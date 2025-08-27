"use client";
/** Simple animated particle background (lightweight, no external deps). */
import { useEffect, useRef } from "react";

interface Particle { x: number; y: number; r: number; vx: number; vy: number; o: number; }

export function Particles({
  density = 55,
  color = "#0ea5e9",
  className = "",
  opacity = 0.6,
  disableWhenReducedMotion = true,
}: { density?: number; color?: string; className?: string; opacity?: number; disableWhenReducedMotion?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particles = useRef<Particle[]>([]);
  const animation = useRef<number | null>(null);

  useEffect(() => {
  const canvas = canvasRef.current;
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced && disableWhenReducedMotion) return; // respect user setting

  const DPR = window.devicePixelRatio || 1;
    function resize() {
      if (!canvas || !ctx) return;
      canvas.width = window.innerWidth * DPR;
      canvas.height = window.innerHeight * DPR;
      canvas.style.width = window.innerWidth + "px";
      canvas.style.height = window.innerHeight + "px";
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(DPR, DPR);
    }
    resize();
    window.addEventListener("resize", resize);

    // Initialize particles
  particles.current = Array.from({ length: density }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: 1 + Math.random() * 2.2,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      o: 0.2 + Math.random() * 0.5,
    }));

  function step() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      ctx.save();
      for (const p of particles.current) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < -50) p.x = window.innerWidth + 50; else if (p.x > window.innerWidth + 50) p.x = -50;
        if (p.y < -50) p.y = window.innerHeight + 50; else if (p.y > window.innerHeight + 50) p.y = -50;
        ctx.beginPath();
        ctx.globalAlpha = p.o;
  ctx.fillStyle = color;
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
      animation.current = requestAnimationFrame(step);
    }
    step();
    return () => {
      window.removeEventListener("resize", resize);
    if (animation.current) cancelAnimationFrame(animation.current);
    };
  }, [density, color, disableWhenReducedMotion]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={`pointer-events-none fixed inset-0 z-0 opacity-${Math.round(
        opacity * 100
      )} [mask-image:radial-gradient(circle_at_center,white,transparent)] ${className}`}
    />
  );
}
