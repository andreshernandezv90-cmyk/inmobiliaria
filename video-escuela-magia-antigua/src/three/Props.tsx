import * as THREE from 'three';
import {useMemo} from 'react';
import {rng} from '../lib/random';
import {featherTexture, pageTexture} from './textures';

/* ---------------- Tintero de vidrio oscuro ---------------- */
const inkGeo = (() => {
  const pts = [
    [0, 0],
    [0.3, 0],
    [0.34, 0.03],
    [0.35, 0.3],
    [0.31, 0.4],
    [0.16, 0.47],
    [0.12, 0.5],
    [0.12, 0.58],
    [0.155, 0.6],
    [0.155, 0.64],
    [0.1, 0.65],
    [0.1, 0.55],
  ].map(([x, y]) => new THREE.Vector2(x, y));
  return new THREE.LatheGeometry(pts, 48);
})();

export const InkBottle: React.FC<{position: [number, number, number]}> = ({position}) => {
  const mat = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: '#120d0a',
        roughness: 0.06,
        metalness: 0.1,
        clearcoat: 1,
        clearcoatRoughness: 0.05,
        side: THREE.DoubleSide,
      }),
    [],
  );
  const ink = useMemo(() => new THREE.MeshStandardMaterial({color: '#050403', roughness: 0.05}), []);
  return (
    <group position={position}>
      <mesh geometry={inkGeo} material={mat} castShadow receiveShadow />
      <mesh position={[0, 0.54, 0]} rotation={[-Math.PI / 2, 0, 0]} material={ink}>
        <circleGeometry args={[0.1, 24]} />
      </mesh>
    </group>
  );
};

/* ---------------- Pluma de escribir ----------------
   Eje local: la punta en el origen, la pluma crece hacia +Y. */
export const Quill: React.FC = () => {
  const mats = useMemo(() => {
    const feather = new THREE.MeshStandardMaterial({
      map: featherTexture(),
      transparent: true,
      alphaTest: 0.08,
      side: THREE.DoubleSide,
      roughness: 0.75,
      color: '#fff6e6',
    });
    const shaft = new THREE.MeshStandardMaterial({color: '#e9dcc0', roughness: 0.35});
    const nib = new THREE.MeshStandardMaterial({color: '#1a120c', roughness: 0.2});
    return {feather, shaft, nib};
  }, []);
  const featherGeo = useMemo(() => {
    const g = new THREE.PlaneGeometry(0.32, 1.55, 1, 16);
    // ligera curvatura de la pluma
    const p = g.getAttribute('position') as THREE.BufferAttribute;
    for (let i = 0; i < p.count; i++) {
      const y = p.getY(i);
      p.setZ(i, -Math.pow((y + 0.78) / 1.55, 2) * 0.12 + Math.abs(p.getX(i)) * 0.15);
    }
    g.computeVertexNormals();
    return g;
  }, []);
  return (
    <group>
      <mesh position={[0, 0.06, 0]} material={mats.nib}>
        <coneGeometry args={[0.014, 0.12, 10]} />
      </mesh>
      <mesh position={[0, 0.3, 0]} material={mats.shaft} castShadow>
        <cylinderGeometry args={[0.016, 0.014, 0.38, 10]} />
      </mesh>
      <mesh geometry={featherGeo} position={[0, 0.48 + 0.78, 0]} material={mats.feather} castShadow />
    </group>
  );
};

/* ---------------- Ramillete de hierbas secas atado ---------------- */
export const Herbs: React.FC<{position: [number, number, number]; rotationY?: number; seed?: number}> = ({
  position,
  rotationY = 0,
  seed = 1,
}) => {
  const data = useMemo(() => {
    const r = rng(seed * 101);
    const stems: {dir: THREE.Vector3; len: number; leaves: THREE.Matrix4[]; color: string}[] = [];
    const leafPalette = ['#6d7656', '#7b8061', '#8a845f', '#5f6a4c', '#8f7f5a'];
    for (let s = 0; s < 9; s++) {
      const spread = (r() - 0.5) * 0.5;
      const lift = r() * 0.12;
      const dir = new THREE.Vector3(1, lift, spread).normalize();
      const len = 1.0 + r() * 0.45;
      const leaves: THREE.Matrix4[] = [];
      const n = 14 + Math.floor(r() * 6);
      for (let i = 0; i < n; i++) {
        const t = 0.25 + (i / n) * 0.75;
        const p = dir.clone().multiplyScalar(len * t);
        const side = i % 2 ? 1 : -1;
        const q = new THREE.Quaternion().setFromEuler(
          new THREE.Euler(r() * 0.6 + side * 0.9, side * 0.5 + (r() - 0.5) * 0.6, (r() - 0.5) * 0.8),
        );
        const sz = 0.06 + r() * 0.03 * (1 - t);
        leaves.push(new THREE.Matrix4().compose(p, q, new THREE.Vector3(sz * 1.7, sz * 0.35, sz * 0.7)));
      }
      stems.push({dir, len, leaves, color: leafPalette[s % leafPalette.length]});
    }
    return stems;
  }, [seed]);
  const mats = useMemo(
    () => ({
      stem: new THREE.MeshStandardMaterial({color: '#6b5a3c', roughness: 0.9}),
      twine: new THREE.MeshStandardMaterial({color: '#a88a5c', roughness: 1}),
      leaf: data.map((s) => new THREE.MeshStandardMaterial({color: s.color, roughness: 0.85})),
    }),
    [data],
  );
  const leafGeo = useMemo(() => new THREE.SphereGeometry(1, 10, 8), []);
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      <group position={[0, 0.07, 0]}>
        {data.map((s, i) => {
          const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), s.dir);
          return (
            <group key={i}>
              <mesh
                position={s.dir.clone().multiplyScalar(s.len / 2).toArray()}
                quaternion={q}
                material={mats.stem}
                castShadow
              >
                <cylinderGeometry args={[0.008, 0.013, s.len, 6]} />
              </mesh>
              <instancedMesh
                args={[leafGeo, mats.leaf[i], s.leaves.length]}
                castShadow
                ref={(m) => {
                  if (!m) return;
                  s.leaves.forEach((mat, k) => m.setMatrixAt(k, mat));
                  m.instanceMatrix.needsUpdate = true;
                }}
              />
            </group>
          );
        })}
        {/* atadura de bramante */}
        {[0.12, 0.16, 0.2].map((x) => (
          <mesh key={x} position={[x, 0.01, 0]} rotation={[0, Math.PI / 2, 0]} material={mats.twine}>
            <torusGeometry args={[0.07, 0.012, 8, 24]} />
          </mesh>
        ))}
      </group>
    </group>
  );
};

/* ---------------- Pergaminos enrollados ---------------- */
export const Scroll: React.FC<{position: [number, number, number]; rotationY?: number; length?: number; radius?: number}> = ({
  position,
  rotationY = 0,
  length = 1.3,
  radius = 0.11,
}) => {
  const mats = useMemo(() => {
    const tex = pageTexture('blank', 9).clone();
    tex.needsUpdate = true;
    const paper = new THREE.MeshStandardMaterial({map: tex, roughness: 0.9});
    const endCanvas = document.createElement('canvas');
    endCanvas.width = endCanvas.height = 128;
    const g = endCanvas.getContext('2d')!;
    g.fillStyle = '#cdb48a';
    g.fillRect(0, 0, 128, 128);
    g.strokeStyle = 'rgba(110,80,45,0.8)';
    g.lineWidth = 2;
    g.beginPath();
    for (let a = 0; a < Math.PI * 12; a += 0.1) {
      const r = 4 + a * 1.55;
      g.lineTo(64 + Math.cos(a) * r, 64 + Math.sin(a) * r);
    }
    g.stroke();
    const endTex = new THREE.CanvasTexture(endCanvas);
    endTex.colorSpace = THREE.SRGBColorSpace;
    const end = new THREE.MeshStandardMaterial({map: endTex, roughness: 0.95});
    const ribbon = new THREE.MeshStandardMaterial({color: '#4a2a1a', roughness: 0.6});
    return {paper, end, ribbon};
  }, []);
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      <mesh position={[0, radius, 0]} rotation={[0, 0, Math.PI / 2]} material={[mats.paper, mats.end, mats.end]} castShadow receiveShadow>
        <cylinderGeometry args={[radius, radius, length, 36]} />
      </mesh>
      <mesh position={[0.1, radius, 0]} rotation={[0, Math.PI / 2, 0]} material={mats.ribbon} castShadow>
        <torusGeometry args={[radius + 0.008, 0.018, 8, 36]} />
      </mesh>
    </group>
  );
};
