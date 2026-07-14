"use client";

import { useMemo } from "react";
import * as THREE from "three";
import { buildBarrierGeometry, ROAD_WIDTH } from "@/lib/track";

const VERTEX = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const FRAGMENT = `
  varying vec2 vUv;
  uniform vec3 uBody;
  uniform vec3 uRail;
  uniform vec3 uBlockA;
  uniform vec3 uBlockB;

  void main() {
    // Bloques de color alternados a lo largo (rushing = sensación de velocidad).
    float block = step(0.5, fract(vUv.x * 0.5));
    vec3 blockCol = mix(uBlockA, uBlockB, block);

    vec3 col = uBody;
    // Banda de color a media altura (tipo publicidad de circuito).
    float midBand = smoothstep(0.34, 0.4, vUv.y) * smoothstep(0.6, 0.54, vUv.y);
    col = mix(col, blockCol, midBand * 0.85);

    // Baranda superior que brilla.
    float rail = smoothstep(0.82, 0.9, vUv.y);
    col = mix(col, uRail, rail);

    // Se oscurece hacia la base para dar volumen sin luces.
    col *= mix(0.55, 1.0, smoothstep(0.0, 0.5, vUv.y));

    gl_FragColor = vec4(col, 1.0);
  }
`;

export function Barriers({
  curve,
  segments,
}: {
  curve: THREE.CatmullRomCurve3;
  segments: number;
}) {
  const offset = ROAD_WIDTH / 2 + 0.35;
  const height = 1.1;

  const geometries = useMemo(
    () => ({
      left: buildBarrierGeometry(curve, -1, offset, height, segments),
      right: buildBarrierGeometry(curve, 1, offset, height, segments),
    }),
    [curve, offset, height, segments],
  );

  const uniforms = useMemo(
    () => ({
      uBody: { value: new THREE.Color("#101016") },
      uRail: { value: new THREE.Color("#ff6b35") },
      uBlockA: { value: new THREE.Color("#e10600") },
      uBlockB: { value: new THREE.Color("#f2f2f2") },
    }),
    [],
  );

  return (
    <>
      <mesh geometry={geometries.left}>
        <shaderMaterial
          uniforms={uniforms}
          vertexShader={VERTEX}
          fragmentShader={FRAGMENT}
          side={THREE.DoubleSide}
        />
      </mesh>
      <mesh geometry={geometries.right}>
        <shaderMaterial
          uniforms={uniforms}
          vertexShader={VERTEX}
          fragmentShader={FRAGMENT}
          side={THREE.DoubleSide}
        />
      </mesh>
    </>
  );
}
