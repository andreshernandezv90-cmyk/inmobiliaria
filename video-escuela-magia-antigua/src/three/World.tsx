import * as THREE from 'three';
import {useLayoutEffect, useMemo} from 'react';
import {useThree} from '@react-three/fiber';
import {ev} from '../config/timeline';
import {clamp, easeInOutCubic, easeInOutSine, easeOutBack, easeOutCubic, lerp, prog, smoothstep} from '../lib/anim';
import {Candle} from './Candle';
import {BOOK, FlipPage, Grimoire, KEYHOLE, PAGE_D, PAGE_W, PAGE_Y} from './Grimoire';
import {Key, KEY_LEN} from './Key';
import {Herbs, InkBottle, Quill, Scroll} from './Props';
import {pageTexture, woodMaps, writingPage} from './textures';

/* ---------------- Disposición de la mesa ---------------- */
type CandleDef = {pos: [number, number, number]; h: number; r: number; ignite: number; light: number; shadow?: boolean; seed: number};
export const CANDLES: CandleDef[] = [
  {pos: [-0.55, 0, -2.5], h: 1.9, r: 0.2, ignite: ev.candle1Ignite, light: 7, shadow: true, seed: 1},
  {pos: [0.9, 0, -3.35], h: 2.6, r: 0.18, ignite: ev.candlesIgnite[0], light: 3, seed: 2},
  {pos: [-1.8, 0, -3.4], h: 1.3, r: 0.24, ignite: ev.candlesIgnite[1], light: 2.5, seed: 3},
  {pos: [1.95, 0, -1.55], h: 1.5, r: 0.22, ignite: ev.candlesIgnite[2], light: 3, seed: 4},
  {pos: [-3.6, 0, -1.4], h: 1.2, r: 0.2, ignite: ev.candlesIgnite[3], light: 2.5, seed: 5},
  {pos: [3.3, 0, -2.1], h: 2.3, r: 0.2, ignite: ev.candlesIgnite[3] + 0.15, light: 0, seed: 6},
  {pos: [2.45, 0, -2.4], h: 0.9, r: 0.26, ignite: ev.candleCloseIgnite, light: 2.2, seed: 7},
];
export const INK_POS: [number, number, number] = [-2.35, 0, 2.15];

/** Encendido con un pequeño destello inicial. */
export const igniteAt = (t: number, at: number) => {
  if (t < at) return 0;
  const k = (t - at) / 0.9;
  return clamp(easeOutCubic(clamp(k)) + 0.25 * Math.sin(clamp(k) * Math.PI) * (1 - clamp(k)));
};

/* ---------------- Llave: pose en función del tiempo ---------------- */
type Pose = {pos: THREE.Vector3; quat: THREE.Quaternion};
const qFromEuler = (x: number, y: number, z: number, order: THREE.EulerOrder = 'YXZ') =>
  new THREE.Quaternion().setFromEuler(new THREE.Euler(x, y, z, order));

const KEY_REST = {pos: new THREE.Vector3(-0.35, BOOK.T + 0.038, 0.55), quat: qFromEuler(-Math.PI / 2, 0.55, 0)};
const KEY_LIFTED = {pos: new THREE.Vector3(0.2, 1.25, 0.6), quat: qFromEuler(-0.5, 0.9, 0.2)};
const keyInsertX = KEYHOLE[0] + KEY_LEN - 0.24;
const KEY_HOVER = {pos: new THREE.Vector3(keyInsertX + 0.55, KEYHOLE[1], 0), quat: qFromEuler(0, Math.PI, 0)};
const KEY_IN = {pos: new THREE.Vector3(keyInsertX, KEYHOLE[1], 0), quat: qFromEuler(0, Math.PI, 0)};
const KEY_ON_PAGE = {pos: new THREE.Vector3(0.05, PAGE_Y + 0.05, 0.5), quat: qFromEuler(-Math.PI / 2, 0.5, 0)};

const mix = (a: Pose, b: Pose, k: number): Pose => ({
  pos: a.pos.clone().lerp(b.pos, k),
  quat: a.quat.clone().slerp(b.quat, k),
});

export const keyPose = (t: number): Pose & {glow: number} => {
  if (t >= 33.0) return {...KEY_ON_PAGE, glow: 0.25 + 0.1 * Math.sin(t * 2)};
  const lift = prog(t, ev.keyLift, ev.keyLift + 0.75, easeInOutSine);
  const travel = prog(t, ev.keyLift + 0.75, ev.keyInsert - 0.3, easeInOutCubic);
  const insert = prog(t, ev.keyInsert - 0.3, ev.keyInsert, easeInOutSine);
  const turn = prog(t, ev.keyTurnStart, ev.keyTurnEnd, easeInOutCubic);
  let p: Pose = KEY_REST;
  if (lift > 0) p = mix(KEY_REST, KEY_LIFTED, lift);
  if (travel > 0) p = mix(KEY_LIFTED, KEY_HOVER, travel);
  if (insert > 0) p = mix(KEY_HOVER, KEY_IN, insert);
  // levitación suave
  const hover = Math.sin(t * 3.1) * 0.025 * Math.sin(Math.PI * clamp((t - ev.keyLift) / (ev.keyInsert - ev.keyLift)));
  p = {pos: p.pos.clone().add(new THREE.Vector3(0, hover, 0)), quat: p.quat.clone()};
  if (turn > 0) p.quat.multiply(qFromEuler(turn * (Math.PI / 2), 0, 0, 'XYZ'));
  const glow =
    smoothstep(ev.keyLift - 0.3, ev.keyLift + 0.4, t) * (1 - smoothstep(ev.keyTurnEnd, ev.keyTurnEnd + 1.2, t)) +
    0.6 * Math.exp(-Math.pow((t - ev.keyTurnEnd) / 0.25, 2));
  return {...p, glow};
};

/* ---------------- Grimoire: estado en función del tiempo ---------------- */
const FLIP_TIMES = [...ev.pageFlutter, ...ev.moduleFlips];
export const bookState = (t: number) => {
  const open = prog(t, ev.coverOpenStart, ev.coverOpenEnd, easeInOutCubic);
  const strap = prog(t, ev.strapOpen, ev.strapOpen + 0.5, (x) => clamp(easeOutBack(x, 0.8), 0, 1.06));
  const glowIn = smoothstep(ev.coverOpenStart + 0.2, ev.coverOpenEnd, t);
  const glow = glowIn * (0.45 + 0.55 * Math.exp(-Math.max(0, t - ev.coverOpenEnd) / 1.2));
  const wp = writingPage();
  const pages: FlipPage[] = FLIP_TIMES.map((ft, i) => {
    const dur = i < 3 ? 0.62 : 0.85;
    const angle = Math.PI * prog(t, ft, ft + dur, easeInOutCubic);
    const front = i === 3 ? wp.texture : pageTexture('flip', 20 + i);
    const back = i === 5 ? pageTexture('left', 2) : pageTexture('flip', 40 + i);
    return {angle, front, back};
  });
  return {open, strap, glow, pages};
};

/** Punta de la pluma (mundo) sobre la página que se escribe (hoja nº 3). */
const writingTip = (t: number) => {
  const p = prog(t, ev.quillWriteStart, ev.quillWriteEnd, (x) => x);
  const [u, v] = writingPage().update(p);
  const x = -BOOK.W / 2 + 0.02 + u * PAGE_W;
  const z = -PAGE_D / 2 + v * PAGE_D;
  return {pos: new THREE.Vector3(x, PAGE_Y + 0.02, z), p};
};

/* ---------------- Entorno: reflejos cálidos para los metales ---------------- */
const useEnvironment = () => {
  const {gl, scene} = useThree();
  useLayoutEffect(() => {
    const envScene = new THREE.Scene();
    envScene.background = new THREE.Color('#020101');
    const glow = (pos: [number, number, number], r: number, color: string, k: number) => {
      const m = new THREE.Mesh(
        new THREE.SphereGeometry(r, 16, 16),
        new THREE.MeshBasicMaterial({color: new THREE.Color(color).multiplyScalar(k)}),
      );
      m.position.set(...pos);
      envScene.add(m);
    };
    glow([-2, 3, -4], 1.2, '#ffae55', 3);
    glow([3, 2, -3], 0.8, '#ff9440', 2.2);
    glow([0, 6, 2], 2.5, '#5a4030', 0.8);
    glow([-4, 1, 3], 0.9, '#ffcc88', 1.4);
    const pm = new THREE.PMREMGenerator(gl);
    const env = pm.fromScene(envScene, 0.02).texture;
    scene.environment = env;
    scene.environmentIntensity = 0.55;
    scene.background = new THREE.Color('#030201');
    scene.fog = new THREE.FogExp2('#030201', 0.05);
    return () => {
      env.dispose();
      pm.dispose();
    };
  }, [gl, scene]);
};

const Table: React.FC = () => {
  const mat = useMemo(() => {
    const w = woodMaps();
    const map = w.map.clone();
    const orm = w.orm.clone();
    for (const tx of [map, orm]) {
      tx.repeat.set(5, 5);
      tx.needsUpdate = true;
    }
    return new THREE.MeshStandardMaterial({map, roughnessMap: orm, roughness: 1, metalness: 0});
  }, []);
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} material={mat} receiveShadow>
      <planeGeometry args={[30, 30]} />
    </mesh>
  );
};

/* ---------------- Mundo completo ---------------- */
export const World: React.FC<{t: number; lightBoost?: number}> = ({t, lightBoost = 1}) => {
  useEnvironment();
  const key = keyPose(t);
  const book = bookState(t);
  const tip = writingTip(t);

  // Pluma: en el tintero, o escribiendo en la página.
  const writing = t >= ev.quillWriteStart - 0.6 && t < 28;
  const quillPos = writing ? tip.pos : new THREE.Vector3(INK_POS[0] + 0.02, 0.18, INK_POS[2]);
  const wob = writing ? Math.sin(t * 9) * 0.03 : 0;
  const quillRot: [number, number, number] = writing ? [-0.55 + wob, 0.5, -0.4] : [-0.18, 0.4, -0.32];

  const ambient = 0.05 + 0.25 * smoothstep(ev.candle1Ignite, ev.candle1Ignite + 1.5, t);

  return (
    <group>
      <ambientLight color="#4a3424" intensity={ambient * lightBoost} />
      {/* contraluz frío y tenue para separar volúmenes */}
      <directionalLight position={[-3, 5, -6]} color="#7d8bb5" intensity={0.22 * lightBoost} />
      <Table />
      <Grimoire state={book} />
      <group position={key.pos} quaternion={key.quat}>
        <Key glow={key.glow} />
      </group>
      {CANDLES.map((c, i) => (
        <Candle
          key={i}
          position={c.pos}
          height={c.h}
          radius={c.r}
          lit={igniteAt(t, c.ignite)}
          t={t}
          seed={c.seed}
          light={c.light * lightBoost}
          castShadow={c.shadow}
        />
      ))}
      <InkBottle position={INK_POS} />
      <group position={quillPos} rotation={quillRot} scale={0.72}>
        <Quill />
      </group>
      <Herbs position={[2.75, 0, -0.75]} rotationY={-2.6} seed={1} />
      <Herbs position={[-3.7, 0, 1.7]} rotationY={0.3} seed={2} />
      <Scroll position={[-3.45, 0, 3.0]} rotationY={0.35} />
      <Scroll position={[-3.2, 0.21, 3.25]} rotationY={0.1} length={1.1} radius={0.1} />
    </group>
  );
};

/* ---------------- Cámara ---------------- */
export type CamKey = {t: number; pos: [number, number, number]; look: [number, number, number]; fov?: number};

export const cameraAt = (keys: CamKey[], t: number) => {
  if (t <= keys[0].t) return keys[0];
  for (let i = 0; i < keys.length - 1; i++) {
    const a = keys[i], b = keys[i + 1];
    if (t <= b.t) {
      const k = easeInOutSine((t - a.t) / (b.t - a.t));
      return {
        t,
        pos: [lerp(a.pos[0], b.pos[0], k), lerp(a.pos[1], b.pos[1], k), lerp(a.pos[2], b.pos[2], k)] as [number, number, number],
        look: [lerp(a.look[0], b.look[0], k), lerp(a.look[1], b.look[1], k), lerp(a.look[2], b.look[2], k)] as [number, number, number],
        fov: lerp(a.fov ?? 45, b.fov ?? 45, k),
      };
    }
  }
  return keys[keys.length - 1];
};

export const CameraRig: React.FC<{keys: CamKey[]; t: number; shake?: number}> = ({keys, t, shake = 0.004}) => {
  const {camera} = useThree();
  const c = cameraAt(keys, t);
  // micro-movimiento "a mano" muy sutil
  const hx = Math.sin(t * 0.9) * shake + Math.sin(t * 2.3) * shake * 0.4;
  const hy = Math.cos(t * 0.7) * shake;
  camera.position.set(c.pos[0] + hx, c.pos[1] + hy, c.pos[2]);
  camera.lookAt(c.look[0], c.look[1], c.look[2]);
  const cam = camera as THREE.PerspectiveCamera;
  cam.fov = c.fov ?? 45;
  cam.near = 0.05;
  cam.far = 60;
  cam.updateProjectionMatrix();
  return null;
};
