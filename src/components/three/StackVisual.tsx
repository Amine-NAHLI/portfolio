"use client";

import React, { useRef, useMemo, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Float, OrbitControls, Text } from "@react-three/drei";
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
        <group position={[0, size + 0.4, 0]}>
          <Text
            fontSize={0.25}
            color="white"
            anchorX="center"
            anchorY="bottom"
          >
            {tech}
          </Text>
          <Text
            position={[0, -0.3, 0]}
            fontSize={0.18}
            color={color}
            anchorX="center"
            anchorY="bottom"
          >
            {skill.category}
          </Text>
        </group>
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
    const phi = Math.PI * (3 - Math.sqrt(5));

    return allTechs.map((node, i) => {
      const y = 1 - (i / (count - 1)) * 2;
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

  useFrame(() => {
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