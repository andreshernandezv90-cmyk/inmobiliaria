import {useLayoutEffect, useMemo, useRef} from 'react';
import {AbsoluteFill} from 'remotion';
import {fbm, rng} from '../lib/random';

const W = 1080;
const H = 1920;

/* ------------------------------------------------------------------ */
/* Polvo dorado y bokeh                                                */
/* ------------------------------------------------------------------ */
type Mote = {x: number; y: number; vy: number; amp: number; f: number; ph: number; r: number; depth: number; tw: number};

export type Burst = {t: number; x: number; y: number; n?: number; spread?: number};

export const GoldDust: React.FC<{t: number; density: number; bursts?: Burst[]; warmth?: number}> = ({
  t,
  density,
  bursts = [],
}) => {
  const ref = useRef<HTMLCanvasElement>(null);
  const motes = useMemo<Mote[]>(() => {
    const r = rng(2024);
    return Array.from({length: 170}, () => {
      const depth = r();
      return {
        x: r() * W,
        y: r() * H,
        vy: 12 + r() * 38 * (0.4 + depth),
        amp: 8 + r() * 30,
        f: 0.2 + r() * 0.6,
        ph: r() * 10,
        r: depth > 0.92 ? 10 + r() * 26 : 1.2 + depth * 3.2,
        depth,
        tw: 1 + r() * 3,
      };
    });
  }, []);
  useLayoutEffect(() => {
    const c = ref.current!;
    const g = c.getContext('2d')!;
    g.clearRect(0, 0, W, H);
    g.globalCompositeOperation = 'lighter';
    const n = Math.floor(motes.length * Math.min(1, density));
    for (let i = 0; i < n; i++) {
      const m = motes[i];
      let y = (m.y - m.vy * t) % H;
      if (y < 0) y += H;
      const x = m.x + Math.sin(t * m.f + m.ph) * m.amp;
      const twinkle = 0.55 + 0.45 * Math.sin(t * m.tw + m.ph * 3);
      const big = m.r > 8;
      const a = (big ? 0.07 : 0.55) * twinkle * Math.min(1, density * 1.2);
      const grd = g.createRadialGradient(x, y, 0, x, y, m.r * (big ? 1 : 3));
      grd.addColorStop(0, `rgba(255,214,140,${a})`);
      grd.addColorStop(big ? 0.7 : 0.35, `rgba(230,170,80,${a * 0.45})`);
      grd.addColorStop(1, 'rgba(200,140,60,0)');
      g.fillStyle = grd;
      g.beginPath();
      g.arc(x, y, m.r * (big ? 1 : 3), 0, Math.PI * 2);
      g.fill();
    }
    // destellos puntuales (llave, títulos, cifras)
    for (const b of bursts) {
      const dt = t - b.t;
      if (dt < 0 || dt > 2.2) continue;
      const r = rng(Math.round(b.t * 1000));
      const count = b.n ?? 40;
      for (let i = 0; i < count; i++) {
        const ang = r() * Math.PI * 2;
        const sp = (60 + r() * 260) * (b.spread ?? 1);
        const life = 0.9 + r() * 1.2;
        if (dt > life) continue;
        const k = dt / life;
        const ease = 1 - Math.pow(1 - k, 2.2);
        const px = b.x + Math.cos(ang) * sp * ease;
        const py = b.y + Math.sin(ang) * sp * ease - 40 * k * k;
        const a = (1 - k) * (0.5 + 0.5 * Math.sin(dt * 18 + i));
        const rad = 2 + r() * 4;
        const grd = g.createRadialGradient(px, py, 0, px, py, rad * 3);
        grd.addColorStop(0, `rgba(255,236,190,${a})`);
        grd.addColorStop(0.3, `rgba(240,190,100,${a * 0.5})`);
        grd.addColorStop(1, 'rgba(240,190,100,0)');
        g.fillStyle = grd;
        g.beginPath();
        g.arc(px, py, rad * 3, 0, Math.PI * 2);
        g.fill();
      }
    }
  }, [t, density, motes, bursts]);
  return <canvas ref={ref} width={W} height={H} style={{position: 'absolute', inset: 0, width: W, height: H}} />;
};

/* ------------------------------------------------------------------ */
/* Humo sutil                                                          */
/* ------------------------------------------------------------------ */
const smokeSprites = (() => {
  let cache: HTMLCanvasElement[] | null = null;
  return () => {
    if (cache) return cache;
    cache = [0, 1, 2].map((s) => {
      const N = 200;
      const c = document.createElement('canvas');
      c.width = c.height = N;
      const g = c.getContext('2d')!;
      const img = g.createImageData(N, N);
      for (let y = 0; y < N; y++) {
        for (let x = 0; x < N; x++) {
          const dx = x / N - 0.5, dy = y / N - 0.5;
          const d = Math.sqrt(dx * dx + dy * dy) * 2;
          const n = fbm(x / 40 + s * 7, y / 40, 5, 100 + s);
          const wisp = fbm(x / 18 + n * 2, y / 60, 3, 200 + s);
          const a = Math.max(0, n * 1.25 - 0.42) * Math.max(0, 1 - d) * (0.6 + wisp * 0.6);
          const i = (y * N + x) * 4;
          img.data[i] = 235;
          img.data[i + 1] = 215;
          img.data[i + 2] = 190;
          img.data[i + 3] = Math.min(255, a * 255 * 1.6);
        }
      }
      g.putImageData(img, 0, 0);
      return c;
    });
    return cache;
  };
})();

export const Smoke: React.FC<{t: number; amount: number}> = ({t, amount}) => {
  const ref = useRef<HTMLCanvasElement>(null);
  const puffs = useMemo(() => {
    const r = rng(77);
    return Array.from({length: 7}, (_, i) => ({
      x: r() * W,
      y: 300 + r() * (H - 300),
      s: 900 + r() * 900,
      vx: (r() - 0.5) * 22,
      vy: -10 - r() * 18,
      rot: r() * 6,
      vr: (r() - 0.5) * 0.05,
      sprite: i % 3,
      a: 0.5 + r() * 0.5,
    }));
  }, []);
  useLayoutEffect(() => {
    const c = ref.current!;
    const g = c.getContext('2d')!;
    g.clearRect(0, 0, W, H);
    if (amount <= 0.001) return;
    const sprites = smokeSprites();
    g.globalCompositeOperation = 'screen';
    for (const p of puffs) {
      g.save();
      g.globalAlpha = 0.11 * amount * p.a;
      g.translate(p.x + p.vx * t, p.y + p.vy * t);
      g.rotate(p.rot + p.vr * t);
      g.drawImage(sprites[p.sprite], -p.s / 2, -p.s / 2, p.s, p.s);
      g.restore();
    }
  }, [t, amount, puffs]);
  return <canvas ref={ref} width={W} height={H} style={{position: 'absolute', inset: 0, width: W, height: H}} />;
};

/* ------------------------------------------------------------------ */
/* Grano de película + viñeta                                          */
/* ------------------------------------------------------------------ */
const grainTiles = (() => {
  let cache: HTMLCanvasElement[] | null = null;
  return () => {
    if (cache) return cache;
    cache = [0, 1, 2, 3].map((s) => {
      const N = 256;
      const c = document.createElement('canvas');
      c.width = c.height = N;
      const g = c.getContext('2d')!;
      const img = g.createImageData(N, N);
      const r = rng(900 + s);
      for (let i = 0; i < N * N; i++) {
        const v = 128 + (r() - 0.5) * 120;
        img.data[i * 4] = img.data[i * 4 + 1] = img.data[i * 4 + 2] = v;
        img.data[i * 4 + 3] = 255;
      }
      g.putImageData(img, 0, 0);
      return c;
    });
    return cache;
  };
})();

export const Grain: React.FC<{frame: number; opacity?: number}> = ({frame, opacity = 0.07}) => {
  const ref = useRef<HTMLCanvasElement>(null);
  useLayoutEffect(() => {
    const c = ref.current!;
    const g = c.getContext('2d')!;
    const tile = grainTiles()[frame % 4];
    const ox = (frame * 73) % 256, oy = (frame * 151) % 256;
    for (let y = -256; y < H; y += 256) for (let x = -256; x < W; x += 256) g.drawImage(tile, x + ox, y + oy);
  }, [frame]);
  return (
    <canvas
      ref={ref}
      width={W}
      height={H}
      style={{position: 'absolute', inset: 0, width: W, height: H, mixBlendMode: 'overlay', opacity}}
    />
  );
};

export const Vignette: React.FC<{strength?: number}> = ({strength = 1}) => (
  <AbsoluteFill
    style={{
      background:
        'radial-gradient(ellipse 75% 60% at 50% 48%, rgba(0,0,0,0) 40%, rgba(3,2,1,0.55) 78%, rgba(2,1,0,0.92) 100%)',
      opacity: strength,
      pointerEvents: 'none',
    }}
  />
);

/** Luz cálida de vela que "respira" sobre la imagen. */
export const CandleBloom: React.FC<{x: number; y: number; r: number; intensity: number; t: number}> = ({
  x,
  y,
  r,
  intensity,
  t,
}) => {
  const fl = 1 + 0.06 * Math.sin(t * 7.3) + 0.04 * Math.sin(t * 13.1 + 1);
  return (
    <div
      style={{
        position: 'absolute',
        left: x - r,
        top: y - r,
        width: r * 2,
        height: r * 2,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255,170,80,0.55) 0%, rgba(255,140,50,0.18) 35%, rgba(255,120,40,0) 70%)',
        mixBlendMode: 'screen',
        opacity: intensity * fl,
        pointerEvents: 'none',
      }}
    />
  );
};
