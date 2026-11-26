"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ElegantShape } from "./ui/ElegantShape";
import styles from './Services.module.scss';
import React, { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { usePublicContent } from '../cms/publicContent'
import type { CmsMedia, CmsTreatment } from '../cms/types'

const fadeUp = { hidden: { opacity: 0, y: 40 }, visible: (i: number) => ({ opacity: 1, y: 0, transition: { duration: 1, delay: 0.1 + i * 0.1, ease: [0.25, 0.4, 0.25, 1] } }) };
const treatmentExampleSlots = ['gallery_1','gallery_2','gallery_3','gallery_4','gallery_5','gallery_6','gallery_7','gallery_8','gallery_9','gallery_10'] as const

function splitApplications(value?: string) {
  return String(value || '').split(/\n|,/).map((item) => item.trim()).filter(Boolean)
}

export default function Services() {
  const sectionRef = useRef<HTMLElement>(null);
  const [openId,setOpenId] = useState<string | null>(null)
  const [activeImageIndex,setActiveImageIndex] = useState(0)
  const [carouselPaused,setCarouselPaused] = useState(false)
  const prefersReducedMotion = useReducedMotion()
  const { data, text, whatsappUrl, mediaFor } = usePublicContent()
  useGSAP(() => { gsap.from(".service-card", { opacity: 0, y: 100, stagger: 0.1, duration: 1.2, ease: "power4.out", scrollTrigger: { trigger: ".services-grid", start: "top 85%" } }); }, { scope: sectionRef });

  const visualHighlights = useMemo(() => {
    const items:Array<{media:CmsMedia;treatment:CmsTreatment}> = []
    data.treatments.forEach((treatment) => {
      const unique = new Map<string,CmsMedia>()
      treatmentExampleSlots.forEach((slot) => {
        const media = mediaFor('treatments',treatment.treatment_id,slot)
        if (media) unique.set(media.media_id,media)
      })
      unique.forEach((media) => items.push({media,treatment}))
    })
    return items
  },[data.treatments,data.media,data.mediaLinks,mediaFor])

  const carouselIntervalMs = useMemo(() => {
    const configuredSeconds = Number(data.site.treatments_carousel_interval_seconds)
    const seconds = Number.isFinite(configuredSeconds) && configuredSeconds > 0
      ? Math.min(configuredSeconds, 60)
      : 3
    return seconds * 1000
  }, [data.site.treatments_carousel_interval_seconds])

  useEffect(() => {
    if (visualHighlights.length < 2 || carouselPaused) return
    const timer = window.setTimeout(() => {
      setActiveImageIndex((current) => (current + 1) % visualHighlights.length)
    }, carouselIntervalMs)
    return () => window.clearTimeout(timer)
  }, [activeImageIndex, carouselIntervalMs, carouselPaused, visualHighlights.length])

  const activeVisualIndex = visualHighlights.length ? activeImageIndex % visualHighlights.length : 0
  const activeVisual = visualHighlights[activeVisualIndex]
  const moveImage = (direction: number) => {
    setActiveImageIndex((current) => (current + direction + visualHighlights.length) % visualHighlights.length)
  }

  return <section ref={sectionRef} className={styles.section} id="tratamientos">
    <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-brand-black to-transparent pointer-events-none z-0" />
    <div className="absolute inset-0 overflow-hidden pointer-events-none"><ElegantShape delay={0.2} width={400} height={100} rotate={-10} gradient="from-brand-gold/[0.08]" className="left-[5%] top-[10%]" parallaxSpeed={1.5} /><ElegantShape delay={0.4} width={300} height={80} rotate={15} gradient="from-brand-gold/[0.05]" className="right-[10%] bottom-[20%]" parallaxSpeed={-1.8} /></div>
    <div className="container relative z-10"><motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} className={styles.header}><motion.span custom={0} variants={fadeUp} className={styles.label}><span className={styles.labelLine} />{text('treatments.eyebrow')}</motion.span><motion.h2 custom={1} variants={fadeUp} className={styles.title}>{text('treatments.title_primary')}<br /><em>{text('treatments.title_accent')}</em></motion.h2><motion.p custom={2} variants={fadeUp} className={styles.desc}>{text('treatments.description')}</motion.p></motion.div>
      <div className={`${styles.grid} services-grid`}>{data.treatments.map((treatment,i)=>{
        const cover = mediaFor('treatments',treatment.treatment_id,'cover')
        const applications = splitApplications(treatment.applications_text)
        const detailAvailable = Boolean(applications.length || [treatment.detail_title,treatment.detail_body,treatment.duration_text,treatment.recovery_text].some((value) => String(value || '').trim()))
        const expanded = openId === treatment.treatment_id
        return <article key={treatment.treatment_id} className={`${styles.card} service-card`} style={{ '--delay': `${i * 0.07}s` } as React.CSSProperties}>
          {cover && <div className={styles.cardImage}><img src={cover.public_url} alt={cover.alt_text || `${treatment.title} · ejemplo de tratamiento`} loading="lazy" /></div>}
          <div className={styles.cardContent}>{treatment.tag && <span className={styles.cardTag}>{treatment.tag}</span>}<div className={styles.cardIcon}>{treatment.icon_key || '✦'}</div><h3 className={styles.cardTitle}>{treatment.title}</h3><p className={styles.cardSub}>{treatment.subtitle}</p><p className={styles.cardDesc}>{treatment.description.replace('El primero paso','El primer paso')}</p>
            {detailAvailable && <button type="button" className={styles.detailToggle} aria-expanded={expanded} onClick={() => setOpenId(expanded ? null : treatment.treatment_id)}>{expanded ? 'Cerrar detalle' : 'Conocer más'} <span aria-hidden="true">{expanded ? '−' : '+'}</span></button>}
            {expanded && detailAvailable && <div className={styles.detailPanel}>
              {treatment.detail_title && <h4>{treatment.detail_title}</h4>}
              {treatment.detail_body && <p>{treatment.detail_body}</p>}
              {applications.length > 0 && <ul>{applications.map((item) => <li key={item}>{item}</li>)}</ul>}
              {(treatment.duration_text || treatment.recovery_text) && <div className={styles.detailMeta}>{treatment.duration_text && <span><small>Duración</small>{treatment.duration_text}</span>}{treatment.recovery_text && <span><small>Recuperación</small>{treatment.recovery_text}</span>}</div>}
            </div>}
            <a href={whatsappUrl('consult')} target="_blank" rel="noreferrer" className={styles.cardCta}>{treatment.cta_label || 'Consultar'} <span className={styles.arrow}>→</span></a>
          </div>
        </article>
      })}</div>

      {activeVisual && <motion.div initial={{opacity:0,y:30}} whileInView={{opacity:1,y:0}} viewport={{once:true,margin:'-80px'}} className={styles.visualBlock}>
        <div className={styles.visualBlockHeading}><span>Tratamientos & resultados</span><h3>Casos y procedimientos, <em>sin salir del recorrido.</em></h3><p>Una selección visual vinculada directamente desde la biblioteca del panel.</p></div>
        <div className={styles.visualCarousel} aria-roledescription="carrusel" aria-label="Galería de imágenes de tratamientos">
          <AnimatePresence mode="sync" initial={false}>
            <motion.figure
              key={`${activeVisual.treatment.treatment_id}-${activeVisual.media.media_id}`}
              className={styles.visualSlide}
              role="group"
              aria-roledescription="diapositiva"
              aria-label={`${activeVisualIndex + 1} de ${visualHighlights.length}`}
              initial={prefersReducedMotion ? false : { opacity: 0, x: 18 }}
              animate={{ opacity: 1, x: 0 }}
              exit={prefersReducedMotion ? undefined : { opacity: 0, x: -18 }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.65, ease: [0.22, 1, 0.36, 1] }}
            >
              <img src={activeVisual.media.public_url} alt={activeVisual.media.alt_text || `${activeVisual.treatment.title} · tratamiento de estética facial`} loading="lazy" />
              <figcaption className={styles.visualCaption}><span>{activeVisual.treatment.subtitle || 'Tratamiento'}</span><strong>{activeVisual.treatment.title}</strong>{activeVisual.media.caption && <small>{activeVisual.media.caption}</small>}</figcaption>
            </motion.figure>
          </AnimatePresence>
          {visualHighlights.length > 1 && <div className={styles.carouselControls}>
            <div className={styles.carouselNavigation}>
              <button type="button" aria-label="Imagen anterior" onClick={() => moveImage(-1)}>←</button>
              <span aria-live={carouselPaused ? 'polite' : 'off'}>{String(activeVisualIndex + 1).padStart(2, '0')} / {String(visualHighlights.length).padStart(2, '0')}</span>
              <button type="button" aria-label="Imagen siguiente" onClick={() => moveImage(1)}>→</button>
            </div>
            <button type="button" className={styles.carouselPause} aria-pressed={carouselPaused} onClick={() => setCarouselPaused((paused) => !paused)}>{carouselPaused ? 'Reanudar' : 'Pausar'}</button>
          </div>}
        </div>
      </motion.div>}

      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0} variants={fadeUp} className={styles.bottomCta}><p className={styles.bottomText}>{text('treatments.bottom_text')}</p><a href={whatsappUrl('consult')} target="_blank" rel="noreferrer" className={styles.bottomBtn}>{text('treatments.bottom_cta_label')}</a></motion.div>
    </div><div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-brand-black to-transparent pointer-events-none z-0" />
  </section>
}
