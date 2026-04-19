import styles from './About.module.scss'

const CREDENTIALS = [
  { value: 'IMP 15.493', label: 'Matrícula Profesional' },
  { value: 'Ensenada', label: 'Consultorio Principal' },
  { value: 'La Plata', label: 'Consultorio Secundario' },
  { value: '100%', label: 'Enfoque personalizado' },
]

export default function About() {
  return (
    <section className={styles.section} id="sobre-mi">
      <div className="container">
        <div className={styles.inner}>

          {/* Left: Visual block */}
          <div className={styles.left}>
            <div className={styles.mono}>
              <span className={styles.monoLetter}>B</span>
              <span className={styles.monoLetter}>I</span>
            </div>
            <div className={styles.credentials}>
              {CREDENTIALS.map(c => (
                <div key={c.label} className={styles.cred}>
                  <span className={styles.credValue}>{c.value}</span>
                  <span className={styles.credLabel}>{c.label}</span>
                </div>
              ))}
            </div>
            <div className={styles.instaBadge}>
              <span className={styles.instaIcon}>@</span>
              <div>
                <p className={styles.instaHandle}>biesteticafacial</p>
                <p className={styles.instaFollowers}>+2.700 seguidores</p>
              </div>
            </div>
          </div>

          {/* Right: Text */}
          <div className={styles.right}>
            <span className={styles.label}>
              <span className={styles.labelLine} />
              El Doctor
            </span>

            <h2 className={styles.title}>
              Dr. Branko<br />
              <em>Iriart</em>
            </h2>

            <p className={styles.text}>
              Especialista en estética y armonización facial con formación en las
              técnicas más actuales de medicina estética no quirúrgica.
            </p>

            <p className={styles.text}>
              Mi filosofía es simple: potenciar lo que ya tenés. Cada tratamiento
              comienza con una consulta personalizada donde evaluamos tu estructura
              facial, tipo de piel y objetivos antes de aplicar cualquier procedimiento.
            </p>

            <p className={styles.text}>
              Atiendo en <strong>Ensenada</strong> (Moreno 119, e/ Cestino y Alberdi)
              y en <strong>La Plata</strong> (@skinglow.estéticalp). Los turnos se
              coordinan por WhatsApp.
            </p>

            <div className={styles.philosophy}>
              <span className={styles.quoteDecor}>"</span>
              <blockquote className={styles.quote}>
                La belleza estética no se construye. Se revela.
              </blockquote>
            </div>

            <a
              href="https://wa.me/541173608299"
              target="_blank"
              rel="noreferrer"
              className={styles.btn}
            >
              Hablá con el Doctor
            </a>
          </div>

        </div>
      </div>
    </section>
  )
}
