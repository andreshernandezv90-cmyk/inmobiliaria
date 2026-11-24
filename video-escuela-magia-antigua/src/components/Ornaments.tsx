import React from 'react';
import {colors} from '../config/brand';
import {clamp, easeInOutCubic, easeOutCubic} from '../lib/anim';

const G = colors.gold;

/** Fase lunar en SVG. phase 0 = nueva, 0.5 = llena. */
export const Moon: React.FC<{cx: number; cy: number; r: number; phase: number; opacity?: number; color?: string}> = ({
  cx,
  cy,
  r,
  phase,
  opacity = 1,
  color = G,
}) => {
  const k = Math.cos(phase * Math.PI * 2); // 1 nueva, -1 llena
  const waxing = phase < 0.5;
  const rx = Math.abs(k) * r;
  // borde exterior (semicírculo iluminado) + terminador elíptico
  const sweepOuter = waxing ? 1 : 0;
  const sweepInner = waxing ? (k > 0 ? 0 : 1) : k > 0 ? 1 : 0;
  const d = `M ${cx} ${cy - r} A ${r} ${r} 0 0 ${sweepOuter} ${cx} ${cy + r} A ${rx} ${r} 0 0 ${sweepInner} ${cx} ${cy - r} Z`;
  return (
    <g opacity={opacity}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth={Math.max(1.2, r * 0.08)} opacity={0.55} />
      {phase > 0.01 && phase < 0.99 && <path d={d} fill={color} />}
    </g>
  );
};

/** Trazo que se dibuja progresivamente (pathLength normalizado). */
const Draw: React.FC<{p: number; children: React.ReactElement<{pathLength?: number; strokeDasharray?: number; strokeDashoffset?: number}>}> = ({
  p,
  children,
}) => React.cloneElement(children, {pathLength: 1, strokeDasharray: 1, strokeDashoffset: 1 - clamp(p)});

const starPath = (cx: number, cy: number, r: number, n: number, step: number) => {
  const pts: string[] = [];
  for (let i = 0; i <= n; i++) {
    const a = ((i * step) / n) * Math.PI * 2 - Math.PI / 2;
    pts.push(`${(cx + Math.cos(a) * r).toFixed(2)},${(cy + Math.sin(a) * r).toFixed(2)}`);
  }
  return 'M' + pts.join(' L');
};

/**
 * Círculo simbólico (sigilo) que se traza y gira lentamente. Inspirado en
 * diagramas astronómicos y alquímicos: fases lunares, estrella de ocho puntas
 * y marcas de reloj — sin iconografía satánica.
 */
export const SigilCircle: React.FC<{size: number; t: number; start: number; rotation?: number; opacity?: number}> = ({
  size,
  t,
  start,
  rotation = 0,
  opacity = 1,
}) => {
  const c = size / 2;
  const R = size * 0.46;
  const p = (delay: number, dur = 1.6) => easeInOutCubic(clamp((t - start - delay) / dur));
  const ticks = Array.from({length: 96}, (_, i) => i);
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{overflow: 'visible', opacity}}>
      <defs>
        <filter id="sigilGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <g filter="url(#sigilGlow)" fill="none" stroke={G} strokeLinecap="round">
        <g transform={`rotate(${rotation} ${c} ${c})`}>
          <Draw p={p(0, 1.8)}>
            <circle cx={c} cy={c} r={R} strokeWidth={2.4} transform={`rotate(-90 ${c} ${c})`} />
          </Draw>
          <Draw p={p(0.2, 1.8)}>
            <circle cx={c} cy={c} r={R * 0.94} strokeWidth={1} opacity={0.7} transform={`rotate(90 ${c} ${c})`} />
          </Draw>
          {ticks.map((i) => {
            const a = (i / ticks.length) * Math.PI * 2;
            const long = i % 8 === 0;
            const r1 = R * 0.94, r2 = long ? R * 0.86 : R * 0.905;
            const vis = clamp((t - start - 0.4 - i * 0.012) / 0.3);
            return (
              <line
                key={i}
                x1={c + Math.cos(a) * r1}
                y1={c + Math.sin(a) * r1}
                x2={c + Math.cos(a) * r2}
                y2={c + Math.sin(a) * r2}
                strokeWidth={long ? 2 : 1}
                opacity={vis * (long ? 0.9 : 0.55)}
              />
            );
          })}
        </g>
        <g transform={`rotate(${-rotation * 0.6} ${c} ${c})`}>
          <Draw p={p(0.6, 2.2)}>
            <path d={starPath(c, c, R * 0.8, 8, 3)} strokeWidth={1.3} opacity={0.5} />
          </Draw>
          <Draw p={p(0.9, 1.6)}>
            <circle cx={c} cy={c} r={R * 0.56} strokeWidth={1.1} opacity={0.45} />
          </Draw>
        </g>
      </g>
      {/* fases lunares sobre el anillo */}
      <g transform={`rotate(${rotation} ${c} ${c})`}>
        {Array.from({length: 8}, (_, i) => {
          const a = (i / 8) * Math.PI * 2 - Math.PI / 2;
          const vis = easeOutCubic(clamp((t - start - 0.8 - i * 0.1) / 0.6));
          return (
            <Moon
              key={i}
              cx={c + Math.cos(a) * R * 1.09}
              cy={c + Math.sin(a) * R * 1.09}
              r={size * 0.022}
              phase={(i / 8 + 0.5) % 1 || 0.001}
              opacity={vis}
            />
          );
        })}
      </g>
    </svg>
  );
};

/** Emblema provisional: llave vertical con creciente lunar. */
export const KeyEmblem: React.FC<{size: number; p?: number; color?: string}> = ({size, p = 1, color = G}) => {
  const s = size / 200;
  return (
    <svg width={size} height={size * 1.6} viewBox="0 0 200 320" style={{overflow: 'visible'}}>
      <defs>
        <linearGradient id="emGold" gradientUnits="userSpaceOnUse" x1="0" y1="20" x2="0" y2="300">
          <stop offset="0" stopColor={colors.goldLight} />
          <stop offset="0.5" stopColor={color} />
          <stop offset="1" stopColor={colors.goldDeep} />
        </linearGradient>
      </defs>
      <g fill="none" stroke="url(#emGold)" strokeWidth={Math.max(3.5, 4.5 / s)} strokeLinecap="round" strokeLinejoin="round">
        {/* creciente */}
        <Draw p={p * 1.2}>
          <path d="M 126 35 A 52 52 0 1 0 126 125 A 46 46 0 1 1 126 35 Z" />
        </Draw>
        {/* anillo de la llave */}
        <Draw p={p * 1.1 - 0.1}>
          <circle cx={100} cy={80} r={24} />
        </Draw>
        <Draw p={p * 1.1 - 0.15}>
          <circle cx={100} cy={80} r={9} />
        </Draw>
        {/* vástago */}
        <Draw p={p * 1.3 - 0.3}>
          <path d="M 100 104 L 100 300" />
        </Draw>
        <Draw p={p * 1.3 - 0.35}>
          <path d="M 88 118 L 112 118 M 91 128 L 109 128" />
        </Draw>
        {/* paletón */}
        <Draw p={p * 1.4 - 0.45}>
          <path d="M 100 250 L 136 250 L 136 268 L 122 268 L 122 280 L 136 280 L 136 298 L 100 298" />
        </Draw>
      </g>
      <g fill={color} opacity={clamp(p * 2 - 1)}>
        <circle cx={100} cy={80} r={3} />
        <path d="M 160 40 l 3 8 l 8 3 l -8 3 l -3 8 l -3 -8 l -8 -3 l 8 -3 Z" />
        <path d="M 40 150 l 2 5 l 5 2 l -5 2 l -2 5 l -2 -5 l -5 -2 l 5 -2 Z" />
      </g>
    </svg>
  );
};

/** Filete ornamental horizontal con rombo central. */
export const Divider: React.FC<{width: number; p: number; opacity?: number}> = ({width, p, opacity = 1}) => {
  const e = easeInOutCubic(clamp(p));
  const half = (width / 2) * e;
  return (
    <svg width={width} height={24} viewBox={`0 0 ${width} 24`} style={{opacity, overflow: 'visible'}}>
      <line x1={width / 2 - half} y1={12} x2={width / 2 - 16} y2={12} stroke={G} strokeWidth={1.6} opacity={e} />
      <line x1={width / 2 + 16} y1={12} x2={width / 2 + half} y2={12} stroke={G} strokeWidth={1.6} opacity={e} />
      <path d={`M ${width / 2} 3 L ${width / 2 + 9} 12 L ${width / 2} 21 L ${width / 2 - 9} 12 Z`} fill={G} opacity={e} />
      <circle cx={width / 2 - half} cy={12} r={2.5} fill={G} opacity={e} />
      <circle cx={width / 2 + half} cy={12} r={2.5} fill={G} opacity={e} />
    </svg>
  );
};
