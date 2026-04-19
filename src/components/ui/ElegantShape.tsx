"use client";

import { motion } from "framer-motion";
import { cn } from "../../lib/utils";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

// Registrar ScrollTrigger
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

interface ElegantShapeProps {
  className?: string;
  delay?: number;
  width?: number;
  height?: number;
  rotate?: number;
  gradient?: string;
  parallaxSpeed?: number; // Nueva prop para controlar el efecto de scroll
}

export function ElegantShape({
  className,
  delay = 0,
  width = 400,
  height = 100,
  rotate = 0,
  gradient = "from-white/[0.08]",
  parallaxSpeed = 0, // 0 significa sin parallax, valores positivos/negativos para dirección
}: ElegantShapeProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (parallaxSpeed === 0) return;

    gsap.to(containerRef.current, {
      y: parallaxSpeed * 100,
      ease: "none",
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    });
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className={cn("absolute", className)}>
      <motion.div
        initial={{ opacity: 0, y: -150, rotate: rotate - 15 }}
        animate={{ opacity: 1, y: 0, rotate }}
        transition={{
          duration: 2.4,
          delay,
          ease: [0.23, 0.86, 0.39, 0.96],
          opacity: { duration: 1.2 },
        }}
      >
        <motion.div
          animate={{ y: [0, 15, 0] }}
          transition={{
            duration: 12,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
          style={{ width, height }}
          className="relative"
        >
          <div
            className={cn(
              "absolute inset-0 rounded-full",
              "bg-gradient-to-r to-transparent",
              gradient,
              "backdrop-blur-[2px] border border-brand-gold/[0.15]",
              "shadow-[0_8px_32px_0_rgba(201,169,110,0.06)]",
              "after:absolute after:inset-0 after:rounded-full",
              "after:bg-[radial-gradient(circle_at_50%_50%,rgba(201,169,110,0.1),transparent_70%)]"
            )}
          />
        </motion.div>
      </motion.div>
    </div>
  );
}
