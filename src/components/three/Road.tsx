"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { buildRoadGeometry } from "@/lib/track";

export function Road({
  curve,
  width,
  segments,
  scrollProgress,
}: {
  curve: THREE.CatmullRomCurve3;
  width: number;
  segments: number;
  scrollProgress: React.RefObject<number>;
}) {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const geometry = useMemo(
    () => buildRoadGeometry(curve, width, segments),
    [curve, width, segments],
  );

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uScroll: { value: 0 },
      uAsphalt: { value: new THREE.Color("#0d0d11") },
      uEdge: { value: new THREE.Color("#ff6b35") },
      uDash: { value: new THREE.Color("#f2f2f2") },
    }),
    [],
  );

  useFrame((_, delta) => {
    const mat = materialRef.current;
    if (!mat) return;
    mat.uniforms.uTime.value += delta;
    mat.uniforms.uScroll.value = scrollProgress.current ?? 0;
  });

  return (
    <mesh geometry={geometry}>
      <shaderMaterial
        ref={materialRef}
        uniforms={uniforms}
        vertexShader={`
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `}
        fragmentShader={`
          varying vec2 vUv;
          uniform float uTime;
          uniform float uScroll;
          uniform vec3 uAsphalt;
          uniform vec3 uEdge;
          uniform vec3 uDash;

          void main() {
            vec3 col = uAsphalt;

            // Bordes brillantes a ambos lados.
            float edge = smoothstep(0.045, 0.02, vUv.x) + smoothstep(0.955, 0.98, vUv.x);
            col = mix(col, uEdge, clamp(edge, 0.0, 1.0));

            // Línea central discontinua que corre hacia la cámara.
            float center = smoothstep(0.03, 0.012, abs(vUv.x - 0.5));
            float dash = step(0.5, fract(vUv.y * 1.2 - uScroll * 8.0 - uTime * 0.6));
            col = mix(col, uDash, center * dash * 0.9);

            gl_FragColor = vec4(col, 1.0);
          }
        `}
      />
    </mesh>
  );
}
