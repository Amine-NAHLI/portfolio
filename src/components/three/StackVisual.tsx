"use client";

import React, { useRef, useMemo, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Html, Float, Sphere, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import type { Skill } from "@/lib/github";

const CAT_COLORS: Record<string, string> = {
  Security: "#06b6d4",
  "Full-Stack": "#6366f1",
  AI: "#a855f7",
  Experiments: "#f59e0b",
};

/* ─── Tech Sphere ────────────────────────────────────────────────── */

const TechNode = ({ 
  skill, 
  tech, 
  position, 
  onSelect 
}: { 
  skill: Skill; 
  tech: string; 
  position: [number, number, number];
  onSelect: (name: string | null) => void;
}) => {
  const [hovered, setHovered] = useState(false);
  const color = CAT_COLORS[skill.category] || "#64748b";
  const size = 0.2 + (skill.level / 100) * 0.3;

  return (
    <group position={position}>
      <mesh
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={() => onSelect(tech)}
      >
        <sphereGeometry args={[size, 32, 32]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={hovered ? 2 : 0.5}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>
      
      {hovered && (
        <Html distanceFactor={10} zIndexRange={[100, 0]}>
          <div className="pointer-events-none p-3 rounded-xl bg-bg-3/90 border border-white/10 backdrop-blur-md shadow-2xl min-w-[120px]">
            <p className="text-xs font-bold text-text-1 mb-1">{tech}</p>
            <p className="text-[10px] font-mono uppercase tracking-widest" style={{ color }}>{skill.category}</p>
            <div className="mt-2 h-1 w-full bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-cyan transition-all" style={{ width: `${skill.level}%` }} />
            </div>
          </div>
        </Html>
      )}
    </group>
  );
};

/* ─── Constellation Scene ────────────────────────────────────────── */

export default function StackVisual({ skills, onSelect }: { skills: Skill[]; onSelect: (name: string | null) => void }) {
  const groupRef = useRef<THREE.Group>(null!);
  
  const nodes = useMemo(() => {
    const allTechs = skills.flatMap(s => s.techs.map(t => ({ tech: t, skill: s })));
    const count = allTechs.length;
    const phi = Math.PI * (3 - Math.sqrt(5)); // golden angle
    
    return allTechs.map((node, i) => {
      const y = 1 - (i / (count - 1)) * 2; // y from 1 to -1
      const radius = Math.sqrt(1 - y * y);
      const theta = phi * i;
      const x = Math.cos(theta) * radius;
      const z = Math.sin(theta) * radius;
      
      return {
        ...node,
        position: [x * 4, y * 4, z * 4] as [number, number, number]
      };
    });
  }, [skills]);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.002;
    }
  });

  return (
    <>
      <group ref={groupRef}>
        {nodes.map((node, i) => (
          <TechNode 
            key={`${node.tech}-${i}`} 
            skill={node.skill} 
            tech={node.tech} 
            position={node.position}
            onSelect={onSelect}
          />
        ))}
        
        {/* Connections */}
        {nodes.map((node, i) => {
          if (i === 0) return null;
          const prev = nodes[i - 1];
          const dist = new THREE.Vector3(...node.position).distanceTo(new THREE.Vector3(...prev.position));
          if (dist > 3) return null;
          
          return (
            <line key={`line-${i}`}>
              <bufferGeometry attach="geometry" {...new THREE.BufferGeometry().setFromPoints([
                new THREE.Vector3(...node.position),
                new THREE.Vector3(...prev.position)
              ])} />
              <lineBasicMaterial attach="material" color="white" transparent opacity={0.1} />
            </line>
          );
        })}
      </group>
      
      <OrbitControls 
        enableZoom={false} 
        enablePan={false}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={Math.PI / 1.5}
      />
      
      <pointLight position={[10, 10, 10]} intensity={1} />
      <ambientLight intensity={0.5} />
    </>
  );
}
