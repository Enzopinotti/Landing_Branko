"use client";

import { motion } from "framer-motion";
import { ElegantShape } from "./ui/ElegantShape";
import styles from './Services.module.scss';
import React, { useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { usePublicContent } from '../cms/publicContent'
import type { CmsMedia, CmsTreatment } from '../cms/types'

const fadeUp = { hidden: { opacity: 0, y: 40 }, visible: (i: number) => ({ opacity: 1, y: 0, transition: { duration: 1, delay: 0.1 + i * 0.1, ease: [0.25, 0.4, 0.25, 1] } }) };
const treatmentSlots = ['cover','gallery_1','gallery_2','gallery_3'] as const

function splitApplications(value?: string) {
  return String(value || '').split(/\n|,/).map((item) => item.trim()).filter(Boolean)
}

export default function Services() {
  const sectionRef = useRef<HTMLElement>(null);
  const [openId,setOpenId] = useState<string | null>(null)
  const { data, text, whatsappUrl, mediaFor } = usePublicContent()
  useGSAP(() => { gsap.from(".service-card", { opacity: 0, y: 100, stagger: 0.1, duration: 1.2, ease: "power4.out", scrollTrigger: { trigger: ".services-grid", start: "top 85%" } }); }, { scope: sectionRef });

  const mediaByTreatment = useMemo(() => {
    const result = new Map<string,CmsMedia[]>()
    data.treatments.forEach((treatment) => {
      const unique = treatmentSlots.map((slot) => mediaFor('treatments',treatment.treatment_id,slot)).filter((item):item is CmsMedia => !!item).filter((item,index,list) => list.findIndex((candidate) => candidate.media_id === item.media_id) === index)
      result.set(treatment.treatment_id,unique)
    })
    return result
  }, [data.treatments, data.media, data.mediaLinks, mediaFor])

  const visualHighlights = useMemo(() => {
    const items:Array<{media:CmsMedia;treatment:CmsTreatment}> = []
    data.treatments.forEach((treatment) => {
      const media = mediaByTreatment.get(treatment.treatment_id)?.[0]
      if (media) items.push({media,treatment})
    })
    return items.slice(0,6)
  },[data.treatments,mediaByTreatment])

  return <section ref={sectionRef} className={styles.section} id="tratamientos">
    <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-brand-black to-transparent pointer-events-none z-0" />
    <div className="absolute inset-0 overflow-hidden pointer-events-none"><ElegantShape delay={0.2} width={400} height={100} rotate={-10} gradient="from-brand-gold/[0.08]" className="left-[5%] top-[10%]" parallaxSpeed={1.5} /><ElegantShape delay={0.4} width={300} height={80} rotate={15} gradient="from-brand-gold/[0.05]" className="right-[10%] bottom-[20%]" parallaxSpeed={-1.8} /></div>
    <div className="container relative z-10"><motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} className={styles.header}><motion.span custom={0} variants={fadeUp} className={styles.label}><span className={styles.labelLine} />{text('treatments.eyebrow')}</motion.span><motion.h2 custom={1} variants={fadeUp} className={styles.title}>{text('treatments.title_primary')}<br /><em>{text('treatments.title_accent')}</em></motion.h2><motion.p custom={2} variants={fadeUp} className={styles.desc}>{text('treatments.description')}</motion.p></motion.div>
      <div className={`${styles.grid} services-grid`}>{data.treatments.map((treatment,i)=>{
        const images = mediaByTreatment.get(treatment.treatment_id) || []
        const cover = images[0]
        const applications = splitApplications(treatment.applications_text)
        const detailAvailable = !!(treatment.detail_title || treatment.detail_body || applications.length || treatment.duration_text || treatment.recovery_text || images.length)
        const expanded = openId === treatment.treatment_id
        return <article key={treatment.treatment_id} className={`${styles.card} service-card`} style={{ '--delay': `${i * 0.07}s` } as React.CSSProperties}>
          {cover && <div className={styles.cardImage}><img src={cover.public_url} alt={cover.alt_text || `${treatment.title} · ejemplo de tratamiento`} loading="lazy" /></div>}
          <div className={styles.cardContent}>{treatment.tag && <span className={styles.cardTag}>{treatment.tag}</span>}<div className={styles.cardIcon}>{treatment.icon_key || '✦'}</div><h3 className={styles.cardTitle}>{treatment.title}</h3><p className={styles.cardSub}>{treatment.subtitle}</p><p className={styles.cardDesc}>{treatment.description.replace('El primero paso','El primer paso')}</p>
            {detailAvailable && <button type="button" className={styles.detailToggle} aria-expanded={expanded} onClick={() => setOpenId(expanded ? null : treatment.treatment_id)}>{expanded ? 'Cerrar detalle' : 'Conocer más'} <span aria-hidden="true">{expanded ? '−' : '+'}</span></button>}
            {expanded && <div className={styles.detailPanel}>
              {treatment.detail_title && <h4>{treatment.detail_title}</h4>}
              {treatment.detail_body && <p>{treatment.detail_body}</p>}
              {applications.length > 0 && <ul>{applications.map((item) => <li key={item}>{item}</li>)}</ul>}
              {(treatment.duration_text || treatment.recovery_text) && <div className={styles.detailMeta}>{treatment.duration_text && <span><small>Duración</small>{treatment.duration_text}</span>}{treatment.recovery_text && <span><small>Recuperación</small>{treatment.recovery_text}</span>}</div>}
              {images.length > 1 && <div className={styles.detailGallery}>{images.slice(1).map((media) => <img key={media.media_id} src={media.public_url} alt={media.alt_text || `${treatment.title} · ejemplo`} loading="lazy" />)}</div>}
            </div>}
            <a href={whatsappUrl('consult')} target="_blank" rel="noreferrer" className={styles.cardCta}>{treatment.cta_label || 'Consultar'} <span className={styles.arrow}>→</span></a>
          </div>
        </article>
      })}</div>

      {visualHighlights.length > 0 && <motion.div initial={{opacity:0,y:30}} whileInView={{opacity:1,y:0}} viewport={{once:true,margin:'-80px'}} className={styles.visualBlock}><div className={styles.visualBlockHeading}><span>Tratamientos & resultados</span><h3>Casos y procedimientos, <em>sin salir del recorrido.</em></h3><p>Una selección visual vinculada directamente desde la biblioteca del panel.</p></div><div className={styles.visualStrip}>{visualHighlights.map(({media,treatment}) => <figure key={`${treatment.treatment_id}-${media.media_id}`}><img src={media.public_url} alt={media.alt_text || `${treatment.title} · tratamiento de estética facial`} loading="lazy" /><figcaption><span>{treatment.subtitle || 'Tratamiento'}</span><strong>{treatment.title}</strong>{media.caption && <small>{media.caption}</small>}</figcaption></figure>)}</div></motion.div>}

      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0} variants={fadeUp} className={styles.bottomCta}><p className={styles.bottomText}>{text('treatments.bottom_text')}</p><a href={whatsappUrl('consult')} target="_blank" rel="noreferrer" className={styles.bottomBtn}>{text('treatments.bottom_cta_label')}</a></motion.div>
    </div><div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-brand-black to-transparent pointer-events-none z-0" />
  </section>
}
