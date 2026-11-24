#!/usr/bin/env bash
# Convierte el render a yuv420p (rango TV) + faststart: máxima compatibilidad en Reels/TikTok/Facebook.
set -e
cd "$(dirname "$0")/.."
ffmpeg -v error -y -i out/render-raw.mp4 \
  -vf "scale=in_range=pc:out_range=tv,format=yuv420p" -c:v libx264 -preset slow -crf 16 \
  -profile:v high -level 4.2 -r 30 -c:a copy -movflags +faststart out/escuela-magia-antigua.mp4
echo "OK → out/escuela-magia-antigua.mp4"
