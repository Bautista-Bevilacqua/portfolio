"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * Piso de grilla en perspectiva estilo "pista". Las líneas corren hacia la cámara
 * (velocidad base + empuje del scroll) y el color hace fade hacia el horizonte.
 * Todo el efecto vive en el fragment shader, así que es barato de renderizar.
 */
export function GridFloor({
  scrollProgress,
  speed = 0.35,
}: {
  scrollProgress: React.RefObject<number>;
  speed?: number;
}) {
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uScroll: { value: 0 },
      uColor: { value: new THREE.Color("#e10600") },
      uColor2: { value: new THREE.Color("#ff6b35") },
    }),
    [],
  );

  useFrame((_, delta) => {
    const mat = materialRef.current;
    if (!mat) return;
    mat.uniforms.uTime.value += delta * speed;
    mat.uniforms.uScroll.value += delta * (scrollProgress.current ?? 0) * 2.5;
  });

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.2, 0]}>
      <planeGeometry args={[60, 120, 1, 1]} />
      <shaderMaterial
        ref={materialRef}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        side={THREE.DoubleSide}
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
          uniform vec3 uColor;
          uniform vec3 uColor2;

          float gridLine(float coord, float width) {
            float g = abs(fract(coord - 0.5) - 0.5) / fwidth(coord);
            return 1.0 - min(g / width, 1.0);
          }

          void main() {
            // El eje V corre hacia la camara con el tiempo y el scroll.
            float depth = vUv.y;
            float run = uTime + uScroll;
            float lines = gridLine((vUv.x - 0.5) * 40.0, 1.2);
            float rows = gridLine((depth * 40.0) - run * 6.0, 1.2);
            float grid = max(lines, rows);

            // Fade hacia el horizonte (parte lejana) y hacia los costados.
            float horizon = smoothstep(0.0, 0.55, depth);
            float sides = smoothstep(0.0, 0.15, vUv.x) * smoothstep(1.0, 0.85, vUv.x);
            float alpha = grid * horizon * sides * 0.9;

            vec3 col = mix(uColor2, uColor, depth);
            gl_FragColor = vec4(col, alpha);
          }
        `}
      />
    </mesh>
  );
}
