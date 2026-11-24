import {content} from '../config/content';
import {shots} from '../config/shots';
import {RevealText, TextShade} from '../components/Text';
import {Scene3D} from '../components/Scene3D';
import {inOut} from '../lib/anim';

/** Escena 1 — El despertar: una vela se enciende sobre la llave y el grimorio. */
export const S1Despertar: React.FC<{t: number}> = ({t}) => (
  <>
    <Scene3D t={t} keys={shots.s1} />
    <TextShade y={370} h={460} opacity={inOut(t, 1.3, 4.95, 0.7, 0.5)} />
    <RevealText text={content.s1.line} t={t} start={1.6} end={4.85} y={370} size={78} maxWidth={860} />
  </>
);
