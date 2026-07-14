"use client";

import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { ROAD_WIDTH } from "@/lib/track";

// Postes reflectores a ambos lados de la pista. Al avanzar pasan volando y dan
// la sensación de velocidad. InstancedMesh para que sea barato.
export function TrackMarkers({ curve }: { curve: THREE.CatmullRomCurve3 }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);

  const instances = useMemo(() => {
    const up = new THREE.Vector3(0, 1, 0);
    const offset = ROAD_WIDTH / 2 + 0.7;
    const length = curve.getLength();
    const step = 4;
    const n = Math.max(2, Math.floor(length / step));
    const out: THREE.Vector3[] = [];
    for (let i = 0; i <= n; i++) {
      const t = i / n;
      const p = curve.getPointAt(t);
      const tangent = curve.getTangentAt(t);
      const right = new THREE.Vector3().crossVectors(tangent, up).normalize();
      out.push(p.clone().addScaledVector(right, -offset).setY(0.4));
      out.push(p.clone().addScaledVector(right, offset).setY(0.4));
    }
    return out;
  }, [curve]);

  useEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const m = new THREE.Matrix4();
    const scale = new THREE.Vector3(0.18, 0.8, 0.18);
    const quat = new THREE.Quaternion();
    instances.forEach((pos, i) => {
      m.compose(pos, quat, scale);
      mesh.setMatrixAt(i, m);
    });
    mesh.instanceMatrix.needsUpdate = true;
  }, [instances]);

  return (
    <instancedMesh
      ref={meshRef}
      args={[undefined, undefined, instances.length]}
    >
      <boxGeometry />
      <meshStandardMaterial
        color="#1a1a20"
        emissive="#ff6b35"
        emissiveIntensity={0.6}
        roughness={0.4}
      />
    </instancedMesh>
  );
}
