"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

const CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()_+ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ";
const FONT_SIZE = 14;
const RADIUS = 90; // Size of the hacker circle

export default function HackerTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDark, setIsDark] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    // Initial check
    setIsDark(document.documentElement.dataset.theme !== "light");
    
    // Watch for theme changes
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
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let columns = 0;
    let rows = 0;
    let grid: string[][] = [];
    
    const mouse = { x: -1000, y: -1000 };
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
    window.addEventListener("resize", resize);

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        mouse.x = e.touches[0].clientX;
        mouse.y = e.touches[0].clientY - 40; // Offset for finger
      }
    };

    const handleTouchEnd = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("touchstart", handleTouchMove, { passive: true });
    window.addEventListener("touchend", handleTouchEnd);
    window.addEventListener("touchcancel", handleTouchEnd);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      


      ctx.font = `bold ${FONT_SIZE}px monospace`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      const r = isDark ? 0 : 2;
      const g = isDark ? 255 : 132;
      const b = isDark ? 65 : 199;

      // Only loop through the grid cells that are near the mouse
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
            // Rapidly animate characters that are currently visible
            if (Math.random() < 0.15) { // 15% chance to change each frame
              grid[i][j] = CHARACTERS.charAt(Math.floor(Math.random() * CHARACTERS.length));
            }

            // Fade out towards the edges of the circle
            const opacity = Math.pow(1 - (distance / RADIUS), 1.5);
            ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${opacity})`;
            ctx.fillText(grid[i][j], charX, charY);
          }
        }
      }
      
      animationFrameId = requestAnimationFrame(animate);
    };
    
    animate();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchstart", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
      window.removeEventListener("touchcancel", handleTouchEnd);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isDark, pathname]);

  return (
    <canvas 
      ref={canvasRef} 
      className="pointer-events-none fixed inset-0 z-40 opacity-100 transition-colors duration-500"
      style={{ mixBlendMode: isDark ? "screen" : "multiply" }}
    />
  );
}
