"use client";

import React, { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";

const MathematicalShape = ({ position, rotationSpeed, args, color, type }: any) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.x += rotationSpeed[0];
    meshRef.current.rotation.y += rotationSpeed[1];
    meshRef.current.rotation.z += rotationSpeed[2];
  });

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={2}>
      <mesh position={position} ref={meshRef}>
        {type === "icosahedron" && <icosahedronGeometry args={args} />}
        {type === "torusKnot" && <torusKnotGeometry args={args} />}
        {type === "octahedron" && <octahedronGeometry args={args} />}
        {type === "dodecahedron" && <dodecahedronGeometry args={args} />}
        
        <meshStandardMaterial 
          color={color} 
          wireframe 
          transparent 
          opacity={0.15} 
          emissive={color}
          emissiveIntensity={0.5}
        />
      </mesh>
    </Float>
  );
};

const Scene = () => {
  const shapes = useMemo(() => [
    {
      type: "torusKnot",
      args: [1, 0.3, 128, 32],
      position: [-4, 2, -5],
      rotationSpeed: [0.002, 0.003, 0.001],
      color: "#06B6D4" // Cyan
    },
    {
      type: "icosahedron",
      args: [1.5, 0],
      position: [5, -3, -8],
      rotationSpeed: [0.001, 0.002, 0.005],
      color: "#6366F1" // Indigo
    },
    {
      type: "dodecahedron",
      args: [2, 0],
      position: [0, 0, -12],
      rotationSpeed: [0.003, 0.001, 0.002],
      color: "#A855F7" // Purple
    },
    {
      type: "octahedron",
      args: [1, 0],
      position: [3, 4, -6],
      rotationSpeed: [0.005, 0.002, 0.001],
      color: "#06B6D4"
    }
  ], []);

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#06B6D4" />
      
      {shapes.map((shape, i) => (
        <MathematicalShape key={i} {...shape} />
      ))}
    </>
  );
};

export default function GeometricBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 bg-bg-0 overflow-hidden">
      <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 5], fov: 75 }}>
        <Scene />
      </Canvas>
      
      {/* Subtle Noise/Vignette Overlay */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,rgba(11,15,25,0.4)_100%)]" />
      <div className="absolute inset-0 noise-bg opacity-[0.03] mix-blend-overlay" />
    </div>
  );
}
