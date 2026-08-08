"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";

const CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()_+ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ";
const FONT_SIZE = 16;
const GLITCH_DURATION_MS = 500; // Duration of the glitch effect

export default function ThemeGlitch() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isGlitching, setIsGlitching] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const isFirstRender = useRef(true);
  const pathname = usePathname();

  useEffect(() => {
    // Initial check
    const currentThemeIsDark = document.documentElement.dataset.theme !== "light";
    setIsDark(currentThemeIsDark);
    
    // Watch for theme changes
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.attributeName === "data-theme") {
          const newThemeIsDark = document.documentElement.dataset.theme !== "light";
          setIsDark(newThemeIsDark);
          
          if (!isFirstRender.current) {
            setIsGlitching(true);
            setTimeout(() => {
              setIsGlitching(false);
            }, GLITCH_DURATION_MS);
          }
        }
      }
    });
    
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    
    setTimeout(() => {
      isFirstRender.current = false;
    }, 500); // Ignore initial theme setting
    
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isGlitching) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let columns = Math.ceil(window.innerWidth / FONT_SIZE);
    let rows = Math.ceil(window.innerHeight / FONT_SIZE);
    
    let grid = Array.from({ length: columns }, () => 
      Array.from({ length: rows }, () => 
        CHARACTERS.charAt(Math.floor(Math.random() * CHARACTERS.length))
      )
    );
    
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      columns = Math.ceil(window.innerWidth / FONT_SIZE);
      rows = Math.ceil(window.innerHeight / FONT_SIZE);
      grid = Array.from({ length: columns }, () => 
        Array.from({ length: rows }, () => 
          CHARACTERS.charAt(Math.floor(Math.random() * CHARACTERS.length))
        )
      );
    };

    resize();
    window.addEventListener("resize", resize);

    let animationFrameId: number;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Update a lot of random characters to create an intense glitch effect
      for (let i = 0; i < (columns * rows) / 4; i++) {
        const randCol = Math.floor(Math.random() * columns);
        const randRow = Math.floor(Math.random() * rows);
        if (grid[randCol]) {
          grid[randCol][randRow] = CHARACTERS.charAt(Math.floor(Math.random() * CHARACTERS.length));
        }
      }

      ctx.font = `bold ${FONT_SIZE}px monospace`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      // Use the target theme's colors
      const r = isDark ? 56 : 2;
      const g = isDark ? 189 : 132;
      const b = isDark ? 248 : 199;

      for (let i = 0; i < columns; i++) {
        for (let j = 0; j < rows; j++) {
          const charX = i * FONT_SIZE + FONT_SIZE / 2;
          const charY = j * FONT_SIZE + FONT_SIZE / 2;
          
          // Random opacity per character for a glitchy static look
          const opacity = Math.random() * 0.8 + 0.2;
          
          // Add some random offsets (chromatic aberration-like glitching)
          const offsetX = Math.random() < 0.1 ? (Math.random() - 0.5) * 10 : 0;
          
          ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${opacity})`;
          ctx.fillText(grid[i][j], charX + offsetX, charY);
        }
      }
      
      animationFrameId = requestAnimationFrame(animate);
    };
    
    animate();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isGlitching, isDark, pathname]);

  return (
    <AnimatePresence>
      {isGlitching && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-[100000] pointer-events-none"
        >
          {/* Glitch overlay backgrounds */}
          <div className="absolute inset-0 bg-[url('/noise.png')] opacity-30 mix-blend-overlay" />
          
          {/* Canvas for the hacker code, lighter opacity so the page is still visible */}
          <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-60 mix-blend-difference" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
