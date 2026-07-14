"use client";

import { Suspense, useEffect, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { Road } from "@/components/three/Road";
import { Gates } from "@/components/three/Gates";
import { TrackMarkers } from "@/components/three/TrackMarkers";
import {
  createTrackCurve,
  makeProgressToT,
  EYE_HEIGHT,
  ROAD_WIDTH,
} from "@/lib/track";

function CameraRig({
  curve,
  count,
  scrollProgress,
}: {
  curve: THREE.CatmullRomCurve3;
  count: number;
  scrollProgress: React.RefObject<number>;
}) {
  const progressToT = useMemo(() => makeProgressToT(count), [count]);
  const pos = useMemo(() => new THREE.Vector3(), []);
  const tangent = useMemo(() => new THREE.Vector3(), []);
  const target = useMemo(() => new THREE.Vector3(), []);
  const up = useMemo(() => new THREE.Vector3(0, 1, 0), []);

  useFrame(({ camera }) => {
    const t = progressToT(scrollProgress.current ?? 0);
    curve.getPointAt(t, pos);
    curve.getTangentAt(t, tangent);

    camera.position.set(pos.x, pos.y + EYE_HEIGHT, pos.z);
    target
      .copy(pos)
      .addScaledVector(tangent, 5)
      .add(up.clone().multiplyScalar(EYE_HEIGHT * 0.6));
    camera.lookAt(target);
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
  const segments = isCompact ? 120 : 240;

  return (
    <>
      <CameraRig curve={curve} count={count} scrollProgress={scrollProgress} />

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, -50]}>
        <planeGeometry args={[240, 320]} />
        <meshStandardMaterial color="#070709" roughness={1} />
      </mesh>

      <Road
        curve={curve}
        width={ROAD_WIDTH}
        segments={segments}
        scrollProgress={scrollProgress}
      />
      <Gates curve={curve} count={count} />
      {!isCompact && <TrackMarkers curve={curve} />}
    </>
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
      <color attach="background" args={["#08080b"]} />
      <fog attach="fog" args={["#08080b", 14, 70]} />
      <hemisphereLight args={["#ffd9c0", "#0a0a12", 0.7]} />
      <directionalLight position={[6, 12, 4]} intensity={1.2} color="#fff2e8" />
      <pointLight position={[0, 6, -30]} intensity={40} color="#e10600" />

      <Suspense fallback={null}>
        <ResizeKick />
        <TrackWorld
          scrollProgress={scrollProgress}
          count={count}
          isCompact={isCompact}
        />
      </Suspense>
    </Canvas>
  );
}
