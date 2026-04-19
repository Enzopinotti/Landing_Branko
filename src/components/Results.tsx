import { useState } from 'react'
import styles from './Results.module.scss'

const CASES = [
  { id: 1, category: 'Hialurónico', title: 'Relleno nasal sin cirugía', desc: 'Corrección de punta y dorso nasal con ácido hialurónico. Procedimiento de 30 min, sin recuperación.' },
  { id: 2, category: 'Botox', title: 'Suavizado de frente y entrecejo', desc: 'Tratamiento de arrugas de expresión con resultado natural. Efecto visible a los 3 días.' },
  { id: 3, category: 'Labios', title: 'Definición y volumen de labios', desc: 'Proyección de labios respetando la proporción áurea facial del paciente.' },
  { id: 4, category: 'PRP', title: 'Plasma para textura de piel', desc: 'Tratamiento con plasma rico en plaquetas para mejorar luminosidad, textura e hidratación.' },
]

const TESTIMONIALS = [
  { name: 'Victoria R.', text: 'El Dr. Branko es un artista. El resultado del botox fue increíblemente natural, nunca pensé que quedaría así de bien.', service: 'Botox' },
  { name: 'Lucía M.', text: 'Me hice el hialurónico en los labios y me encantó. Muy profesional, me explicó todo antes del procedimiento.', service: 'Hialurónico' },
  { name: 'Julia S.', text: 'El plasma cambió mi piel completamente. En tres sesiones noté una diferencia increíble en textura y luminosidad.', service: 'Plasma PRP' },
]

export default function Results() {
  const [active, setActive] = useState(0)

  return (
    <section className={styles.section} id="resultados">
      <div className="container">

        {/* Header */}
        <div className={styles.header}>
          <span className={styles.label}>
            <span className={styles.labelLine} />
            Resultados
          </span>
          <h2 className={styles.title}>
            Los resultados<br />
            <em>hablan solos.</em>
          </h2>
        </div>

        {/* Cases */}
        <div className={styles.cases}>
          {CASES.map((c, i) => (
            <button
              key={c.id}
              className={`${styles.case} ${active === i ? styles.caseActive : ''}`}
              onClick={() => setActive(i)}
            >
              <div className={styles.caseNum}>0{i + 1}</div>
              <div className={styles.caseInfo}>
                <span className={styles.caseCat}>{c.category}</span>
                <p className={styles.caseTitle}>{c.title}</p>
                {active === i && <p className={styles.caseDesc}>{c.desc}</p>}
              </div>
              <span className={styles.casePlus}>{active === i ? '−' : '+'}</span>
            </button>
          ))}
        </div>

        {/* Before / After placeholder */}
        <div className={styles.baWrap}>
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
          <h3 className={styles.testTitle}>Lo que dicen los pacientes</h3>
          <div className={styles.testGrid}>
            {TESTIMONIALS.map(t => (
              <div key={t.name} className={styles.testCard}>
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
    </section>
  )
}
