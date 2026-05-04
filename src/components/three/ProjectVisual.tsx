"use client";

import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Float, Sphere, MeshDistortMaterial, PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";

/* ─── Security Scene ─────────────────────────────────────────────── */

export const SecurityScene = () => {
  const group = useRef<THREE.Group>(null!);
  useFrame((state) => (group.current.rotation.y = state.clock.getElapsedTime() * 0.5));

  return (
    <group ref={group}>
      {[0, 1, 2, 3, 4].map((i) => (
        <React.Fragment key={i}>
          <mesh position={[Math.cos(i * 1.2) * 1.5, Math.sin(i * 1.2) * 1.5, 0]}>
            <sphereGeometry args={[0.1, 16, 16]} />
            <meshBasicMaterial color="#06b6d4" />
          </mesh>
          <line>
            <bufferGeometry attach="geometry" {...new THREE.BufferGeometry().setFromPoints([
              new THREE.Vector3(0, 0, 0),
              new THREE.Vector3(Math.cos(i * 1.2) * 1.5, Math.sin(i * 1.2) * 1.5, 0)
            ])} />
            <lineBasicMaterial attach="material" color="#06b6d4" transparent opacity={0.3} />
          </line>
        </React.Fragment>
      ))}
      <mesh>
        <sphereGeometry args={[0.3, 32, 32]} />
        <meshBasicMaterial color="#06b6d4" wireframe />
      </mesh>
    </group>
  );
};

/* ─── Full-Stack Scene ───────────────────────────────────────────── */

export const FullStackScene = () => {
  const group = useRef<THREE.Group>(null!);
  useFrame((state) => (group.current.rotation.y = state.clock.getElapsedTime() * 0.3));

  return (
    <group ref={group}>
      {[0, 1, 2].map((i) => (
        <mesh key={i} position={[0, (i - 1) * 0.8, 0]} rotation={[Math.PI / 2.5, 0, 0]}>
          <planeGeometry args={[2, 0.6]} />
          <meshBasicMaterial color="#6366f1" wireframe transparent opacity={0.4} />
        </mesh>
      ))}
    </group>
  );
};

/* ─── AI Scene ───────────────────────────────────────────────────── */

export const AIScene = () => {
  const group = useRef<THREE.Group>(null!);
  useFrame((state) => {
    group.current.rotation.y = state.clock.getElapsedTime() * 0.4;
    group.current.rotation.z = state.clock.getElapsedTime() * 0.2;
  });

  return (
    <group ref={group}>
      <Float speed={5} rotationIntensity={2} floatIntensity={2}>
        <Sphere args={[1, 64, 64]}>
          <MeshDistortMaterial
            color="#a855f7"
            speed={2}
            distort={0.5}
            roughness={0}
          />
        </Sphere>
      </Float>
    </group>
  );
};

export const CategoryVisual = ({ category }: { category: string }) => {
  switch (category) {
    case "Security": return <SecurityScene />;
    case "Full-Stack": return <FullStackScene />;
    case "AI/Vision": return <AIScene />;
    default: return <SecurityScene />;
  }
};
