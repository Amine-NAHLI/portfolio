"use client";

import React, { useRef, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

const vertexShader = `
  uniform float uTime;
  uniform vec2 uMouse;
  varying vec2 vUv;
  varying float vElevation;
  
  void main() {
    vUv = uv;
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    
    float elevation = sin(modelPosition.x * 2.0 + uTime) * 
                      sin(modelPosition.z * 2.0 + uTime) * 0.5;
    
    // Mouse influence
    float dist = distance(modelPosition.xz, uMouse * 5.0);
    elevation += smoothstep(2.0, 0.0, dist) * 0.5;
    
    modelPosition.y += elevation;
    vElevation = elevation;
    
    gl_Position = projectionMatrix * viewMatrix * modelPosition;
  }
`;

const fragmentShader = `
  uniform vec3 uColor;
  varying float vElevation;
  
  void main() {
    float strength = (vElevation + 0.5);
    gl_FragColor = vec4(uColor * strength, strength * 0.3);
  }
`;

export default function WaveVisual() {
  const meshRef = useRef<THREE.Mesh>(null!);
  const { mouse } = useThree();
  
  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uMouse: { value: new THREE.Vector2(0, 0) },
    uColor: { value: new THREE.Color("#06b6d4") }
  }), []);

  useFrame((state) => {
    const { clock } = state;
    uniforms.uTime.value = clock.getElapsedTime();
    uniforms.uMouse.value.lerp(mouse, 0.1);
  });

  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]}>
      <planeGeometry args={[20, 20, 64, 64]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        wireframe
      />
    </mesh>
  );
}
