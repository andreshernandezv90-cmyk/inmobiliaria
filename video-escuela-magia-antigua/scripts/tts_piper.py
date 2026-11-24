"""Genera cada frase de la narración con Piper (voz es_MX 'claude', licencia Apache-2.0).
Uso: python3 scripts/tts_piper.py <carpeta_modelo> <salida_dir> [length_scale]
Para usar una voz profesional, sustituye los WAV de public/audio/voice/ manteniendo los nombres."""
import json, sys, subprocess, pathlib
model_dir = pathlib.Path(sys.argv[1]); out = pathlib.Path(sys.argv[2]); ls = sys.argv[3] if len(sys.argv) > 3 else "1.12"
out.mkdir(parents=True, exist_ok=True)
onnx = next(model_dir.glob("*.onnx"))
lines = json.load(open(pathlib.Path(__file__).with_name("voice_lines.json")))
for l in lines:
    subprocess.run([sys.executable, "-m", "piper", "-m", str(onnx), "-c", str(onnx) + ".json",
                    "-f", str(out / f"{l['id']}.wav"), "--length-scale", ls,
                    "--noise-scale", "0.6", "--noise-w-scale", "0.75"],
                   input=l["text"].encode(), check=True, capture_output=True)
    print("ok", l["id"])
