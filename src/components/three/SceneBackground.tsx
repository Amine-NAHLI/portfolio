"use client";

import React, { useRef, useMemo, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useScroll, Float } from "@react-three/drei";
import * as THREE from "three";

const ParticleField = () => {
  const count = 800;
  const meshRef = useRef<THREE.Points>(null!);
  
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 10;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 10;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 5;
    }
    return pos;
  }, []);

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uColor1: { value: new THREE.Color("#06b6d4") },
    uColor2: { value: new THREE.Color("#6366f1") },
    uColor3: { value: new THREE.Color("#a855f7") },
  }), []);

  useFrame((state) => {
    const { clock } = state;
    uniforms.uTime.value = clock.getElapsedTime() * 0.5;
    meshRef.current.rotation.y += 0.001;
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <shaderMaterial
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        uniforms={uniforms}
        vertexShader={`
          uniform float uTime;
          varying float vOpacity;
          void main() {
            vec3 pos = position;
            float offset = sin(pos.x * 0.5 + uTime) * cos(pos.y * 0.5 + uTime) * 0.5;
            pos.z += offset;
            vOpacity = (offset + 0.5);
            vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
            gl_PointSize = 4.0 * (1.0 / -mvPosition.z);
            gl_Position = projectionMatrix * mvPosition;
          }
        `}
        fragmentShader={`
          uniform vec3 uColor1;
          uniform vec3 uColor2;
          uniform vec3 uColor3;
          varying float vOpacity;
          void main() {
            vec3 color = mix(uColor1, uColor2, vOpacity);
            color = mix(color, uColor3, sin(vOpacity * 3.14));
            float dist = distance(gl_PointCoord, vec2(0.5));
            float alpha = smoothstep(0.5, 0.2, dist) * vOpacity * 0.6;
            gl_FragColor = vec4(color, alpha);
          }
        `}
      />
    </points>
  );
};

const Scene = () => {
  const { camera, mouse } = useThree();
  const scroll = useScroll();

  useFrame(() => {
    // Mouse Parallax
    camera.position.x += (mouse.x * 0.5 - camera.position.x) * 0.05;
    camera.position.y += (mouse.y * 0.5 - camera.position.y) * 0.05;
    
    // Scroll Parallax
    const scrollOffset = scroll?.offset || 0;
    camera.position.z = 5 + scrollOffset * 2;
    
    camera.lookAt(0, 0, 0);
  });

  return (
    <>
      <ambientLight intensity={0.5} />
      <ParticleField />
    </>
  );
};

export default function SceneBackground() {
  const [shouldReduceMotion, setShouldReduceMotion] = React.useState(false);

  React.useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setShouldReduceMotion(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setShouldReduceMotion(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  if (shouldReduceMotion) {
    return (
      <div 
        className="fixed inset-0 z-[-1] pointer-events-none bg-gradient-to-br from-bg-0 via-bg-1 to-bg-0"
        style={{ opacity: 0.5 }}
      />
    );
  }

  return (
    <div className="fixed inset-0 z-[-1] pointer-events-none overflow-hidden">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 75 }}
        gl={{ antialias: false, alpha: true }}
        dpr={[1, 2]}
      >
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
    </div>
  );
}
