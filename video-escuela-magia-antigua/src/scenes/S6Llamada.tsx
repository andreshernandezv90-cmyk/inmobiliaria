import {Img, staticFile} from 'remotion';
import {colors, fonts, logos} from '../config/brand';
import {content} from '../config/content';
import {shots} from '../config/shots';
import {ev, timeline} from '../config/timeline';
import {RevealText, TextShade, goldText} from '../components/Text';
import {Scene3D} from '../components/Scene3D';
import {Divider, KeyEmblem} from '../components/Ornaments';
import {clamp, easeOutCubic, inOut, smoothstep} from '../lib/anim';

const CTA_Y = 1345;

const Cta: React.FC<{t: number}> = ({t}) => {
  const s = ev.ctaHit;
  const e = easeOutCubic(clamp((t - s + 0.1) / 0.8));
  const pulse = 0.5 + 0.5 * Math.sin((t - s) * 3.2);
  const c = content.s6;
  return (
    <div style={{position: 'absolute', top: CTA_Y, left: 0, width: 1080, transform: 'translateY(-50%)', opacity: e}}>
      <div style={{display: 'flex', justifyContent: 'center', marginBottom: 6}}>
        <Divider width={560} p={(t - s) / 0.9} />
      </div>
      <div
        style={{
          textAlign: 'center',
          fontFamily: fonts.serif,
          fontStyle: 'italic',
          fontWeight: 500,
          fontSize: 60,
          color: colors.ivory,
          textShadow: '0 2px 8px rgba(0,0,0,0.95), 0 0 30px rgba(0,0,0,0.9)',
          lineHeight: 1.1,
        }}
      >
        {c.ctaPrefix}
      </div>
      <div
        style={{
          textAlign: 'center',
          fontFamily: fonts.display,
          fontWeight: 700,
          fontSize: 150,
          letterSpacing: '0.16em',
          paddingLeft: '0.16em',
          lineHeight: 1.05,
          transform: `scale(${1.15 - 0.15 * e})`,
          filter: `drop-shadow(0 4px 10px rgba(0,0,0,0.95)) drop-shadow(0 0 ${24 + pulse * 22}px rgba(232,190,110,${0.35 + pulse * 0.25}))`,
        }}
      >
        <span style={goldText}>{c.ctaWord}</span>
      </div>
      <div style={{display: 'flex', justifyContent: 'center', marginTop: 4}}>
        <Divider width={560} p={(t - s - 0.2) / 0.9} />
      </div>
    </div>
  );
};

const BrandLockup: React.FC<{t: number}> = ({t}) => {
  const s = ev.endCard;
  const p = clamp((t - s) / 2.0);
  const e = (d: number) => easeOutCubic(clamp((t - s - d) / 0.9));
  const b = content.brand;
  return (
    <div style={{position: 'absolute', top: 300, left: 0, width: 1080, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
      <div style={{opacity: e(0), filter: 'drop-shadow(0 0 18px rgba(201,164,92,0.45))', height: 280, display: 'flex', alignItems: 'center'}}>
        {logos.llave ? <Img src={staticFile(logos.llave)} style={{height: 250}} /> : <KeyEmblem size={170} p={p} />}
      </div>
      <div
        style={{
          marginTop: 26,
          fontFamily: fonts.display,
          fontWeight: 600,
          fontSize: 68,
          letterSpacing: '0.12em',
          paddingLeft: '0.12em',
          opacity: e(0.35),
          transform: `translateY(${(1 - e(0.35)) * 16}px)`,
          filter: 'drop-shadow(0 3px 8px rgba(0,0,0,0.9))',
          textAlign: 'center',
          lineHeight: 1.12,
        }}
      >
        <span style={goldText}>{b.name.toUpperCase()}</span>
      </div>
      <div style={{marginTop: 18, opacity: e(0.6)}}>
        <Divider width={420} p={(t - s - 0.6) / 0.9} />
      </div>
      <div
        style={{
          marginTop: 14,
          fontFamily: fonts.serif,
          fontStyle: 'italic',
          fontWeight: 500,
          fontSize: 54,
          color: colors.ivory,
          opacity: e(0.75),
          textShadow: '0 2px 8px rgba(0,0,0,0.9)',
        }}
      >
        {b.school}
      </div>
      <div
        style={{
          marginTop: 26,
          display: 'flex',
          alignItems: 'center',
          gap: 18,
          fontFamily: fonts.serif,
          fontWeight: 500,
          fontSize: 40,
          letterSpacing: '0.04em',
          color: colors.goldLight,
          opacity: e(1.0) * 0.95,
          textShadow: '0 2px 8px rgba(0,0,0,0.9)',
        }}
      >
        {logos.grimorio && <Img src={staticFile(logos.grimorio)} style={{height: 64}} />}
        <span>{b.parent}</span>
      </div>
    </div>
  );
};

/** Escena 6 — Llamada a la acción e identidad final. */
export const S6Llamada: React.FC<{t: number}> = ({t}) => {
  const end = ev.endCard;
  const dark = smoothstep(end - 0.2, end + 0.9, t);
  const c = content.s6;
  const finalFade = smoothstep(timeline.duration - 0.35, timeline.duration, t);
  return (
    <>
      <Scene3D t={t} keys={shots.s6} />
      <div style={{position: 'absolute', inset: 0, background: 'rgba(4,3,2,1)', opacity: dark * 0.8}} />
      <TextShade y={395} h={480} opacity={inOut(t, 34.2, end + 0.1, 0.6, 0.6)} />
      <RevealText text={c.main} t={t} start={34.4} end={end} y={395} size={86} maxWidth={860} stagger={0.1} highlight={['capítulo']} />
      <TextShade y={1240} h={680} opacity={smoothstep(36.4, 37.2, t)} />
      <RevealText text={c.secondary} t={t} start={36.6} end={end} y={1130} size={54} maxWidth={860} stagger={0.06} />
      <Cta t={t} />
      {t >= end - 0.1 && <BrandLockup t={t} />}
      <div style={{position: 'absolute', inset: 0, background: '#000', opacity: finalFade}} />
    </>
  );
};
