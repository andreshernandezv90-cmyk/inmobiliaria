import {content} from '../config/content';
import {shots} from '../config/shots';
import {RevealText, TextShade} from '../components/Text';
import {Scene3D} from '../components/Scene3D';
import {ev} from '../config/timeline';
import {inOut, smoothstep} from '../lib/anim';

/** Escena 2 — La llave gira y el grimorio se abre; el escenario se ilumina. */
export const S2Llave: React.FC<{t: number}> = ({t}) => {
  // destello cálido cuando se abre la tapa
  const flash = smoothstep(ev.coverOpenStart, ev.coverOpenEnd - 0.3, t) * (1 - smoothstep(ev.coverOpenEnd, ev.coverOpenEnd + 1.4, t));
  return (
    <>
      <Scene3D t={t} keys={shots.s2} />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse 60% 40% at 45% 62%, rgba(255,196,110,0.5) 0%, rgba(255,160,70,0.12) 45%, rgba(0,0,0,0) 75%)',
          mixBlendMode: 'screen',
          opacity: flash * 0.8,
        }}
      />
      <TextShade y={360} h={440} opacity={inOut(t, 5.3, 9.75, 0.6, 0.5)} />
      <RevealText
        text={content.s2.line}
        t={t}
        start={5.5}
        end={9.7}
        y={360}
        size={80}
        maxWidth={880}
        stagger={0.12}
        highlight={['llave', 'bruja']}
      />
    </>
  );
};
