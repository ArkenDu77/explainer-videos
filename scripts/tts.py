"""Génère la voix off d'une vidéo avec edge-tts + le timing de chaque mot.

Usage : python scripts/tts.py <nom-video>
Lit   : videos/<nom>/script.txt
Écrit : public/voice/<nom>/voice.mp3
        public/voice/<nom>/timing.json  ({"words": [{text, start, end}], "durationInSeconds"})
"""
import asyncio
import json
import sys
from pathlib import Path

import edge_tts

VOICE = "fr-FR-HenriNeural"
TICKS_PER_SECOND = 10_000_000  # les offsets edge-tts sont en unités de 100 ns


async def main(name: str) -> None:
    root = Path(__file__).resolve().parent.parent
    script = (root / "videos" / name / "script.txt").read_text(encoding="utf-8")
    text = " ".join(script.split())
    if not text:
        sys.exit(f"script.txt vide pour {name}")

    out_dir = root / "public" / "voice" / name
    out_dir.mkdir(parents=True, exist_ok=True)

    # boundary="WordBoundary" : un événement par mot (le défaut récent est SentenceBoundary)
    communicate = edge_tts.Communicate(text, VOICE, boundary="WordBoundary")
    words = []
    with open(out_dir / "voice.mp3", "wb") as audio:
        async for chunk in communicate.stream():
            if chunk["type"] == "audio":
                audio.write(chunk["data"])
            elif chunk["type"] == "WordBoundary":
                start = chunk["offset"] / TICKS_PER_SECOND
                end = (chunk["offset"] + chunk["duration"]) / TICKS_PER_SECOND
                words.append({"text": chunk["text"], "start": round(start, 3), "end": round(end, 3)})

    if not words:
        sys.exit("Aucun WordBoundary reçu d'edge-tts")

    timing = {"words": words, "durationInSeconds": round(words[-1]["end"] + 0.6, 3)}
    (out_dir / "timing.json").write_text(json.dumps(timing, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"{len(words)} mots, {timing['durationInSeconds']} s -> {out_dir}")


if __name__ == "__main__":
    if len(sys.argv) != 2:
        sys.exit("Usage : python scripts/tts.py <nom-video>")
    asyncio.run(main(sys.argv[1]))
