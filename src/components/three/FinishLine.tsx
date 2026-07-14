"use client";

import { useMemo } from "react";
import * as THREE from "three";
import { ROAD_WIDTH } from "@/lib/track";

const FINISH_T = 0.965;

const CHECKER_VERT = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

function checkerFrag(cols: number, rows: number) {
  return `
    varying vec2 vUv;
    void main() {
      float c = mod(floor(vUv.x * ${cols.toFixed(1)}) + floor(vUv.y * ${rows.toFixed(1)}), 2.0);
      vec3 col = mix(vec3(0.03), vec3(0.95), c);
      gl_FragColor = vec4(col, 1.0);
    }
  `;
}

export function FinishLine({ curve }: { curve: THREE.CatmullRomCurve3 }) {
  const { position, quaternion } = useMemo(() => {
    const point = curve.getPointAt(FINISH_T);
    const tangent = curve.getTangentAt(FINISH_T);
    const up = new THREE.Vector3(0, 1, 0);
    const m = new THREE.Matrix4().lookAt(point, point.clone().add(tangent), up);
    const quat = new THREE.Quaternion().setFromRotationMatrix(m);
    return {
      position: [point.x, point.y, point.z] as [number, number, number],
      quaternion: [quat.x, quat.y, quat.z, quat.w] as [number, number, number, number],
    };
  }, [curve]);

  const half = ROAD_WIDTH / 2 + 0.5;
  const height = 4.6;

  return (
    <group position={position} quaternion={quaternion}>
      {/* Franja a cuadros sobre el asfalto. */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <planeGeometry args={[ROAD_WIDTH, 1.4]} />
        <shaderMaterial
          vertexShader={CHECKER_VERT}
          fragmentShader={checkerFrag(12, 2)}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Gantry de meta con cartel a cuadros. */}
      {[-half, half].map((x) => (
        <mesh key={x} position={[x, height / 2, 0]}>
          <boxGeometry args={[0.22, height, 0.22]} />
          <meshStandardMaterial color="#0f0f14" metalness={0.85} roughness={0.25} />
        </mesh>
      ))}
      <mesh position={[0, height + 0.2, 0]}>
        <planeGeometry args={[half * 2, 0.9]} />
        <shaderMaterial
          vertexShader={CHECKER_VERT}
          fragmentShader={checkerFrag(16, 2)}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}
