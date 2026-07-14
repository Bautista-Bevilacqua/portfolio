"use client";

import { Suspense, useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { Road } from "@/components/three/Road";
import { Gates } from "@/components/three/Gates";
import { Barriers } from "@/components/three/Barriers";
import {
  createTrackCurve,
  makeProgressToT,
  EYE_HEIGHT,
  ROAD_WIDTH,
} from "@/lib/track";

const BASE_FOV = 72;

function CameraRig({
  curve,
  count,
  scrollProgress,
}: {
  curve: THREE.CatmullRomCurve3;
  count: number;
  scrollProgress: React.RefObject<number>;
}) {
  const mapping = useMemo(() => makeProgressToT(count), [count]);
  const pos = useMemo(() => new THREE.Vector3(), []);
  const tangent = useMemo(() => new THREE.Vector3(), []);
  const nextTangent = useMemo(() => new THREE.Vector3(), []);
  const target = useMemo(() => new THREE.Vector3(), []);
  const up = useMemo(() => new THREE.Vector3(0, 1, 0), []);
  const currentT = useRef(0);
  const bank = useRef(0);

  useFrame(({ camera }, delta) => {
    const p = scrollProgress.current ?? 0;

    // Damping: la cámara persigue su objetivo con suavidad (independiente del
    // frame-rate) → el movimiento queda sedoso aunque el scroll llegue a saltos.
    const targetT = mapping.t(p);
    currentT.current = THREE.MathUtils.damp(currentT.current, targetT, 5, delta);
    const t = currentT.current;

    curve.getPointAt(t, pos);
    curve.getTangentAt(t, tangent);

    const cam = camera as THREE.PerspectiveCamera;
    cam.position.set(pos.x, pos.y + EYE_HEIGHT, pos.z);
    target
      .copy(pos)
      .addScaledVector(tangent, 5)
      .addScaledVector(up, EYE_HEIGHT * 0.6);
    cam.lookAt(target);

    // Inclinación (bank) hacia adentro de la curva, sutil, como un auto real.
    curve.getTangentAt(Math.min(t + 0.01, 1), nextTangent);
    const turn = tangent.x * nextTangent.z - tangent.z * nextTangent.x;
    const bankTarget = THREE.MathUtils.clamp(-turn * 7, -0.11, 0.11);
    bank.current = THREE.MathUtils.damp(bank.current, bankTarget, 4, delta);
    cam.rotateZ(bank.current);

    // FOV dinámico: más rápido → un poco más abierto = sensación de velocidad.
    const targetFov = BASE_FOV + mapping.speedNorm(p) * 8;
    cam.fov = THREE.MathUtils.damp(cam.fov, targetFov, 4, delta);
    cam.updateProjectionMatrix();
  });

  return null;
}

function TrackWorld({
  scrollProgress,
  count,
  isCompact,
}: {
  scrollProgress: React.RefObject<number>;
  count: number;
  isCompact: boolean;
}) {
  const curve = useMemo(() => createTrackCurve(), []);
  const segments = isCompact ? 160 : 320;

  return (
    <>
      <CameraRig curve={curve} count={count} scrollProgress={scrollProgress} />

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.06, -50]}>
        <planeGeometry args={[300, 340]} />
        <meshStandardMaterial color="#0a0a0e" roughness={1} />
      </mesh>

      <Road curve={curve} width={ROAD_WIDTH} segments={segments} />
      <Barriers curve={curve} segments={segments} />
      <Gates curve={curve} count={count} />
    </>
  );
}

function Backdrop() {
  const uniforms = useMemo(
    () => ({
      uTop: { value: new THREE.Color("#05050b") },
      uHorizon: { value: new THREE.Color("#2a1016") },
    }),
    [],
  );
  return (
    <mesh scale={[-1, 1, 1]}>
      <sphereGeometry args={[130, 32, 16]} />
      <shaderMaterial
        uniforms={uniforms}
        side={THREE.BackSide}
        depthWrite={false}
        vertexShader={`
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `}
        fragmentShader={`
          varying vec2 vUv;
          uniform vec3 uTop;
          uniform vec3 uHorizon;
          void main() {
            float h = smoothstep(0.45, 0.62, vUv.y);
            vec3 col = mix(uHorizon, uTop, h);
            gl_FragColor = vec4(col, 1.0);
          }
        `}
      />
    </mesh>
  );
}

function ResizeKick() {
  const { invalidate } = useThree();
  useEffect(() => {
    const timers = [0, 150, 500].map((ms) =>
      setTimeout(() => {
        window.dispatchEvent(new Event("resize"));
        invalidate();
      }, ms),
    );
    return () => timers.forEach(clearTimeout);
  }, [invalidate]);
  return null;
}

export function TrackScene({
  scrollProgress,
  count,
  isCompact,
}: {
  scrollProgress: React.RefObject<number>;
  count: number;
  isCompact: boolean;
}) {
  return (
    <Canvas
      dpr={[1, isCompact ? 1.3 : 1.75]}
      camera={{ position: [0, EYE_HEIGHT, 6], fov: 72, near: 0.1, far: 200 }}
      gl={{ antialias: true, preserveDrawingBuffer: true }}
    >
      <color attach="background" args={["#08070c"]} />
      <fog attach="fog" args={["#100810", 18, 95]} />
      <hemisphereLight args={["#ffe0cc", "#0a0a12", 0.85]} />
      <directionalLight position={[8, 14, 6]} intensity={1.4} color="#fff2e8" />
      <directionalLight position={[-6, 5, -8]} intensity={0.4} color="#5a6cff" />

      <Suspense fallback={null}>
        <ResizeKick />
        <Backdrop />
        <TrackWorld
          scrollProgress={scrollProgress}
          count={count}
          isCompact={isCompact}
        />
      </Suspense>
    </Canvas>
  );
}
