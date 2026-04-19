"use client";

import { motion } from "framer-motion";
import { Circle } from "lucide-react";
import { ElegantShape } from "./ElegantShape";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

interface HeroGeometricProps {
  badge?: string;
  title1?: string;
  title2?: string;
  subtitle?: string;
  ctaLabel?: string;
  ctaHref?: string;
  ghostLabel?: string;
  ghostHref?: string;
}

function HeroGeometric({
  badge = "Estética Facial Premium · IMP 15.493",
  title1 = "La belleza que ya",
  title2 = "tenés.",
  subtitle = "Tratamientos de precisión diseñados para resaltar tus rasgos naturales. Sin cirugías. Sin sobreactuación.",
  ctaLabel = "Reservar turno",
  ctaHref = "https://wa.me/541173608299",
  ghostLabel = "Ver tratamientos",
  ghostHref = "#tratamientos",
}: HeroGeometricProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 1,
        delay: 0.5 + i * 0.2,
        ease: [0.25, 0.4, 0.25, 1],
      },
    }),
  };

  useGSAP(() => {
    // Sutil efecto de parallax en el contenido principal
    gsap.to(".hero-content", {
      y: 100,
      ease: "none",
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
    });
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-brand-black">
      {/* Warm glow background */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-gold/[0.05] via-transparent to-brand-gold/[0.05] blur-3xl" />

      {/* Animated geometric shapes with varying parallax speeds */}
      <div className="absolute inset-0 overflow-hidden">
        <ElegantShape
          delay={0.3}
          width={600}
          height={140}
          rotate={12}
          gradient="from-brand-gold/[0.15]"
          className="left-[-10%] md:left-[-5%] top-[15%] md:top-[20%]"
          parallaxSpeed={1.8}
        />
        <ElegantShape
          delay={0.5}
          width={500}
          height={120}
          rotate={-15}
          gradient="from-amber-600/[0.15]"
          className="right-[-5%] md:right-[0%] top-[70%] md:top-[75%]"
          parallaxSpeed={-1.5}
        />
        <ElegantShape
          delay={0.4}
          width={300}
          height={80}
          rotate={-8}
          gradient="from-brand-gold/[0.15]"
          className="left-[5%] md:left-[10%] bottom-[5%] md:bottom-[10%]"
          parallaxSpeed={1.2}
        />
        <ElegantShape
          delay={0.6}
          width={200}
          height={60}
          rotate={20}
          gradient="from-amber-500/[0.15]"
          className="right-[15%] md:right-[20%] top-[10%] md:top-[15%]"
          parallaxSpeed={2.5}
        />
        <ElegantShape
          delay={0.7}
          width={150}
          height={40}
          rotate={-25}
          gradient="from-brand-gold/[0.15]"
          className="left-[20%] md:left-[25%] top-[5%] md:top-[10%]"
          parallaxSpeed={-2.2}
        />
      </div>

      {/* Content */}
      <div className="hero-content relative z-10 container mx-auto px-4 md:px-6">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            custom={0}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.08] mb-8 md:mb-12"
          >
            <Circle className="h-2 w-2 fill-brand-gold/80" />
            <span className="text-xs text-brand-cream/60 tracking-widest font-body uppercase">
              {badge}
            </span>
          </motion.div>

          {/* Title */}
          <motion.div
            custom={1}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
          >
            <h1 className="font-heading text-5xl sm:text-7xl md:text-8xl font-bold mb-6 md:mb-10 tracking-tight leading-[0.95]">
              <span className="bg-clip-text text-transparent bg-gradient-to-b from-white to-white/75">
                {title1}
              </span>
              <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-gold via-brand-gold-light to-brand-gold">
                {title2}
              </span>
            </h1>
          </motion.div>

          {/* Subtitle */}
          <motion.div
            custom={2}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
          >
            <p className="font-body text-base sm:text-lg text-brand-cream/60 mb-10 leading-relaxed font-light tracking-wide max-w-xl mx-auto px-4">
              {subtitle}
            </p>
          </motion.div>

          {/* Actions */}
          <motion.div
            custom={3}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="flex items-center justify-center gap-4 flex-wrap"
          >
            <a
              href={ctaHref}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center px-8 py-4 bg-brand-gold text-brand-black font-body text-xs font-bold tracking-widest uppercase rounded-sm hover:bg-brand-gold-light transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(201,169,110,0.3)]"
            >
              {ctaLabel}
            </a>
            <a
              href={ghostHref}
              className="inline-flex items-center px-8 py-4 font-body text-xs font-bold tracking-widest uppercase text-brand-cream/70 border border-brand-cream/[0.2] rounded-sm hover:border-brand-gold hover:text-brand-gold transition-all duration-300"
            >
              {ghostLabel}
            </a>
          </motion.div>
        </div>
      </div>

      {/* Bottom fade vignette */}
      <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-transparent to-brand-black/80 pointer-events-none" />
    </div>
  );
}

export { HeroGeometric };
