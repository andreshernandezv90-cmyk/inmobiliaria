/** PRNG determinista (mulberry32): el render debe ser idéntico en todos los hilos. */
export const rng = (seed: number) => {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

const hash = (x: number, y: number, s: number) => {
  let h = (x * 374761393 + y * 668265263 + s * 2147483647) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
};

const fade = (t: number) => t * t * (3 - 2 * t);

/** Ruido de valor 2D suave en [0,1]. */
export const noise2 = (x: number, y: number, seed = 0) => {
  const xi = Math.floor(x), yi = Math.floor(y);
  const xf = x - xi, yf = y - yi;
  const a = hash(xi, yi, seed), b = hash(xi + 1, yi, seed);
  const c = hash(xi, yi + 1, seed), d = hash(xi + 1, yi + 1, seed);
  const u = fade(xf), v = fade(yf);
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
};

export const fbm = (x: number, y: number, oct = 4, seed = 0) => {
  let s = 0, amp = 0.5, f = 1, n = 0;
  for (let i = 0; i < oct; i++) {
    s += amp * noise2(x * f, y * f, seed + i * 17);
    n += amp; amp *= 0.5; f *= 2;
  }
  return s / n;
};

/** Ruido 1D suave en [-1,1] para parpadeos de llama, etc. */
export const noise1 = (t: number, seed = 0) => noise2(t, seed * 13.37, seed) * 2 - 1;
