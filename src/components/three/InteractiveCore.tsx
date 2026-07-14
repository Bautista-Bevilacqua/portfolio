"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * Objeto central: gira solo, sigue al puntero con inercia y late levemente.
 * Wireframe emisivo por fuera + núcleo sólido, para que resalte sobre el fondo oscuro.
 */
export function InteractiveCore({ detail = 1 }: { detail?: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const current = useRef({ x: 0, y: 0 });

  useFrame((state, delta) => {
    const group = groupRef.current;
    if (!group) return;

    const targetX = -state.pointer.y * 0.6;
    const targetY = state.pointer.x * 0.8;
    current.current.x += (targetX - current.current.x) * 0.06;
    current.current.y += (targetY - current.current.y) * 0.06;

    group.rotation.x = current.current.x;
    group.rotation.y += delta * 0.25 + (current.current.y - group.rotation.y) * 0.03;

    const pulse = 1 + Math.sin(state.clock.elapsedTime * 1.5) * 0.05;
    group.scale.setScalar(pulse);
  });

  return (
    <group ref={groupRef}>
      <mesh>
        <icosahedronGeometry args={[1.35, detail]} />
        <meshStandardMaterial
          color="#1a1a20"
          emissive="#e10600"
          emissiveIntensity={0.35}
          roughness={0.3}
          metalness={0.7}
          flatShading
        />
      </mesh>
      <mesh scale={1.04}>
        <icosahedronGeometry args={[1.35, detail]} />
        <meshBasicMaterial color="#ff6b35" wireframe toneMapped={false} />
      </mesh>
    </group>
  );
}
