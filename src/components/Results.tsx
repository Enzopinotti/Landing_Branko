"use client";

import { motion } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { ElegantShape } from "./ui/ElegantShape";
import styles from './Results.module.scss';
import React from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { usePublicContent } from '../cms/publicContent'

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: (i: number) => ({ opacity: 1, y: 0, transition: { duration: 0.8, delay: 0.1 + i * 0.1, ease: [0.25, 0.4, 0.25, 1] } }) };

export default function Results() {
  const [active, setActive] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const { data, text, mediaFor } = usePublicContent()
  const activeCase = data.resultCases[active]
  const beforeMedia = activeCase ? mediaFor('resultCases', activeCase.result_case_id, 'before') : undefined
  const afterMedia = activeCase ? mediaFor('resultCases', activeCase.result_case_id, 'after') : undefined

  useEffect(() => {
    if (active >= data.resultCases.length) setActive(0)
  }, [active, data.resultCases.length])

  useGSAP(() => {
    gsap.from(".ba-image-container", { scale: 0.9, opacity: 0, duration: 1.5, ease: "power2.out", scrollTrigger: { trigger: ".ba-image-container", start: "top 85%" } });
    gsap.to(".testimonial-card", { y: -30, stagger: 0.1, scrollTrigger: { trigger: ".testimonials-grid", start: "top bottom", end: "bottom top", scrub: true } });
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className={styles.section} id="resultados">
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-brand-black to-transparent pointer-events-none z-0" />
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <ElegantShape delay={0.6} width={450} height={90} rotate={10} gradient="from-brand-gold/[0.06]" className="left-[-5%] bottom-[15%]" parallaxSpeed={-1} />
        <ElegantShape delay={0.9} width={220} height={50} rotate={-15} gradient="from-brand-gold/[0.04]" className="right-[10%] top-[40%]" parallaxSpeed={1.8} />
      </div>
      <div className="container relative z-10">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} className={styles.header}>
          <motion.span custom={0} variants={fadeUp} className={styles.label}><span className={styles.labelLine} />{text('results.eyebrow')}</motion.span>
          <motion.h2 custom={1} variants={fadeUp} className={styles.title}>{text('results.title_primary')}<br /><em>{text('results.title_accent')}</em></motion.h2>
        </motion.div>

        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className={styles.cases}>
          {data.resultCases.map((item, i) => (
            <motion.button key={item.result_case_id} custom={i} variants={fadeUp} className={`${styles.case} ${active === i ? styles.caseActive : ''}`} onClick={() => setActive(i)}>
              <div className={styles.caseNum}>{String(i + 1).padStart(2,'0')}</div>
              <div className={styles.caseInfo}><span className={styles.caseCat}>{item.category}</span><p className={styles.caseTitle}>{item.title}</p>{active === i && <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className={styles.caseDesc}>{item.description}</motion.p>}</div>
              <span className={styles.casePlus}>{active === i ? '−' : '+'}</span>
            </motion.button>
          ))}
        </motion.div>

        {!!activeCase && (
          <div className={`${styles.baWrap} ba-image-container`}>
            <div className={styles.baSide}><span className={styles.baLabel}>{text('results.before_label')}</span><div className={styles.baImg}>{beforeMedia ? <img src={beforeMedia.public_url} alt={beforeMedia.alt_text || `${activeCase.title} antes`} loading="lazy" /> : <p className={styles.baPlaceholder}>{text('results.placeholder')}</p>}</div></div>
            <div className={styles.baDivider} />
            <div className={styles.baSide}><span className={styles.baLabel}>{text('results.after_label')}</span><div className={`${styles.baImg} ${styles.baAfter}`}>{afterMedia ? <img src={afterMedia.public_url} alt={afterMedia.alt_text || `${activeCase.title} después`} loading="lazy" /> : <p className={styles.baPlaceholder}>{data.site.instagram_handle || '@biesteticafacial'}</p>}</div></div>
          </div>
        )}

        {data.testimonials.length > 0 && <div className={styles.testimonials}><motion.h3 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className={styles.testTitle}>{text('results.testimonials_title')}</motion.h3><div className={`${styles.testGrid} testimonials-grid`}>{data.testimonials.map((item) => <div key={item.testimonial_id} className={`${styles.testCard} testimonial-card`}><p className={styles.testText}>"{item.text}"</p><div className={styles.testAuthor}><span className={styles.testName}>{item.display_name}</span><span className={styles.testService}>{item.service}</span></div></div>)}</div></div>}
      </div>
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-brand-black to-transparent pointer-events-none z-0" />
    </section>
  )
}
