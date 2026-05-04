"use client";

import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function GlobeVisual() {
  const globeRef = useRef<THREE.Mesh>(null!);
  const pointsRef = useRef<THREE.Points>(null!);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    globeRef.current.rotation.y = t * 0.1;
    pointsRef.current.rotation.y = t * 0.1;
  });

  return (
    <group scale={2}>
      <mesh ref={globeRef}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshBasicMaterial color="#06b6d4" wireframe transparent opacity={0.1} />
      </mesh>
      
      <points ref={pointsRef}>
        <sphereGeometry args={[1.05, 32, 32]} />
        <pointsMaterial color="#06b6d4" size={0.02} transparent opacity={0.5} />
      </points>

      {/* Pulsing Dots for locations */}
      {[
        { lat: 34, lon: -5 }, // Fès
        { lat: 48, lon: 2 },  // Paris
        { lat: 40, lon: -74 }, // NYC
      ].map((loc, i) => {
        const phi = (90 - loc.lat) * (Math.PI / 180);
        const theta = (loc.lon + 180) * (Math.PI / 180);
        const x = -(Math.sin(phi) * Math.cos(theta));
        const z = Math.sin(phi) * Math.sin(theta);
        const y = Math.cos(phi);
        
        return (
          <mesh key={i} position={[x, y, z]}>
            <sphereGeometry args={[0.02, 16, 16]} />
            <meshBasicMaterial color="#06b6d4" />
          </mesh>
        );
      })}
    </group>
  );
}
