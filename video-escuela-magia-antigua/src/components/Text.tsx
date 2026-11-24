import React from 'react';
import {colors, fonts} from '../config/brand';
import {clamp, easeOutCubic, smoothstep} from '../lib/anim';

type Props = {
  text: string;
  t: number; // tiempo global (s)
  start: number; // aparición
  end: number; // desaparición
  y: number; // centro vertical (px)
  size?: number;
  italic?: boolean;
  family?: 'serif' | 'display';
  weight?: number;
  color?: string;
  gold?: boolean;
  letterSpacing?: string;
  maxWidth?: number;
  stagger?: number;
  lineHeight?: number;
  uppercase?: boolean;
  /** palabras (en minúsculas, sin signos) que se resaltan en dorado */
  highlight?: string[];
};

const goldStyle: React.CSSProperties = {
  backgroundImage: `linear-gradient(180deg, #fbefcc 0%, ${colors.goldLight} 30%, ${colors.gold} 75%, #a88446 100%)`,
  WebkitBackgroundClip: 'text',
  backgroundClip: 'text',
  color: 'transparent',
};

/**
 * Línea de texto con revelado palabra a palabra (desenfoque → nitidez y ascenso
 * suave) y salida con disolución. Pensado para leerse en móvil.
 */
export const RevealText: React.FC<Props> = ({
  text,
  t,
  start,
  end,
  y,
  size = 76,
  italic = true,
  family = 'serif',
  weight = 500,
  color = colors.ivory,
  gold = false,
  letterSpacing = '0.01em',
  maxWidth = 900,
  stagger = 0.09,
  lineHeight = 1.18,
  uppercase = false,
  highlight = [],
}) => {
  if (t < start - 0.1 || t > end + 0.1) return null;
  const words = text.split(' ');
  const out = 1 - smoothstep(end - 0.55, end, t);
  return (
    <div
      style={{
        position: 'absolute',
        left: (1080 - maxWidth) / 2,
        width: maxWidth,
        top: y,
        transform: 'translateY(-50%)',
        textAlign: 'center',
        fontFamily: family === 'serif' ? fonts.serif : fonts.display,
        fontStyle: italic ? 'italic' : 'normal',
        fontWeight: weight,
        fontSize: size,
        lineHeight,
        letterSpacing,
        textTransform: uppercase ? 'uppercase' : 'none',
        color,
        opacity: out,
        filter: `blur(${(1 - out) * 6}px)`,
        textShadow: gold ? undefined : '0 2px 6px rgba(0,0,0,0.85), 0 0 34px rgba(0,0,0,0.9)',
      }}
    >
      {words.map((w, i) => {
        const k = clamp((t - start - i * stagger) / 0.75);
        const e = easeOutCubic(k);
        const clean = w.toLowerCase().replace(/[^\p{L}]/gu, '');
        const isGold = gold || highlight.includes(clean);
        return (
          <React.Fragment key={i}>
            <span
              style={{
                display: 'inline-block',
                opacity: e,
                transform: `translateY(${(1 - e) * 22}px)`,
                filter: `blur(${(1 - e) * 10}px)`,
                ...(gold ? goldStyle : {}),
                ...(isGold && !gold ? {color: '#f2d595'} : {}),
              }}
            >
              {w}
            </span>
            {i < words.length - 1 ? ' ' : ''}
          </React.Fragment>
        );
      })}
    </div>
  );
};

/** Sombra radial suave detrás del texto para asegurar contraste sin cajas visibles. */
export const TextShade: React.FC<{y: number; h?: number; opacity: number}> = ({y, h = 420, opacity}) => (
  <div
    style={{
      position: 'absolute',
      left: -200,
      width: 1480,
      top: y - h / 2,
      height: h,
      background: 'radial-gradient(ellipse at center, rgba(4,3,2,0.78) 0%, rgba(4,3,2,0.45) 45%, rgba(4,3,2,0) 72%)',
      opacity,
      pointerEvents: 'none',
    }}
  />
);

export const goldText = goldStyle;
