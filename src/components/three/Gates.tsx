"use client";

import { useMemo } from "react";
import * as THREE from "three";
import { ROAD_WIDTH, stationTrackTs } from "@/lib/track";

const GATE_COLORS = ["#e10600", "#ff6b35"];

function gateTransform(curve: THREE.CatmullRomCurve3, t: number) {
  const point = curve.getPointAt(t);
  const tangent = curve.getTangentAt(t);
  const up = new THREE.Vector3(0, 1, 0);
  const m = new THREE.Matrix4().lookAt(
    point,
    point.clone().add(tangent),
    up,
  );
  const quat = new THREE.Quaternion().setFromRotationMatrix(m);
  return { point, quat };
}

export function Gates({
  curve,
  count,
}: {
  curve: THREE.CatmullRomCurve3;
  count: number;
}) {
  const gates = useMemo(() => {
    return stationTrackTs(count).map((t, i) => {
      const { point, quat } = gateTransform(curve, t);
      return {
        position: [point.x, point.y, point.z] as [number, number, number],
        quaternion: [quat.x, quat.y, quat.z, quat.w] as [number, number, number, number],
        color: GATE_COLORS[i % GATE_COLORS.length],
      };
    });
  }, [curve, count]);

  const half = ROAD_WIDTH / 2 + 0.5;
  const height = 4.6;

  return (
    <>
      {gates.map((gate, i) => (
        <group key={i} position={gate.position} quaternion={gate.quaternion}>
          {[-half, half].map((x) => (
            <mesh key={x} position={[x, height / 2, 0]}>
              <boxGeometry args={[0.22, height, 0.22]} />
              <meshStandardMaterial
                color="#0f0f14"
                metalness={0.85}
                roughness={0.25}
              />
            </mesh>
          ))}
          {/* Travesaño superior tipo gantry de largada. */}
          <mesh position={[0, height + 0.15, 0]}>
            <boxGeometry args={[half * 2 + 0.5, 0.7, 0.5]} />
            <meshStandardMaterial
              color="#0f0f14"
              metalness={0.85}
              roughness={0.25}
            />
          </mesh>
          {/* Barra de luz emisiva bajo el travesaño. */}
          <mesh position={[0, height - 0.28, 0.26]}>
            <boxGeometry args={[half * 2, 0.14, 0.06]} />
            <meshBasicMaterial color={gate.color} toneMapped={false} />
          </mesh>
        </group>
      ))}
    </>
  );
}
