"use client";

import { useMemo } from "react";
import * as THREE from "three";
import { buildRoadGeometry } from "@/lib/track";

export function Road({
  curve,
  width,
  segments,
}: {
  curve: THREE.CatmullRomCurve3;
  width: number;
  segments: number;
}) {
  const geometry = useMemo(
    () => buildRoadGeometry(curve, width, segments),
    [curve, width, segments],
  );

  const uniforms = useMemo(
    () => ({
      uAsphalt: { value: new THREE.Color("#111116") },
      uKerbRed: { value: new THREE.Color("#d10a0a") },
      uKerbWhite: { value: new THREE.Color("#eef0f2") },
      uLine: { value: new THREE.Color("#e8e8ec") },
    }),
    [],
  );

  return (
    <mesh geometry={geometry}>
      <shaderMaterial
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
          uniform vec3 uAsphalt;
          uniform vec3 uKerbRed;
          uniform vec3 uKerbWhite;
          uniform vec3 uLine;

          void main() {
            // Asfalto: leve gradiente a lo ancho para que no sea plano.
            float shade = 0.85 + 0.15 * (1.0 - abs(vUv.x - 0.5) * 2.0);
            vec3 col = uAsphalt * shade;

            // Distancia al borde más cercano (0 en el borde, 0.5 en el centro).
            float edgeDist = min(vUv.x, 1.0 - vUv.x);

            // Piano (kerb) rojo/blanco a rayas: la firma visual de un circuito F1.
            float kerbW = 0.07;
            float kerb = step(edgeDist, kerbW);
            float stripe = step(0.5, fract(vUv.y * 2.5));
            vec3 kerbCol = mix(uKerbRed, uKerbWhite, stripe);
            col = mix(col, kerbCol, kerb);

            // Línea blanca fina de pista justo por dentro del kerb.
            float line = smoothstep(kerbW + 0.018, kerbW + 0.008, edgeDist)
                       * step(kerbW, edgeDist);
            col = mix(col, uLine, line * 0.8);

            gl_FragColor = vec4(col, 1.0);
          }
        `}
      />
    </mesh>
  );
}
