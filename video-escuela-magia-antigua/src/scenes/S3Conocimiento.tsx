import * as THREE from 'three';
import {content} from '../config/content';
import {shots} from '../config/shots';
import {ev} from '../config/timeline';
import {RevealText, TextShade} from '../components/Text';
import {Scene3D, projectToScreen} from '../components/Scene3D';
import {inOut, prog, smoothstep} from '../lib/anim';
import {BOOK, PAGE_D, PAGE_W, PAGE_Y} from '../three/Grimoire';
import {writingPage} from '../three/textures';

const CUT_B = 13.1;
const CUT_C = 16.2;
const XF = 0.45; // fundido entre planos

/** Sombra de una mano que escribe, proyectada por la luz de las velas. */
const HandShadow: React.FC<{x: number; y: number; opacity: number; t: number}> = ({x, y, opacity, t}) => (
  <svg
    width={1080}
    height={1920}
    style={{position: 'absolute', inset: 0, mixBlendMode: 'multiply', opacity}}
    viewBox="0 0 1080 1920"
  >
    <defs>
      <filter id="handBlur" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="22" />
      </filter>
    </defs>
    <g filter="url(#handBlur)" fill="rgb(40,22,10)" transform={`translate(${x + 60} ${y + 140}) rotate(${-28 + Math.sin(t * 9) * 2})`}>
      {/* dedos índice y pulgar sujetando la pluma */}
      <rect x={-18} y={-130} width={44} height={170} rx={22} />
      <rect x={30} y={-90} width={42} height={150} rx={21} transform="rotate(14)" />
      <rect x={-70} y={-60} width={40} height={120} rx={20} transform="rotate(-30)" />
      {/* palma y antebrazo */}
      <ellipse cx={40} cy={90} rx={120} ry={95} />
      <rect x={-20} y={120} width={200} height={900} rx={90} transform="rotate(-18)" />
    </g>
  </svg>
);

/** Escena 3 — El conocimiento: velas, hierbas, tinta, pergaminos y escritura. */
export const S3Conocimiento: React.FC<{t: number}> = ({t}) => {
  const showA = t < CUT_B + XF;
  const showB = t >= CUT_B && t < CUT_C + XF;
  const showC = t >= CUT_C;
  const fadeB = smoothstep(CUT_B, CUT_B + XF, t);
  const fadeC = smoothstep(CUT_C, CUT_C + XF, t);

  // punta de la pluma en pantalla para la sombra de la mano
  const p = prog(t, ev.quillWriteStart, ev.quillWriteEnd);
  const [u, v] = writingPage().update(p);
  const tipWorld = new THREE.Vector3(-BOOK.W / 2 + 0.02 + u * PAGE_W, PAGE_Y, -PAGE_D / 2 + v * PAGE_D);
  const [hx, hy] = projectToScreen(shots.s3c, t, tipWorld);
  const [l1, l2, l3] = content.s3.lines;
  return (
    <>
      {showA && <Scene3D t={t} keys={shots.s3a} />}
      {showB && <Scene3D t={t} keys={shots.s3b} style={{opacity: fadeB}} />}
      {showC && <Scene3D t={t} keys={shots.s3c} style={{opacity: fadeC}} />}
      {showC && <HandShadow x={hx} y={hy} t={t} opacity={0.5 * fadeC} />}
      <TextShade y={350} h={420} opacity={inOut(t, 10.2, 19.2, 0.5, 0.4)} />
      <RevealText text={l1} t={t} start={10.35} end={12.95} y={350} size={78} maxWidth={820} highlight={['símbolo']} />
      <RevealText text={l2} t={t} start={13.45} end={16.05} y={350} size={78} maxWidth={820} highlight={['ritual']} />
      <RevealText text={l3} t={t} start={16.55} end={19.15} y={350} size={78} maxWidth={820} highlight={['intención']} />
    </>
  );
};
