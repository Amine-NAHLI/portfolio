"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

class Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  life: number;
  isDust: boolean;

  constructor(x: number, y: number, velocityX: number, velocityY: number, isDust: boolean) {
    this.x = x;
    this.y = y;
    this.isDust = isDust;
    
    if (isDust) {
      // Small dust particles
      this.size = Math.random() * 3 + 1;
      // High velocity based on mouse movement
      this.speedX = velocityX * (Math.random() * 0.4 + 0.1) + (Math.random() * 4 - 2);
      this.speedY = velocityY * (Math.random() * 0.4 + 0.1) + (Math.random() * 4 - 2);
      this.life = Math.random() * 0.5 + 0.5; // Shorter life
    } else {
      // Large cloud blob
      this.size = Math.random() * 30 + 30; 
      // Very slow drift
      this.speedX = Math.random() * 0.5 - 0.25;
      this.speedY = Math.random() * 0.5 - 0.25;
      this.life = 1;
    }
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    
    if (this.isDust) {
      // Dust slows down (friction)
      this.speedX *= 0.95;
      this.speedY *= 0.95;
      this.life -= 0.02;
    } else {
      // Cloud expands
      this.size += 0.5; 
      this.life -= 0.015;
    }
  }

  draw(ctx: CanvasRenderingContext2D, isDark: boolean) {
    if (this.life <= 0) return;

    if (this.isDust) {
      // Draw sharp dust particle
      ctx.fillStyle = isDark ? `rgba(255, 255, 255, ${this.life})` : `rgba(2, 132, 199, ${this.life})`;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    } else {
      // Draw soft cloud blob
      const gradient = ctx.createRadialGradient(
        this.x, this.y, 0,
        this.x, this.y, this.size
      );
      
      if (isDark) {
        gradient.addColorStop(0, `rgba(56, 189, 248, ${this.life * 0.15})`);
        gradient.addColorStop(0.5, `rgba(56, 189, 248, ${this.life * 0.05})`);
        gradient.addColorStop(1, `rgba(56, 189, 248, 0)`);
      } else {
        gradient.addColorStop(0, `rgba(2, 132, 199, ${this.life * 0.15})`);
        gradient.addColorStop(0.5, `rgba(2, 132, 199, ${this.life * 0.05})`);
        gradient.addColorStop(1, `rgba(2, 132, 199, 0)`);
      }
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

export default function MouseTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDark, setIsDark] = useState(true);
  
  const isDarkRef = useRef(isDark);
  useEffect(() => {
    isDarkRef.current = isDark;
  }, [isDark]);

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

    const particlesArray: Particle[] = [];
    const lastMouse = { x: -100, y: -100 };
    let animationFrameId: number;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const updateMousePos = (clientX: number, clientY: number) => {
      if (lastMouse.x === -100) {
        lastMouse.x = clientX;
        lastMouse.y = clientY;
      }

      const dx = clientX - lastMouse.x;
      const dy = clientY - lastMouse.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      // Spawn cloud blobs continuously
      const steps = Math.max(1, Math.floor(distance / 15));
      for (let i = 0; i < steps; i++) {
        const x = lastMouse.x + (dx * i) / steps;
        const y = lastMouse.y + (dy * i) / steps;
        particlesArray.push(new Particle(x, y, 0, 0, false));
      }

      // Spawn dust if moving fast
      if (distance > 5) {
        const dustCount = Math.min(10, Math.floor(distance / 5));
        for (let i = 0; i < dustCount; i++) {
          particlesArray.push(new Particle(clientX, clientY, dx * 0.1, dy * 0.1, true));
        }
      }

      lastMouse.x = clientX;
      lastMouse.y = clientY;
    };

    const handleMouseMove = (e: MouseEvent) => {
      updateMousePos(e.clientX, e.clientY);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        updateMousePos(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove", handleTouchMove, { passive: true });

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw(ctx, isDarkRef.current);
        
        if (particlesArray[i].life <= 0) {
          particlesArray.splice(i, 1);
          i--;
        }
      }
      animationFrameId = requestAnimationFrame(animate);
    };
    
    animate();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // Use blur(12px) for cloud melting, but not too high so dust remains slightly visible
  return (
    <canvas 
      ref={canvasRef} 
      className={cn(
        "pointer-events-none fixed inset-0 z-40 opacity-100 blur-[12px] transition-colors duration-500",
        isDark ? "mix-blend-screen" : "mix-blend-multiply"
      )}
    />
  );
}
