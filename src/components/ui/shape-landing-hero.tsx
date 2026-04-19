"use client";

import { motion } from "framer-motion";
import { Circle } from "lucide-react";
import { cn } from "../../lib/utils";

// ─── Tipos ───────────────────────────────────────────────────────────────────

interface ElegantShapeProps {
  className?: string;
  delay?: number;
  width?: number;
  height?: number;
  rotate?: number;
  gradient?: string;
}

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

// ─── ElegantShape ─────────────────────────────────────────────────────────────

function ElegantShape({
  className,
  delay = 0,
  width = 400,
  height = 100,
  rotate = 0,
  gradient = "from-white/[0.08]",
}: ElegantShapeProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -150, rotate: rotate - 15 }}
      animate={{ opacity: 1, y: 0, rotate }}
      transition={{
        duration: 2.4,
        delay,
        ease: [0.23, 0.86, 0.39, 0.96],
        opacity: { duration: 1.2 },
      }}
      className={cn("absolute", className)}
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
            "backdrop-blur-[2px] border border-brand-gold/[0.2]",
            "shadow-[0_8px_32px_0_rgba(201,169,110,0.08)]",
            "after:absolute after:inset-0 after:rounded-full",
            "after:bg-[radial-gradient(circle_at_50%_50%,rgba(201,169,110,0.15),transparent_70%)]"
          )}
        />
      </motion.div>
    </motion.div>
  );
}

// ─── HeroGeometric ────────────────────────────────────────────────────────────

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
  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 1,
        delay: 0.5 + i * 0.2,
        ease: [0.25, 0.4, 0.25, 1] as [number, number, number, number],
      },
    }),
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-brand-black">

      {/* Warm glow background */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-gold/[0.04] via-transparent to-brand-gold/[0.02] blur-3xl" />

      {/* Animated geometric shapes — all in gold tones */}
      <div className="absolute inset-0 overflow-hidden">
        <ElegantShape
          delay={0.3} width={600} height={140} rotate={12}
          gradient="from-brand-gold/[0.12]"
          className="left-[-10%] md:left-[-4%] top-[15%] md:top-[18%]"
        />
        <ElegantShape
          delay={0.5} width={480} height={110} rotate={-15}
          gradient="from-amber-600/[0.1]"
          className="right-[-5%] md:right-[1%] top-[68%] md:top-[73%]"
        />
        <ElegantShape
          delay={0.4} width={310} height={75} rotate={-8}
          gradient="from-yellow-800/[0.1]"
          className="left-[4%] md:left-[8%] bottom-[6%] md:bottom-[10%]"
        />
        <ElegantShape
          delay={0.6} width={200} height={55} rotate={20}
          gradient="from-brand-gold/[0.1]"
          className="right-[14%] md:right-[18%] top-[8%] md:top-[13%]"
        />
        <ElegantShape
          delay={0.7} width={140} height={38} rotate={-25}
          gradient="from-amber-500/[0.08]"
          className="left-[20%] md:left-[24%] top-[5%] md:top-[9%]"
        />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 md:px-6">
        <div className="max-w-4xl mx-auto text-center pt-28 md:pt-40">

          {/* Badge */}
          <motion.div
            custom={0} variants={fadeUp} initial="hidden" animate="visible"
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-gold/[0.06] border border-brand-gold/[0.15] mb-8 md:mb-12"
          >
            <Circle className="h-2 w-2 fill-brand-gold/80 text-brand-gold/80" />
            <span className="text-xs text-brand-cream/60 tracking-widest font-body uppercase">
              {badge}
            </span>
          </motion.div>

          {/* Title */}
          <motion.div custom={1} variants={fadeUp} initial="hidden" animate="visible">
            <h1 className="font-heading text-5xl sm:text-7xl md:text-8xl font-light mb-6 md:mb-10 tracking-tight leading-[0.95]">
              <span className="bg-clip-text text-transparent bg-gradient-to-b from-brand-cream to-brand-cream/75">
                {title1}
              </span>
              <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-gold via-brand-gold-light to-brand-gold italic">
                {title2}
              </span>
            </h1>
          </motion.div>

          {/* Subtitle */}
          <motion.div custom={2} variants={fadeUp} initial="hidden" animate="visible">
            <p className="font-body text-base sm:text-lg text-brand-cream/60 mb-10 leading-relaxed font-light tracking-wide max-w-xl mx-auto px-4">
              {subtitle}
            </p>
          </motion.div>

          {/* Actions */}
          <motion.div
            custom={3} variants={fadeUp} initial="hidden" animate="visible"
            className="flex items-center justify-center gap-4 flex-wrap"
          >
            <a
              href={ctaHref}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center px-7 py-3.5 bg-brand-gold text-brand-black font-body text-xs font-bold tracking-widest uppercase rounded-sm hover:bg-brand-gold-light transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(201,169,110,0.3)]"
            >
              {ctaLabel}
            </a>
            <a
              href={ghostHref}
              className="inline-flex items-center px-7 py-3.5 font-body text-xs font-bold tracking-widest uppercase text-brand-cream/70 border border-brand-cream/[0.2] rounded-sm hover:border-brand-gold hover:text-brand-gold transition-all duration-300"
            >
              {ghostLabel}
            </a>
          </motion.div>

          {/* Stats bar */}
          <motion.div
            custom={4} variants={fadeUp} initial="hidden" animate="visible"
            className="flex items-center justify-center gap-8 mt-16 pt-8 border-t border-brand-gold/[0.15]"
          >
            {[
              { num: '+500', label: 'Pacientes' },
              { num: '6',    label: 'Tratamientos' },
              { num: '2',    label: 'Consultorios' },
            ].map((s, i) => (
              <div key={i} className="text-center">
                <p className="font-heading text-3xl font-light text-brand-gold leading-none">{s.num}</p>
                <p className="font-body text-[0.6rem] font-medium tracking-[0.2em] uppercase text-brand-cream/40 mt-1">{s.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Top/bottom fade vignette */}
      <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-transparent to-brand-black/80 pointer-events-none" />
    </div>
  );
}

export { HeroGeometric, ElegantShape };
