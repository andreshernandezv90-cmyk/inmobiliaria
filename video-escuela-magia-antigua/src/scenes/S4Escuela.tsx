import {colors, fonts} from '../config/brand';
import {content} from '../config/content';
import {shots} from '../config/shots';
import {ev, sceneRange} from '../config/timeline';
import {RevealText, TextShade, goldText} from '../components/Text';
import {Scene3D} from '../components/Scene3D';
import {Divider, SigilCircle} from '../components/Ornaments';
import {clamp, easeOutCubic, inOut, smoothstep} from '../lib/anim';

const CY = 760; // centro vertical del bloque de título

/** Título con revelado letra a letra y barrido de luz dorada. */
const TitleLine: React.FC<{text: string; t: number; start: number; size: number; y: number; spacing: string; weight?: number}> = ({
  text,
  t,
  start,
  size,
  y,
  spacing,
  weight = 600,
}) => {
  const letters = [...text];
  const sweep = clamp((t - start - 0.3) / 1.6);
  return (
    <div
      style={{
        position: 'absolute',
        top: y,
        left: 0,
        width: 1080,
        transform: 'translateY(-50%)',
        textAlign: 'center',
        fontFamily: fonts.display,
        fontWeight: weight,
        fontSize: size,
        letterSpacing: spacing,
        lineHeight: 1,
        whiteSpace: 'nowrap',
        filter: 'drop-shadow(0 3px 6px rgba(0,0,0,0.9)) drop-shadow(0 0 22px rgba(201,164,92,0.35))',
      }}
    >
      {letters.map((ch, i) => {
        const k = easeOutCubic(clamp((t - start - i * 0.055) / 0.9));
        return (
          <span
            key={i}
            style={{
              display: 'inline-block',
              opacity: k,
              transform: `translateY(${(1 - k) * 18}px) scale(${1.25 - 0.25 * k})`,
              filter: `blur(${(1 - k) * 12}px)`,
              ...goldText,
              backgroundImage: `linear-gradient(100deg, ${colors.goldDeep} 0%, ${colors.gold} ${30 + sweep * 40}%, #fff4d6 ${40 + sweep * 40}%, ${colors.gold} ${50 + sweep * 40}%, ${colors.goldDeep} 100%)`,
              backgroundSize: '100% 100%',
            }}
          >
            {ch === ' ' ? ' ' : ch}
          </span>
        );
      })}
    </div>
  );
};

/** Escena 4 — Revelación: ESCUELA DE MAGIA ANTIGUA. */
export const S4Escuela: React.FC<{t: number}> = ({t}) => {
  const [a, b] = sceneRange('s4');
  const hit = ev.titleHit;
  const out = 1 - smoothstep(b - 0.5, b + 0.3, t);
  const rot = (t - a) * 2.2;
  const streak = Math.exp(-Math.pow((t - hit - 0.15) / 0.35, 2));
  const c = content.s4;
  return (
    <>
      <Scene3D t={t} keys={shots.s4} bloom={0.7} />
      {/* oscurecido para dar protagonismo al título */}
      <div style={{position: 'absolute', inset: 0, background: 'rgba(5,3,2,0.58)'}} />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse 70% 38% at 50% 40%, rgba(4,3,2,0.85) 0%, rgba(4,3,2,0.4) 60%, rgba(0,0,0,0) 100%)',
        }}
      />
      <div style={{position: 'absolute', left: 540 - 480, top: CY - 480, opacity: out * 0.9}}>
        <SigilCircle size={960} t={t} start={a + 0.1} rotation={rot} />
      </div>
      {/* destello horizontal en el golpe del título */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          width: 1080,
          top: CY + 10 - 3,
          height: 6,
          background: 'linear-gradient(90deg, rgba(255,220,150,0) 0%, rgba(255,230,170,0.95) 50%, rgba(255,220,150,0) 100%)',
          filter: 'blur(3px)',
          opacity: streak * 0.9,
          transform: `scaleX(${0.3 + streak * 0.9})`,
          mixBlendMode: 'screen',
        }}
      />
      <div style={{opacity: out}}>
        <RevealText
          text={c.eyebrow}
          t={t}
          start={a + 0.2}
          end={b + 1}
          y={CY - 205}
          size={40}
          color={colors.goldLight}
          letterSpacing="0.06em"
          stagger={0.05}
        />
        <TitleLine text={c.titleTop.toUpperCase()} t={t} start={hit - 0.35} size={66} y={CY - 120} spacing="0.22em" weight={500} />
        <TitleLine text={c.titleBottom.split(' ')[0].toUpperCase()} t={t} start={hit - 0.1} size={150} y={CY + 10} spacing="0.1em" weight={700} />
        <TitleLine text={c.titleBottom.split(' ').slice(1).join(' ').toUpperCase()} t={t} start={hit + 0.2} size={112} y={CY + 145} spacing="0.12em" weight={600} />
        <div style={{position: 'absolute', left: 540 - 260, top: CY + 230}}>
          <Divider width={520} p={(t - hit - 0.8) / 1.2} />
        </div>
        <TextShade y={1290} h={520} opacity={inOut(t, 22.0, b + 0.5, 0.8, 0.6)} />
        <RevealText text={c.body} t={t} start={22.2} end={b + 1} y={1290} size={60} maxWidth={900} stagger={0.07} lineHeight={1.25} highlight={['raíces', 'símbolos', 'rituales', 'grimorio']} />
      </div>
    </>
  );
};
