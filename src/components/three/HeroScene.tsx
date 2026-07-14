"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Sparkles } from "@react-three/drei";
import * as THREE from "three";
import { InteractiveCore } from "@/components/three/InteractiveCore";
import { GridFloor } from "@/components/three/GridFloor";

// Progreso de scroll (0-1) leído sin re-renderizar React en cada evento.
function useScrollProgress() {
  const progress = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      progress.current = max > 0 ? Math.min(window.scrollY / max, 1) : 0;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return progress;
}

// Parallax de camara con el mouse + dolly/tilt con el scroll.
function CameraRig({ scrollProgress }: { scrollProgress: React.RefObject<number> }) {
  useFrame((state, delta) => {
    const t = scrollProgress.current ?? 0;
    const targetX = state.pointer.x * 0.8;
    const targetY = 0.6 + state.pointer.y * 0.4 + t * 1.2;
    const targetZ = 7 - t * 2.5;

    state.camera.position.x += (targetX - state.camera.position.x) * 0.05;
    state.camera.position.y += (targetY - state.camera.position.y) * 0.05;
    state.camera.position.z += (targetZ - state.camera.position.z) * 0.05;
    state.camera.lookAt(0, 0, 0);
    void delta;
  });
  return null;
}

function CoreRig({
  scrollProgress,
  offsetX,
}: {
  scrollProgress: React.RefObject<number>;
  offsetX: number;
}) {
  const ref = useRef<THREE.Group>(null);
  useFrame(() => {
    if (!ref.current) return;
    const t = scrollProgress.current ?? 0;
    ref.current.position.y = t * 2.5;
  });
  return (
    <group ref={ref} position={[offsetX, 0, 0]}>
      <InteractiveCore detail={1} />
    </group>
  );
}

export function HeroScene() {
  const scrollProgress = useScrollProgress();
  const [isCompact, setIsCompact] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(max-width: 640px)").matches,
  );

  useEffect(() => {
    const mql = window.matchMedia("(max-width: 640px)");
    const onChange = (e: MediaQueryListEvent) => setIsCompact(e.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  // R3F dimensiona el canvas cuando su observer reporta tamaño. En algunos
  // entornos el primer callback no dispara al montar y el canvas queda en 0.
  // Unos resize sintéticos escalonados garantizan la inicialización.
  useEffect(() => {
    const timers = [0, 150, 500].map((ms) =>
      setTimeout(() => window.dispatchEvent(new Event("resize")), ms),
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <Canvas
      dpr={[1, isCompact ? 1.3 : 1.75]}
      camera={{ position: [0, 0.6, 7], fov: 50 }}
      gl={{ antialias: true, alpha: true, preserveDrawingBuffer: true }}
    >
      <color attach="background" args={["#08080b"]} />
      <fog attach="fog" args={["#08080b", 8, 22]} />
      <ambientLight intensity={0.5} />
      <pointLight position={[3, 4, 5]} intensity={60} color="#ff6b35" />
      <pointLight position={[-4, 1, -2]} intensity={30} color="#e10600" />

      <Suspense fallback={null}>
        <CameraRig scrollProgress={scrollProgress} />
        <CoreRig scrollProgress={scrollProgress} offsetX={isCompact ? 0 : 2.3} />
        <GridFloor scrollProgress={scrollProgress} />
        <Sparkles
          count={isCompact ? 30 : 70}
          scale={[12, 6, 6]}
          size={2}
          speed={0.3}
          color="#ff6b35"
          opacity={0.6}
        />
      </Suspense>
    </Canvas>
  );
}
