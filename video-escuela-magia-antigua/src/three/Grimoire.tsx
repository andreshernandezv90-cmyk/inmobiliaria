import * as THREE from 'three';
import {useMemo} from 'react';
import {coverMaps, pageEdgeTexture, pageTexture, writingPage} from './textures';

/**
 * Grimoire con lomo a la izquierda (x = -BOOK.W/2) y broche con cerradura en el
 * canto derecho. La mitad superior (tapa + medio bloque de hojas) gira 180° sobre
 * el lomo para abrirlo. Todas las medidas en unidades de escena (~10 cm).
 */
export const BOOK = {
  W: 2.2,
  D: 3.0,
  T: 0.5,
  cover: 0.06,
  overhang: 0.06,
};
const PIVOT_Y = BOOK.T / 2;
const SPINE_X = -BOOK.W / 2;
export const PAGE_Y = PIVOT_Y; // altura de las páginas abiertas
export const PAGE_W = BOOK.W - BOOK.overhang - 0.04;
export const PAGE_D = BOOK.D - BOOK.overhang * 2;
/** Posición del ojo de la cerradura (cara exterior de la placa). */
export const KEYHOLE: [number, number, number] = [BOOK.W / 2 + 0.075, BOOK.T * 0.55, 0];

export type FlipPage = {angle: number; front: THREE.Texture; back: THREE.Texture};

/* ---------------- hoja flexible ---------------- */
const NX = 28;
const NZ = 2;
const makePageGeometry = () => {
  const g = new THREE.BufferGeometry();
  const pos = new Float32Array((NX + 1) * (NZ + 1) * 3);
  const uv = new Float32Array((NX + 1) * (NZ + 1) * 2);
  const idx: number[] = [];
  for (let j = 0; j <= NZ; j++) {
    for (let i = 0; i <= NX; i++) {
      const k = j * (NX + 1) + i;
      uv[k * 2] = i / NX;
      uv[k * 2 + 1] = 1 - j / NZ;
    }
  }
  for (let j = 0; j < NZ; j++) {
    for (let i = 0; i < NX; i++) {
      const a = j * (NX + 1) + i, b = a + 1, c = a + NX + 1, d = c + 1;
      idx.push(a, c, b, b, c, d);
    }
  }
  g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  g.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
  g.setIndex(idx);
  return g;
};

/** Curva la hoja: angle 0 = plana a la derecha, π = plana a la izquierda. */
const bendPage = (g: THREE.BufferGeometry, angle: number, lift: number) => {
  const pos = g.getAttribute('position') as THREE.BufferAttribute;
  const du = PAGE_W / NX;
  const bend = 0.9 * Math.sin(angle);
  for (let j = 0; j <= NZ; j++) {
    let x = 0, y = 0;
    const z = -PAGE_D / 2 + (j / NZ) * PAGE_D;
    for (let i = 0; i <= NX; i++) {
      const k = j * (NX + 1) + i;
      pos.setXYZ(k, x, y + lift, z);
      const u = (i + 0.5) / NX;
      // el borde exterior se retrasa → curvatura natural del papel
      const phi = angle - bend * Math.pow(u, 1.4) * (angle < Math.PI / 2 ? 1 : -0.6);
      x += Math.cos(phi) * du;
      y += Math.sin(phi) * du;
    }
  }
  pos.needsUpdate = true;
  g.computeVertexNormals();
  g.computeBoundingSphere();
};

const Page: React.FC<{page: FlipPage; lift: number}> = ({page, lift}) => {
  const geo = useMemo(makePageGeometry, []);
  bendPage(geo, page.angle, lift);
  const front = useMemo(
    () => new THREE.MeshStandardMaterial({roughness: 0.85, side: THREE.FrontSide}),
    [],
  );
  const back = useMemo(
    () => new THREE.MeshStandardMaterial({roughness: 0.85, side: THREE.BackSide}),
    [],
  );
  front.map = page.front;
  back.map = page.back;
  return (
    <group position={[SPINE_X + 0.02, PAGE_Y, 0]}>
      <mesh geometry={geo} material={front} castShadow receiveShadow />
      <mesh geometry={geo} material={back} receiveShadow />
    </group>
  );
};

/* ---------------- libro ---------------- */
export type GrimoireState = {
  open: number; // 0..1 apertura de la tapa
  strap: number; // 0..1 broche liberado
  glow: number; // brillo de las páginas
  pages: FlipPage[];
};

export const Grimoire: React.FC<{state: GrimoireState}> = ({state}) => {
  const {W, D, T, cover, overhang} = BOOK;
  const mats = useMemo(() => {
    const cm = coverMaps();
    const leather = new THREE.MeshStandardMaterial({
      map: cm.map,
      roughnessMap: cm.orm,
      metalnessMap: cm.orm,
      bumpMap: cm.bump,
      bumpScale: 2.2,
      roughness: 1,
      metalness: 1,
    });
    const leatherPlain = new THREE.MeshStandardMaterial({color: '#21140d', roughness: 0.78});
    const edgeTex = pageEdgeTexture();
    const edge = new THREE.MeshStandardMaterial({map: edgeTex, roughness: 0.9, color: '#efe2c2'});
    const right = new THREE.MeshStandardMaterial({map: pageTexture('right', 1), roughness: 0.9});
    const left = new THREE.MeshStandardMaterial({map: pageTexture('left', 2), roughness: 0.9});
    const endpaper = new THREE.MeshStandardMaterial({color: '#3b2416', roughness: 0.8});
    const brass = new THREE.MeshStandardMaterial({color: '#b08a4a', metalness: 1, roughness: 0.34});
    const cornerBrass = new THREE.MeshStandardMaterial({color: '#7d5f32', metalness: 0.9, roughness: 0.62, bumpMap: cm.bump, bumpScale: 1.5});
    const dark = new THREE.MeshStandardMaterial({color: '#050302', roughness: 1});
    const strap = new THREE.MeshStandardMaterial({color: '#2c1a10', roughness: 0.7});
    return {leather, leatherPlain, edge, right, left, endpaper, brass, cornerBrass, dark, strap};
  }, []);
  // precarga de la página de escritura (comparte textura con FlipPage)
  useMemo(() => writingPage(), []);

  const angle = state.open * Math.PI;
  const blockW = W - overhang - 0.02;
  const blockD = D - overhang * 2;
  const halfH = (T - cover * 2) / 2;
  const blockX = SPINE_X + 0.02 + blockW / 2;

  // Tapas: material por cara [+x,-x,+y,-y,+z,-z]
  const frontCoverMats = [mats.leatherPlain, mats.leatherPlain, mats.leather, mats.endpaper, mats.leatherPlain, mats.leatherPlain];
  const backCoverMats = [mats.leatherPlain, mats.leatherPlain, mats.endpaper, mats.leatherPlain, mats.leatherPlain, mats.leatherPlain];
  const lowerBlockMats = [mats.edge, mats.edge, mats.right, mats.edge, mats.edge, mats.edge];
  const upperBlockMats = [mats.edge, mats.edge, mats.edge, mats.left, mats.edge, mats.edge];

  // lomo: se aplasta al abrir para quedar oculto bajo el canal
  const spineScale = 1 - 0.55 * Math.min(1, state.open * 1.6);
  const strapAngle = -3.35 * state.strap;

  return (
    <group>
      {/* tapa trasera */}
      <mesh position={[0, cover / 2, 0]} material={backCoverMats} castShadow receiveShadow>
        <boxGeometry args={[W, cover, D]} />
      </mesh>
      {/* medio bloque inferior (página derecha) */}
      <mesh position={[blockX, cover + halfH / 2, 0]} material={lowerBlockMats} castShadow receiveShadow>
        <boxGeometry args={[blockW, halfH, blockD]} />
      </mesh>
      {/* lomo */}
      <group position={[SPINE_X, 0, 0]} scale={[1, spineScale, 1]}>
        <mesh position={[0, T / 2, 0]} rotation={[Math.PI / 2, 0, 0]} material={mats.leatherPlain} castShadow>
          <cylinderGeometry args={[T / 2, T / 2, D, 24, 1, false, Math.PI, Math.PI]} />
        </mesh>
        {[-0.9, -0.3, 0.3, 0.9].map((z) => (
          <mesh key={z} position={[0, T / 2, z]} rotation={[Math.PI / 2, 0, 0]} material={mats.leatherPlain}>
            <cylinderGeometry args={[T / 2 + 0.02, T / 2 + 0.02, 0.06, 24, 1, false, Math.PI, Math.PI]} />
          </mesh>
        ))}
      </group>
      {/* mitad superior que gira sobre el lomo */}
      <group position={[SPINE_X, PIVOT_Y, 0]} rotation={[0, 0, angle]}>
        <group position={[-SPINE_X, -PIVOT_Y, 0]}>
          <mesh position={[blockX, cover + halfH * 1.5, 0]} material={upperBlockMats} castShadow receiveShadow>
            <boxGeometry args={[blockW, halfH, blockD]} />
          </mesh>
          <mesh position={[0, T - cover / 2, 0]} material={frontCoverMats} castShadow receiveShadow>
            <boxGeometry args={[W, cover, D]} />
          </mesh>
          {/* cantoneras de latón */}
          {[
            [W / 2 - 0.1, D / 2 - 0.1],
            [W / 2 - 0.1, -D / 2 + 0.1],
          ].map(([x, z], i) => (
            <mesh
              key={i}
              position={[x - 0.02, T + 0.006, z + (z > 0 ? -0.02 : 0.02)]}
              rotation={[0, z > 0 ? Math.PI / 4 : (3 * Math.PI) / 4, 0]}
              material={mats.cornerBrass}
              castShadow
            >
              <cylinderGeometry args={[0.16, 0.16, 0.012, 3]} />
            </mesh>
          ))}
        </group>
      </group>
      {/* hojas sueltas que pasan */}
      {state.pages.map((p, i) => (
        <Page key={i} page={p} lift={0.003 + (p.angle > Math.PI / 2 ? i : state.pages.length - i) * 0.0025} />
      ))}
      {/* broche: correa vertical + placa de cerradura (fijos a la tapa trasera) */}
      <mesh position={[W / 2 + 0.018, T / 2, 0]} material={mats.strap} castShadow>
        <boxGeometry args={[0.03, T + 0.02, 0.38]} />
      </mesh>
      <mesh position={[W / 2 + 0.05, T * 0.55, 0]} material={mats.brass} castShadow>
        <boxGeometry args={[0.04, 0.34, 0.32]} />
      </mesh>
      {/* bisel decorativo de la placa */}
      <mesh position={[W / 2 + 0.072, T * 0.55, 0]} material={mats.brass}>
        <boxGeometry args={[0.008, 0.28, 0.26]} />
      </mesh>
      {/* ojo de la cerradura */}
      <mesh position={[KEYHOLE[0] + 0.001, KEYHOLE[1] + 0.035, 0]} rotation={[0, 0, Math.PI / 2]} material={mats.dark}>
        <cylinderGeometry args={[0.03, 0.03, 0.012, 20]} />
      </mesh>
      <mesh position={[KEYHOLE[0] + 0.001, KEYHOLE[1] - 0.02, 0]} material={mats.dark}>
        <boxGeometry args={[0.012, 0.07, 0.026]} />
      </mesh>
      {/* lengüeta superior que se libera */}
      <group position={[W / 2 + 0.035, T + 0.01, 0]} rotation={[0, 0, strapAngle]}>
        <mesh position={[-0.24, 0.0, 0]} material={mats.strap} castShadow>
          <boxGeometry args={[0.5, 0.025, 0.36]} />
        </mesh>
        <mesh position={[-0.42, 0.018, 0]} material={mats.brass} castShadow>
          <cylinderGeometry args={[0.05, 0.05, 0.02, 20]} />
        </mesh>
      </group>
      {/* resplandor interior al abrir */}
      {state.glow > 0.001 && (
        <pointLight position={[SPINE_X, PAGE_Y + 1.1, 0.2]} color="#ffc777" intensity={state.glow * 6} distance={6} decay={2} />
      )}
    </group>
  );
};
