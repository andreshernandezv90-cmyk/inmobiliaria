#!/usr/bin/env bash
# Renderiza fotogramas de control (segundos): scripts/stills.sh 2.5 7.3 ...
set -e
cd "$(dirname "$0")/.."
npx remotion bundle src/index.ts --out-dir=out/bundle --log=error >/dev/null
for s in "$@"; do
  f=$(python3 -c "print(round($s*30))")
  npx remotion still out/bundle EscuelaMagiaAntigua "out/stills/t$s.png" --frame=$f --log=error --scale=0.5 &
  [ $(jobs -r | wc -l) -ge 4 ] && wait -n
done
wait
python3 - "$@" <<'PY'
import sys
from PIL import Image
ims=[Image.open(f'out/stills/t{s}.png') for s in sys.argv[1:]]
w,h=ims[0].size
c=Image.new('RGB',(len(ims)*(w+10),h),'white')
for i,im in enumerate(ims): c.paste(im,(i*(w+10),0))
c.save('out/stills/sheet.png')
PY
