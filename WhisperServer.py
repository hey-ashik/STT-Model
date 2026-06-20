import io
import os
import warnings
from flask import Flask, request, jsonify, render_template_string

# Suppress Hugging Face symlink and user warnings
os.environ["HF_HUB_DISABLE_SYMLINKS_WARNING"] = "1"
warnings.filterwarnings("ignore", category=UserWarning)

from faster_whisper import WhisperModel

app = Flask(__name__)

# Initialize model once on startup
# Default to "small" for multilingual support (English & Bengali).
model_size = "small" 
print(f"Loading local Whisper model '{model_size}'...")
model = WhisperModel(model_size, device="cpu", compute_type="int8")
print("Model loaded successfully! Ready to transcribe.")

HTML_TEMPLATE = """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MythBrain | Local STT Service</title>
    <link href="https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
    <style>
        :root {
            --bg-color: #0b0f19;
            --card-bg: rgba(255, 255, 255, 0.03);
            --card-border: rgba(255, 255, 255, 0.08);
            --accent-color: #38bdf8;
            --text-primary: #f8fafc;
            --text-secondary: #94a3b8;
            --success-color: #10b981;
        }
        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }
        body {
            font-family: 'Instrument Sans', sans-serif;
            background-color: var(--bg-color);
            color: var(--text-primary);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
            overflow-x: hidden;
            position: relative;
        }
        /* Glowing background blobs */
        body::before {
            content: '';
            position: absolute;
            width: 400px;
            height: 400px;
            background: radial-gradient(circle, rgba(56, 189, 248, 0.15) 0%, transparent 70%);
            top: -100px;
            right: -100px;
            z-index: 0;
        }
        body::after {
            content: '';
            position: absolute;
            width: 500px;
            height: 500px;
            background: radial-gradient(circle, rgba(168, 85, 247, 0.1) 0%, transparent 70%);
            bottom: -200px;
            left: -200px;
            z-index: 0;
        }
        .container {
            width: 100%;
            max-width: 680px;
            background: var(--card-bg);
            border: 1px solid var(--card-border);
            border-radius: 24px;
            backdrop-filter: blur(20px);
            padding: 40px;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
            z-index: 10;
        }
        .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 30px;
            border-bottom: 1px solid var(--card-border);
            padding-bottom: 20px;
        }
        .logo-text {
            font-size: 24px;
            font-weight: 700;
            letter-spacing: -0.5px;
        }
        .logo-accent {
            color: var(--accent-color);
        }
        .status-badge {
            display: flex;
            align-items: center;
            gap: 8px;
            background: rgba(16, 185, 129, 0.1);
            color: var(--success-color);
            padding: 8px 16px;
            border-radius: 100px;
            font-weight: 600;
            font-size: 14px;
            border: 1px solid rgba(16, 185, 129, 0.2);
        }
        .status-dot {
            width: 8px;
            height: 8px;
            background-color: var(--success-color);
            border-radius: 50%;
            display: inline-block;
            box-shadow: 0 0 10px var(--success-color);
            animation: pulse 1.5s infinite;
        }
        @keyframes pulse {
            0% { transform: scale(0.9); opacity: 0.6; }
            50% { transform: scale(1.2); opacity: 1; }
            100% { transform: scale(0.9); opacity: 0.6; }
        }
        .specs-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 16px;
            margin-bottom: 30px;
        }
        .spec-card {
            background: rgba(255, 255, 255, 0.015);
            border: 1px solid var(--card-border);
            padding: 16px;
            border-radius: 16px;
            text-align: center;
        }
        .spec-val {
            font-size: 18px;
            font-weight: 700;
            color: var(--text-primary);
            margin-bottom: 4px;
        }
        .spec-label {
            font-size: 12px;
            color: var(--text-secondary);
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        .test-section {
            background: rgba(255, 255, 255, 0.01);
            border: 1px solid var(--card-border);
            border-radius: 20px;
            padding: 24px;
        }
        .test-title {
            font-size: 18px;
            font-weight: 600;
            margin-bottom: 16px;
            color: var(--text-primary);
        }
        .dropzone {
            border: 2px dashed rgba(255, 255, 255, 0.15);
            border-radius: 14px;
            padding: 30px 20px;
            text-align: center;
            cursor: pointer;
            transition: all 0.3s ease;
            margin-bottom: 20px;
            background: rgba(255, 255, 255, 0.005);
        }
        .dropzone:hover {
            border-color: var(--accent-color);
            background: rgba(56, 189, 248, 0.02);
        }
        .dropzone-icon {
            font-size: 32px;
            margin-bottom: 12px;
            color: var(--text-secondary);
        }
        .dropzone-text {
            color: var(--text-secondary);
            font-size: 14px;
        }
        .file-input {
            display: none;
        }
        .btn {
            width: 100%;
            background: var(--text-primary);
            color: var(--bg-color);
            border: none;
            padding: 14px;
            border-radius: 12px;
            font-weight: 600;
            font-size: 15px;
            cursor: pointer;
            transition: all 0.2s ease;
        }
        .btn:hover {
            background: var(--accent-color);
            transform: translateY(-1px);
        }
        .btn:disabled {
            opacity: 0.5;
            cursor: not-allowed;
            transform: none;
        }
        .result-container {
            margin-top: 24px;
            display: none;
        }
        .result-header {
            font-size: 14px;
            font-weight: 600;
            margin-bottom: 8px;
            color: var(--text-secondary);
            text-transform: uppercase;
        }
        .result-box {
            background: rgba(0, 0, 0, 0.2);
            border: 1px solid var(--card-border);
            border-radius: 12px;
            padding: 16px;
            font-size: 15px;
            line-height: 1.6;
            max-height: 200px;
            overflow-y: auto;
            color: var(--text-primary);
            white-space: pre-wrap;
        }
        .loader {
            display: none;
            align-items: center;
            justify-content: center;
            gap: 10px;
            margin: 15px 0;
            color: var(--accent-color);
            font-size: 14px;
        }
        .spinner {
            width: 18px;
            height: 18px;
            border: 2px solid rgba(56, 189, 248, 0.2);
            border-top-color: var(--accent-color);
            border-radius: 50%;
            animation: spin 0.8s linear infinite;
        }
        @keyframes spin {
            to { transform: rotate(360deg); }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo-text">Myth<span class="logo-accent">Brain STT</span></div>
            <div class="status-badge">
                <span class="status-dot"></span>
                <span>Active</span>
            </div>
        </div>
        <div class="specs-grid">
            <div class="spec-card">
                <div class="spec-val">small</div>
                <div class="spec-label">Model Size</div>
            </div>
            <div class="spec-card">
                <div class="spec-val">CPU</div>
                <div class="spec-label">Device</div>
            </div>
            <div class="spec-card">
                <div class="spec-val">int8</div>
                <div class="spec-label">Quantization</div>
            </div>
        </div>
        <div class="test-section">
            <div class="test-title">Quick Test Transcription</div>
            <div class="dropzone" id="dropzone" onclick="document.getElementById('fileInput').click()">
                <div class="dropzone-icon">🎙️</div>
                <div class="dropzone-text" id="dropzoneText">Drag and drop audio file here or click to browse</div>
                <input type="file" id="fileInput" class="file-input" accept="audio/*">
            </div>
            <button class="btn" id="transcribeBtn" disabled onclick="startTranscription()">Transcribe Audio</button>
            <div class="loader" id="loader">
                <div class="spinner"></div>
                <span>Transcribing... (Using local model on CPU)</span>
            </div>
            <div class="result-container" id="resultContainer">
                <div class="result-header">Transcription Result</div>
                <div class="result-box" id="resultBox"></div>
            </div>
        </div>
    </div>
    <script>
        const fileInput = document.getElementById('fileInput');
        const dropzone = document.getElementById('dropzone');
        const dropzoneText = document.getElementById('dropzoneText');
        const transcribeBtn = document.getElementById('transcribeBtn');
        const loader = document.getElementById('loader');
        const resultContainer = document.getElementById('resultContainer');
        const resultBox = document.getElementById('resultBox');
        let selectedFile = null;

        fileInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                handleFileSelect(e.target.files[0]);
            }
        });

        dropzone.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropzone.style.borderColor = '#38bdf8';
        });
        dropzone.addEventListener('dragleave', () => {
            dropzone.style.borderColor = 'rgba(255, 255, 255, 0.15)';
        });
        dropzone.addEventListener('drop', (e) => {
            e.preventDefault();
            dropzone.style.borderColor = 'rgba(255, 255, 255, 0.15)';
            if (e.dataTransfer.files.length > 0) {
                handleFileSelect(e.dataTransfer.files[0]);
            }
        });

        function handleFileSelect(file) {
            selectedFile = file;
            dropzoneText.textContent = `Selected: ${file.name} (${(file.size / (1024 * 1024)).toFixed(2)} MB)`;
            transcribeBtn.disabled = false;
        }

        async function startTranscription() {
            if (!selectedFile) return;
            
            transcribeBtn.style.display = 'none';
            loader.style.display = 'flex';
            resultContainer.style.display = 'none';
            
            try {
                const fileData = await selectedFile.arrayBuffer();
                
                const response = await fetch('/transcribe', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'audio/wav'
                    },
                    body: fileData
                });
                
                const result = await response.json();
                
                if (result.error) {
                    resultBox.textContent = `Error: ${result.error}`;
                    resultBox.style.color = '#ef4444';
                } else {
                    resultBox.textContent = result.transcript || '(No speech detected)';
                    resultBox.style.color = '#f8fafc';
                }
            } catch (err) {
                resultBox.textContent = `Failed to connect to transcription service: ${err.message}`;
                resultBox.style.color = '#ef4444';
            } finally {
                loader.style.display = 'none';
                transcribeBtn.style.display = 'block';
                resultContainer.style.display = 'block';
            }
        }
    </script>
</body>
</html>"""

@app.route("/")
def index():
    return render_template_string(HTML_TEMPLATE)

@app.route("/transcribe", methods=["POST"])
def transcribe():
    # Read the raw WAV binary data sent in cURL body
    audio_bytes = request.data
    
    if not audio_bytes or len(audio_bytes) == 0:
        return jsonify({"error": "No audio payload received"}), 400
        
    try:
        # Wrap bytes in a file-like object
        audio_file = io.BytesIO(audio_bytes)
        
        # Get language parameter from query string if present (e.g. ?language=bn)
        lang = request.args.get("language")
        if lang == "multi" or not lang:
            lang = None  # None lets Whisper auto-detect the language
            
        # Transcribe
        segments, info = model.transcribe(audio_file, beam_size=5, language=lang)
        
        # Combine transcribed segments
        transcript_text = " ".join([segment.text for segment in segments]).strip()
        
        return jsonify({
            "transcript": transcript_text,
            "language": info.language,
            "language_probability": info.language_probability
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    # Start the local microservice on port 8000
    app.run(host="127.0.0.1", port=8000, debug=False)
