# MythBrain — AI-Powered Meeting Recorder (Hardware + Software)

MythBrain is a premium real-time AI Meeting Recorder combining custom microcontroller capture hardware (**ESP32 Dev Kit V1** + **INMP441 I2S Microphone**) with a modern, high-performance web Single Page Application (SPA). It transcribes voice inputs on-the-fly and generates action points, summaries, and answering assistance.

---

## 🚀 Core Features

1.  **Capsule Floating Header & Premium Design System:** Curated HSL color palette using Cormorant Garamond & Instrument Sans, glassmorphic layouts, and responsive flex spacing.
2.  **Facebook-Style Mobile Auth Drawer:** Modals slide up seamlessly from bottom to top on mobile views (`< 768px`) for a native-like experience, while aligning centered on desktop.
3.  **Bilingual Real-Time Sync:** Deepgram Nova-2 automatically detects spoken languages (English & Bengali supported), syncs WAV audio streams every 15 seconds, and updates transcripts in real-time.
4.  **Redis Cache Speedup:** Poll requests for live transcripts utilize high-performance Redis cache keys, maintaining near-zero database load.
5.  **Multi-SSID Automated Connection:** The ESP32 scan-detects up to 4 Wi-Fi networks (with dynamic sync from the web Settings page).
6.  **Local SPIFFS Audio Buffering:** Local hardware buffer queues WAV files when Wi-Fi is weak or disconnected, uploading them sequentially when connection stabilizes.
7.  **Analytical RAG Chats:** 
    *   **Ask AI (Single Context):** Submits queries restricted to a single meeting.
    *   **Myth Chat (Global Context):** Submits queries scanning transcripts across all completed meetings.
8.  **Token & Resource Usage Dashboard:** Monitors Groq token quantities, words transcribed, and sent chunks.

---

## 🔌 Hardware Connections (ESP32 Dev Kit V1 + INMP441)

Connect the **INMP441 Microphone module** to the **ESP32 Dev Kit V1** using the following pin mapping:

| INMP441 Pin | ESP32 GPIO | Description |
| :--- | :--- | :--- |
| **VDD** | `3.3V` | Power supply |
| **GND** | `GND` | Ground reference |
| **L/R** | `GND` | Left channel selection |
| **WS** | `GPIO 15` | Word Select (I2S WS) |
| **SCK** | `GPIO 14` | Serial Clock (I2S SCK) |
| **SD** | `GPIO 32` | Serial Data (I2S SD) |

---

## 🛠️ Software Installation & Setup

### 1. Database Setup
The web app is configured to use the following credentials:
*   **Database Name:** `ashikone_mythbraindb`
*   **User:** `ashikone_mythbrainuser`
*   **Password:** `Ashik@21032001`

Import the schema from `db.sql` or let the app automatically initialize the tables and seed default activation tokens on its first launch.

### 2. Redis Cache Setup
*   **IP Address:** `127.0.0.1`
*   **Port:** `52499`
*   **Password:** `GcKuKqim5daLCmh9ahM`

Ensure the Redis service daemon is active on this port. If Redis is unavailable, the application gracefully falls back to a file-based cache emulation.

### 3. Server Configuration
*   Edit `.env` in the root folder to update custom keys or models.
*   Ensure `.htaccess` and `mod_rewrite` are active on Apache/LiteSpeed web servers to route SPA paths (`/home`, `/dashboard`, `/brain`, `/myth`, `/settings`) cleanly.

### 4. Microcontroller Upload
1.  Open `esp32_code/esp32_code.ino` in the Arduino IDE.
2.  Install the **ArduinoJson** library (v6.x) via the Library Manager.
3.  Set the target board to **DOIT ESP32 DEVKIT V1**.
4.  Specify the `DEVICE_TOKEN` variable to match one of the pre-seeded tokens (`MB101`, `MB102`, `MB103`, etc.).
5.  Upload the sketch to your hardware.
