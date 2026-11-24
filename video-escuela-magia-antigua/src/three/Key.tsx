import * as THREE from 'three';
import {useMemo} from 'react';

/**
 * Llave antigua de latón. Eje local: vástago a lo largo de +X (anillo en x=0,
 * punta en x=KEY_LEN), anillo y paletón en el plano XY, paletón hacia -Y.
 */
export const KEY_LEN = 1.3;

const brass = () =>
  new THREE.MeshStandardMaterial({
    color: '#b48c4c',
    metalness: 1,
    roughness: 0.3,
    emissive: new THREE.Color('#ffcf7a'),
    emissiveIntensity: 0,
  });

export const Key: React.FC<{glow?: number}> = ({glow = 0}) => {
  const mat = useMemo(brass, []);
  mat.emissiveIntensity = glow * 0.16;
  const parts = useMemo(() => {
    const quatrefoil = [0, 1, 2, 3].map((i) => {
      const a = (i / 4) * Math.PI * 2 + Math.PI / 4;
      return [Math.cos(a) * 0.085, Math.sin(a) * 0.085] as const;
    });
    return {quatrefoil};
  }, []);

  return (
    <group>
      {/* anillo exterior */}
      <mesh material={mat} castShadow>
        <torusGeometry args={[0.2, 0.034, 20, 64]} />
      </mesh>
      {/* cuadrifolio interior */}
      {parts.quatrefoil.map(([x, y], i) => (
        <mesh key={i} position={[x, y, 0]} material={mat} castShadow>
          <torusGeometry args={[0.07, 0.016, 12, 36]} />
        </mesh>
      ))}
      <mesh material={mat}>
        <sphereGeometry args={[0.035, 16, 16]} />
      </mesh>
      {/* remate superior */}
      <mesh position={[-0.235, 0, 0]} material={mat} castShadow>
        <sphereGeometry args={[0.04, 16, 16]} />
      </mesh>
      {/* cuello */}
      <mesh position={[0.25, 0, 0]} rotation={[0, 0, Math.PI / 2]} material={mat} castShadow>
        <cylinderGeometry args={[0.05, 0.04, 0.1, 20]} />
      </mesh>
      {[0.32, 0.38].map((x) => (
        <mesh key={x} position={[x, 0, 0]} rotation={[0, Math.PI / 2, 0]} material={mat} castShadow>
          <torusGeometry args={[0.042, 0.014, 10, 28]} />
        </mesh>
      ))}
      {/* vástago */}
      <mesh position={[(0.3 + KEY_LEN) / 2, 0, 0]} rotation={[0, 0, Math.PI / 2]} material={mat} castShadow>
        <cylinderGeometry args={[0.03, 0.032, KEY_LEN - 0.3, 20]} />
      </mesh>
      <mesh position={[KEY_LEN, 0, 0]} material={mat}>
        <sphereGeometry args={[0.032, 16, 16]} />
      </mesh>
      {/* paletón con guardas */}
      <mesh position={[KEY_LEN - 0.12, -0.1, 0]} material={mat} castShadow>
        <boxGeometry args={[0.2, 0.17, 0.035]} />
      </mesh>
      <mesh position={[KEY_LEN - 0.16, -0.2, 0]} material={mat} castShadow>
        <boxGeometry args={[0.06, 0.06, 0.035]} />
      </mesh>
      <mesh position={[KEY_LEN - 0.05, -0.2, 0]} material={mat} castShadow>
        <boxGeometry args={[0.05, 0.06, 0.035]} />
      </mesh>
    </group>
  );
};
