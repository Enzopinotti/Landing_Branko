import styles from './Footer.module.scss'
import brankoMonogram from '../assets/branko-monogram.svg'
import { usePublicContent } from '../cms/publicContent'

export default function Footer() {
  const { data, text, whatsappUrl } = usePublicContent()
  const primaryLocation = data.locations[0]
  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.top}>
          <div className={styles.brand}>
            <div className={styles.logo}><img src={brankoMonogram} alt="" aria-hidden="true" className={styles.logoMark} /><div><p className={styles.logoName}>{String(data.site.site_name || 'BRANKO IRIART').toUpperCase()}</p><p className={styles.logoSub}>ESTÉTICA FACIAL</p></div></div>
            <p className={styles.tagline}>{text('footer.tagline')}</p>
          </div>
          <div className={styles.links}>
            <p className={styles.linksTitle}>{text('footer.treatments_title')}</p>
            {data.treatments.slice(0, 6).map((treatment) => <a key={treatment.treatment_id} href="#tratamientos" className={styles.link}>{treatment.title}</a>)}
          </div>
          <div className={styles.links}>
            <p className={styles.linksTitle}>{text('footer.locations_title')}</p>
            {primaryLocation && <><p className={styles.linkText}>{primaryLocation.city}</p><p className={styles.linkText}>{primaryLocation.address}</p><br /></>}
            <p className={styles.linkText}>{data.site.professional_license || ''}</p>
            <a href={data.site.instagram_url || '#'} target="_blank" rel="noreferrer" className={styles.link}>{data.site.instagram_handle || '@biesteticafacial'}</a>
          </div>
          <div className={styles.ctaBlock}>
            <p className={styles.ctaText}>{text('footer.cta_text')}</p>
            <a href={whatsappUrl('booking')} target="_blank" rel="noreferrer" className={styles.ctaBtn}>{text('footer.cta_label')}</a>
            <p className={styles.phone}>{data.site.whatsapp_number ? `+${String(data.site.whatsapp_number).replace(/^(54)(\d{2})(\d{4})(\d{4})$/, '$1 $2 $3-$4')}` : ''}</p>
          </div>
        </div>
        <div className={styles.bottom}>
          <p className={styles.copy}>© {new Date().getFullYear()} {data.site.professional_name || 'Dr. Branko Iriart'} · Todos los derechos reservados</p>
          <p className={styles.disclaimer}>{text('footer.disclaimer')}</p>
        </div>
      </div>
    </footer>
  )
}
