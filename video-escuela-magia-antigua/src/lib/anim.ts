export const clamp = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const easeInOutCubic = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
export const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
export const easeInCubic = (t: number) => t * t * t;
export const easeInOutSine = (t: number) => -(Math.cos(Math.PI * t) - 1) / 2;
export const easeOutBack = (t: number, s = 1.4) =>
  1 + (s + 1) * Math.pow(t - 1, 3) + s * Math.pow(t - 1, 2);
export const smoothstep = (a: number, b: number, x: number) => {
  const t = clamp((x - a) / (b - a));
  return t * t * (3 - 2 * t);
};
/** Progreso 0..1 de t entre a y b, con easing opcional. */
export const prog = (t: number, a: number, b: number, ease: (x: number) => number = (x) => x) =>
  ease(clamp((t - a) / (b - a)));
/** Fundido de entrada y salida: 0→1 (entre a y a+fi) y 1→0 (entre b-fo y b). */
export const inOut = (t: number, a: number, b: number, fi = 0.5, fo = 0.5) =>
  Math.min(smoothstep(a, a + fi, t), 1 - smoothstep(b - fo, b, t));
export type V3 = [number, number, number];
export const lerp3 = (a: V3, b: V3, t: number): V3 => [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)];
/** Catmull-Rom sobre una lista de puntos con parámetro u∈[0,1]. */
export const catmull = (pts: V3[], u: number): V3 => {
  if (pts.length === 1) return pts[0];
  const n = pts.length - 1;
  const x = clamp(u) * n;
  const i = Math.min(n - 1, Math.floor(x));
  const t = x - i;
  const p0 = pts[Math.max(0, i - 1)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(n, i + 2)];
  const out: V3 = [0, 0, 0];
  for (let k = 0; k < 3; k++) {
    out[k] = 0.5 * (2 * p1[k] + (-p0[k] + p2[k]) * t + (2 * p0[k] - 5 * p1[k] + 4 * p2[k] - p3[k]) * t * t + (-p0[k] + 3 * p1[k] - 3 * p2[k] + p3[k]) * t * t * t);
  }
  return out;
};
