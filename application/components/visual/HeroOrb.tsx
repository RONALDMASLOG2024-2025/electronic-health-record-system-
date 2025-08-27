"use client";
// @ts-expect-error: framer-motion types unavailable in current setup
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

/**
 * HeroOrb renders layered animated gradient circles for the hero backdrop.
 * Purely decorative (aria-hidden) and positioned absolutely by parent.
 */
export function HeroOrb({ disabledOnReducedMotion = true }: { disabledOnReducedMotion?: boolean }) {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handler = () => setReduced(mq.matches);
    handler();
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);
  const animate = !(reduced && disabledOnReducedMotion);
  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      <motion.div
        aria-hidden
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[105vmin] h-[105vmin] rounded-full bg-gradient-to-br from-sky-200 via-white to-cyan-100 blur-3xl opacity-70"
        initial={{ scale: 0.95, opacity: 0.45 }}
        animate={animate ? { scale: 1.05, opacity: 0.65 } : {}}
        transition={animate ? { duration: 10, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" } : undefined}
      />
      <motion.div
        aria-hidden
        className="absolute left-[55%] top-[42%] -translate-x-1/2 -translate-y-1/2 w-[68vmin] h-[68vmin] rounded-full bg-gradient-to-tr from-cyan-100/80 via-white/50 to-sky-200/80 backdrop-blur-xl ring-1 ring-sky-300/30"
        initial={{ rotate: 0 }}
        animate={animate ? { rotate: 360 } : { rotate: 0 }}
        transition={animate ? { duration: 70, repeat: Infinity, ease: "linear" } : undefined}
        style={{ mixBlendMode: "plus-lighter" }}
      />
      <motion.div
        aria-hidden
        className="absolute left-[48%] top-[50%] -translate-x-1/2 -translate-y-1/2 w-[34vmin] h-[34vmin] rounded-full bg-gradient-to-b from-sky-400/40 to-cyan-300/10 ring-2 ring-white/40 shadow-2xl shadow-sky-200/60"
        initial={{ scale: 0.85, opacity: 0.55 }}
        animate={animate ? { scale: 1, opacity: 0.85 } : {}}
        transition={animate ? { duration: 12, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" } : undefined}
        style={{ mixBlendMode: "overlay" }}
      />
    </div>
  );
}
