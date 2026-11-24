import {colors, fonts} from '../config/brand';
import {content} from '../config/content';
import {shots} from '../config/shots';
import {ev, sceneRange} from '../config/timeline';
import {Scene3D} from '../components/Scene3D';
import {Moon, Divider} from '../components/Ornaments';
import {goldText} from '../components/Text';
import {clamp, easeOutBack, easeOutCubic, smoothstep} from '../lib/anim';

const Big: React.FC<{text: string; t: number; start: number; y: number; size: number}> = ({text, t, start, y, size}) => {
  const k = clamp((t - start) / 0.9);
  const e = easeOutCubic(k);
  return (
    <div
      style={{
        position: 'absolute',
        top: y,
        left: 0,
        width: 1080,
        textAlign: 'center',
        transform: `translateY(-50%) scale(${1.18 - 0.18 * easeOutBack(k, 1.1)})`,
        fontFamily: fonts.display,
        fontWeight: 700,
        fontSize: size,
        lineHeight: 1,
        opacity: e,
        filter: `blur(${(1 - e) * 14}px) drop-shadow(0 4px 10px rgba(0,0,0,0.9)) drop-shadow(0 0 30px rgba(201,164,92,0.45))`,
      }}
    >
      <span style={goldText}>{text}</span>
    </div>
  );
};

const Label: React.FC<{text: string; t: number; start: number; y: number}> = ({text, t, start, y}) => {
  const e = easeOutCubic(clamp((t - start) / 0.8));
  return (
    <div
      style={{
        position: 'absolute',
        top: y,
        left: 0,
        width: 1080,
        textAlign: 'center',
        transform: `translateY(-50%) translateY(${(1 - e) * 16}px)`,
        fontFamily: fonts.display,
        fontWeight: 600,
        fontSize: 64,
        letterSpacing: `${0.2 + (1 - e) * 0.15}em`,
        paddingLeft: '0.2em',
        color: colors.ivory,
        opacity: e,
        textShadow: '0 2px 8px rgba(0,0,0,0.95), 0 0 26px rgba(0,0,0,0.8)',
      }}
    >
      {text.toUpperCase()}
    </div>
  );
};

const ROMAN = ['I', 'II', 'III'];

/** Escena 5 — 3 módulos · 12 semanas, con páginas que pasan como capítulos. */
export const S5Programa: React.FC<{t: number}> = ({t}) => {
  const [, b] = sceneRange('s5');
  const out = 1 - smoothstep(b - 0.45, b + 0.25, t);
  const m = content.s5;
  const flips = ev.moduleFlips;
  const w0 = ev.weeksHit;
  const ringR = 205;
  const ringY = 1150;
  return (
    <>
      <Scene3D t={t} keys={shots.s5} bloom={0.8} />
      <div style={{position: 'absolute', inset: 0, background: 'rgba(5,3,2,0.5)'}} />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse 80% 55% at 50% 45%, rgba(4,3,2,0.75) 0%, rgba(4,3,2,0.25) 70%, rgba(0,0,0,0) 100%)',
        }}
      />
      <div style={{opacity: out}}>
        {/* Módulos */}
        <Big text={m.modules.number} t={t} start={flips[0] - 0.15} y={470} size={230} />
        <Label text={m.modules.label} t={t} start={flips[0] + 0.15} y={640} />
        <div style={{position: 'absolute', top: 700, left: 0, width: 1080, display: 'flex', justifyContent: 'center', gap: 46}}>
          {ROMAN.map((r, i) => {
            const k = easeOutCubic(clamp((t - flips[i] - 0.2) / 0.6));
            return (
              <div
                key={r}
                style={{
                  width: 92,
                  height: 92,
                  border: `2px solid ${colors.gold}`,
                  transform: `rotate(45deg) scale(${0.6 + 0.4 * k})`,
                  opacity: k,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: `0 0 ${18 * k}px rgba(201,164,92,0.45), inset 0 0 14px rgba(201,164,92,0.2)`,
                  background: 'rgba(10,7,4,0.55)',
                }}
              >
                <span
                  style={{
                    transform: 'rotate(-45deg)',
                    fontFamily: fonts.display,
                    fontWeight: 700,
                    fontSize: 38,
                    color: colors.goldLight,
                  }}
                >
                  {r}
                </span>
              </div>
            );
          })}
        </div>
        <div style={{position: 'absolute', left: 540 - 220, top: 880}}>
          <Divider width={440} p={(t - flips[2]) / 0.9} />
        </div>
        {/* Semanas: doce lunas en círculo */}
        <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}} viewBox="0 0 1080 1920">
          <circle
            cx={540}
            cy={ringY}
            r={ringR}
            fill="none"
            stroke={colors.gold}
            strokeWidth={1.4}
            opacity={0.55 * smoothstep(w0 - 0.2, w0 + 0.6, t)}
            pathLength={1}
            strokeDasharray={1}
            strokeDashoffset={1 - clamp((t - w0 + 0.2) / 1.4)}
            transform={`rotate(-90 540 ${ringY})`}
          />
          {Array.from({length: 12}, (_, i) => {
            const a = (i / 12) * Math.PI * 2 - Math.PI / 2;
            const k = easeOutCubic(clamp((t - w0 - i * 0.085) / 0.5));
            return (
              <Moon
                key={i}
                cx={540 + Math.cos(a) * ringR}
                cy={ringY + Math.sin(a) * ringR}
                r={21 * (0.6 + 0.4 * k)}
                phase={((i + 0.5) / 12) % 1}
                opacity={k}
                color={colors.goldLight}
              />
            );
          })}
        </svg>
        <Big text={m.weeks.number} t={t} start={w0 - 0.1} y={ringY - 10} size={200} />
        <Label text={m.weeks.label} t={t} start={w0 + 0.3} y={ringY + ringR + 95} />
      </div>
    </>
  );
};
