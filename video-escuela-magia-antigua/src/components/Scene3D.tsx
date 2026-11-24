import * as THREE from 'three';
import {ThreeCanvas} from '@remotion/three';
import {AbsoluteFill} from 'remotion';
import {CameraRig, CamKey, CANDLES, World, cameraAt, igniteAt} from '../three/World';
import {CandleBloom} from './Atmosphere';

/** Lienzo 3D con el mundo completo visto desde una secuencia de cámara. */
export const Scene3D: React.FC<{t: number; keys: CamKey[]; lightBoost?: number; bloom?: number; style?: React.CSSProperties}> = ({
  t,
  keys,
  lightBoost = 1,
  bloom = 1,
  style,
}) => (
  <AbsoluteFill style={style}>
    <ThreeCanvas
      width={1080}
      height={1920}
      shadows
      gl={{antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.15}}
      camera={{fov: 45, near: 0.05, far: 60, position: [0, 3, 6]}}
    >
      <CameraRig keys={keys} t={t} />
      <World t={t} lightBoost={lightBoost} />
    </ThreeCanvas>
    {/* halo de las llamas (bloom) proyectado sobre la imagen */}
    {CANDLES.map((c, i) => {
      const lit = igniteAt(t, c.ignite);
      if (lit <= 0.01) return null;
      const flame = new THREE.Vector3(c.pos[0], c.pos[1] + 0.2 + c.h + 0.14, c.pos[2]);
      const cam = cameraAt(keys, t);
      const dist = flame.distanceTo(new THREE.Vector3(...cam.pos));
      const [x, y, inFront] = projectToScreen(keys, t, flame, true);
      if (!inFront || x < -300 || x > 1380 || y < -300 || y > 2220) return null;
      return <CandleBloom key={i} x={x} y={y} r={Math.min(520, 900 / dist)} intensity={lit * 0.75 * bloom} t={t + i} />;
    })}
  </AbsoluteFill>
);

/** Proyecta un punto del mundo a píxeles de pantalla (1080×1920) para una cámara dada. */
export function projectToScreen(keys: CamKey[], t: number, p: THREE.Vector3): [number, number];
export function projectToScreen(keys: CamKey[], t: number, p: THREE.Vector3, withDepth: true): [number, number, boolean];
export function projectToScreen(keys: CamKey[], t: number, p: THREE.Vector3, withDepth = false) {
  const c = cameraAt(keys, t);
  const cam = new THREE.PerspectiveCamera(c.fov ?? 45, 1080 / 1920, 0.05, 60);
  cam.position.set(...c.pos);
  cam.lookAt(...c.look);
  cam.updateMatrixWorld();
  const inFront = p.clone().applyMatrix4(cam.matrixWorldInverse).z < 0;
  const v = p.clone().project(cam);
  const xy: [number, number] = [(v.x * 0.5 + 0.5) * 1080, (-v.y * 0.5 + 0.5) * 1920];
  return withDepth ? [...xy, inFront] : xy;
}
