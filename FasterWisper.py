import os
import warnings

# Suppress Hugging Face symlink and user warnings
os.environ["HF_HUB_DISABLE_SYMLINKS_WARNING"] = "1"
warnings.filterwarnings("ignore", category=UserWarning)

from faster_whisper import WhisperModel

model_size = "small.en"

model = WhisperModel(model_size, device="cpu", compute_type="int8")

segments, _ = model.transcribe("data/audio.mp3", beam_size=5)

for segment in segments:
    print(segment.text)
