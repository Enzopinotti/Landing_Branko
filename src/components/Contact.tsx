"use client";

import { motion } from "framer-motion";
import { useState, useRef } from "react";
import { ElegantShape } from "./ui/ElegantShape";
import styles from './Contact.module.scss';
import React from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { usePublicContent } from '../cms/publicContent'

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: (i: number) => ({ opacity: 1, y: 0, transition: { duration: 0.8, delay: 0.1 + i * 0.1, ease: [0.25, 0.4, 0.25, 1] } }) };

function FAQ({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return <div className={`${styles.faq} ${open ? styles.faqOpen : ''} faq-item`}><button className={styles.faqQ} onClick={() => setOpen(!open)}><span>{question}</span><span className={styles.faqToggle}>{open ? '−' : '+'}</span></button><motion.div initial={false} animate={{ height: open ? 'auto' : 0, opacity: open ? 1 : 0 }} className={styles.faqA}><p>{answer}</p></motion.div></div>
}

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const { data, text, whatsappUrl } = usePublicContent()

  useGSAP(() => {
    gsap.from(".faq-item", { opacity: 0, x: 30, stagger: 0.15, duration: 1, ease: "power2.out", scrollTrigger: { trigger: ".faqs-container", start: "top 80%" } });
    gsap.to(".contact-info", { y: -20, ease: "none", scrollTrigger: { trigger: sectionRef.current, start: "top bottom", end: "bottom top", scrub: true } });
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className={styles.section} id="contacto">
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-brand-black to-transparent pointer-events-none z-0" />
      <div className="absolute inset-0 overflow-hidden pointer-events-none"><ElegantShape delay={0.8} width={400} height={100} rotate={-20} gradient="from-brand-gold/[0.05]" className="right-[5%] top-[10%]" parallaxSpeed={1.4} /><ElegantShape delay={1} width={300} height={60} rotate={30} gradient="from-brand-gold/[0.04]" className="left-[-5%] bottom-[5%]" parallaxSpeed={-2} /></div>
      <div className="container relative z-10"><div className={styles.inner}>
        <div className={`${styles.left} contact-info`}>
          <motion.span initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0} variants={fadeUp} className={styles.label}><span className={styles.labelLine} />{text('contact.eyebrow')}</motion.span>
          <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} custom={1} variants={fadeUp} className={styles.title}>{text('contact.title_primary')}<br /><em>{text('contact.title_accent')}</em></motion.h2>
          <motion.p initial="hidden" whileInView="visible" viewport={{ once: true }} custom={2} variants={fadeUp} className={styles.subtitle}>{text('contact.subtitle')}</motion.p>
          <motion.a initial="hidden" whileInView="visible" viewport={{ once: true }} custom={3} variants={fadeUp} href={whatsappUrl('booking')} target="_blank" rel="noreferrer" className={styles.waCta}><svg className={styles.waIcon} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.124.558 4.122 1.532 5.861L.057 23.882l6.186-1.623A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.845 9.845 0 01-5.032-1.378l-.359-.214-3.722.977.993-3.636-.235-.374A9.818 9.818 0 012.182 12C2.182 6.565 6.565 2.182 12 2.182S21.818 6.565 21.818 12 17.435 21.818 12 21.818z"/></svg>{text('contact.cta_label')}</motion.a>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} custom={4} variants={fadeUp} className={styles.locations}>{data.locations.map((location) => <div className={styles.location} key={location.location_id}><span className={styles.locationDot} /><div><p className={styles.locationCity}>{location.city}</p><p className={styles.locationAddr}>{location.address}{location.secondary_text ? ` · ${location.secondary_text}` : ''}</p></div></div>)}</motion.div>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} custom={5} variants={fadeUp} className={styles.social}><a href={data.site.instagram_url || '#'} target="_blank" rel="noreferrer" className={styles.socialLink}>Instagram · {data.site.instagram_handle || '@biesteticafacial'}</a></motion.div>
        </div>
        <div className={styles.right}><motion.h3 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className={styles.faqTitle}>{text('contact.faq_title')}</motion.h3><div className={`${styles.faqs} faqs-container`}>{data.faqs.map((faq) => <FAQ key={faq.faq_id} question={faq.question} answer={faq.answer} />)}</div></div>
      </div></div>
    </section>
  )
}
