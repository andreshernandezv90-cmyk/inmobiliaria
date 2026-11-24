# Escuela de Magia Antigua · Video comercial

Video vertical para Reels, TikTok y Facebook que promociona la **Escuela de Magia Antigua** de **La Llave de la Bruja**, una marca de **El Grimorio de la Bruja**.

| Formato | Valor |
|---|---|
| Resolución | 1080 × 1920 (9:16) |
| Duración | 44,5 s (1335 fotogramas) |
| FPS | 30 |
| Vídeo | H.264, yuv420p, CRF 16 |
| Audio | AAC 320 kbps, 48 kHz, −14 LUFS integrados, −1,5 dBTP |
| Archivo final | `out/escuela-magia-antigua.mp4` |

## Cómo se hizo

* **Remotion 4 + React 19 + Three.js (React Three Fiber)**. Toda la escena 3D se genera en código: el grimorio de cuero repujado en oro con broche y cerradura, la llave de latón, las velas con llama por *shader*, el tintero, la pluma, las hierbas, los pergaminos y la mesa de nogal. Las texturas son procedurales (canvas) y usan semillas fijas, así que el render es determinista.
* **Capas 2D encima del 3D**: polvo dorado y bokeh, humo sutil, halo de las llamas, grano de película, viñeta, sigilos dorados en SVG y textos animados.
* **Transiciones**: fundidos cruzados entre cámaras, con más humo en cada cambio de escena.
* **Banda sonora** (`scripts/build_audio.py`): la música es **original y está sintetizada en el propio script**: pads en Re menor/dórico, arpa y celesta, campanas y un golpe grave en el título. Los efectos también están sintetizados: vela, llave, cerradura, broche, páginas y pluma. La música baja automáticamente cuando habla la voz.

## Estructura

```
src/
  config/
    content.ts     ← TODOS los textos en pantalla
    brand.ts       ← colores, tipografías y rutas de logotipos oficiales
    timeline.json  ← tiempos de escenas, frases de voz y eventos (video + audio)
    shots.ts       ← movimientos de cámara por escena
  scenes/          ← S1Despertar … S6Llamada (composición de cada escena)
  three/           ← mundo 3D (Grimoire, Key, Candle, Props, texturas)
  components/      ← textos, atmósfera (partículas, humo, grano), ornamentos
scripts/
  voice_lines.json ← guion de la narración (una entrada por frase)
  tts_piper.py     ← genera la voz provisional
  build_audio.py   ← música + efectos + mezcla → public/audio/mix.wav
  stills.sh        ← fotogramas de control: scripts/stills.sh 2.5 20 38
```

## Comandos

```bash
npm install
```

```bash
npm run studio
```

```bash
npm run audio
```

```bash
npm run render
```

`npm run studio` abre la vista previa interactiva. `npm run audio` reconstruye la banda sonora después de cambiar tiempos o voces. `npm run render` genera `out/escuela-magia-antigua.mp4`.

## Personalización

* **Textos**: `src/config/content.ts`.
* **Colores y tipografías**: `src/config/brand.ts`. Se usan Cinzel y Cormorant Garamond, ambas con licencia SIL OFL, que permite el uso comercial.
* **Logotipos oficiales**: copia los archivos PNG o SVG con fondo transparente en `public/brand/` e indica su ruta en `logos.llave` y `logos.grimorio` de `brand.ts`. Mientras esas rutas sean `null` se usa el emblema provisional de llave y luna creciente hecho en código.
* **Tiempos y duración**: `src/config/timeline.json`. Después ejecuta `npm run audio`.
* **Voz profesional**: guarda los WAV en `public/audio/voice/` con los nombres `l1.wav`, `l2.wav`, `l3.wav`, `l4a.wav`, `l4b.wav`, `l5.wav` y `l6.wav` (una frase por archivo; el texto está en `scripts/voice_lines.json`). Ajusta los `start` de `timeline.json` si cambian las duraciones y ejecuta `npm run audio`. El script avisa si dos frases se solapan.

## Licencias de los recursos

| Recurso | Origen | Licencia |
|---|---|---|
| Imágenes 3D, texturas, partículas y sigilos | Generados en este proyecto | Propios |
| Música y efectos | Sintetizados en `build_audio.py` | Propios |
| Tipografías Cinzel y Cormorant Garamond | @fontsource | SIL Open Font License 1.1 |
| Voz provisional | Piper TTS, voz `es_MX-claude-high` | Modelo Apache-2.0 |

> **Voz**: la narración actual es una voz sintética provisional en español de México. Su ficha declara licencia Apache-2.0, pero los modelos Piper suelen afinarse a partir de otras voces base con licencias propias. Antes de pautar la campaña con inversión publicitaria, se recomienda sustituirla por una locutora profesional o por una voz de un servicio con licencia comercial explícita (ver *Voz profesional*).
