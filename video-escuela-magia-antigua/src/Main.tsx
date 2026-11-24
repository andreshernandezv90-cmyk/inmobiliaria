import * as THREE from 'three';
import {AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {colors} from './config/brand';
import {shots} from './config/shots';
import {FPS, SceneId, ev, sceneRange, sec, timeline} from './config/timeline';
import {Burst, GoldDust, Grain, Smoke, Vignette} from './components/Atmosphere';
import {projectToScreen} from './components/Scene3D';
import {smoothstep} from './lib/anim';
import {KEYHOLE} from './three/Grimoire';
import {S1Despertar} from './scenes/S1Despertar';
import {S2Llave} from './scenes/S2Llave';
import {S3Conocimiento} from './scenes/S3Conocimiento';
import {S4Escuela} from './scenes/S4Escuela';
import {S5Programa} from './scenes/S5Programa';
import {S6Llamada} from './scenes/S6Llamada';

const SCENES: {id: SceneId; C: React.FC<{t: number}>}[] = [
  {id: 's1', C: S1Despertar},
  {id: 's2', C: S2Llave},
  {id: 's3', C: S3Conocimiento},
  {id: 's4', C: S4Escuela},
  {id: 's5', C: S5Programa},
  {id: 's6', C: S6Llamada},
];

const XF = timeline.crossfade;

/** Envoltorio de escena: tiempo global + fundido de entrada orgánico. */
const SceneSlot: React.FC<{id: SceneId; C: React.FC<{t: number}>; first: boolean}> = ({id, C, first}) => {
  const frame = useCurrentFrame();
  const [a] = sceneRange(id);
  const t = a + frame / FPS;
  const fade = first ? 1 : smoothstep(a, a + XF, t);
  return (
    <AbsoluteFill style={{opacity: fade}}>
      <C t={t} />
    </AbsoluteFill>
  );
};

// Destellos dorados sincronizados con los momentos clave
const bursts: Burst[] = (() => {
  const key = projectToScreen(shots.s2, ev.keyTurnEnd, new THREE.Vector3(...KEYHOLE));
  const page = projectToScreen(shots.s2, ev.coverOpenEnd, new THREE.Vector3(-1.1, 0.3, 0));
  return [
    {t: ev.keyTurnEnd, x: key[0], y: key[1], n: 50, spread: 0.8},
    {t: ev.coverOpenEnd - 0.6, x: page[0], y: page[1], n: 70, spread: 1.6},
    {t: ev.titleHit + 0.1, x: 540, y: 770, n: 70, spread: 2.2},
    ...ev.moduleFlips.map((f, i) => ({t: f + 0.2, x: 540 + (i - 1) * 138, y: 746, n: 26, spread: 0.6})),
    {t: ev.weeksHit, x: 540, y: 1140, n: 60, spread: 1.4},
    {t: ev.ctaHit, x: 540, y: 1360, n: 60, spread: 1.6},
    {t: ev.endCard + 0.3, x: 540, y: 460, n: 60, spread: 1.4},
  ];
})();

const dustDensity = (t: number) => {
  const pts: [number, number][] = [
    [0, 0],
    [0.8, 0.05],
    [3, 0.45],
    [7, 0.6],
    [9.5, 1],
    [19, 0.7],
    [21, 1],
    [28, 0.8],
    [34, 0.9],
    [44.5, 1],
  ];
  for (let i = 0; i < pts.length - 1; i++) {
    const [t0, v0] = pts[i], [t1, v1] = pts[i + 1];
    if (t <= t1) return v0 + (v1 - v0) * smoothstep(t0, t1, t);
  }
  return 1;
};

export const Main: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  // humo más denso en las transiciones para fundir escenas de forma orgánica
  const sceneStarts = Object.values(timeline.scenes).map(([a]) => a).slice(1);
  const transitionSmoke = sceneStarts.reduce((m, s) => Math.max(m, Math.exp(-Math.pow((t - s - XF / 2) / 0.5, 2))), 0);
  const smoke = 0.55 + 0.6 * transitionSmoke;
  const fadeIn = smoothstep(0, 0.6, t);
  return (
    <AbsoluteFill style={{background: colors.black}}>
      {SCENES.map(({id, C}, i) => {
        const [a, b] = sceneRange(id);
        const isLast = i === SCENES.length - 1;
        return (
          <Sequence key={id} from={sec(a)} durationInFrames={sec(b - a + (isLast ? 0 : XF))} layout="none">
            <SceneSlot id={id} C={C} first={i === 0} />
          </Sequence>
        );
      })}
      <Smoke t={t} amount={smoke} />
      <GoldDust t={t} density={dustDensity(t)} bursts={bursts} />
      <Vignette />
      <Grain frame={frame} opacity={0.08} />
      <AbsoluteFill style={{background: '#000', opacity: 1 - fadeIn}} />
      <Audio src={staticFile('audio/mix.wav')} />
    </AbsoluteFill>
  );
};
