"use client";

import React, { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, PerspectiveCamera, MeshDistortMaterial, Sphere } from "@react-three/drei";
import * as THREE from "three";

const Shape = ({ position, args, type, color, speed, rotationSpeed }: any) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    
    // Slow rotation
    meshRef.current.rotation.x += 0.001 * rotationSpeed;
    meshRef.current.rotation.y += 0.002 * rotationSpeed;

    // Subtle parallax on mouse move
    const x = state.mouse.x * 2;
    const y = state.mouse.y * 2;
    meshRef.current.position.x = position[0] + x * 0.5;
    meshRef.current.position.y = position[1] + y * 0.5;
  });

  return (
    <Float speed={speed} rotationIntensity={1} floatIntensity={1}>
      <mesh ref={meshRef} position={position}>
        {type === "icosahedron" && <icosahedronGeometry args={[args, 0]} />}
        {type === "octahedron" && <octahedronGeometry args={[args, 0]} />}
        {type === "torus" && <torusGeometry args={[args, 0.05, 16, 100]} />}
        <meshStandardMaterial
          color={color}
          wireframe
          transparent
          opacity={0.4}
          emissive={color}
          emissiveIntensity={0.5}
        />
      </mesh>
    </Float>
  );
};

const HeroScene = () => {
  const shapes = useMemo(() => {
    const s = [
      { type: "icosahedron", position: [-4, 2, -2], args: 1.5, color: "#06b6d4", speed: 1.5, rotationSpeed: 1 },
      { type: "octahedron", position: [4, -2, -3], args: 1.2, color: "#6366f1", speed: 2, rotationSpeed: 1.2 },
      { type: "torus", position: [-3, -3, -1], args: 0.8, color: "#a855f7", speed: 1.8, rotationSpeed: 0.8 },
      { type: "icosahedron", position: [5, 3, -4], args: 1, color: "#06b6d4", speed: 2.2, rotationSpeed: 1.5 },
      { type: "octahedron", position: [0, 4, -5], args: 2, color: "#6366f1", speed: 1.2, rotationSpeed: 0.5 },
      { type: "torus", position: [3, 1, -2], args: 1.2, color: "#a855f7", speed: 2.5, rotationSpeed: 2 },
    ];
    return s;
  }, []);

  return (
    <div className="absolute inset-0 z-0">
      <Canvas shadows dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={50} />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#06b6d4" />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#6366f1" />
        <spotLight position={[0, 5, 10]} angle={0.15} penumbra={1} intensity={2} color="#ffffff" />
        
        {shapes.map((shape, idx) => (
          <Shape key={idx} {...shape} />
        ))}
      </Canvas>
    </div>
  );
};

export default HeroScene;
