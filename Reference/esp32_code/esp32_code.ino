/*
 * esp32_code.ino
 * MythBrain AI Meeting Recorder - Microcontroller Firmware
 * Target Hardware: ESP32 Dev Kit V1
 * Sensor: INMP441 I2S Microphone
 * 
 * Required libraries in Arduino IDE:
 *  - ArduinoJson (by Benoit Blanchon)
 * 
 * Pinout Connections:
 *  - INMP441 SCK  -> ESP32 GPIO 14 (I2S SCK)
 *  - INMP441 WS   -> ESP32 GPIO 15 (I2S WS)
 *  - INMP441 SD   -> ESP32 GPIO 32 (I2S SD)
 *  - INMP441 L/R  -> GND (Left Channel Select)
 *  - INMP441 VDD  -> 3.3V
 *  - INMP441 GND  -> GND
 */

#include <WiFi.h>
#include <HTTPClient.h>
#include <driver/i2s_std.h>
#include <esp_err.h>
#include <FS.h>
#include <SPI.h>
#include <SD.h>
#include <ArduinoJson.h>
#include <Preferences.h>
#include <WiFiClientSecure.h>
#include <DNSServer.h>
#include <WebServer.h>

// Forward declarations of functions
void loadWiFiCredentials();
void connectWiFi();
void startCaptivePortal();
void handleRedirect();
void handleRoot();
void handleSave();
void checkServerStatus();
void initI2S();
struct AudioFileTask {
  char filepath[64];
  int chunkNum;
};
void recordAndUploadChunk();
int uploadFileToServer(const char* filepath, int chunkNum);
void uploadTask(void *pvParameters);
void initSD();
void createNextRecordingDir();
bool sendCompleteSignal();


// ==========================================
// CONFIGURATION CONSTANTS & VARIABLES
// ==========================================
char deviceToken[6] = "MB101"; // Set dynamically, fallback to MB101
const char* SERVER_URL = "https://mythbrain.ashikone.com/api.php";

DNSServer dnsServer;
WebServer server(80);

// Default Wi-Fi credentials fallback
const char* DEFAULT_SSID = "Al Amin Islam Ar";
const char* DEFAULT_PASS = "@ALAMINAIR92@";

// Prefs namespace to store dynamic WiFi settings
Preferences preferences;

// I2S Microphone Pin Definitions
#define I2S_WS 15
#define I2S_SD 32
#define I2S_SCK 14
#define I2S_PORT I2S_NUM_0

// Audio recording parameters
#define SAMPLE_RATE 16000     // 16kHz standard for Speech-to-Text
#define BITS_PER_SAMPLE 16    // 16-bit precision
#define CHANNELS 1            // Mono channel
#define CHUNK_DURATION_SEC 15  // 15 seconds chunk length
#define BUFFER_SIZE (SAMPLE_RATE * BITS_PER_SAMPLE / 8 * CHUNK_DURATION_SEC) // 480,000 bytes

// SD Card SPI Pin Definitions
#define SD_MISO 19
#define SD_MOSI 23
#define SD_SCK  18
#define SD_CS   5

// Variables
volatile bool isRecording = false;
volatile bool needToSendCompleteSignal = false;
char currentRecDir[32] = "";
unsigned long lastPingTime = 0;
const unsigned long PING_INTERVAL_MS = 5000; // Ping every 5 seconds
int chunkCounter = 0;
QueueHandle_t audioQueue = NULL;

// Struct to store WiFi profiles
struct WifiCred {
  char ssid[64];
  char password[64];
};
WifiCred storedWifis[5];
int totalStoredWifis = 1;

// Modern I2S API Channel Handle
i2s_chan_handle_t rx_handle = NULL;

// ==========================================
// SETUP & INITIALIZATION
// ==========================================
void setup() {
  Serial.begin(115200);
  delay(1000);
  Serial.println("\n--- MythBrain Voice Capture Firmware Booting ---");

  // 1. Initialize SD Card Storage
  initSD();

  // 2. Load Wi-Fi credentials from preferences
  loadWiFiCredentials();

  // 3. Connect to available Wi-Fi network
  connectWiFi();

  // 4. Initialize I2S Microcontroller Audio pipeline
  initI2S();

  // 5. Create FreeRTOS Queue for audio chunk files (stores file paths in queue)
  audioQueue = xQueueCreate(10, sizeof(AudioFileTask));

  // 6. Create background upload task on Core 0
  xTaskCreatePinnedToCore(
    uploadTask,
    "UploadTask",
    8192,
    NULL,
    1,
    NULL,
    0
  );
}

// ==========================================
// MAIN RECURRING LOOP
// ==========================================
void loop() {
  // Core 1 focuses entirely on Audio Recording (INMP441 capture)
  if (isRecording) {
    recordAndUploadChunk();
  } else {
    delay(100);
  }
}

// ==========================================
// WI-FI MULTI SYSTEM
// ==========================================
void loadWiFiCredentials() {
  preferences.begin("myth-wifi", false);
  
  // Read SSID/Pass from Preferences
  preferences.getBytes("wifi_data", storedWifis, sizeof(storedWifis));
  totalStoredWifis = preferences.getInt("wifi_count", 0);
  
  // Read device token with boundary safety
  String savedToken = preferences.getString("dev_token", "MB101");
  if (savedToken.length() > 5) {
    savedToken = savedToken.substring(0, 5);
  }
  strcpy(deviceToken, savedToken.c_str());
  
  // If no credentials saved, use fallback defaults
  if (totalStoredWifis == 0) {
    strcpy(storedWifis[0].ssid, DEFAULT_SSID);
    strcpy(storedWifis[0].password, DEFAULT_PASS);
    totalStoredWifis = 1;
    
    // Save defaults
    preferences.putBytes("wifi_data", storedWifis, sizeof(storedWifis));
    preferences.putInt("wifi_count", totalStoredWifis);
    preferences.putString("dev_token", deviceToken);
  }
  preferences.end();
  
  Serial.printf("Device ID Token loaded: %s\n", deviceToken);
  Serial.printf("Loaded %d WiFi network configurations from storage.\n", totalStoredWifis);
  for (int i = 0; i < totalStoredWifis; i++) {
    Serial.printf(" - SSID: %s\n", storedWifis[i].ssid);
  }
  Serial.flush();
}

// ==========================================
// CAPTIVE PORTAL HANDLERS
// ==========================================
void handleRedirect() {
  server.sendHeader("Location", "http://192.168.4.1/", true);
  server.send(302, "text/plain", "");
}

void handleRoot() {
  String html = R"rawliteral(
<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link href="https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;600;800&display=swap" rel="stylesheet">
  <style>
    body {
      background: #1c1a17;
      color: #eae7e2;
      font-family: 'Instrument Sans', sans-serif;
      margin: 0;
      padding: 24px;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      box-sizing: border-box;
    }
    .container {
      width: 100%;
      max-width: 400px;
      background: #25221e;
      border: 1px solid #332f2a;
      border-radius: 12px;
      padding: 30px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.5);
    }
    h2 {
      font-weight: 800;
      font-size: 24px;
      margin-top: 0;
      margin-bottom: 8px;
      background: linear-gradient(135deg, #dfc29c 0%, #c5a880 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    p {
      color: #b5af9f;
      font-size: 14px;
      line-height: 1.5;
      margin-bottom: 24px;
    }
    .form-group {
      margin-bottom: 16px;
    }
    label {
      display: block;
      font-size: 13px;
      font-weight: 600;
      margin-bottom: 6px;
      color: #eae7e2;
    }
    input {
      width: 100%;
      box-sizing: border-box;
      background: #1c1a17;
      border: 1px solid #332f2a;
      border-radius: 6px;
      padding: 10px 12px;
      color: #eae7e2;
      font-size: 14px;
    }
    input:focus {
      outline: none;
      border-color: #dfc29c;
    }
    button {
      width: 100%;
      background: #dfc29c;
      color: #1c1a17;
      border: none;
      border-radius: 6px;
      padding: 12px;
      font-size: 14px;
      font-weight: 700;
      cursor: pointer;
      margin-top: 10px;
      transition: background 0.2s;
    }
    button:hover {
      background: #c5a880;
    }
  </style>
</head>
<body>
  <div class="container">
    <h2>MythBrain Setup</h2>
    <p>Connect your voice microphone device to your local Wi-Fi network and activate your token.</p>
    <form method="POST" action="/save">
      <div class="form-group">
        <label>Wi-Fi Name (SSID)</label>
        <input type="text" name="ssid" required placeholder="SSID Name">
      </div>
      <div class="form-group">
        <label>Wi-Fi Password</label>
        <input type="password" name="pass" placeholder="Password">
      </div>
      <div class="form-group">
        <label>Device ID Token (5 Chars)</label>
        <input type="text" name="token" maxlength="5" required placeholder="e.g. MB101" style="font-family:monospace; text-transform:uppercase;">
      </div>
      <button type="submit">Connect Device</button>
    </form>
  </div>
</body>
</html>
)rawliteral";
  server.send(200, "text/html", html);
}

void handleSave() {
  if (server.hasArg("ssid") && server.hasArg("token")) {
    String ssidInput = server.arg("ssid");
    String passInput = server.arg("pass");
    String tokenInput = server.arg("token");
    tokenInput.toUpperCase();
    
    // Save to storedWifis[0]
    strcpy(storedWifis[0].ssid, ssidInput.c_str());
    strcpy(storedWifis[0].password, passInput.c_str());
    totalStoredWifis = 1;
    
    // Update dynamic token
    strcpy(deviceToken, tokenInput.c_str());
    
    preferences.begin("myth-wifi", false);
    preferences.putBytes("wifi_data", storedWifis, sizeof(storedWifis));
    preferences.putInt("wifi_count", totalStoredWifis);
    preferences.putString("dev_token", deviceToken);
    preferences.end();
    
    String successHtml = R"rawliteral(
<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link href="https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;600;800&display=swap" rel="stylesheet">
  <style>
    body {
      background: #1c1a17;
      color: #eae7e2;
      font-family: 'Instrument Sans', sans-serif;
      margin: 0;
      padding: 24px;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      box-sizing: border-box;
    }
    .container {
      width: 100%;
      max-width: 400px;
      background: #25221e;
      border: 1px solid #332f2a;
      border-radius: 12px;
      padding: 30px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.5);
      text-align: center;
    }
    h2 {
      font-weight: 800;
      font-size: 24px;
      margin-top: 0;
      margin-bottom: 15px;
      color: #dfc29c;
    }
    p {
      color: #b5af9f;
      font-size: 14px;
      line-height: 1.5;
      margin-bottom: 20px;
    }
  </style>
</head>
<body>
  <div class="container">
    <h2>Configuration Saved!</h2>
    <p>ESP32 is rebooting and will try to connect to the Wi-Fi network: <strong>)rawliteral" + ssidInput + R"rawliteral(</strong>.</p>
    <p>You may now close this page and reconnect to your local Wi-Fi.</p>
  </div>
</body>
</html>
)rawliteral";
    server.send(200, "text/html", successHtml);
    delay(2000);
    ESP.restart();
  } else {
    server.send(400, "text/plain", "Bad Request: Missing SSID or Token");
  }
}

void startCaptivePortal() {
  WiFi.mode(WIFI_AP);
  WiFi.softAP("MythBrain Connect");
  
  // Start DNS Server mapping all requests to standard local softAP IP (192.168.4.1)
  const byte DNS_PORT = 53;
  dnsServer.start(DNS_PORT, "*", WiFi.softAPIP());
  
  server.on("/", handleRoot);
  server.on("/save", HTTP_POST, handleSave);
  server.onNotFound(handleRedirect);
  server.begin();
  
  Serial.println("AP 'MythBrain Connect' started. Awaiting configuration client connection...");
  
  while (true) {
    dnsServer.processNextRequest();
    server.handleClient();
    delay(2);
  }
}

void connectWiFi() {
  WiFi.mode(WIFI_STA);
  WiFi.disconnect();
  delay(100);
  
  int targetIndex = 0; // Default to first configuration
  
  Serial.printf("Connecting to: %s\n", storedWifis[targetIndex].ssid);
  Serial.flush();
  
  WiFi.begin(storedWifis[targetIndex].ssid, storedWifis[targetIndex].password);
  
  int retry = 0;
  while (WiFi.status() != WL_CONNECTED && retry < 25) {
    delay(500);
    Serial.print(".");
    Serial.flush();
    retry++;
  }
  
  if (WiFi.status() == WL_CONNECTED) {
    Serial.printf("\nWiFi Connected successfully! IP Address: %s\n", WiFi.localIP().toString().c_str());
    Serial.flush();
  } else {
    Serial.println("\nWiFi Connection failed. Launching captive portal configuration...");
    Serial.flush();
    startCaptivePortal();
  }
}

// ==========================================
// SERVER PING HEARTBEAT
// ==========================================
void checkServerStatus() {
  if (WiFi.status() != WL_CONNECTED) {
    connectWiFi();
    if (WiFi.status() != WL_CONNECTED) return;
  }

  WiFiClientSecure client;
  client.setInsecure();
  client.setTimeout(10000); // 10 seconds timeout

  HTTPClient http;
  String url = String(SERVER_URL) + "?action=esp_ping&token=" + String(deviceToken);
  
  if (http.begin(client, url)) {
    int httpCode = http.GET();
    
    if (httpCode == HTTP_CODE_OK) {
      String payload = http.getString();
      
      JsonDocument doc;
      DeserializationError error = deserializeJson(doc, payload);
      
      if (!error && doc["status"] == "success") {
        // 1. Update Recording State
        int newState = doc["recording_state"];
        if (newState == 1 && !isRecording) {
          Serial.println("START RECORDING signal received from cloud.");
          createNextRecordingDir();
          isRecording = true;
          needToSendCompleteSignal = true;
          chunkCounter = 0;
        } else if (newState == 0 && isRecording) {
          Serial.println("STOP RECORDING signal received from cloud.");
          isRecording = false;
        }
        
        // 2. Sync dynamic Wi-Fi credentials from server setting
        JsonArray wifiArr = doc["wifi"].as<JsonArray>();
        int serverCount = wifiArr.size();
        if (serverCount > 0 && serverCount <= 5) {
          bool changed = false;
          WifiCred tempWifis[5];
          memset(tempWifis, 0, sizeof(tempWifis));
          
          for (int i = 0; i < serverCount; i++) {
            strcpy(tempWifis[i].ssid, wifiArr[i]["ssid"]);
            strcpy(tempWifis[i].password, wifiArr[i]["pass"]);
          }
          
          // Compare with local to check if changed
          if (serverCount != totalStoredWifis || memcmp(storedWifis, tempWifis, sizeof(storedWifis)) != 0) {
            memcpy(storedWifis, tempWifis, sizeof(storedWifis));
            totalStoredWifis = serverCount;
            
            preferences.begin("myth-wifi", false);
            preferences.putBytes("wifi_data", storedWifis, sizeof(storedWifis));
            preferences.putInt("wifi_count", totalStoredWifis);
            preferences.end();
            
            Serial.println("Local Wi-Fi credentials database updated from server config.");
          }
        }
      }
    } else {
      Serial.printf("Status ping failed. HTTP Code: %d\n", httpCode);
    }
    http.end();
  } else {
    Serial.println("Failed to initialize secure HTTPS connection for ping.");
  }
}

// ==========================================
// AUDIO I2S INITIALIZATION
// ==========================================
void initI2S() {
  i2s_chan_config_t chan_cfg = I2S_CHANNEL_DEFAULT_CONFIG(I2S_PORT, I2S_ROLE_MASTER);
  esp_err_t err = i2s_new_channel(&chan_cfg, NULL, &rx_handle);
  if (err != ESP_OK) {
    Serial.printf("Failed to create I2S RX channel: %s\n", esp_err_to_name(err));
    return;
  }

  i2s_std_config_t std_cfg = {
    .clk_cfg = I2S_STD_CLK_DEFAULT_CONFIG(SAMPLE_RATE),
    .slot_cfg = I2S_STD_PHILIPS_SLOT_DEFAULT_CONFIG(I2S_DATA_BIT_WIDTH_32BIT, I2S_SLOT_MODE_MONO),
    .gpio_cfg = {
      .mclk = I2S_GPIO_UNUSED,
      .bclk = (gpio_num_t)I2S_SCK,
      .ws   = (gpio_num_t)I2S_WS,
      .dout = I2S_GPIO_UNUSED,
      .din  = (gpio_num_t)I2S_SD,
      .invert_flags = { .mclk_inv = false, .bclk_inv = false, .ws_inv = false }
    }
  };

  err = i2s_channel_init_std_mode(rx_handle, &std_cfg);
  if (err != ESP_OK) {
    Serial.printf("Failed to initialize I2S channel standard mode: %s\n", esp_err_to_name(err));
    return;
  }

  err = i2s_channel_enable(rx_handle);
  if (err != ESP_OK) {
    Serial.printf("Failed to enable I2S channel: %s\n", esp_err_to_name(err));
    return;
  }

  Serial.println("I2S Audio interface configured successfully using new channel API.");
}

// ==========================================
// WAV WRITING & HEADER HELPERS
// ==========================================
void writeWavHeader(File &file) {
  byte header[44];
  
  // RIFF
  header[0] = 'R'; header[1] = 'I'; header[2] = 'F'; header[3] = 'F';
  
  // File size placeholder (will write at completion)
  uint32_t fileSize = BUFFER_SIZE + 36;
  header[4] = fileSize & 0xFF;
  header[5] = (fileSize >> 8) & 0xFF;
  header[6] = (fileSize >> 16) & 0xFF;
  header[7] = (fileSize >> 24) & 0xFF;
  
  // WAVE
  header[8] = 'W'; header[9] = 'A'; header[10] = 'V'; header[11] = 'E';
  
  // fmt
  header[12] = 'f'; header[13] = 'm'; header[14] = 't'; header[15] = ' ';
  
  // Header size (16)
  header[16] = 16; header[17] = 0; header[18] = 0; header[19] = 0;
  
  // Format (1 = PCM)
  header[20] = 1; header[21] = 0;
  
  // Channels
  header[22] = CHANNELS; header[23] = 0;
  
  // Sample rate
  uint32_t sampleRate = SAMPLE_RATE;
  header[24] = sampleRate & 0xFF;
  header[25] = (sampleRate >> 8) & 0xFF;
  header[26] = (sampleRate >> 16) & 0xFF;
  header[27] = (sampleRate >> 24) & 0xFF;
  
  // Byte rate
  uint32_t byteRate = SAMPLE_RATE * CHANNELS * BITS_PER_SAMPLE / 8;
  header[28] = byteRate & 0xFF;
  header[29] = (byteRate >> 8) & 0xFF;
  header[30] = (byteRate >> 16) & 0xFF;
  header[31] = (byteRate >> 24) & 0xFF;
  
  // Block align
  header[32] = CHANNELS * BITS_PER_SAMPLE / 8; header[33] = 0;
  
  // Bits per sample
  header[34] = BITS_PER_SAMPLE; header[35] = 0;
  
  // data
  header[36] = 'd'; header[37] = 'a'; header[38] = 't'; header[39] = 'a';
  
  // Data size placeholder
  uint32_t dataSize = BUFFER_SIZE;
  header[40] = dataSize & 0xFF;
  header[41] = (dataSize >> 8) & 0xFF;
  header[42] = (dataSize >> 16) & 0xFF;
  header[43] = (dataSize >> 24) & 0xFF;
  
  file.write(header, 44);
}

void updateWavHeaderSizes(File &file, uint32_t totalBytesWritten) {
  file.seek(4);
  uint32_t fileSize = totalBytesWritten - 8;
  file.write((uint8_t*)&fileSize, 4);
  
  file.seek(40);
  uint32_t dataSize = totalBytesWritten - 44;
  file.write((uint8_t*)&dataSize, 4);
}

// ==========================================
// VOICE RECORDING & SD STORAGE
// ==========================================

void initSD() {
  Serial.println("Initializing SD card...");
  
  pinMode(SD_CS, OUTPUT);
  digitalWrite(SD_CS, HIGH);
  delay(100);
  
  SPI.begin(SD_SCK, SD_MISO, SD_MOSI, SD_CS);
  delay(500);
  
  // Try up to 5 times to mount the SD card
  bool mounted = false;
  for (int attempt = 1; attempt <= 5; attempt++) {
    Serial.printf("SD mount attempt %d...\n", attempt);
    if (SD.begin(SD_CS, SPI, 4000000)) {
      mounted = true;
      break;
    }
    SD.end();
    delay(500);
  }
  
  if (!mounted) {
    Serial.println("SD Card Mount FAILED after 5 attempts!");
    Serial.println("Check: wiring, card inserted, FAT32 format");
    return;
  }

  uint8_t cardType = SD.cardType();
  if (cardType == CARD_NONE) {
    Serial.println("No SD card detected!");
    return;
  }

  Serial.print("SD Card Type: ");
  if      (cardType == CARD_MMC)  Serial.println("MMC");
  else if (cardType == CARD_SD)   Serial.println("SDSC");
  else if (cardType == CARD_SDHC) Serial.println("SDHC");
  else                            Serial.println("UNKNOWN");

  uint64_t cardSize = SD.cardSize() / (1024 * 1024);
  Serial.printf("SD Card Size: %llu MB\n", cardSize);
  
  // Test write access immediately
  Serial.println("Testing SD write access...");
  File testFile = SD.open("/sd_test.txt", FILE_WRITE);
  if (!testFile) {
    Serial.println("SD WRITE TEST FAILED! Card may be:");
    Serial.println(" - Write-protected (check lock switch on card adapter)");
    Serial.println(" - Corrupted (reformat as FAT32)");
    Serial.println(" - Not fully seated in the slot");
    return;
  }
  testFile.println("MythBrain SD Test OK");
  testFile.close();
  SD.remove("/sd_test.txt");
  Serial.println("SD card initialized and write-tested successfully!");
}

void createNextRecordingDir() {
  int dirNum = 1;
  char dirName[32];
  while (dirNum < 1000) {
    sprintf(dirName, "/rec_%03d", dirNum);
    if (!SD.exists(dirName)) {
      if (SD.mkdir(dirName)) {
        strcpy(currentRecDir, dirName);
        Serial.printf("Created new recording directory: %s\n", currentRecDir);
        return;
      } else {
        Serial.printf("Failed to create directory: %s\n", dirName);
        strcpy(currentRecDir, "");
        return;
      }
    }
    dirNum++;
  }
  strcpy(currentRecDir, "");
}

void recordAndUploadChunk() {
  uint32_t dataSize = BUFFER_SIZE; // 480,000 bytes (15 seconds)
  
  char filepath[64];
  int currentChunkNum = chunkCounter + 1;
  if (strlen(currentRecDir) > 0) {
    sprintf(filepath, "%s/chunk_%03d.wav", currentRecDir, currentChunkNum);
  } else {
    sprintf(filepath, "/chunk_%03d.wav", currentChunkNum);
  }
  
  File file = SD.open(filepath, FILE_WRITE);
  if (!file) {
    Serial.printf("Failed to open audio file on SD card for writing: %s\n", filepath);
    delay(1000); // Prevent tight error loop
    return;
  }
  
  writeWavHeader(file);
  
  int bytesRecorded = 0;
  const int dma_read_len = 2048; // 512 samples of 32-bit (4 bytes)
  char* i2s_read_buff = (char*) malloc(dma_read_len);
  if (i2s_read_buff == NULL) {
    Serial.println("Failed to allocate I2S DMA read buffer!");
    file.close();
    return;
  }

  int16_t* out_samples = (int16_t*) malloc(dma_read_len / 2); // 512 samples of 16-bit (2 bytes) = 1024 bytes
  if (out_samples == NULL) {
    free(i2s_read_buff);
    Serial.println("Failed to allocate scaling buffer!");
    file.close();
    return;
  }

  size_t bytes_read;
  unsigned long startRecTime = millis();
  
  Serial.printf("Recording chunk %d to SD Card file: %s...\n", currentChunkNum, filepath);
  
  while (bytesRecorded < dataSize && isRecording) {
    // Read audio chunk from I2S
    i2s_channel_read(rx_handle, (void*) i2s_read_buff, dma_read_len, &bytes_read, portMAX_DELAY);
    
    int samples_read = bytes_read / 4;
    
    // Cap samples to avoid writing beyond the buffer size
    if (bytesRecorded + (samples_read * 2) > dataSize) {
      samples_read = (dataSize - bytesRecorded) / 2;
    }
    
    int32_t* raw_samples = (int32_t*) i2s_read_buff;
    
    // Scale 32-bit MSB-aligned samples down to 16-bit signed PCM
    for (int i = 0; i < samples_read; i++) {
      out_samples[i] = (int16_t)(raw_samples[i] >> 14);
    }
    
    int bytesToWrite = samples_read * 2;
    if (file.write((uint8_t*)out_samples, bytesToWrite) != bytesToWrite) {
      Serial.println("SD write error! File write failed.");
      break;
    }
    
    bytesRecorded += bytesToWrite;
  }
  
  free(i2s_read_buff);
  free(out_samples);
  
  updateWavHeaderSizes(file, bytesRecorded + 44);
  file.close();
  
  if (bytesRecorded > 0) {
    AudioFileTask task;
    strcpy(task.filepath, filepath);
    task.chunkNum = currentChunkNum;
    
    chunkCounter = currentChunkNum;
    Serial.printf("Chunk %d recorded successfully to SD Card: %d bytes (Duration: %d ms)\n", 
                  currentChunkNum, bytesRecorded + 44, (int)(millis() - startRecTime));
                  
    if (xQueueSend(audioQueue, &task, 0) != pdTRUE) {
      Serial.println("Queue full! Skipped pushing file task to upload queue.");
    }
  } else {
    SD.remove(filepath);
  }
}

int uploadFileToServer(const char* filepath, int chunkNum) {
  if (WiFi.status() != WL_CONNECTED) {
    return 0; // Transient offline
  }

  File file = SD.open(filepath, FILE_READ);
  if (!file) {
    Serial.printf("Failed to open file for upload: %s\n", filepath);
    return -1; // Permanent file error, skip from queue
  }

  uint32_t fileSize = file.size();
  Serial.printf("Uploading audio file '%s' (%d bytes) to server...\n", filepath, fileSize);

  WiFiClientSecure client;
  client.setInsecure();
  client.setTimeout(30000); // 30 seconds upload timeout

  HTTPClient http;
  String url = String(SERVER_URL) + "?action=esp_upload_chunk&token=" + String(deviceToken);
  
  int result = 0; // Transient failure by default
  if (http.begin(client, url)) {
    http.addHeader("Content-Type", "audio/wav");
    
    // Stream the file directly from SD Card to HTTP body
    http.addHeader("Content-Length", String(fileSize));
int httpCode = http.sendRequest("POST", &file, fileSize);
    file.close();
    
    if (httpCode == HTTP_CODE_OK) {
      String response = http.getString();
      Serial.println("Server response: " + response);
      
      JsonDocument doc;
      DeserializationError error = deserializeJson(doc, response);
      if (!error && doc.containsKey("transcript")) {
        const char* transcript = doc["transcript"];
        if (transcript != NULL && strlen(transcript) > 0) {
          Serial.printf("\n>>> TRANSCRIBED TEXT: %s\n\n", transcript);
          
          // Save chunk transcript to SD Card
          char txtPath[64];
          strcpy(txtPath, filepath);
          int len = strlen(txtPath);
          if (len > 4) {
            txtPath[len-4] = '.';
            txtPath[len-3] = 't';
            txtPath[len-2] = 'x';
            txtPath[len-1] = 't';
          }
          
          File txtFile = SD.open(txtPath, FILE_WRITE);
          if (txtFile) {
            txtFile.print(transcript);
            txtFile.close();
            Serial.printf("Saved chunk transcript to: %s\n", txtPath);
          }
          
          // Append to cumulative transcript.txt in current directory
          char fullTxtPath[64];
          if (strlen(currentRecDir) > 0) {
            sprintf(fullTxtPath, "%s/transcript.txt", currentRecDir);
          } else {
            char* lastSlash = strrchr(filepath, '/');
            if (lastSlash != NULL) {
              int dirLen = lastSlash - filepath;
              strncpy(fullTxtPath, filepath, dirLen);
              fullTxtPath[dirLen] = '\0';
              strcat(fullTxtPath, "/transcript.txt");
            } else {
              strcpy(fullTxtPath, "/transcript.txt");
            }
          }
          
          File fullTxtFile = SD.open(fullTxtPath, FILE_APPEND);
          if (fullTxtFile) {
            if (fullTxtFile.size() > 0) {
              fullTxtFile.print(" ");
            }
            fullTxtFile.print(transcript);
            fullTxtFile.close();
            Serial.printf("Appended to cumulative transcript: %s\n", fullTxtPath);
          }
        } else {
          Serial.println("\n>>> TRANSCRIBED TEXT: [Silence / No speech detected]\n");
        }
      }
      result = 1; // Success
    } else {
      Serial.printf("Upload failed. HTTP error code: %d\n", httpCode);
      String response = http.getString();
      if (response.length() > 0) {
        Serial.print("Server response: ");
        Serial.println(response);
      }
      if (httpCode >= 400 && httpCode < 500) {
        Serial.println("Permanent client/config error. File will be skipped from queue.");
        result = -1;
      } else {
        result = 0; // Server or network issue, retry
      }
    }
    http.end();
  } else {
    Serial.println("Failed to initialize secure HTTPS connection for upload.");
    file.close();
    result = 0;
  }
  
  return result;
}

bool sendCompleteSignal() {
  if (WiFi.status() != WL_CONNECTED) {
    return false;
  }
  WiFiClientSecure client;
  client.setInsecure();
  client.setTimeout(15000);
  
  HTTPClient http;
  String url = String(SERVER_URL) + "?action=esp_complete_recording&token=" + String(deviceToken);
  
  bool success = false;
  Serial.printf("Sending complete recording signal to server: %s\n", url.c_str());
  if (http.begin(client, url)) {
    int httpCode = http.GET();
    if (httpCode == HTTP_CODE_OK) {
      String response = http.getString();
      Serial.println("Server acknowledged completion: " + response);
      success = true;
    } else {
      Serial.printf("Failed to send complete signal. HTTP Code: %d\n", httpCode);
    }
    http.end();
  }
  return success;
}

// Background FreeRTOS task running on Core 0
void uploadTask(void *pvParameters) {
  while (true) {
    unsigned long currentMillis = millis();
    
    // Core 0 handles HTTPS server status checking
    if (WiFi.status() == WL_CONNECTED) {
      if (currentMillis - lastPingTime >= PING_INTERVAL_MS) {
        lastPingTime = currentMillis;
        checkServerStatus();
      }
    }
    
    // Core 0 handles HTTPS audio uploading
    AudioFileTask task;
    if (audioQueue != NULL && xQueuePeek(audioQueue, &task, pdMS_TO_TICKS(10)) == pdTRUE) {
      if (strlen(task.filepath) > 0) {
        if (WiFi.status() == WL_CONNECTED) {
          int uploadResult = uploadFileToServer(task.filepath, task.chunkNum);
          if (uploadResult == 1 || uploadResult == -1) {
            // Success or permanent failure, pop task from queue
            xQueueReceive(audioQueue, &task, 0);
          } else {
            // Transient failure, wait and retry
            vTaskDelay(pdMS_TO_TICKS(1000));
          }
        } else {
          // WiFi offline, wait
          vTaskDelay(pdMS_TO_TICKS(1000));
        }
      } else {
        // Null task, pop and ignore
        xQueueReceive(audioQueue, &task, 0);
      }
    }
    
    // Check if recording stopped, queue is empty, and we need to notify server
    if (!isRecording && needToSendCompleteSignal && audioQueue != NULL && uxQueueMessagesWaiting(audioQueue) == 0) {
      if (WiFi.status() == WL_CONNECTED) {
        if (sendCompleteSignal()) {
          needToSendCompleteSignal = false;
          strcpy(currentRecDir, ""); // Clear active directory path now
        } else {
          vTaskDelay(pdMS_TO_TICKS(2000)); // Delay before retrying completion signal
        }
      }
    }
    
    vTaskDelay(pdMS_TO_TICKS(10));
  }
}
