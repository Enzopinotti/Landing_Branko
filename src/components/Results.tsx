"use client";

import { motion } from "framer-motion";
import { useState, useRef } from "react";
import { ElegantShape } from "./ui/ElegantShape";
import styles from './Results.module.scss';
import React from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const CASES = [
  { id: 1, category: 'Hialurónico', title: 'Relleno nasal sin cirugía', desc: 'Corrección de punta y dorso nasal con ácido hialurónico. Procedimiento de 30 min, sin recuperación.' },
  { id: 2, category: 'Botox', title: 'Suavizado de frente y entrecejo', desc: 'Tratamiento de arrugas de expresión con resultado natural. Efecto visible a los 3 días.' },
  { id: 3, category: 'Labios', title: 'Definición y volumen de labios', desc: 'Proyección de labios respetando la proporción áurea facial del paciente.' },
  { id: 4, category: 'PRP', title: 'Plasma para textura de piel', desc: 'Tratamiento con plasma rico en plaquetas para mejorar luminosidad, textura e hidratación.' },
];

const TESTIMONIALS = [
  { name: 'Victoria R.', text: 'El Dr. Branko es un artista. El resultado del botox fue increíblemente natural, nunca pensé que quedaría así de bien.', service: 'Botox' },
  { name: 'Lucía M.', text: 'Me hice el hialurónico en los labios y me encantó. Muy profesional, me explicó todo antes del procedimiento.', service: 'Hialurónico' },
  { name: 'Julia S.', text: 'El plasma cambió mi piel completamente. En tres sesiones noté una diferencia increíble en textura y luminosidad.', service: 'Plasma PRP' },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      delay: 0.1 + i * 0.1,
      ease: [0.25, 0.4, 0.25, 1],
    },
  }),
};

export default function Results() {
  const [active, setActive] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    // Escala suave de las imágenes antes/después al entrar en el viewport
    gsap.from(".ba-image-container", {
      scale: 0.9,
      opacity: 0,
      duration: 1.5,
      ease: "power2.out",
      scrollTrigger: {
        trigger: ".ba-image-container",
        start: "top 85%",
      }
    });

    // Parallax para los testimonios al fondo
    gsap.to(".testimonial-card", {
      y: -30,
      stagger: 0.1,
      scrollTrigger: {
        trigger: ".testimonials-grid",
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      }
    });

  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className={styles.section} id="resultados">
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-brand-black to-transparent pointer-events-none z-0" />
      
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <ElegantShape
          delay={0.6}
          width={450}
          height={90}
          rotate={10}
          gradient="from-brand-gold/[0.06]"
          className="left-[-5%] bottom-[15%]"
          parallaxSpeed={-0.4}
        />
        <ElegantShape
          delay={0.9}
          width={220}
          height={50}
          rotate={-15}
          gradient="from-brand-gold/[0.04]"
          className="right-[10%] top-[40%]"
          parallaxSpeed={1.1}
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
            Resultados
          </motion.span>
          <motion.h2 custom={1} variants={fadeUp} className={styles.title}>
            Los resultados<br />
            <em>hablan solos.</em>
          </motion.h2>
        </motion.div>

        {/* Cases */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className={styles.cases}
        >
          {CASES.map((c, i) => (
            <motion.button
              key={c.id}
              custom={i}
              variants={fadeUp}
              className={`${styles.case} ${active === i ? styles.caseActive : ''}`}
              onClick={() => setActive(i)}
            >
              <div className={styles.caseNum}>0{i + 1}</div>
              <div className={styles.caseInfo}>
                <span className={styles.caseCat}>{c.category}</span>
                <p className={styles.caseTitle}>{c.title}</p>
                {active === i && (
                  <motion.p 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className={styles.caseDesc}
                  >
                    {c.desc}
                  </motion.p>
                )}
              </div>
              <span className={styles.casePlus}>{active === i ? '−' : '+'}</span>
            </motion.button>
          ))}
        </motion.div>

        {/* Before / After placeholder */}
        <div className={`${styles.baWrap} ba-image-container`}>
          <div className={styles.baSide}>
            <span className={styles.baLabel}>Antes</span>
            <div className={styles.baImg}>
              <p className={styles.baPlaceholder}>
                Consultá por Instagram para ver el caso real
              </p>
            </div>
          </div>
          <div className={styles.baDivider} />
          <div className={styles.baSide}>
            <span className={styles.baLabel}>Después</span>
            <div className={`${styles.baImg} ${styles.baAfter}`}>
              <p className={styles.baPlaceholder}>
                @biesteticafacial
              </p>
            </div>
          </div>
        </div>

        {/* Testimonials */}
        <div className={styles.testimonials}>
          <motion.h3 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className={styles.testTitle}
          >
            Lo que dicen los pacientes
          </motion.h3>
          <div className={`${styles.testGrid} testimonials-grid`}>
            {TESTIMONIALS.map((t, i) => (
              <div key={t.name} className={`${styles.testCard} testimonial-card`}>
                <p className={styles.testText}>"{t.text}"</p>
                <div className={styles.testAuthor}>
                  <span className={styles.testName}>{t.name}</span>
                  <span className={styles.testService}>{t.service}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-brand-black to-transparent pointer-events-none z-0" />
    </section>
  )
}
