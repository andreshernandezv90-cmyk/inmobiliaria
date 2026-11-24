#!/usr/bin/env python3
"""
Construye la banda sonora completa del comercial a partir de la línea de tiempo
(src/config/timeline.json):

  * Música instrumental ORIGINAL sintetizada aquí mismo (pads, arpa/celesta,
    campanas, graves) → sin licencias de terceros: uso comercial libre.
  * Efectos sonoros sintetizados (vela, llave, cerradura, broche, páginas, pluma).
  * Narración: WAV por frase en assets-src/voice_raw/<id>.wav (o los que pongas tú),
    procesados (limpieza, EQ cálida, compresión, reverberación corta).
  * Mezcla con "ducking" de la música bajo la voz y normalización a -14 LUFS.

Salidas: public/audio/mix.wav (la que usa el video) y stems en assets-src/stems/.
Uso: python3 scripts/build_audio.py
"""
import json
import pathlib
import subprocess
import sys

import numpy as np
import soundfile as sf
from scipy.signal import butter, fftconvolve, resample_poly, sosfilt

ROOT = pathlib.Path(__file__).resolve().parent.parent
TL = json.load(open(ROOT / "src/config/timeline.json"))
SR = 48000
DUR = TL["duration"]
N = int(DUR * SR)
EV = TL["events"]
rng = np.random.default_rng(7)


def midi(m):
    return 440.0 * 2 ** ((m - 69) / 12)


def t_axis(n):
    return np.arange(n) / SR


def place(buf, sig, at, gain=1.0):
    """Suma sig (mono o estéreo) en buf a partir del segundo `at`."""
    i = int(at * SR)
    if i >= len(buf):
        return
    sig = sig[: len(buf) - i]
    if buf.ndim == 2 and sig.ndim == 1:
        sig = np.stack([sig, sig], 1)
    buf[i : i + len(sig)] += sig * gain


def lp(x, f, order=2):
    return sosfilt(butter(order, f, "low", fs=SR, output="sos"), x, axis=0)


def hp(x, f, order=2):
    return sosfilt(butter(order, f, "high", fs=SR, output="sos"), x, axis=0)


def bp(x, lo, hi, order=2):
    return sosfilt(butter(order, [lo, hi], "band", fs=SR, output="sos"), x, axis=0)


def env_adsr(n, a, r, sustain=1.0):
    e = np.ones(n) * sustain
    na, nr = int(a * SR), int(r * SR)
    na = min(na, n)
    e[:na] = np.sin(np.linspace(0, np.pi / 2, na)) ** 2 * sustain
    if nr > 0 and nr < n:
        e[-nr:] *= np.cos(np.linspace(0, np.pi / 2, nr)) ** 2
    return e


def pan(sig, p):
    """p en [-1,1]."""
    a = (p + 1) * np.pi / 4
    return np.stack([sig * np.cos(a), sig * np.sin(a)], 1)


def reverb_ir(seconds, damp=3500, seed=1, predelay=0.02):
    r = np.random.default_rng(seed)
    n = int(seconds * SR)
    t = t_axis(n)
    decay = np.exp(-6.9 * t / seconds)
    ir = np.zeros((n + int(predelay * SR), 2))
    for ch in range(2):
        noise = r.standard_normal(n) * decay
        noise = lp(noise, damp)
        ir[int(predelay * SR) :, ch] = noise
    # primeras reflexiones
    for k in range(8):
        d = int((0.008 + r.random() * 0.05) * SR)
        ir[d, k % 2] += 0.6 * (0.8 ** k)
    return ir / np.sqrt((ir ** 2).sum() / 2)


def convolve_st(x, ir):
    out = np.zeros((len(x), 2))
    src = x if x.ndim == 2 else np.stack([x, x], 1)
    for ch in range(2):
        out[:, ch] = fftconvolve(src[:, ch], ir[:, ch])[: len(x)]
    return out


# ---------------------------------------------------------------------------
# MÚSICA
# ---------------------------------------------------------------------------
CHORDS = [  # (inicio, fin, notas midi, brillo 0..1)
    (0.0, 5.3, [38, 50, 57, 62, 65, 69, 76], 0.25),  # Dm9 — despertar
    (5.0, 7.8, [38, 50, 57, 62, 65, 69, 76], 0.4),  # Dm9
    (7.6, 10.3, [46, 53, 58, 62, 65, 69, 74], 0.7),  # B♭maj7 — el libro se abre
    (10.0, 12.6, [43, 50, 58, 62, 65, 69], 0.55),  # Gm9
    (12.3, 14.9, [41, 50, 57, 62, 65, 69], 0.55),  # Dm/F
    (14.6, 17.2, [46, 53, 58, 62, 65, 69], 0.6),  # B♭maj7
    (16.9, 19.6, [48, 55, 62, 64, 67, 69], 0.6),  # C6/9
    (19.3, 21.9, [38, 50, 57, 62, 64, 65, 69, 76], 0.9),  # Dm(add9) — título
    (21.6, 24.3, [46, 53, 57, 62, 64, 69], 0.75),  # B♭maj7♯11
    (24.0, 26.6, [43, 50, 58, 62, 65, 69], 0.7),  # Gm9
    (26.3, 29.0, [45, 52, 57, 62, 64, 69], 0.7),  # Asus4
    (28.7, 31.6, [38, 50, 57, 62, 65, 69], 0.65),  # Dm
    (31.4, 34.3, [41, 48, 57, 60, 65, 69], 0.7),  # F
    (34.0, 36.9, [46, 53, 58, 62, 65, 70], 0.7),  # B♭
    (36.6, 39.4, [45, 53, 57, 60, 65, 69], 0.7),  # F/A
    (39.2, 40.9, [43, 50, 55, 58, 62, 65], 0.65),  # Gm7
    (40.6, DUR, [38, 50, 57, 62, 66, 69, 74], 0.8),  # D mayor — final luminoso
]


def pad_chord(start, end, notes, bright):
    n = int((end - start + 1.6) * SR)
    t = t_axis(n)
    out = np.zeros((n, 2))
    nh = int(3 + bright * 7)
    for j, m in enumerate(notes):
        f0 = midi(m)
        voice = np.zeros(n)
        for det in (-0.0025, 0.0, 0.0028):
            f = f0 * (1 + det)
            ph = rng.random() * 2 * np.pi
            for h in range(1, nh + 1):
                if f * h > 7000:
                    break
                voice += np.sin(2 * np.pi * f * h * t + ph * h) / h ** 1.35
        # respiración lenta
        voice *= 0.82 + 0.18 * np.sin(2 * np.pi * (0.11 + 0.03 * j) * t + j)
        low = m < 48
        voice *= (0.9 if low else 0.55) / len(notes)
        out += pan(voice, (j / max(1, len(notes) - 1) - 0.5) * 0.7)
    e = env_adsr(n, 1.3, 1.8)
    out *= e[:, None]
    out = lp(out, 900 + bright * 2600)
    return out


def pluck(f, dur=2.6, bright=1.0):
    n = int(dur * SR)
    t = t_axis(n)
    s = np.zeros(n)
    for k, (h, a, d) in enumerate([(1, 1, 1.6), (2, 0.45, 0.9), (3, 0.22, 0.5), (4.2, 0.12, 0.25), (6.1, 0.05 * bright, 0.12)]):
        s += a * np.sin(2 * np.pi * f * h * t + k) * np.exp(-t / (d * (440 / f) ** 0.3))
    att = np.minimum(1, t / 0.004)
    return s * att


def bell(f, dur=5.0):
    n = int(dur * SR)
    t = t_axis(n)
    s = np.zeros(n)
    for h, a, d in [(1, 1, 3.5), (2.76, 0.5, 2.0), (5.40, 0.25, 1.1), (8.93, 0.12, 0.6), (0.5, 0.3, 4.0)]:
        s += a * np.sin(2 * np.pi * f * h * t) * np.exp(-t / d)
    return s * np.minimum(1, t / 0.002)


def build_music():
    mus = np.zeros((N, 2))
    for (a, b, notes, br) in CHORDS:
        place(mus, pad_chord(a, b, notes, br), a, 1.0)
    # pedal grave en Re que respira
    t = t_axis(N)
    sub = np.sin(2 * np.pi * midi(26) * t) * 0.5 + np.sin(2 * np.pi * midi(38) * t) * 0.25
    subenv = np.clip((t - 0.2) / 3.0, 0, 1) * (1 - np.clip((t - (DUR - 2.5)) / 2.5, 0, 1))
    mus += np.stack([sub * subenv, sub * subenv], 1) * 0.18

    # arpegios de arpa/celesta (delicados) en las secciones de desarrollo
    def arp(a, b, step, octave_up=12, gain=0.09, seed=1):
        r = np.random.default_rng(seed)
        tt = a
        i = 0
        while tt < b:
            chord = next((c for c in CHORDS[::-1] if c[0] <= tt), CHORDS[0])
            tones = sorted({m for m in chord[2] if m >= 57})
            seq = tones + [m + 12 for m in tones]
            m = seq[(i * 2 + (i // len(seq))) % len(seq)] + octave_up
            vel = 0.7 + 0.3 * r.random()
            p = pluck(midi(m), 2.4)
            place(mus, pan(p, (r.random() - 0.5) * 0.9), tt + r.normal(0, 0.008), gain * vel)
            tt += step
            i += 1

    arp(5.2, 9.8, 0.42, 0, 0.06, 1)
    arp(10.0, 19.2, 0.34, 0, 0.075, 2)
    arp(21.8, 28.6, 0.3, 0, 0.07, 3)
    arp(28.7, 33.8, 0.3, 0, 0.065, 4)
    arp(34.2, 40.4, 0.36, 0, 0.06, 5)

    # campanas en los momentos clave
    for at, m, g in [
        (EV["candle1Ignite"], 74, 0.06),
        (EV["keyTurnEnd"], 81, 0.08),
        (EV["coverOpenStart"] + 0.2, 86, 0.06),
        (EV["titleHit"], 74, 0.12),
        (EV["titleHit"] + 0.02, 81, 0.07),
        (EV["moduleFlips"][0], 81, 0.05),
        (EV["moduleFlips"][1], 84, 0.05),
        (EV["moduleFlips"][2], 88, 0.05),
        (EV["weeksHit"], 86, 0.07),
        (EV["ctaHit"], 81, 0.09),
        (EV["endCard"], 74, 0.1),
        (EV["endCard"] + 0.02, 78, 0.06),
    ]:
        place(mus, pan(bell(midi(m)), 0.15), at, g)

    # subida antes del título y golpe grave suave
    hit = EV["titleHit"]
    n = int(2.2 * SR)
    sw = rng.standard_normal(n)
    tt = t_axis(n)
    shape = (tt / 2.2) ** 2.5
    sw = bp(sw, 1500, 9000) * shape * 0.12
    place(mus, np.stack([sw, np.roll(sw, 300)], 1), hit - 2.2)
    n = int(3.0 * SR)
    tt = t_axis(n)
    boom = np.sin(2 * np.pi * (48 * np.exp(-tt * 0.6)) * tt) * np.exp(-tt / 1.1) * np.minimum(1, tt / 0.01)
    place(mus, boom, hit, 0.32)
    # pequeño golpe al final (tarjeta de marca)
    place(mus, boom, EV["endCard"], 0.2)

    # fundido final
    fade = np.ones(N)
    fl = int(1.8 * SR)
    fade[-fl:] = np.cos(np.linspace(0, np.pi / 2, fl)) ** 1.5
    fadein = np.minimum(1, t / 1.2)
    mus *= (fade * fadein)[:, None]
    return mus


# ---------------------------------------------------------------------------
# EFECTOS
# ---------------------------------------------------------------------------
def noise(d):
    return rng.standard_normal(int(d * SR))


def sfx_ignite(scale=1.0):
    d = 0.9
    t = t_axis(int(d * SR))
    strike = hp(noise(d), 2500) * np.exp(-t / 0.05) * 0.5
    whoomp = lp(noise(d), 700) * (np.sin(np.pi * np.clip(t / 0.5, 0, 1)) ** 2) * 0.9
    crackle = bp(noise(d), 3000, 8000) * (rng.random(len(t)) > 0.997) * 4 * np.exp(-t / 0.4)
    return (strike + whoomp + crackle) * scale


def sfx_click(f=2300):
    d = 0.12
    t = t_axis(int(d * SR))
    s = sum(np.sin(2 * np.pi * f * k * t) * np.exp(-t / (0.02 / k)) for k in (1, 1.61, 2.27, 3.1))
    s += hp(noise(d), 4000) * np.exp(-t / 0.004) * 0.6
    return s * 0.5


def sfx_scrape(d=0.32):
    t = t_axis(int(d * SR))
    s = bp(noise(d), 2500, 6500) * np.sin(np.pi * t / d) ** 1.5
    s += sum(np.sin(2 * np.pi * f * t) * 0.05 for f in (3150, 4720))
    return s * 0.35


def sfx_thud(d=0.4, f=180):
    t = t_axis(int(d * SR))
    return lp(noise(d), f) * np.exp(-t / 0.06) * 2.5 + np.sin(2 * np.pi * 70 * t) * np.exp(-t / 0.08) * 0.4


def sfx_rustle(d=0.45, density=1.0):
    t = t_axis(int(d * SR))
    flutter = 0.5 + 0.5 * np.sin(2 * np.pi * (18 + 10 * t) * t) ** 2
    s = bp(noise(d), 900, 7000) * flutter * np.sin(np.pi * t / d) ** 1.2
    return s * 0.35 * density


def sfx_creak(d=1.4):
    t = t_axis(int(d * SR))
    f = 140 + 60 * np.sin(2 * np.pi * 0.7 * t)
    pulses = np.sin(2 * np.pi * np.cumsum(f) / SR)
    s = bp(np.sign(pulses) * (rng.random(len(t)) * 0.3 + 0.7), 300, 1800) * np.sin(np.pi * t / d) ** 2
    whoosh = lp(noise(d), 500) * np.sin(np.pi * t / d) ** 2
    return s * 0.05 + whoosh * 0.5


def sfx_shimmer(d=1.6):
    out = np.zeros(int(d * SR))
    for i, m in enumerate([86, 90, 93, 98, 102]):
        p = pluck(midi(m), d - i * 0.08)
        out[int(i * 0.08 * SR) : int(i * 0.08 * SR) + len(p)] += p * 0.4
    return out


def sfx_quill(d):
    t = t_axis(int(d * SR))
    strokes = 0.5 + 0.5 * np.sign(np.sin(2 * np.pi * 2.6 * t + np.sin(2 * np.pi * 0.7 * t)))
    s = bp(noise(d), 2500, 9000) * strokes * (0.6 + 0.4 * rng.random(len(t)))
    return lp(s, 7000) * 0.06 * np.minimum(1, np.minimum(t / 0.2, (d - t) / 0.3))


def build_sfx():
    fx = np.zeros((N, 2))
    place(fx, pan(sfx_ignite(1.0), -0.2), EV["candle1Ignite"] - 0.05, 0.5)
    for i, at in enumerate(EV["candlesIgnite"]):
        place(fx, pan(sfx_ignite(0.5), [-0.4, 0.4, -0.6, 0.6][i]), at - 0.05, 0.35)
    place(fx, pan(sfx_ignite(1.0), 0.1), EV["candleCloseIgnite"] - 0.05, 0.55)
    place(fx, pan(sfx_shimmer(), 0.1), EV["keyLift"], 0.25)
    place(fx, pan(sfx_scrape(), 0.3), EV["keyInsert"] - 0.3, 0.45)
    place(fx, pan(sfx_click(2100), 0.3), EV["keyInsert"], 0.4)
    place(fx, pan(sfx_click(1900), 0.3), EV["keyTurnEnd"] - 0.12, 0.5)
    place(fx, pan(sfx_click(2600), 0.3), EV["keyTurnEnd"], 0.6)
    place(fx, pan(sfx_thud(0.3, 260), 0.35), EV["strapOpen"] + 0.05, 0.6)
    place(fx, pan(sfx_creak(EV["coverOpenEnd"] - EV["coverOpenStart"]), -0.1), EV["coverOpenStart"], 0.8)
    place(fx, pan(sfx_thud(0.5, 140), -0.3), EV["coverOpenEnd"] - 0.05, 0.9)
    for i, at in enumerate(EV["pageFlutter"]):
        place(fx, pan(sfx_rustle(0.45), -0.2 + 0.1 * i), at, 0.6)
    for i, at in enumerate(EV["moduleFlips"]):
        place(fx, pan(sfx_rustle(0.6), -0.2 + 0.1 * i), at, 0.55)
    place(fx, pan(sfx_quill(EV["quillWriteEnd"] - EV["quillWriteStart"]), 0.2), EV["quillWriteStart"], 1.0)
    return fx


# ---------------------------------------------------------------------------
# VOZ
# ---------------------------------------------------------------------------
def load_voice(path):
    x, sr = sf.read(path, always_2d=False)
    if x.ndim == 2:
        x = x.mean(1)
    if sr != SR:
        from math import gcd

        g = gcd(SR, sr)
        x = resample_poly(x, SR // g, sr // g)
    # recorte de silencios
    thr = 0.01 * np.max(np.abs(x))
    idx = np.where(np.abs(x) > thr)[0]
    x = x[max(0, idx[0] - int(0.015 * SR)) : idx[-1] + int(0.08 * SR)]
    return x


def process_voice(x):
    x = hp(x, 75)
    # calidez y presencia suaves (shelves aproximados con filtros paralelos)
    x = x + 0.25 * lp(x, 260) + 0.12 * bp(x, 2500, 5000)
    x = x - 0.18 * bp(x, 6500, 10500)  # de-esser suave
    # compresión simple (seguidor de envolvente)
    env = np.abs(x)
    env = lp(env, 12, 1)
    thr = 0.12
    gain = np.where(env > thr, (thr + (env - thr) / 3) / np.maximum(env, 1e-9), 1.0)
    x = x * gain
    return x / (np.max(np.abs(x)) + 1e-9) * 0.9


def build_voice():
    vdir_custom = ROOT / "public/audio/voice"
    vdir = ROOT / "assets-src/voice_raw"
    voice = np.zeros(N)
    report = []
    for line in TL["voice"]:
        p = vdir_custom / f"{line['id']}.wav"
        if not p.exists():
            p = vdir / f"{line['id']}.wav"
        x = process_voice(load_voice(p))
        place(voice, x, line["start"])
        report.append((line["id"], line["start"], line["start"] + len(x) / SR))
    for (a, s, e), nxt in zip(report, report[1:] + [(None, DUR, None)]):
        flag = "  <-- SOLAPA" if e > nxt[1] else ""
        print(f"  voz {a}: {s:6.2f} → {e:6.2f}s{flag}")
    return voice


# ---------------------------------------------------------------------------
def main():
    print("Componiendo música…")
    mus = build_music()
    print("Sintetizando efectos…")
    fx = build_sfx()
    print("Procesando narración…")
    voice = build_voice()

    # reverberaciones
    hall = reverb_ir(3.6, 3800, 1)
    room = reverb_ir(0.9, 5000, 2, 0.01)
    mus = mus * 0.75 + convolve_st(mus, hall) * 0.32
    fx = fx * 0.85 + convolve_st(fx, hall) * 0.18
    vst = np.stack([voice, voice], 1)
    vst = vst + convolve_st(voice, room) * 0.07

    # ducking de la música bajo la voz
    venv = lp(np.abs(voice), 4, 1)
    venv = venv / (venv.max() + 1e-9)
    duck = 1 - 0.62 * np.clip(venv * 4, 0, 1)
    duck = lp(duck, 3, 1)

    def norm_rms(x, db):
        r = np.sqrt(np.mean(x[np.abs(x).sum(axis=-1) > 1e-4] ** 2)) if x.ndim == 2 else np.sqrt(np.mean(x[np.abs(x) > 1e-4] ** 2))
        return x * (10 ** (db / 20) / (r + 1e-12))

    vst = norm_rms(vst, -17)
    mus = norm_rms(mus, -21) * duck[:, None]
    fx = norm_rms(fx, -26)
    mix = vst + mus + fx
    # limitador suave
    peak = np.max(np.abs(mix))
    mix = np.tanh(mix / max(peak, 1e-9) * 1.3) / np.tanh(1.3) * 0.95

    stems = ROOT / "assets-src/stems"
    stems.mkdir(parents=True, exist_ok=True)
    sf.write(stems / "musica.wav", mus / (np.max(np.abs(mus)) + 1e-9) * 0.9, SR, subtype="PCM_24")
    sf.write(stems / "efectos.wav", fx / (np.max(np.abs(fx)) + 1e-9) * 0.9, SR, subtype="PCM_24")
    sf.write(stems / "voz.wav", vst / (np.max(np.abs(vst)) + 1e-9) * 0.9, SR, subtype="PCM_24")
    pre = stems / "mix_pre.wav"
    sf.write(pre, mix, SR, subtype="PCM_24")

    out = ROOT / "public/audio/mix.wav"
    out.parent.mkdir(parents=True, exist_ok=True)
    print("Normalizando a -14 LUFS…")
    subprocess.run(
        ["ffmpeg", "-v", "error", "-y", "-i", str(pre), "-af", "loudnorm=I=-14:TP=-1.5:LRA=11", "-ar", str(SR), "-c:a", "pcm_s16le", str(out)],
        check=True,
    )
    print("OK →", out.relative_to(ROOT))


if __name__ == "__main__":
    sys.exit(main())
