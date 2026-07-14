"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * Anillo tipo tacómetro: marcas alrededor de un círculo que giran despacio.
 * Es el guiño "racing" del hero, sutil y de bajo costo de render (solo boxes/torus).
 */
export function RevCounterRing({ tickCount = 24 }: { tickCount?: number }) {
  const groupRef = useRef<THREE.Group>(null);

  const ticks = useMemo(() => {
    return Array.from({ length: tickCount }, (_, i) => {
      const angle = (i / tickCount) * Math.PI * 2;
      const major = i % 6 === 0;
      return {
        angle,
        major,
        position: [Math.cos(angle) * 2.6, Math.sin(angle) * 2.6, 0] as const,
      };
    });
  }, [tickCount]);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.z += delta * 0.12;
  });

  return (
    <group ref={groupRef}>
      <mesh>
        <torusGeometry args={[2.6, 0.012, 8, 96]} />
        <meshBasicMaterial color="#e10600" toneMapped={false} transparent opacity={0.7} />
      </mesh>
      {ticks.map((tick) => (
        <mesh
          key={tick.angle}
          position={tick.position}
          rotation={[0, 0, tick.angle + Math.PI / 2]}
        >
          <boxGeometry args={[tick.major ? 0.05 : 0.025, tick.major ? 0.22 : 0.12, 0.03]} />
          <meshBasicMaterial
            color={tick.major ? "#ff6b35" : "#5a5a63"}
            toneMapped={false}
          />
        </mesh>
      ))}
    </group>
  );
}
