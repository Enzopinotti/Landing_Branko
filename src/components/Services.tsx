"use client";

import { motion } from "framer-motion";
import { ElegantShape } from "./ui/ElegantShape";
import styles from './Services.module.scss';
import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const SERVICES = [
  {
    id: 'botox',
    icon: '✦',
    title: 'Botox',
    subtitle: 'Toxina Botulínica',
    desc: 'Relajación muscular de precisión para suavizar expresiones sin perder naturalidad. Resultado visible en 72 hs.',
    tag: 'Más solicitado',
  },
  {
    id: 'plasma',
    icon: '◈',
    title: 'Plasma Rico en Plaquetas',
    subtitle: 'PRP Facial',
    desc: 'Regeneración celular usando tu propia sangre para mejorar textura, luminosidad e hidratación profunda.',
    tag: null,
  },
  {
    id: 'hialuronico',
    icon: '◉',
    title: 'Ácido Hialurónico',
    subtitle: 'Relleno & Volumen',
    desc: 'Definición de labios, pómulos y mentón con técnicas avanzadas de sobreproyección y armonización.',
    tag: 'Popular',
  },
  {
    id: 'bioestimulacion',
    icon: '❋',
    title: 'Bioestimulación',
    subtitle: 'Rejuvenecimiento Dérmico',
    desc: 'Estimulación del colágeno natural para una piel más firme, elástica y con efecto lifting progresivo.',
    tag: null,
  },
  {
    id: 'peeling',
    icon: '◇',
    title: 'Peeling Químico',
    subtitle: 'Renovación Celular',
    desc: 'Exfoliación controlada de capas superficiales para eliminar manchas, cicatrices y piel opaca.',
    tag: null,
  },
  {
    id: 'limpieza',
    icon: '○',
    title: 'Limpieza Facial',
    subtitle: 'Tratamiento Base',
    desc: 'Protocolo de limpieza profunda adaptado a tu tipo de piel. El primero paso para cualquier tratamiento.',
    tag: null,
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 1,
      delay: 0.1 + i * 0.1,
      ease: [0.25, 0.4, 0.25, 1],
    },
  }),
};

export default function Services() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    // Animación de entrada de las cards sincronizada con el scroll
    gsap.from(".service-card", {
      opacity: 0,
      y: 100,
      stagger: 0.1,
      duration: 1.2,
      ease: "power4.out",
      scrollTrigger: {
        trigger: ".services-grid",
        start: "top 85%",
      }
    });
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className={styles.section} id="tratamientos">
      {/* Background elements to "hook" with Hero */}
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-brand-black to-transparent pointer-events-none z-0" />
      
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <ElegantShape
          delay={0.2}
          width={400}
          height={100}
          rotate={-10}
          gradient="from-brand-gold/[0.08]"
          className="left-[5%] top-[10%]"
          parallaxSpeed={0.8}
        />
        <ElegantShape
          delay={0.4}
          width={300}
          height={80}
          rotate={15}
          gradient="from-brand-gold/[0.05]"
          className="right-[10%] bottom-[20%]"
          parallaxSpeed={-1.2}
        />
      </div>

      <div className="container relative z-10">
        {/* Header */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className={styles.header}
        >
          <motion.span custom={0} variants={fadeUp} className={styles.label}>
            <span className={styles.labelLine} />
            Tratamientos
          </motion.span>
          <motion.h2 custom={1} variants={fadeUp} className={styles.title}>
            Cada rostro,<br />
            <em>su protocolo.</em>
          </motion.h2>
          <motion.p custom={2} variants={fadeUp} className={styles.desc}>
            Todos los tratamientos son personalizados en consulta previa.
            Sin paquetes estándar. Sin promesas vacías.
          </motion.p>
        </motion.div>

        {/* Grid */}
        <div className={`${styles.grid} services-grid`}>
          {SERVICES.map((s, i) => (
            <article 
              key={s.id} 
              className={`${styles.card} service-card`}
              style={{ '--delay': `${i * 0.07}s` } as React.CSSProperties}
            >
              {s.tag && <span className={styles.cardTag}>{s.tag}</span>}
              <div className={styles.cardIcon}>{s.icon}</div>
              <h3 className={styles.cardTitle}>{s.title}</h3>
              <p className={styles.cardSub}>{s.subtitle}</p>
              <p className={styles.cardDesc}>{s.desc}</p>
              <a
                href="https://wa.me/541173608299"
                target="_blank"
                rel="noreferrer"
                className={styles.cardCta}
              >
                Consultar <span className={styles.arrow}>→</span>
              </a>
            </article>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          custom={0}
          variants={fadeUp}
          className={styles.bottomCta}
        >
          <p className={styles.bottomText}>
            ¿No sabés qué tratamiento es para vos?
          </p>
          <a
            href="https://wa.me/541173608299?text=Hola%20Dr.%20Branko!%20Me%20gustar%C3%ADa%20hacer%20una%20consulta."
            target="_blank"
            rel="noreferrer"
            className={styles.bottomBtn}
          >
            Pedí una consulta gratuita
          </a>
        </motion.div>
      </div>
      
      {/* Bottom vignette to connect with About */}
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-brand-black to-transparent pointer-events-none z-0" />
    </section>
  )
}
