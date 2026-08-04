"use client";

import { useEffect, useRef } from "react";

class Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  life: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    // Larger size for a soft cloud effect
    this.size = Math.random() * 25 + 20;
    // Slower drift
    this.speedX = Math.random() * 1.5 - 0.75;
    this.speedY = Math.random() * 1.5 - 0.75;
    this.life = 1;
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    // Smoke expands as it ages
    this.size += 0.3;
    // Fade out
    this.life -= 0.012;
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (this.life <= 0) return;

    // Create a soft radial gradient to simulate a glowing cloud/smoke
    const gradient = ctx.createRadialGradient(
      this.x, this.y, 0,
      this.x, this.y, this.size
    );
    
    // Accent color: #3b82f6 or #38bdf8 (light blue/cyan)
    gradient.addColorStop(0, `rgba(56, 189, 248, ${this.life * 0.4})`);
    gradient.addColorStop(0.5, `rgba(56, 189, 248, ${this.life * 0.1})`);
    gradient.addColorStop(1, `rgba(56, 189, 248, 0)`);
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

export default function MouseTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const particlesArray: Particle[] = [];
    const mouse = { x: -100, y: -100 };
    let animationFrameId: number;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const updateMousePos = (clientX: number, clientY: number) => {
      mouse.x = clientX;
      mouse.y = clientY;
      for (let i = 0; i < 2; i++) {
        particlesArray.push(new Particle(mouse.x, mouse.y));
      }
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
        particlesArray[i].draw(ctx);
        
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

  return (
    <canvas 
      ref={canvasRef} 
      className="pointer-events-none fixed inset-0 z-40 mix-blend-screen opacity-100"
    />
  );
}
