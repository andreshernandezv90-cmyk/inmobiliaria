/**
 * Texturas procedurales (canvas 2D) — cuero repujado en oro, pergamino con
 * escritura, madera de nogal, cantos de página y pluma. Todo se genera con
 * semillas fijas para que cada fotograma sea idéntico entre hilos de render.
 */
import * as THREE from 'three';
import {fbm, rng} from '../lib/random';

const cache = new Map<string, unknown>();
const memo = <T,>(key: string, make: () => T): T => {
  if (!cache.has(key)) cache.set(key, make());
  return cache.get(key) as T;
};

const canvas = (w: number, h: number) => {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  const ctx = c.getContext('2d')!;
  return {c, ctx};
};

/** Campo de ruido fbm a baja resolución, devuelto como canvas en escala de grises. */
const noiseCanvas = (w: number, h: number, scale: number, oct: number, seed: number, stretch = 1) => {
  const {c, ctx} = canvas(w, h);
  const img = ctx.createImageData(w, h);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const v = fbm((x / w) * scale * stretch, (y / h) * scale, oct, seed);
      const i = (y * w + x) * 4;
      const g = Math.round(v * 255);
      img.data[i] = img.data[i + 1] = img.data[i + 2] = g;
      img.data[i + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
  return c;
};

const toTexture = (c: HTMLCanvasElement, srgb = true, repeat = false) => {
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = srgb ? THREE.SRGBColorSpace : THREE.NoColorSpace;
  t.anisotropy = 8;
  if (repeat) t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.needsUpdate = true;
  return t;
};

/* ------------------------------------------------------------------ */
/* Ornamentos dorados del grimorio (máscara blanca sobre negro)        */
/* ------------------------------------------------------------------ */
const drawMoon = (ctx: CanvasRenderingContext2D, x: number, y: number, r: number, phase: number) => {
  // phase: 0 nueva, 0.5 llena, 1 nueva. Dibuja la parte iluminada.
  ctx.save();
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.lineWidth = Math.max(1.5, r * 0.12);
  ctx.stroke();
  const k = Math.cos(phase * Math.PI * 2); // 1 nueva → -1 llena
  ctx.beginPath();
  const waxing = phase < 0.5;
  ctx.arc(x, y, r, -Math.PI / 2, Math.PI / 2, !waxing);
  ctx.ellipse(x, y, Math.abs(k) * r, r, 0, Math.PI / 2, -Math.PI / 2, waxing ? k > 0 : k < 0);
  ctx.fill();
  ctx.restore();
};

const drawKeyShape = (ctx: CanvasRenderingContext2D, x: number, y: number, len: number, lw: number) => {
  // Llave vertical: anillo arriba, vástago, paletón abajo.
  ctx.save();
  ctx.lineWidth = lw;
  const r = len * 0.16;
  ctx.beginPath();
  ctx.arc(x, y - len / 2 + r, r, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(x, y - len / 2 + r, r * 0.45, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x, y - len / 2 + 2 * r);
  ctx.lineTo(x, y + len / 2);
  ctx.stroke();
  // collarín
  ctx.beginPath();
  ctx.moveTo(x - r * 0.55, y - len / 2 + 2.6 * r);
  ctx.lineTo(x + r * 0.55, y - len / 2 + 2.6 * r);
  ctx.stroke();
  // paletón
  ctx.fillRect(x, y + len / 2 - len * 0.22, len * 0.17, len * 0.08);
  ctx.fillRect(x, y + len / 2 - len * 0.1, len * 0.22, len * 0.1);
  ctx.restore();
};

const drawStar = (ctx: CanvasRenderingContext2D, x: number, y: number, r: number, points = 8, inner = 0.42) => {
  ctx.beginPath();
  for (let i = 0; i < points * 2; i++) {
    const a = (i / (points * 2)) * Math.PI * 2 - Math.PI / 2;
    const rr = i % 2 === 0 ? r : r * inner;
    ctx.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr);
  }
  ctx.closePath();
};

const coverOrnamentMask = (w: number, h: number) => {
  const {c, ctx} = canvas(w, h);
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, w, h);
  ctx.strokeStyle = '#fff';
  ctx.fillStyle = '#fff';
  ctx.lineCap = 'round';
  // marcos
  ctx.lineWidth = 7;
  ctx.strokeRect(54, 54, w - 108, h - 108);
  ctx.lineWidth = 2.5;
  ctx.strokeRect(78, 78, w - 156, h - 156);
  ctx.lineWidth = 2;
  ctx.strokeRect(96, 96, w - 192, h - 192);
  // esquinas
  const corners: [number, number, number][] = [
    [96, 96, 0],
    [w - 96, 96, Math.PI / 2],
    [w - 96, h - 96, Math.PI],
    [96, h - 96, -Math.PI / 2],
  ];
  for (const [x, y, rot] of corners) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rot);
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(0, 0, 70, 0, Math.PI / 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(0, 0, 50, 0, Math.PI / 2);
    ctx.stroke();
    drawStar(ctx, 30, 30, 16, 4, 0.35);
    ctx.fill();
    for (let i = 0; i < 5; i++) {
      const a = (i / 4) * (Math.PI / 2);
      ctx.beginPath();
      ctx.arc(Math.cos(a) * 88, Math.sin(a) * 88, 4, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }
  // emblema central
  const cx = w / 2, cy = h * 0.47;
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.arc(cx, cy, 250, 0, Math.PI * 2);
  ctx.stroke();
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(cx, cy, 228, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(cx, cy, 168, 0, Math.PI * 2);
  ctx.stroke();
  // marcas radiales
  for (let i = 0; i < 72; i++) {
    const a = (i / 72) * Math.PI * 2;
    const r1 = 228, r2 = i % 6 === 0 ? 196 : 212;
    ctx.lineWidth = i % 6 === 0 ? 3 : 1.5;
    ctx.beginPath();
    ctx.moveTo(cx + Math.cos(a) * r1, cy + Math.sin(a) * r1);
    ctx.lineTo(cx + Math.cos(a) * r2, cy + Math.sin(a) * r2);
    ctx.stroke();
  }
  // fases lunares en el anillo exterior
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2 - Math.PI / 2;
    drawMoon(ctx, cx + Math.cos(a) * 300, cy + Math.sin(a) * 300, 20, i / 8);
  }
  // llave central y estrella
  ctx.lineWidth = 2;
  drawStar(ctx, cx, cy, 160, 8, 0.78);
  ctx.stroke();
  drawKeyShape(ctx, cx, cy, 250, 8);
  // cartela inferior
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(cx - 220, h * 0.79);
  ctx.lineTo(cx + 220, h * 0.79);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(cx - 160, h * 0.81);
  ctx.lineTo(cx + 160, h * 0.81);
  ctx.stroke();
  drawStar(ctx, cx, h * 0.8, 14, 4, 0.3);
  ctx.fill();
  for (let i = -2; i <= 2; i++) drawMoon(ctx, cx + i * 70, h * 0.86, 13, (i + 2) / 4 * 0.5 + 0.02);
  return c;
};

export type CoverMaps = {map: THREE.Texture; orm: THREE.Texture; bump: THREE.Texture};

/** Cuero negro-marrón con repujado dorado gastado. */
export const coverMaps = (): CoverMaps =>
  memo('cover', () => {
    const w = 1024, h = 1400;
    const mask = coverOrnamentMask(w, h);
    const big = noiseCanvas(128, 176, 6, 5, 11);
    const fine = noiseCanvas(512, 700, 60, 3, 12);
    const wear = noiseCanvas(128, 176, 9, 4, 13);

    // Color
    const col = canvas(w, h);
    const g = col.ctx;
    g.fillStyle = '#24150d';
    g.fillRect(0, 0, w, h);
    g.globalCompositeOperation = 'overlay';
    g.globalAlpha = 0.85;
    g.drawImage(big, 0, 0, w, h);
    g.globalAlpha = 0.35;
    g.drawImage(fine, 0, 0, w, h);
    g.globalCompositeOperation = 'source-over';
    // bordes gastados (más claros)
    const r = rng(7);
    g.globalAlpha = 1;
    for (const [x0, y0, x1, y1] of [
      [0, 0, 46, 0],
      [w, 0, w - 46, 0],
      [0, 0, 0, 46],
      [0, h, 0, h - 46],
    ]) {
      const gr = g.createLinearGradient(x0, y0, x1, y1);
      gr.addColorStop(0, 'rgba(120,80,50,0.55)');
      gr.addColorStop(1, 'rgba(120,80,50,0)');
      g.fillStyle = gr;
      g.fillRect(0, 0, w, h);
    }
    // arañazos finos
    g.strokeStyle = 'rgba(150,105,70,0.18)';
    for (let i = 0; i < 260; i++) {
      const x = r() * w, y = r() * h, a = r() * Math.PI, l = 6 + r() * 40;
      g.lineWidth = 0.6 + r() * 1.2;
      g.beginPath();
      g.moveTo(x, y);
      g.lineTo(x + Math.cos(a) * l, y + Math.sin(a) * l);
      g.stroke();
    }
    // oro gastado: la máscara se convierte en alfa modulado por el desgaste
    const alphaMask = canvas(w, h);
    {
      const m = mask.getContext('2d')!.getImageData(0, 0, w, h);
      const wd = wear.getContext('2d')!;
      const wearData = wd.getImageData(0, 0, wear.width, wear.height).data;
      for (let i = 0; i < m.data.length; i += 4) {
        const px = (i / 4) % w, py = Math.floor(i / 4 / w);
        const wi = (Math.floor((py / h) * wear.height) * wear.width + Math.floor((px / w) * wear.width)) * 4;
        const worn = Math.min(1, Math.max(0, (wearData[wi] / 255 - 0.28) * 2.6));
        m.data[i + 3] = m.data[i] * (0.35 + 0.65 * worn);
        m.data[i] = m.data[i + 1] = m.data[i + 2] = 255;
      }
      alphaMask.ctx.putImageData(m, 0, 0);
    }
    const goldFinal = canvas(w, h);
    goldFinal.ctx.fillStyle = '#c7a058';
    goldFinal.ctx.fillRect(0, 0, w, h);
    goldFinal.ctx.globalCompositeOperation = 'multiply';
    goldFinal.ctx.globalAlpha = 0.5;
    goldFinal.ctx.drawImage(wear, 0, 0, w, h);
    goldFinal.ctx.globalAlpha = 1;
    goldFinal.ctx.globalCompositeOperation = 'destination-in';
    goldFinal.ctx.drawImage(alphaMask.c, 0, 0);
    g.drawImage(goldFinal.c, 0, 0);

    // ORM: G = rugosidad, B = metalicidad
    const orm = canvas(w, h);
    orm.ctx.fillStyle = 'rgb(255,190,0)';
    orm.ctx.fillRect(0, 0, w, h);
    const ormGold = canvas(w, h);
    ormGold.ctx.fillStyle = 'rgb(255,95,255)';
    ormGold.ctx.fillRect(0, 0, w, h);
    ormGold.ctx.globalCompositeOperation = 'destination-in';
    ormGold.ctx.drawImage(alphaMask.c, 0, 0);
    orm.ctx.drawImage(ormGold.c, 0, 0);

    // Relieve: cuero granulado, ornamentos hundidos
    const bump = canvas(w, h);
    bump.ctx.fillStyle = '#808080';
    bump.ctx.fillRect(0, 0, w, h);
    bump.ctx.globalAlpha = 0.5;
    bump.ctx.drawImage(fine, 0, 0, w, h);
    bump.ctx.globalAlpha = 0.6;
    bump.ctx.globalCompositeOperation = 'multiply';
    const inv = canvas(w, h);
    inv.ctx.filter = 'invert(1) blur(1.5px)';
    inv.ctx.drawImage(mask, 0, 0);
    bump.ctx.drawImage(inv.c, 0, 0);

    return {map: toTexture(col.c), orm: toTexture(orm.c, false), bump: toTexture(bump.c, false)};
  });

/* ------------------------------------------------------------------ */
/* Pergamino                                                           */
/* ------------------------------------------------------------------ */
const INK = 'rgba(52,34,20,';

/** Escritura manuscrita ilegible (simula caligrafía antigua sin inventar texto). */
const fauxScript = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  lines: number,
  lh: number,
  seed: number,
  size = 1,
) => {
  const r = rng(seed);
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  for (let l = 0; l < lines; l++) {
    let cx = x + (l === 0 ? 40 * size : 0);
    const end = x + width - (l === lines - 1 ? width * (0.3 + r() * 0.4) : r() * 30);
    const by = y + l * lh;
    while (cx < end) {
      const ww = (28 + r() * 70) * size;
      if (cx + ww > end) break;
      ctx.strokeStyle = INK + (0.72 + r() * 0.2) + ')';
      ctx.lineWidth = (1.6 + r() * 0.9) * size;
      ctx.beginPath();
      ctx.moveTo(cx, by);
      let px = cx;
      while (px < cx + ww) {
        const step = (5 + r() * 7) * size;
        const up = r() < 0.16 ? -22 * size : -7 * size - r() * 6 * size;
        const down = r() < 0.08 ? 14 * size : 1;
        ctx.quadraticCurveTo(px + step * 0.3, by + up, px + step * 0.6, by - 2);
        ctx.quadraticCurveTo(px + step * 0.8, by + down, px + step, by + (r() - 0.5) * 2);
        px += step;
      }
      ctx.stroke();
      cx += ww + (12 + r() * 10) * size;
    }
  }
};

export const drawSigil = (ctx: CanvasRenderingContext2D, cx: number, cy: number, R: number, lw = 2) => {
  ctx.lineWidth = lw;
  ctx.beginPath();
  ctx.arc(cx, cy, R, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(cx, cy, R * 0.86, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(cx, cy, R * 0.34, 0, Math.PI * 2);
  ctx.stroke();
  for (let i = 0; i < 48; i++) {
    const a = (i / 48) * Math.PI * 2;
    const r2 = i % 4 === 0 ? R * 0.76 : R * 0.81;
    ctx.beginPath();
    ctx.moveTo(cx + Math.cos(a) * R * 0.86, cy + Math.sin(a) * R * 0.86);
    ctx.lineTo(cx + Math.cos(a) * r2, cy + Math.sin(a) * r2);
    ctx.stroke();
  }
  drawStar(ctx, cx, cy, R * 0.74, 8, 0.55);
  ctx.stroke();
  for (let i = 0; i < 4; i++) {
    const a = (i / 4) * Math.PI * 2 - Math.PI / 2;
    drawMoon(ctx, cx + Math.cos(a) * R * 1.18, cy + Math.sin(a) * R * 1.18, R * 0.09, [0.25, 0.5, 0.75, 0.02][i]);
  }
};

const botanical = (ctx: CanvasRenderingContext2D, x: number, y: number, h: number, seed: number) => {
  const r = rng(seed);
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.bezierCurveTo(x - 10, y - h * 0.3, x + 12, y - h * 0.7, x, y - h);
  ctx.stroke();
  for (let i = 1; i < 9; i++) {
    const t = i / 9;
    const px = x + Math.sin(t * 3) * 6, py = y - h * t;
    const side = i % 2 ? 1 : -1;
    const lw = (34 - t * 20) * (0.8 + r() * 0.4);
    ctx.beginPath();
    ctx.ellipse(px + side * lw * 0.55, py - lw * 0.25, lw * 0.55, lw * 0.2, side * -0.6, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(px, py);
    ctx.lineTo(px + side * lw * 0.9, py - lw * 0.45);
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.lineWidth = 2;
  }
};

const parchmentBase = (w: number, h: number, seed: number, gutterSide: 'left' | 'right' | 'none') => {
  const big = noiseCanvas(96, 132, 5, 5, seed);
  const stains = noiseCanvas(64, 88, 3, 4, seed + 5);
  const {c, ctx} = canvas(w, h);
  ctx.fillStyle = '#eadcbc';
  ctx.fillRect(0, 0, w, h);
  ctx.globalCompositeOperation = 'multiply';
  ctx.globalAlpha = 0.28;
  ctx.drawImage(big, 0, 0, w, h);
  ctx.globalAlpha = 0.2;
  ctx.drawImage(stains, 0, 0, w, h);
  ctx.globalAlpha = 1;
  // tinte pergamino
  ctx.fillStyle = 'rgba(214,180,120,0.35)';
  ctx.fillRect(0, 0, w, h);
  // bordes tostados
  const v = ctx.createRadialGradient(w / 2, h / 2, Math.min(w, h) * 0.35, w / 2, h / 2, Math.max(w, h) * 0.75);
  v.addColorStop(0, 'rgba(255,255,255,0)');
  v.addColorStop(1, 'rgba(120,80,40,0.55)');
  ctx.fillStyle = v;
  ctx.fillRect(0, 0, w, h);
  if (gutterSide !== 'none') {
    const gx = gutterSide === 'left' ? 0 : w;
    const gg = ctx.createLinearGradient(gx, 0, gutterSide === 'left' ? 160 : w - 160, 0);
    gg.addColorStop(0, 'rgba(70,45,20,0.55)');
    gg.addColorStop(1, 'rgba(70,45,20,0)');
    ctx.fillStyle = gg;
    ctx.fillRect(0, 0, w, h);
  }
  // manchas (foxing)
  const r = rng(seed + 99);
  for (let i = 0; i < 26; i++) {
    const x = r() * w, y = r() * h, rr = 2 + r() * 10;
    const sg = ctx.createRadialGradient(x, y, 0, x, y, rr);
    sg.addColorStop(0, 'rgba(140,90,40,0.35)');
    sg.addColorStop(1, 'rgba(140,90,40,0)');
    ctx.fillStyle = sg;
    ctx.fillRect(x - rr, y - rr, rr * 2, rr * 2);
  }
  ctx.globalCompositeOperation = 'source-over';
  return c;
};

export type PageVariant = 'right' | 'left' | 'flip' | 'blank';

export const pageTexture = (variant: PageVariant, seed = 1): THREE.Texture =>
  memo(`page-${variant}-${seed}`, () => {
    const w = 1024, h = 1400;
    const base = parchmentBase(w, h, 40 + seed, variant === 'left' ? 'right' : variant === 'right' ? 'left' : 'none');
    const {c, ctx} = canvas(w, h);
    ctx.drawImage(base, 0, 0);
    ctx.strokeStyle = INK + '0.82)';
    ctx.fillStyle = INK + '0.82)';
    if (variant === 'right') {
      fauxScript(ctx, 150, 170, w - 270, 4, 46, seed * 3);
      drawSigil(ctx, w / 2 + 10, 560, 190, 2.4);
      fauxScript(ctx, 150, 870, w - 270, 5, 46, seed * 3 + 1);
      for (let i = 0; i < 5; i++) drawMoon(ctx, 300 + i * 110, 1180, 26, [0.02, 0.15, 0.25, 0.38, 0.5][i]);
      fauxScript(ctx, 150, 1280, w - 270, 1, 46, seed * 3 + 2);
    } else if (variant === 'left') {
      fauxScript(ctx, 120, 170, w - 260, 6, 46, seed * 5);
      botanical(ctx, 300, 1100, 520, seed);
      ctx.save();
      drawKeyShape(ctx, 690, 820, 420, 5);
      ctx.restore();
      fauxScript(ctx, 120, 1220, w - 260, 2, 46, seed * 5 + 1);
    } else if (variant === 'flip') {
      fauxScript(ctx, 140, 170, w - 260, 11, 46, seed * 7);
      drawSigil(ctx, w / 2, 900, 150, 2);
      fauxScript(ctx, 140, 1140, w - 260, 4, 46, seed * 7 + 1);
    }
    return toTexture(c);
  });

/* ---- Página para la escena de escritura: el sigilo se dibuja progresivamente ---- */
type Stroke = [number, number][];
const sigilStrokes = (cx: number, cy: number, R: number): Stroke[] => {
  const s: Stroke[] = [];
  const circle = (r: number, a0 = -Math.PI / 2, sweep = Math.PI * 2) => {
    const pts: Stroke = [];
    for (let i = 0; i <= 90; i++) {
      const a = a0 + (i / 90) * sweep;
      pts.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]);
    }
    return pts;
  };
  s.push(circle(R));
  // estrella de ocho puntas en un solo trazo {8/3}
  const star: Stroke = [];
  for (let i = 0; i <= 8; i++) {
    const a = ((i * 3) / 8) * Math.PI * 2 - Math.PI / 2;
    star.push([cx + Math.cos(a) * R * 0.92, cy + Math.sin(a) * R * 0.92]);
  }
  // subdividir para un avance suave
  const fine: Stroke = [];
  for (let i = 0; i < star.length - 1; i++) {
    for (let k = 0; k < 12; k++) {
      const t = k / 12;
      fine.push([star[i][0] + (star[i + 1][0] - star[i][0]) * t, star[i][1] + (star[i + 1][1] - star[i][1]) * t]);
    }
  }
  fine.push(star[star.length - 1]);
  s.push(fine);
  s.push(circle(R * 0.3));
  // creciente lunar
  const cres: Stroke = [];
  for (let i = 0; i <= 40; i++) {
    const a = -Math.PI / 2 + (i / 40) * Math.PI;
    cres.push([cx + R * 0.14 + Math.cos(a) * R * 0.16 * -1, cy + Math.sin(a) * R * 0.16]);
  }
  s.push(cres);
  return s;
};

export type WritingPage = {texture: THREE.CanvasTexture; update: (p: number) => [number, number]};

/** Devuelve la textura y una función que dibuja el progreso p∈[0,1] y devuelve la punta (uv). */
export const writingPage = (): WritingPage =>
  memo('writing', () => {
    const w = 1024, h = 1400;
    const base = parchmentBase(w, h, 77, 'left');
    const {c, ctx} = canvas(w, h);
    const cx = w / 2 + 20, cy = 700, R = 300;
    const strokes = sigilStrokes(cx, cy, R);
    const total = strokes.reduce((n, s) => n + s.length - 1, 0);
    const texture = toTexture(c) as THREE.CanvasTexture;
    let last = -1;
    let tip: [number, number] = [cx / w, cy / h];
    const update = (p: number): [number, number] => {
      const q = Math.round(p * 600) / 600;
      if (q === last) return tip;
      last = q;
      ctx.globalCompositeOperation = 'source-over';
      ctx.drawImage(base, 0, 0);
      ctx.strokeStyle = INK + '0.85)';
      ctx.fillStyle = INK + '0.85)';
      fauxScript(ctx, 150, 170, w - 270, 3, 46, 901);
      fauxScript(ctx, 150, 1150, w - 270, 4, 46, 902);
      let budget = q * total;
      ctx.lineWidth = 4.2;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.strokeStyle = 'rgba(30,18,10,0.92)';
      for (const s of strokes) {
        if (budget <= 0) break;
        const n = Math.min(s.length - 1, budget);
        ctx.beginPath();
        ctx.moveTo(s[0][0], s[0][1]);
        const whole = Math.floor(n);
        for (let i = 1; i <= whole; i++) ctx.lineTo(s[i][0], s[i][1]);
        let end = s[whole];
        if (whole < s.length - 1 && n > whole) {
          const f = n - whole;
          end = [s[whole][0] + (s[whole + 1][0] - s[whole][0]) * f, s[whole][1] + (s[whole + 1][1] - s[whole][1]) * f];
          ctx.lineTo(end[0], end[1]);
        }
        ctx.stroke();
        tip = [end[0] / w, end[1] / h];
        budget -= s.length - 1;
      }
      // tinta fresca brillante en la punta
      texture.needsUpdate = true;
      return tip;
    };
    update(0);
    return {texture, update};
  });

/* ------------------------------------------------------------------ */
/* Madera de nogal                                                     */
/* ------------------------------------------------------------------ */
export const woodMaps = () =>
  memo('wood', () => {
    const w = 512, h = 512;
    const {c, ctx} = canvas(w, h);
    const img = ctx.createImageData(w, h);
    const rough = canvas(w, h);
    const rimg = rough.ctx.createImageData(w, h);
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const u = x / w, v = y / h;
        const warp = fbm(u * 3, v * 1.2, 4, 3) * 6;
        const ring = Math.sin((v * 34 + warp) * Math.PI);
        const grain = fbm(u * 60, v * 4, 2, 5);
        const t = 0.5 + 0.5 * ring;
        const k = 0.55 + 0.25 * t + 0.35 * (grain - 0.5);
        const i = (y * w + x) * 4;
        img.data[i] = 62 * k;
        img.data[i + 1] = 38 * k;
        img.data[i + 2] = 22 * k;
        img.data[i + 3] = 255;
        const rr = 150 + 60 * (grain - 0.5) + 30 * t;
        rimg.data[i] = 255;
        rimg.data[i + 1] = rr;
        rimg.data[i + 2] = 0;
        rimg.data[i + 3] = 255;
      }
    }
    ctx.putImageData(img, 0, 0);
    rough.ctx.putImageData(rimg, 0, 0);
    return {map: toTexture(c, true, true), orm: toTexture(rough.c, false, true)};
  });

/* ------------------------------------------------------------------ */
/* Cantos de las hojas                                                 */
/* ------------------------------------------------------------------ */
export const pageEdgeTexture = () =>
  memo('edge', () => {
    const w = 64, h = 256;
    const {c, ctx} = canvas(w, h);
    const r = rng(5);
    ctx.fillStyle = '#d8c59c';
    ctx.fillRect(0, 0, w, h);
    for (let y = 0; y < h; y += 1) {
      const k = r();
      ctx.fillStyle = `rgba(${k < 0.5 ? '120,90,55' : '250,240,215'},${0.15 + r() * 0.35})`;
      ctx.fillRect(0, y, w, 1);
    }
    const t = toTexture(c);
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    return t;
  });

/* ------------------------------------------------------------------ */
/* Pluma (alfa)                                                        */
/* ------------------------------------------------------------------ */
export const featherTexture = () =>
  memo('feather', () => {
    const w = 256, h = 1024;
    const {c, ctx} = canvas(w, h);
    ctx.clearRect(0, 0, w, h);
    const r = rng(21);
    const cx = w / 2;
    for (let y = 40; y < h - 120; y += 2.2) {
      const t = (y - 40) / (h - 160);
      const width = Math.sin(Math.min(1, t * 1.15) * Math.PI) ** 0.6 * (w * 0.46) * (t > 0.9 ? 0.7 : 1);
      if (r() < 0.04) continue; // huecos naturales entre barbas
      for (const side of [-1, 1]) {
        const len = width * (side < 0 ? 0.75 : 1) * (0.85 + r() * 0.15);
        const tone = 225 - t * 90 + r() * 20;
        ctx.strokeStyle = `rgba(${tone},${tone * 0.9},${tone * 0.75},${0.55 + r() * 0.35})`;
        ctx.lineWidth = 1.3;
        ctx.beginPath();
        ctx.moveTo(cx, y);
        ctx.quadraticCurveTo(cx + side * len * 0.5, y - len * 0.15, cx + side * len, y - len * 0.42);
        ctx.stroke();
      }
    }
    ctx.strokeStyle = 'rgba(240,228,200,1)';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(cx, 20);
    ctx.lineTo(cx, h);
    ctx.stroke();
    const t = toTexture(c);
    return t;
  });

/* ------------------------------------------------------------------ */
/* Cera de vela                                                        */
/* ------------------------------------------------------------------ */
export const waxTexture = () =>
  memo('wax', () => {
    const n = noiseCanvas(64, 128, 6, 4, 31, 0.4);
    const {c, ctx} = canvas(256, 512);
    ctx.fillStyle = '#efe3c8';
    ctx.fillRect(0, 0, 256, 512);
    ctx.globalCompositeOperation = 'multiply';
    ctx.globalAlpha = 0.25;
    ctx.drawImage(n, 0, 0, 256, 512);
    const t = toTexture(c);
    t.wrapS = THREE.RepeatWrapping;
    return t;
  });
