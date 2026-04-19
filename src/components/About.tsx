"use client";

import { motion } from "framer-motion";
import { ElegantShape } from "./ui/ElegantShape";
import styles from './About.module.scss';
import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const CREDENTIALS = [
  { value: 'IMP 15.493', label: 'Matrícula Profesional' },
  { value: 'Ensenada', label: 'Consultorio Principal' },
  { value: 'La Plata', label: 'Consultorio Secundario' },
  { value: '+500', label: 'Pacientes Satisfechos' },
  { value: '6+', label: 'Tratamientos Estéticos' },
  { value: '100%', label: 'Enfoque personalizado' },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
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

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    // Parallax sutil para el bloque visual de la izquierda
    gsap.to(".about-left", {
      y: -50,
      ease: "none",
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      }
    });

    // Revelación del título tipo "mask"
    gsap.from(".about-title", {
      letterSpacing: "15px",
      opacity: 0,
      filter: "blur(10px)",
      duration: 1.5,
      ease: "power3.out",
      scrollTrigger: {
        trigger: ".about-title",
        start: "top 90%",
      }
    });

  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className={styles.section} id="sobre-mi">
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-brand-black to-transparent pointer-events-none z-0" />
      
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <ElegantShape
          delay={0.5}
          width={500}
          height={120}
          rotate={-15}
          gradient="from-brand-gold/[0.05]"
          className="right-[-10%] top-[20%]"
          parallaxSpeed={-1.2}
        />
        <ElegantShape
          delay={0.8}
          width={250}
          height={60}
          rotate={20}
          gradient="from-brand-gold/[0.03]"
          className="left-[5%] bottom-[10%]"
          parallaxSpeed={2.2}
        />
      </div>

      <div className="container relative z-10">
        <div className={styles.inner}>

          {/* Left: Visual block */}
          <div className={`${styles.left} about-left`}>
            <div className={styles.mono}>
              <span className={styles.monoLetter}>B</span>
              <span className={styles.monoLetter}>I</span>
            </div>
            <div className={styles.credentials}>
              {CREDENTIALS.map(c => (
                <div key={c.label} className={styles.cred}>
                  <span className={styles.credValue}>{c.value}</span>
                  <span className={styles.credLabel}>{c.label}</span>
                </div>
              ))}
            </div>
            <div className={styles.instaBadge}>
              <span className={styles.instaIcon}>@</span>
              <div>
                <p className={styles.instaHandle}>biesteticafacial</p>
                <p className={styles.instaFollowers}>+2.700 seguidores</p>
              </div>
            </div>
          </div>

          {/* Right: Text */}
          <div className={styles.right}>
            <motion.span 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={0} variants={fadeUp} 
              className={styles.label}
            >
              <span className={styles.labelLine} />
              El Doctor
            </motion.span>

            <h2 className={`${styles.title} about-title`}>
              Dr. Branko<br />
              <em>Iriart</em>
            </h2>

            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="space-y-6"
            >
              <motion.p custom={2} variants={fadeUp} className={styles.text}>
                Especialista en estética y armonización facial con formación en las
                técnicas más actuales de medicina estética no quirúrgica.
              </motion.p>

              <motion.p custom={3} variants={fadeUp} className={styles.text}>
                Mi filosofía es simple: potenciar lo que ya tenés. Cada tratamiento
                comienza con una consulta personalizada donde evaluamos tu estructura
                facial, tipo de piel y objetivos antes de aplicar cualquier procedimiento.
              </motion.p>

              <motion.p custom={4} variants={fadeUp} className={styles.text}>
                Atiendo en <strong>Ensenada</strong> (Moreno 119, e/ Cestino y Alberdi)
                y en <strong>La Plata</strong> (@skinglow.estéticalp). Los turnos se
                coordinan por WhatsApp.
              </motion.p>

              <motion.div custom={5} variants={fadeUp} className={styles.philosophy}>
                <span className={styles.quoteDecor}>"</span>
                <blockquote className={styles.quote}>
                  La belleza estética no se construye. Se revela.
                </blockquote>
              </motion.div>

              <motion.a
                custom={6}
                variants={fadeUp}
                href="https://wa.me/541173608299"
                target="_blank"
                rel="noreferrer"
                className={styles.btn}
              >
                Hablá con el Doctor
              </motion.a>
            </motion.div>
          </div>

        </div>
      </div>
      
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-brand-black to-transparent pointer-events-none z-0" />
    </section>
  )
}
