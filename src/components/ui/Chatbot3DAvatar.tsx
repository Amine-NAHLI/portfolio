"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

interface Chatbot3DAvatarProps {
  size?: number;
  className?: string;
  isHovered?: boolean;
  isOpen?: boolean;
  isLoading?: boolean;
}

// Global cache for parsed GLTF scenes & clips so theme switches are instantaneous without refetching
const modelCache = new Map<
  string,
  { scene: THREE.Group; animations: THREE.AnimationClip[] }
>();

export default function Chatbot3DAvatar({
  size = 72,
  className = "",
  isHovered = false,
  isOpen = false,
  isLoading = false,
}: Chatbot3DAvatarProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isHoveredRef = useRef(isHovered);
  const isOpenRef = useRef(isOpen);
  const isLoadingRef = useRef(isLoading);
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof document !== "undefined") {
      return document.documentElement.dataset.theme !== "light";
    }
    return true;
  });

  // Keep state refs synced without re-triggering Three.js recreation
  useEffect(() => {
    isHoveredRef.current = isHovered;
  }, [isHovered]);

  useEffect(() => {
    isOpenRef.current = isOpen;
  }, [isOpen]);

  useEffect(() => {
    isLoadingRef.current = isLoading;
  }, [isLoading]);

  // Track theme changes dynamically
  useEffect(() => {
    if (typeof document === "undefined") return;

    const checkTheme = () => {
      setIsDark(document.documentElement.dataset.theme !== "light");
    };

    checkTheme();

    const observer = new MutationObserver((mutations) => {
      for (const m of mutations) {
        if (m.attributeName === "data-theme") {
          checkTheme();
        }
      }
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    window.addEventListener("portfolio-theme-change", checkTheme);

    return () => {
      observer.disconnect();
      window.removeEventListener("portfolio-theme-change", checkTheme);
    };
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || typeof window === "undefined") return;

    let isDestroyed = false;
    let animationFrameId: number;

    // 1. Scene & Camera setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
    camera.position.set(0, 0, 4.2);

    // 2. WebGL Renderer with full transparency and hardware acceleration
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(size, size);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;

    container.innerHTML = "";
    container.appendChild(renderer.domElement);

    // 3. Studio Lighting Rig (Multi-angle illumination for rich 3D specular depth)
    const ambientLight = new THREE.AmbientLight(0xffffff, isDark ? 1.25 : 1.35);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, isDark ? 2.5 : 2.2);
    dirLight.position.set(3.5, 4.5, 4.0);
    scene.add(dirLight);

    const fillLight = new THREE.DirectionalLight(0xffffff, 0.9);
    fillLight.position.set(-3.5, -1.0, 2.5);
    scene.add(fillLight);

    const topLight = new THREE.DirectionalLight(0xffffff, 1.2);
    topLight.position.set(0, 5, 1);
    scene.add(topLight);

    // Vibrant Rim/Accent PointLight matching active theme
    const accentColor = isDark ? 0xc8f122 : 0x2563eb;
    const rimLight = new THREE.PointLight(accentColor, isDark ? 3.6 : 2.8, 12);
    rimLight.position.set(0, -1.8, 2.0);
    scene.add(rimLight);

    const backRimLight = new THREE.DirectionalLight(accentColor, isDark ? 2.2 : 1.6);
    backRimLight.position.set(-2, 2, -3);
    scene.add(backRimLight);

    // 4. Model Root Group
    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    let mixer: THREE.AnimationMixer | null = null;

    // Model selection based on theme
    const modelUrl = isDark ? "/3D/ai-model-dark.glb" : "/3D/ai-model-claire.glb";

    const setupModel = (originalScene: THREE.Group, animations: THREE.AnimationClip[] = []) => {
      if (isDestroyed) return;

      // Clone from cache so instance transforms are independent
      const model = originalScene.clone(true);

      // Calculate bounding box and center geometry
      const box = new THREE.Box3().setFromObject(model);
      const center = new THREE.Vector3();
      box.getCenter(center);

      const boxSize = new THREE.Vector3();
      box.getSize(boxSize);
      const maxDim = Math.max(boxSize.x, boxSize.y, boxSize.z) || 1;
      const targetScale = 2.65 / maxDim;

      // Pivot group approach for precise centering at (0,0,0) and clean scaling
      const pivot = new THREE.Group();
      model.position.set(-center.x, -center.y, -center.z);
      pivot.scale.set(targetScale, targetScale, targetScale);
      pivot.add(model);

      // Enhance materials: elevate dark body so bevels pop, boost metallic highlights and emissive glows
      model.traverse((child: THREE.Object3D) => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh;
          if (mesh.material) {
            const mat = (mesh.material as THREE.MeshStandardMaterial).clone();
            // In dark mode, if the body color is pitch black (<0.03), lift it slightly to cyber slate so normal bevels reflect lights
            if (isDark && mat.color.r < 0.03 && mat.color.g < 0.03 && mat.color.b < 0.03) {
              mat.color.setRGB(0.12, 0.13, 0.18);
              mat.roughness = 0.22;
              mat.metalness = 0.55;
            } else {
              mat.roughness = Math.max(0.18, (mat.roughness ?? 0.4) * 0.85);
              mat.metalness = Math.min(0.65, (mat.metalness ?? 0.2) + 0.12);
            }
            // Boost emissive glow on neon accents
            if (mat.emissive && (mat.emissive.r > 0.05 || mat.emissive.g > 0.05 || mat.emissive.b > 0.05)) {
              mat.emissiveIntensity = 1.6;
            }
            mesh.material = mat;
          }
        }
      });

      // Clear previous and mount
      rootGroup.clear();
      rootGroup.add(pivot);

      // Setup AnimationMixer if clips exist
      if (animations && animations.length > 0) {
        mixer = new THREE.AnimationMixer(model);
        animations.forEach((clip) => {
          mixer?.clipAction(clip).play();
        });
      }

      // Initial frame paint
      renderer.render(scene, camera);
    };

    if (modelCache.has(modelUrl)) {
      const cached = modelCache.get(modelUrl)!;
      setupModel(cached.scene, cached.animations);
    } else {
      const loader = new GLTFLoader();
      loader.load(
        modelUrl,
        (gltf) => {
          if (isDestroyed) return;
          modelCache.set(modelUrl, {
            scene: gltf.scene,
            animations: gltf.animations,
          });
          setupModel(gltf.scene, gltf.animations);
        },
        undefined,
        (error) => {
          console.error("Erreur de chargement du modèle 3D:", error);
        }
      );
    }

    // 5. Interactive Pointer Tilt
    let targetTiltX = 0.12;
    let targetTiltZ = 0;

    const handlePointerMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      const rect = container.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const dx = (e.clientX - centerX) / window.innerWidth;
      const dy = (e.clientY - centerY) / window.innerHeight;

      targetTiltX = 0.12 + dy * 0.45;
      targetTiltZ = -dx * 0.45;
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });

    // 6. 60/120 FPS Unified Animation Clock
    const clock = new THREE.Clock();

    const animate = () => {
      if (isDestroyed) return;

      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      // Only calculate and render if tab is visible
      if (!document.hidden) {
        if (mixer) {
          mixer.update(delta);
        }

        const isProcessing = isLoadingRef.current;
        const isTerminalOpen = isOpenRef.current;

        // Dynamic rotation speed: accelerates when computing AI response or hovered
        const rotSpeed = isProcessing ? 4.2 : isHoveredRef.current ? 2.6 : isTerminalOpen ? 1.35 : 1.15;
        rootGroup.rotation.y += delta * rotSpeed;

        // Vertical levitation: faster pulse during AI computation
        const floatFreq = isProcessing ? 4.8 : 2.6;
        const floatAmp = isProcessing ? 0.16 : 0.12;
        rootGroup.position.y = Math.sin(time * floatFreq) * floatAmp;

        // Dynamic Rim/Accent Light: surges in brightness during streaming
        const baseRim = isProcessing ? 5.2 : isDark ? 3.6 : 2.8;
        rimLight.intensity = baseRim + Math.sin(time * (isProcessing ? 6.2 : 3.2)) * (isProcessing ? 1.4 : 0.5);

        // When terminal is open above it, mascot looks slightly upwards toward the chat window
        const baseTiltX = isTerminalOpen ? -0.18 : 0.12;
        const currentTiltX = baseTiltX + (targetTiltX - 0.12);
        rootGroup.rotation.x = THREE.MathUtils.lerp(rootGroup.rotation.x, currentTiltX, 0.08);
        rootGroup.rotation.z = THREE.MathUtils.lerp(rootGroup.rotation.z, targetTiltZ, 0.08);

        // Hover & state scale bounce
        const targetScale = isHoveredRef.current ? 1.08 : isTerminalOpen ? 0.94 : 1.0;
        rootGroup.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.12);

        renderer.render(scene, camera);
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      isDestroyed = true;
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("pointermove", handlePointerMove);
      renderer.dispose();
      scene.clear();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [isDark, size]);

  return (
    <div
      ref={containerRef}
      style={{ width: size, height: size }}
      className={`relative shrink-0 flex items-center justify-center overflow-visible pointer-events-none ${className}`}
      aria-hidden="true"
    />
  );
}
