"use client";

import { motion } from "framer-motion";
import { ElegantShape } from "./ui/ElegantShape";
import styles from './Services.module.scss';
import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { usePublicContent } from '../cms/publicContent'

const fadeUp = { hidden: { opacity: 0, y: 40 }, visible: (i: number) => ({ opacity: 1, y: 0, transition: { duration: 1, delay: 0.1 + i * 0.1, ease: [0.25, 0.4, 0.25, 1] } }) };

export default function Services() {
  const sectionRef = useRef<HTMLElement>(null);
  const { data, text, whatsappUrl } = usePublicContent()
  useGSAP(() => { gsap.from(".service-card", { opacity: 0, y: 100, stagger: 0.1, duration: 1.2, ease: "power4.out", scrollTrigger: { trigger: ".services-grid", start: "top 85%" } }); }, { scope: sectionRef });
  return <section ref={sectionRef} className={styles.section} id="tratamientos">
    <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-brand-black to-transparent pointer-events-none z-0" />
    <div className="absolute inset-0 overflow-hidden pointer-events-none"><ElegantShape delay={0.2} width={400} height={100} rotate={-10} gradient="from-brand-gold/[0.08]" className="left-[5%] top-[10%]" parallaxSpeed={1.5} /><ElegantShape delay={0.4} width={300} height={80} rotate={15} gradient="from-brand-gold/[0.05]" className="right-[10%] bottom-[20%]" parallaxSpeed={-1.8} /></div>
    <div className="container relative z-10"><motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} className={styles.header}><motion.span custom={0} variants={fadeUp} className={styles.label}><span className={styles.labelLine} />{text('treatments.eyebrow')}</motion.span><motion.h2 custom={1} variants={fadeUp} className={styles.title}>{text('treatments.title_primary')}<br /><em>{text('treatments.title_accent')}</em></motion.h2><motion.p custom={2} variants={fadeUp} className={styles.desc}>{text('treatments.description')}</motion.p></motion.div>
      <div className={`${styles.grid} services-grid`}>{data.treatments.map((treatment,i)=><article key={treatment.treatment_id} className={`${styles.card} service-card`} style={{ '--delay': `${i * 0.07}s` } as React.CSSProperties}>{treatment.tag && <span className={styles.cardTag}>{treatment.tag}</span>}<div className={styles.cardIcon}>{treatment.icon_key || '✦'}</div><h3 className={styles.cardTitle}>{treatment.title}</h3><p className={styles.cardSub}>{treatment.subtitle}</p><p className={styles.cardDesc}>{treatment.description.replace('El primero paso','El primer paso')}</p><a href={whatsappUrl('consult')} target="_blank" rel="noreferrer" className={styles.cardCta}>Consultar <span className={styles.arrow}>→</span></a></article>)}</div>
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0} variants={fadeUp} className={styles.bottomCta}><p className={styles.bottomText}>{text('treatments.bottom_text')}</p><a href={whatsappUrl('consult')} target="_blank" rel="noreferrer" className={styles.bottomBtn}>{text('treatments.bottom_cta_label')}</a></motion.div>
    </div><div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-brand-black to-transparent pointer-events-none z-0" />
  </section>
}
