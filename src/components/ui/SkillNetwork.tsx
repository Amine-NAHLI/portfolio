"use client";

import React, { useRef, useMemo, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { 
  OrbitControls, 
  Float, 
  Text, 
  Html, 
  Instances, 
  Instance, 
  Stars,
  PerspectiveCamera,
  ContactShadows
} from "@react-three/drei";
import * as THREE from "three";
import { motion, AnimatePresence } from "framer-motion";

/* ─── Constants ────────────────────────────────────────────────── */

const CATEGORIES = {
  Languages: { color: "#4FC3F7", label: "Languages" },
  Frontend: { color: "#69F0AE", label: "Frontend" },
  Backend: { color: "#FF8A65", label: "Backend" },
  AI_ML: { color: "#CE93D8", label: "AI/ML" },
  Database: { color: "#FFF176", label: "Database" },
  DevOps: { color: "#80DEEA", label: "DevOps" },
};

const SKILLS = [
  // Languages
  { name: "TypeScript", category: "Languages", importance: 1.5 },
  { name: "JavaScript", category: "Languages", importance: 1.3 },
  { name: "Python", category: "Languages", importance: 1.4 },
  { name: "Java", category: "Languages", importance: 1.2 },
  { name: "SQL", category: "Languages", importance: 1.1 },
  { name: "Bash", category: "Languages", importance: 1.0 },
  
  // Frontend
  { name: "React", category: "Frontend", importance: 1.5 },
  { name: "Next.js", category: "Frontend", importance: 1.4 },
  { name: "Tailwind CSS", category: "Frontend", importance: 1.2 },
  { name: "Three.js", category: "Frontend", importance: 1.3 },
  { name: "Framer Motion", category: "Frontend", importance: 1.1 },
  { name: "EJS", category: "Frontend", importance: 0.8 },

  // Backend
  { name: "FastAPI", category: "Backend", importance: 1.3 },
  { name: "Spring Boot", category: "Backend", importance: 1.4 },
  { name: "Node.js", category: "Backend", importance: 1.4 },
  { name: "REST API", category: "Backend", importance: 1.2 },
  { name: "JWT Auth", category: "Backend", importance: 1.1 },
  { name: "Spring Security", category: "Backend", importance: 1.1 },

  // AI/ML
  { name: "OpenCV", category: "AI_ML", importance: 1.3 },
  { name: "PyTorch", category: "AI_ML", importance: 1.2 },
  { name: "MediaPipe", category: "AI_ML", importance: 1.1 },
  { name: "YOLO", category: "AI_ML", importance: 1.4 },

  // Database
  { name: "MongoDB", category: "Database", importance: 1.2 },
  { name: "MySQL", category: "Database", importance: 1.2 },
  { name: "PostgreSQL", category: "Database", importance: 1.3 },

  // DevOps
  { name: "Git", category: "DevOps", importance: 1.3 },
  { name: "CI/CD", category: "DevOps", importance: 1.2 },
  { name: "Docker", category: "DevOps", importance: 1.4 },
];

/* ─── Utility: Generate Positions ─────────────────────────────── */

const generateSkillNodes = () => {
  return SKILLS.map((skill, i) => {
    // Distribute in a spherical cloud
    const phi = Math.acos(-1 + (2 * i) / SKILLS.length);
    const theta = Math.sqrt(SKILLS.length * Math.PI) * phi;
    const radius = 10 + Math.random() * 2;

    return {
      ...skill,
      position: new THREE.Vector3(
        radius * Math.sin(phi) * Math.cos(theta),
        radius * Math.sin(phi) * Math.sin(theta),
        radius * Math.cos(phi)
      ),
      color: CATEGORIES[skill.category as keyof typeof CATEGORIES].color
    };
  });
};

/* ─── Components ─────────────────────────────────────────────── */

const Orb = ({ node, onHover, hoveredNode }: { 
  node: any; 
  onHover: (name: string | null) => void;
  hoveredNode: string | null;
}) => {
  const isHovered = hoveredNode === node.name;
  const meshRef = useRef<THREE.Mesh>(null);

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <group position={node.position}>
        <mesh
          ref={meshRef}
          onPointerOver={(e) => { e.stopPropagation(); onHover(node.name); }}
          onPointerOut={() => onHover(null)}
          scale={isHovered ? 1.5 : 1}
        >
          <sphereGeometry args={[node.importance * 0.4, 32, 32]} />
          <meshStandardMaterial 
            color={node.color} 
            emissive={node.color} 
            emissiveIntensity={isHovered ? 5 : 2} 
            toneMapped={false}
          />
        </mesh>
        
        {/* Glow Ring */}
        <mesh scale={isHovered ? 1.8 : 1.4}>
          <ringGeometry args={[node.importance * 0.42, node.importance * 0.45, 32]} />
          <meshBasicMaterial color={node.color} transparent opacity={0.3} side={THREE.DoubleSide} />
        </mesh>

        <Text
          position={[0, node.importance * 0.8, 0]}
          fontSize={0.5}
          color="white"
          anchorX="center"
          anchorY="middle"
          visible={isHovered}
        >
          {node.name}
        </Text>
      </group>
    </Float>
  );
};

const ConnectionLines = ({ nodes, hoveredNode }: { nodes: any[]; hoveredNode: string | null }) => {
  const lines = useMemo(() => {
    const res: any[] = [];
    nodes.forEach((n1, i) => {
      nodes.slice(i + 1).forEach((n2) => {
        // Connect if same category OR special cross-category relations
        const sameCat = n1.category === n2.category;
        const related = (n1.name === "TypeScript" && n2.name === "React") ||
                        (n1.name === "Python" && n2.name === "FastAPI") ||
                        (n1.name === "Python" && n2.name === "YOLO") ||
                        (n1.name === "SQL" && n2.name === "PostgreSQL");

        if (sameCat || related) {
          res.push({ start: n1.position, end: n2.position, color: n1.color, active: n1.name === hoveredNode || n2.name === hoveredNode });
        }
      });
    });
    return res;
  }, [nodes, hoveredNode]);

  return (
    <group>
      {lines.map((line, i) => (
        <Line 
          key={i} 
          start={line.start} 
          end={line.end} 
          color={line.color} 
          opacity={line.active ? 0.8 : 0.1} 
          width={line.active ? 2 : 1}
        />
      ))}
    </group>
  );
};

const Line = ({ start, end, color, opacity, width }: any) => {
  const ref = useRef<any>(null);
  const points = useMemo(() => [start, end], [start, end]);
  const geometry = useMemo(() => new THREE.BufferGeometry().setFromPoints(points), [points]);

  return (
    <line geometry={geometry}>
      <lineBasicMaterial color={color} transparent opacity={opacity} linewidth={width} />
    </line>
  );
};

const Network = ({ hoveredNode, setHoveredNode }: any) => {
  const groupRef = useRef<THREE.Group>(null);
  const nodes = useMemo(() => generateSkillNodes(), []);

  useFrame((state, delta) => {
    if (groupRef.current && !hoveredNode) {
      groupRef.current.rotation.y += delta * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      <ConnectionLines nodes={nodes} hoveredNode={hoveredNode} />
      {nodes.map((node, i) => (
        <Orb key={i} node={node} onHover={setHoveredNode} hoveredNode={hoveredNode} />
      ))}
    </group>
  );
};

/* ─── Main Component ─────────────────────────────────────────── */

export default function SkillNetwork() {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  return (
    <div className="relative w-full h-[400px] md:h-[600px] bg-[#06080f] rounded-[3rem] overflow-hidden border border-white/5 shadow-2xl">
      <Canvas dpr={[1, 2]} gl={{ antialias: true }}>
        <color attach="background" args={["#06080f"]} />
        <PerspectiveCamera makeDefault position={[0, 0, 25]} fov={50} />
        
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <spotLight position={[-10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />

        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        
        <Network hoveredNode={hoveredNode} setHoveredNode={setHoveredNode} />
        
        <OrbitControls 
          enablePan={false} 
          enableZoom={true} 
          minDistance={15} 
          maxDistance={40}
          autoRotate={false}
          makeDefault
        />
      </Canvas>

      {/* UI Overlay: Legend */}
      <div className="absolute bottom-8 left-8 flex flex-wrap gap-4 pointer-events-none">
        {Object.entries(CATEGORIES).map(([key, cat]) => (
          <div key={key} className="flex items-center gap-2 bg-white/5 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }} />
            <span className="font-mono text-[9px] uppercase tracking-widest text-text-4">{cat.label}</span>
          </div>
        ))}
      </div>

      {/* UI Overlay: Tooltip */}
      <AnimatePresence>
        {hoveredNode && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute top-8 left-1/2 -translate-x-1/2 px-6 py-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl pointer-events-none text-center"
          >
            <p className="text-accent-cyan font-mono text-[10px] uppercase tracking-widest mb-1">
              {SKILLS.find(s => s.name === hoveredNode)?.category.replace('_', '/')}
            </p>
            <h3 className="text-white font-black text-2xl tracking-tighter">{hoveredNode}</h3>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute bottom-8 right-8 pointer-events-none">
         <p className="font-mono text-[8px] uppercase tracking-[0.5em] text-text-4 opacity-50">Drag to Rotate • Scroll to Zoom</p>
      </div>
    </div>
  );
}
