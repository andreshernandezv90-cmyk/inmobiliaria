import * as THREE from 'three';
import {useMemo} from 'react';
import {noise1, rng} from '../lib/random';
import {waxTexture} from './textures';

/* Billboard esférico: el plano siempre mira a cámara, base anclada en el origen. */
const billboardVert = /* glsl */ `
  uniform vec2 uScale;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    vec4 mv = modelViewMatrix * vec4(0.0, 0.0, 0.0, 1.0);
    mv.xy += vec2(position.x, position.y + 0.5) * uScale;
    gl_Position = projectionMatrix * mv;
  }
`;

const flameFrag = /* glsl */ `
  uniform float uTime;
  uniform float uSeed;
  uniform float uIntensity;
  varying vec2 vUv;
  void main() {
    vec2 p = vUv - vec2(0.5, 0.0);
    float y = p.y;
    float sway = sin(uTime * 6.3 + uSeed) * 0.035 * y * y + sin(uTime * 15.0 + uSeed * 2.0) * 0.012 * y;
    p.x -= sway;
    float prof = pow(max(0.0, sin(3.14159 * pow(clamp(y, 0.0, 1.0), 0.72))), 0.85) * (1.0 - 0.45 * y);
    float w = 0.3 * prof + 1e-3;
    float d = abs(p.x) / w;
    float body = smoothstep(1.0, 0.45, d) * smoothstep(0.0, 0.07, y) * smoothstep(1.0, 0.7, y);
    float core = smoothstep(0.75, 0.0, d) * smoothstep(0.62, 0.12, y) * smoothstep(0.03, 0.16, y);
    vec3 col = mix(vec3(1.0, 0.42, 0.08), vec3(1.0, 0.74, 0.34), smoothstep(0.0, 0.8, body));
    col = mix(col, vec3(1.0, 0.96, 0.84), core);
    float blue = smoothstep(0.2, 0.02, y) * smoothstep(1.0, 0.2, d);
    col = mix(col, vec3(0.35, 0.45, 1.0), blue * 0.45);
    float a = clamp(body * 1.15, 0.0, 1.0) * uIntensity;
    gl_FragColor = vec4(col * a * 1.5, a);
  }
`;

const haloFrag = /* glsl */ `
  uniform float uIntensity;
  uniform vec3 uColor;
  varying vec2 vUv;
  void main() {
    vec2 p = vUv - 0.5;
    float r = length(p) * 2.0;
    float a = exp(-r * r * 4.0) * 0.55 + exp(-r * 9.0) * 0.45;
    a *= smoothstep(1.0, 0.6, r) * uIntensity;
    gl_FragColor = vec4(uColor * a, a);
  }
`;

const flameGeo = new THREE.PlaneGeometry(1, 1);
const haloGeo = new THREE.PlaneGeometry(1, 1);

export const Flame: React.FC<{t: number; seed: number; intensity: number; size?: number}> = ({
  t,
  seed,
  intensity,
  size = 1,
}) => {
  const flame = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: billboardVert,
        fragmentShader: flameFrag,
        uniforms: {uTime: {value: 0}, uSeed: {value: seed}, uIntensity: {value: 0}, uScale: {value: new THREE.Vector2()}},
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    [seed],
  );
  const halo = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: billboardVert.replace('position.y + 0.5', 'position.y'),
        fragmentShader: haloFrag,
        uniforms: {uIntensity: {value: 0}, uColor: {value: new THREE.Color('#ff9a40')}, uScale: {value: new THREE.Vector2()}},
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    [],
  );
  const flick = 1 + 0.06 * noise1(t * 9, seed) + 0.04 * noise1(t * 23, seed + 3);
  const s = size * (0.35 + 0.65 * intensity);
  flame.uniforms.uTime.value = t;
  flame.uniforms.uIntensity.value = intensity;
  flame.uniforms.uScale.value.set(0.16 * s * (2 - flick), 0.44 * s * flick);
  halo.uniforms.uIntensity.value = intensity * 0.55 * flick;
  halo.uniforms.uScale.value.set(1.1 * size, 1.1 * size);
  return (
    <group>
      <mesh geometry={haloGeo} material={halo} position={[0, 0.16 * size, 0]} renderOrder={10} frustumCulled={false} />
      <mesh geometry={flameGeo} material={flame} renderOrder={11} frustumCulled={false} />
    </group>
  );
};

export type CandleProps = {
  position: [number, number, number];
  height: number;
  radius: number;
  lit: number; // 0..1 (encendido)
  t: number;
  seed: number;
  light?: number; // intensidad de luz puntual (0 = sin luz)
  castShadow?: boolean;
  holder?: boolean;
};

const holderGeo = (() => {
  const pts = [
    [0, 0],
    [0.42, 0],
    [0.46, 0.03],
    [0.44, 0.06],
    [0.3, 0.07],
    [0.27, 0.12],
    [0.27, 0.2],
    [0.0, 0.2],
  ].map(([x, y]) => new THREE.Vector2(x, y));
  return new THREE.LatheGeometry(pts, 48);
})();

export const Candle: React.FC<CandleProps> = ({position, height, radius, lit, t, seed, light = 0, castShadow = false, holder = true}) => {
  const base = holder ? 0.2 : 0;
  const mats = useMemo(() => {
    const glowCanvas = document.createElement('canvas');
    glowCanvas.width = 4;
    glowCanvas.height = 256;
    const g = glowCanvas.getContext('2d')!;
    const grd = g.createLinearGradient(0, 256, 0, 0);
    grd.addColorStop(0, '#000');
    grd.addColorStop(0.78, '#000');
    grd.addColorStop(0.95, '#a8501a');
    grd.addColorStop(1, '#ff9a48');
    g.fillStyle = grd;
    g.fillRect(0, 0, 4, 256);
    const glowTex = new THREE.CanvasTexture(glowCanvas);
    glowTex.colorSpace = THREE.SRGBColorSpace;
    const wax = new THREE.MeshStandardMaterial({
      map: waxTexture(),
      color: '#f1e6cc',
      roughness: 0.5,
      emissive: new THREE.Color('#ffffff'),
      emissiveMap: glowTex,
      emissiveIntensity: 0,
    });
    const top = new THREE.MeshStandardMaterial({color: '#e9d6ac', roughness: 0.25, emissive: new THREE.Color('#ff9a48'), emissiveIntensity: 0});
    const wick = new THREE.MeshStandardMaterial({color: '#140c06', roughness: 1});
    const brass = new THREE.MeshStandardMaterial({color: '#9c7a42', metalness: 1, roughness: 0.38});
    return {wax, top, wick, brass};
  }, []);
  const drips = useMemo(() => {
    const r = rng(seed * 31 + 7);
    return Array.from({length: 6}, () => ({
      a: r() * Math.PI * 2,
      len: 0.12 + r() * Math.min(0.55, height * 0.3),
      w: 0.028 + r() * 0.02,
    }));
  }, [seed, height]);

  const flick = 1 + 0.08 * noise1(t * 8, seed) + 0.05 * noise1(t * 21, seed + 1);
  mats.wax.emissiveIntensity = lit * 0.85 * flick;
  mats.top.emissiveIntensity = lit * 0.35 * flick;
  const flameY = base + height + 0.05;

  return (
    <group position={position}>
      {holder && <mesh geometry={holderGeo} material={mats.brass} castShadow receiveShadow />}
      <mesh position={[0, base + height / 2, 0]} material={mats.wax} castShadow={castShadow} receiveShadow>
        <cylinderGeometry args={[radius * 0.97, radius, height, 40, 1, true]} />
      </mesh>
      {/* superficie superior ligeramente hundida */}
      <mesh position={[0, base + height - 0.012, 0]} rotation={[-Math.PI / 2, 0, 0]} material={mats.top}>
        <circleGeometry args={[radius * 0.97, 40]} />
      </mesh>
      <mesh position={[0, base + height - 0.004, 0]} rotation={[Math.PI / 2, 0, 0]} material={mats.wax}>
        <torusGeometry args={[radius * 0.93, 0.022, 10, 40]} />
      </mesh>
      {drips.map((d, i) => (
        <mesh
          key={i}
          position={[Math.cos(d.a) * radius * 0.98, base + height - d.len / 2, Math.sin(d.a) * radius * 0.98]}
          material={mats.wax}
        >
          <capsuleGeometry args={[d.w, d.len, 6, 10]} />
        </mesh>
      ))}
      {/* mecha */}
      <mesh position={[0, base + height + 0.03, 0]} rotation={[0, 0, 0.12]} material={mats.wick}>
        <cylinderGeometry args={[0.008, 0.01, 0.09, 8]} />
      </mesh>
      {lit > 0.001 && (
        <>
          <group position={[0, flameY, 0]}>
            <Flame t={t} seed={seed} intensity={lit} size={Math.max(0.8, radius * 4.2)} />
          </group>
          {light > 0 && (
            <pointLight
              position={[0, flameY + 0.2, 0]}
              color="#ff9f4f"
              intensity={light * lit * flick}
              distance={0}
              decay={2}
              castShadow={castShadow}
              shadow-mapSize-width={1024}
              shadow-mapSize-height={1024}
              shadow-bias={-0.002}
              shadow-radius={6}
            />
          )}
        </>
      )}
    </group>
  );
};
