import styles from './Footer.module.scss'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.top}>
          {/* Brand */}
          <div className={styles.brand}>
            <div className={styles.logo}>
              <span className={styles.logoMono}>BI</span>
              <div>
                <p className={styles.logoName}>BRANKO IRIART</p>
                <p className={styles.logoSub}>Estética &amp; Armonización Facial</p>
              </div>
            </div>
            <p className={styles.tagline}>
              Tu mejor versión, desde adentro hacia afuera.
            </p>
          </div>

          {/* Links */}
          <div className={styles.links}>
            <p className={styles.linksTitle}>Tratamientos</p>
            {['Botox', 'Plasma PRP', 'Ácido Hialurónico', 'Bioestimulación', 'Peeling', 'Limpieza Facial'].map(l => (
              <a key={l} href="#tratamientos" className={styles.link}>{l}</a>
            ))}
          </div>

          <div className={styles.links}>
            <p className={styles.linksTitle}>Consultorios</p>
            <p className={styles.linkText}>Ensenada</p>
            <p className={styles.linkText}>Moreno 119, e/ Cestino y Alberdi</p>
            <br />
            <p className={styles.linkText}>IMP 15.493</p>
            <a href="https://instagram.com/biesteticafacial" target="_blank" rel="noreferrer" className={styles.link}>
              @biesteticafacial
            </a>
          </div>

          {/* CTA block */}
          <div className={styles.ctaBlock}>
            <p className={styles.ctaText}>¿Listo para transformarte?</p>
            <a
              href="https://wa.me/541173608299"
              target="_blank"
              rel="noreferrer"
              className={styles.ctaBtn}
            >
              Reservar turno
            </a>
            <p className={styles.phone}>+54 11 7360-8299</p>
          </div>
        </div>

        <div className={styles.bottom}>
          <p className={styles.copy}>
            © {new Date().getFullYear()} Dr. Branko Iriart · Todos los derechos reservados
          </p>
          <p className={styles.disclaimer}>
            Los resultados pueden variar. Consulte con un profesional antes de realizar cualquier procedimiento.
          </p>
        </div>
      </div>
    </footer>
  )
}
