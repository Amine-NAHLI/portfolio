"use client";

import React, { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";

/**
 * Individual floating wireframe shape — lightweight, GPU-friendly.
 * Uses only wireframe + emissive for a glowing outline effect.
 */
const Shape = ({
  position,
  size,
  type,
  color,
  speed,
  rotationSpeed,
}: {
  position: [number, number, number];
  size: number;
  type: "icosahedron" | "octahedron" | "torus";
  color: string;
  speed: number;
  rotationSpeed: number;
}) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;

    // Slow auto-rotation
    meshRef.current.rotation.x += 0.001 * rotationSpeed;
    meshRef.current.rotation.y += 0.002 * rotationSpeed;

    // Subtle mouse parallax
    const mx = state.pointer.x * 0.3;
    const my = state.pointer.y * 0.3;
    meshRef.current.position.x =
      position[0] + mx * (1 + position[2] * 0.1);
    meshRef.current.position.y =
      position[1] + my * (1 + position[2] * 0.1);
  });

  const geometry = useMemo(() => {
    switch (type) {
      case "icosahedron":
        return <icosahedronGeometry args={[size, 0]} />;
      case "octahedron":
        return <octahedronGeometry args={[size, 0]} />;
      case "torus":
        return <torusGeometry args={[size, 0.04, 12, 48]} />;
    }
  }, [type, size]);

  return (
    <Float speed={speed} rotationIntensity={0.8} floatIntensity={0.8}>
      <mesh ref={meshRef} position={position}>
        {geometry}
        <meshBasicMaterial
          color={color}
          wireframe
          transparent
          opacity={0.25}
        />
      </mesh>
    </Float>
  );
};

/**
 * HeroScene — minimal 3D background with 3 floating wireframe shapes.
 * Performance-first: no shadows, no complex materials, no heavy lighting.
 */
const HeroScene = () => {
  const shapes = useMemo(
    () => [
      {
        type: "icosahedron" as const,
        position: [-3.5, 1.5, -2] as [number, number, number],
        size: 1.3,
        color: "#06b6d4",
        speed: 1.5,
        rotationSpeed: 0.8,
      },
      {
        type: "octahedron" as const,
        position: [3.5, -1.5, -3] as [number, number, number],
        size: 1.1,
        color: "#6366f1",
        speed: 2,
        rotationSpeed: 1,
      },
      {
        type: "torus" as const,
        position: [-2, -2.5, -1.5] as [number, number, number],
        size: 0.9,
        color: "#a855f7",
        speed: 1.8,
        rotationSpeed: 0.6,
      },
    ],
    []
  );

  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 8], fov: 50 }}
        gl={{ antialias: false, alpha: true }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.3} />
        {shapes.map((shape, idx) => (
          <Shape key={idx} {...shape} />
        ))}
      </Canvas>
    </div>
  );
};

export default HeroScene;
