import { useState, useEffect } from 'react'
import styles from './Navbar.module.scss'

const LINKS = [
  { label: 'Inicio',       href: '#inicio' },
  { label: 'Tratamientos', href: '#tratamientos' },
  { label: 'El Doctor',    href: '#sobre-mi' },
  { label: 'Resultados',   href: '#resultados' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav className={`${styles.nav} ${scrolled ? styles.scrolled : ''}`}>
      <div className={`container ${styles.inner}`}>
        {/* Logo */}
        <a href="#inicio" className={styles.logo}>
          <span className={styles.logoMono}>BI</span>
          <span className={styles.logoText}>BRANKO IRIART</span>
        </a>

        {/* Desktop links */}
        <ul className={styles.links}>
          {LINKS.map(l => (
            <li key={l.label}>
              <a href={l.href} className={styles.link}>{l.label}</a>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <a
          href="https://wa.me/541173608299"
          target="_blank"
          rel="noreferrer"
          className={styles.cta}
        >
          Reservar turno
        </a>

        {/* Hamburger */}
        <button
          className={`${styles.burger} ${menuOpen ? styles.burgerOpen : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menú"
        >
          <span /><span /><span />
        </button>
      </div>

      {/* Mobile menu */}
      <div className={`${styles.mobile} ${menuOpen ? styles.mobileOpen : ''}`}>
        {LINKS.map(l => (
          <a
            key={l.label}
            href={l.href}
            className={styles.mobileLink}
            onClick={() => setMenuOpen(false)}
          >{l.label}</a>
        ))}
        <a
          href="https://wa.me/541173608299"
          target="_blank"
          rel="noreferrer"
          className={styles.mobileCta}
          onClick={() => setMenuOpen(false)}
        >Reservar turno</a>
      </div>
    </nav>
  )
}
