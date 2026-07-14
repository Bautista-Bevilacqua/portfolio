"use client";

import { useMemo } from "react";
import * as THREE from "three";
import { ROAD_WIDTH, stationCenters } from "@/lib/track";

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
    return stationCenters(count).map((t, i) => {
      const { point, quat } = gateTransform(curve, t);
      return {
        position: [point.x, point.y, point.z] as [number, number, number],
        quaternion: [quat.x, quat.y, quat.z, quat.w] as [number, number, number, number],
        color: GATE_COLORS[i % GATE_COLORS.length],
      };
    });
  }, [curve, count]);

  const half = ROAD_WIDTH / 2 + 0.4;
  const height = 4.2;

  return (
    <>
      {gates.map((gate, i) => (
        <group key={i} position={gate.position} quaternion={gate.quaternion}>
          {[-half, half].map((x) => (
            <mesh key={x} position={[x, height / 2, 0]}>
              <boxGeometry args={[0.35, height, 0.35]} />
              <meshStandardMaterial
                color="#15151b"
                emissive={gate.color}
                emissiveIntensity={0.5}
                metalness={0.6}
                roughness={0.3}
              />
            </mesh>
          ))}
          <mesh position={[0, height, 0]}>
            <boxGeometry args={[half * 2 + 0.35, 0.45, 0.45]} />
            <meshStandardMaterial
              color="#15151b"
              emissive={gate.color}
              emissiveIntensity={0.7}
              metalness={0.6}
              roughness={0.3}
            />
          </mesh>
        </group>
      ))}
    </>
  );
}
