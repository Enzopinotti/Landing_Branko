"use client";

import { motion } from "framer-motion";
import { ElegantShape } from "./ui/ElegantShape";
import styles from './About.module.scss';
import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { usePublicContent } from '../cms/publicContent'

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: (i: number) => ({ opacity: 1, y: 0, transition: { duration: 1, delay: 0.1 + i * 0.1, ease: [0.25, 0.4, 0.25, 1] } }) };

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const { data, text, whatsappUrl } = usePublicContent()
  const credentials = [
    { value: data.site.professional_license || '—', label: 'Matrícula Profesional' },
    { value: data.locations[0]?.city || 'Ensenada', label: 'Consultorio Principal' },
    { value: data.locations[1]?.city || 'La Plata', label: 'Consultorio Secundario' },
    { value: data.site.patients_metric || '—', label: 'Pacientes Satisfechos' },
    { value: data.site.treatments_metric || String(data.treatments.length), label: 'Tratamientos Estéticos' },
    { value: data.site.personalized_metric || '100%', label: 'Enfoque personalizado' },
  ]

  useGSAP(() => {
    gsap.to(".about-left", { y: -50, ease: "none", scrollTrigger: { trigger: sectionRef.current, start: "top bottom", end: "bottom top", scrub: true } });
    gsap.from(".about-title", { letterSpacing: "15px", opacity: 0, filter: "blur(10px)", duration: 1.5, ease: "power3.out", scrollTrigger: { trigger: ".about-title", start: "top 90%" } });
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className={styles.section} id="sobre-mi">
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-brand-black to-transparent pointer-events-none z-0" />
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <ElegantShape delay={0.5} width={500} height={120} rotate={-15} gradient="from-brand-gold/[0.05]" className="right-[-10%] top-[20%]" parallaxSpeed={-1.2} />
        <ElegantShape delay={0.8} width={250} height={60} rotate={20} gradient="from-brand-gold/[0.03]" className="left-[5%] bottom-[10%]" parallaxSpeed={2.2} />
      </div>
      <div className="container relative z-10">
        <div className={styles.inner}>
          <div className={`${styles.left} about-left`}>
            <div className={styles.mono}><span className={styles.monoLetter}>B</span><span className={styles.monoLetter}>I</span></div>
            <div className={styles.credentials}>{credentials.map((item) => <div key={item.label} className={styles.cred}><span className={styles.credValue}>{item.value}</span><span className={styles.credLabel}>{item.label}</span></div>)}</div>
            <div className={styles.instaBadge}><span className={styles.instaIcon}>@</span><div><p className={styles.instaHandle}>{String(data.site.instagram_handle || '@biesteticafacial').replace(/^@/,'')}</p><p className={styles.instaFollowers}>{data.site.followers_metric || ''} seguidores</p></div></div>
          </div>
          <div className={styles.right}>
            <motion.span initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0} variants={fadeUp} className={styles.label}><span className={styles.labelLine} />{text('about.eyebrow')}</motion.span>
            <h2 className={`${styles.title} about-title`}>{data.site.professional_name || 'Dr. Branko Iriart'}</h2>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="space-y-6">
              <motion.p custom={2} variants={fadeUp} className={styles.text}>{text('about.paragraph_1')}</motion.p>
              <motion.p custom={3} variants={fadeUp} className={styles.text}>{text('about.paragraph_2')}</motion.p>
              <motion.p custom={4} variants={fadeUp} className={styles.text}>{text('about.paragraph_3')}</motion.p>
              <motion.div custom={5} variants={fadeUp} className={styles.philosophy}><span className={styles.quoteDecor}>"</span><blockquote className={styles.quote}>{text('about.quote')}</blockquote></motion.div>
              <motion.a custom={6} variants={fadeUp} href={whatsappUrl('consult')} target="_blank" rel="noreferrer" className={styles.btn}>{text('about.cta_label')}</motion.a>
            </motion.div>
          </div>
        </div>
      </div>
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-brand-black to-transparent pointer-events-none z-0" />
    </section>
  )
}
