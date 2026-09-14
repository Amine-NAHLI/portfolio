"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

const CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()_+ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ";
const FONT_SIZE = 14;
const RADIUS = 80;

export default function HackerTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDark, setIsDark] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    setIsDark(document.documentElement.dataset.theme !== "light");
    
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.attributeName === "data-theme") {
          setIsDark(document.documentElement.dataset.theme !== "light");
        }
      }
    });
    
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    // Disable on touch devices to save battery & performance
    if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let columns = 0;
    let rows = 0;
    let grid: string[][] = [];
    
    const mouse = { x: -1000, y: -1000, active: false };
    let animationFrameId: number;

    const initGrid = () => {
      columns = Math.ceil(window.innerWidth / FONT_SIZE);
      rows = Math.ceil(window.innerHeight / FONT_SIZE);
      grid = Array.from({ length: columns }, () => 
        Array.from({ length: rows }, () => 
          CHARACTERS.charAt(Math.floor(Math.random() * CHARACTERS.length))
        )
      );
    };

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initGrid();
    };

    resize();
    window.addEventListener("resize", resize, { passive: true });

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;
    };

    const handleMouseLeave = () => {
      mouse.active = false;
      mouse.x = -1000;
      mouse.y = -1000;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave, { passive: true });

    const animate = () => {
      if (mouse.active && mouse.x > 0 && mouse.y > 0) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.font = `bold ${FONT_SIZE}px monospace`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        const r = isDark ? 59 : 2;
        const g = isDark ? 130 : 132;
        const b = isDark ? 246 : 199;

        const startCol = Math.max(0, Math.floor((mouse.x - RADIUS) / FONT_SIZE));
        const endCol = Math.min(columns - 1, Math.ceil((mouse.x + RADIUS) / FONT_SIZE));
        const startRow = Math.max(0, Math.floor((mouse.y - RADIUS) / FONT_SIZE));
        const endRow = Math.min(rows - 1, Math.ceil((mouse.y + RADIUS) / FONT_SIZE));

        for (let i = startCol; i <= endCol; i++) {
          for (let j = startRow; j <= endRow; j++) {
            const charX = i * FONT_SIZE + FONT_SIZE / 2;
            const charY = j * FONT_SIZE + FONT_SIZE / 2;
            
            const dx = charX - mouse.x;
            const dy = charY - mouse.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < RADIUS) {
              if (Math.random() < 0.15) {
                grid[i][j] = CHARACTERS.charAt(Math.floor(Math.random() * CHARACTERS.length));
              }

              const opacity = Math.pow(1 - (distance / RADIUS), 1.5);
              ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${opacity})`;
              ctx.fillText(grid[i][j], charX, charY);
            }
          }
        }
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
      
      animationFrameId = requestAnimationFrame(animate);
    };
    
    animate();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isDark, pathname]);

  return (
    <canvas 
      ref={canvasRef} 
      className="pointer-events-none fixed inset-0 z-40 opacity-100 transition-colors duration-500 hidden sm:block"
      style={{ mixBlendMode: isDark ? "screen" : "multiply" }}
    />
  );
}
