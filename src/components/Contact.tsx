import { useState } from 'react'
import styles from './Contact.module.scss'

const FAQS = [
  { q: '¿Necesito turno previo?', a: 'Sí, todos los tratamientos requieren una consulta previa. Coordiná tu turno por WhatsApp.' },
  { q: '¿Los tratamientos duelen?', a: 'La mayoría de los procedimientos se realizan con anestesia tópica. La molestia es mínima y tolerable.' },
  { q: '¿Cuánto dura el efecto?', a: 'Depende del tratamiento. El Botox dura entre 3-6 meses. El hialurónico entre 9-18 meses dependiendo de la zona.' },
  { q: '¿Tienen financiación?', a: 'Sí, consultá por los métodos de pago disponibles directamente con el consultorio.' },
]

function FAQ({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className={`${styles.faq} ${open ? styles.faqOpen : ''}`}>
      <button className={styles.faqQ} onClick={() => setOpen(!open)}>
        <span>{question}</span>
        <span className={styles.faqToggle}>{open ? '−' : '+'}</span>
      </button>
      <div className={styles.faqA}>
        <p>{answer}</p>
      </div>
    </div>
  )
}

export default function Contact() {
  return (
    <section className={styles.section} id="contacto">
      <div className="container">
        <div className={styles.inner}>

          {/* Left: CTA principal */}
          <div className={styles.left}>
            <span className={styles.label}>
              <span className={styles.labelLine} />
              Contacto
            </span>
            <h2 className={styles.title}>
              Empezá<br />
              <em>hoy.</em>
            </h2>
            <p className={styles.subtitle}>
              El primer paso es la consulta. Escribinos y coordinaremos
              el tratamiento ideal para vos.
            </p>

            <a
              href="https://wa.me/541173608299?text=Hola%20Dr.%20Branko!%20Quiero%20reservar%20un%20turno."
              target="_blank"
              rel="noreferrer"
              className={styles.waCta}
            >
              <svg className={styles.waIcon} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.124.558 4.122 1.532 5.861L.057 23.882l6.186-1.623A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.845 9.845 0 01-5.032-1.378l-.359-.214-3.722.977.993-3.636-.235-.374A9.818 9.818 0 012.182 12C2.182 6.565 6.565 2.182 12 2.182S21.818 6.565 21.818 12 17.435 21.818 12 21.818z"/>
              </svg>
              Escribir al Dr. Branko
            </a>

            <div className={styles.locations}>
              <div className={styles.location}>
                <span className={styles.locationDot} />
                <div>
                  <p className={styles.locationCity}>Ensenada</p>
                  <p className={styles.locationAddr}>Moreno 119, e/ Cestino y Alberdi</p>
                </div>
              </div>
              <div className={styles.location}>
                <span className={styles.locationDot} />
                <div>
                  <p className={styles.locationCity}>La Plata</p>
                  <p className={styles.locationAddr}>@skinglow.estетicalp</p>
                </div>
              </div>
            </div>

            <div className={styles.social}>
              <a href="https://instagram.com/biesteticafacial" target="_blank" rel="noreferrer" className={styles.socialLink}>
                Instagram · @biesteticafacial
              </a>
            </div>
          </div>

          {/* Right: FAQ */}
          <div className={styles.right}>
            <h3 className={styles.faqTitle}>Preguntas frecuentes</h3>
            <div className={styles.faqs}>
              {FAQS.map((f, i) => (
                <FAQ key={i} question={f.q} answer={f.a} />
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
