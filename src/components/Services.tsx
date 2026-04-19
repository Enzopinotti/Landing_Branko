import styles from './Services.module.scss'

const SERVICES = [
  {
    id: 'botox',
    icon: '✦',
    title: 'Botox',
    subtitle: 'Toxina Botulínica',
    desc: 'Relajación muscular de precisión para suavizar expresiones sin perder naturalidad. Resultado visible en 72 hs.',
    tag: 'Más solicitado',
  },
  {
    id: 'plasma',
    icon: '◈',
    title: 'Plasma Rico en Plaquetas',
    subtitle: 'PRP Facial',
    desc: 'Regeneración celular usando tu propia sangre para mejorar textura, luminosidad e hidratación profunda.',
    tag: null,
  },
  {
    id: 'hialuronico',
    icon: '◉',
    title: 'Ácido Hialurónico',
    subtitle: 'Relleno & Volumen',
    desc: 'Definición de labios, pómulos y mentón con técnicas avanzadas de sobreproyección y armonización.',
    tag: 'Popular',
  },
  {
    id: 'bioestimulacion',
    icon: '❋',
    title: 'Bioestimulación',
    subtitle: 'Rejuvenecimiento Dérmico',
    desc: 'Estimulación del colágeno natural para una piel más firme, elástica y con efecto lifting progresivo.',
    tag: null,
  },
  {
    id: 'peeling',
    icon: '◇',
    title: 'Peeling Químico',
    subtitle: 'Renovación Celular',
    desc: 'Exfoliación controlada de capas superficiales para eliminar manchas, cicatrices y piel opaca.',
    tag: null,
  },
  {
    id: 'limpieza',
    icon: '○',
    title: 'Limpieza Facial',
    subtitle: 'Tratamiento Base',
    desc: 'Protocolo de limpieza profunda adaptado a tu tipo de piel. El primero paso para cualquier tratamiento.',
    tag: null,
  },
]

export default function Services() {
  return (
    <section className={styles.section} id="tratamientos">
      <div className="container">
        {/* Header */}
        <div className={styles.header}>
          <span className={styles.label}>
            <span className={styles.labelLine} />
            Tratamientos
          </span>
          <h2 className={styles.title}>
            Cada rostro,<br />
            <em>su protocolo.</em>
          </h2>
          <p className={styles.desc}>
            Todos los tratamientos son personalizados en consulta previa.
            Sin paquetes estándar. Sin promesas vacías.
          </p>
        </div>

        {/* Grid */}
        <div className={styles.grid}>
          {SERVICES.map((s, i) => (
            <article key={s.id} className={styles.card} style={{ '--delay': `${i * 0.07}s` } as React.CSSProperties}>
              {s.tag && <span className={styles.cardTag}>{s.tag}</span>}
              <div className={styles.cardIcon}>{s.icon}</div>
              <h3 className={styles.cardTitle}>{s.title}</h3>
              <p className={styles.cardSub}>{s.subtitle}</p>
              <p className={styles.cardDesc}>{s.desc}</p>
              <a
                href="https://wa.me/541173608299"
                target="_blank"
                rel="noreferrer"
                className={styles.cardCta}
              >
                Consultar <span className={styles.arrow}>→</span>
              </a>
            </article>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className={styles.bottomCta}>
          <p className={styles.bottomText}>
            ¿No sabés qué tratamiento es para vos?
          </p>
          <a
            href="https://wa.me/541173608299?text=Hola%20Dr.%20Branko!%20Me%20gustar%C3%ADa%20hacer%20una%20consulta."
            target="_blank"
            rel="noreferrer"
            className={styles.bottomBtn}
          >
            Pedí una consulta gratuita
          </a>
        </div>
      </div>
    </section>
  )
}
