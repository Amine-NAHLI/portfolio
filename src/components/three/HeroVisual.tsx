"use client";

import React, { useRef, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { MeshDistortMaterial, Float } from "@react-three/drei";
import * as THREE from "three";

export default function HeroVisual() {
  const meshRef = useRef<THREE.Mesh>(null!);
  const wireRef = useRef<THREE.Mesh>(null!);
  const { mouse } = useThree();

  const colors = useMemo(() => ["#06b6d4", "#6366f1", "#a855f7"], []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    
    // Color cycling
    const colorIndex = Math.floor(t / 4) % colors.length;
    const nextColorIndex = (colorIndex + 1) % colors.length;
    const lerpFactor = (t % 4) / 4;
    const currentColor = new THREE.Color(colors[colorIndex]).lerp(new THREE.Color(colors[nextColorIndex]), lerpFactor);
    
    if (meshRef.current) {
      (meshRef.current.material as any).color = currentColor;
    }

    // Mouse Repel
    const targetX = -mouse.x * 0.5;
    const targetY = -mouse.y * 0.5;
    meshRef.current.position.x += (targetX - meshRef.current.position.x) * 0.1;
    meshRef.current.position.y += (targetY - meshRef.current.position.y) * 0.1;
    
    wireRef.current.position.copy(meshRef.current.position);
    
    // Auto Rotation
    meshRef.current.rotation.y = t * 0.2;
    meshRef.current.rotation.x = t * 0.1;
    wireRef.current.rotation.copy(meshRef.current.rotation);
  });

  return (
    <group position={[0, 0, -2]}>
      <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
        <mesh ref={meshRef}>
          <torusKnotGeometry args={[1, 0.3, 128, 32]} />
          <MeshDistortMaterial
            color="#06b6d4"
            speed={1.5}
            distort={0.4}
            roughness={0.1}
            metalness={0.8}
          />
        </mesh>
        <mesh ref={wireRef} scale={1.05}>
          <torusKnotGeometry args={[1, 0.3, 128, 32]} />
          <meshBasicMaterial color="#06b6d4" wireframe transparent opacity={0.3} />
        </mesh>
      </Float>
      <pointLight position={[10, 10, 10]} intensity={1.5} color="#06b6d4" />
      <pointLight position={[-10, -10, -10]} intensity={1} color="#a855f7" />
      <ambientLight intensity={0.4} />
    </group>
  );
}
