"use client";

import { useState, useRef } from "react";
import styles from "./Navbar.module.scss";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const NAV_LINKS = [
  { label: "Servicios", href: "#tratamientos" },
  { label: "Sobre Mí", href: "#sobre-mi" },
  { label: "Resultados", href: "#resultados" },
  { label: "Contacto", href: "#contacto" },
];

export default function Navbar({ hideInitial = false }: { hideInitial?: boolean }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLAnchorElement>(null);

  useGSAP(() => {
    // Si hideInitial es true, ocultamos el logo al principio y lo revelamos después de un delay
    // que coincida con el final de la animación del Preloader
    if (hideInitial) {
      gsap.fromTo(logoRef.current, 
        { opacity: 0 },
        { opacity: 1, duration: 0.8, delay: 3.2, ease: "power2.inOut" }
      );
    }

    const handleScroll = () => {
      const scrolled = window.scrollY > 50;
      if (scrolled !== isScrolled) {
        setIsScrolled(scrolled);
        
        // Animación suave del fondo con GSAP
        gsap.to(navRef.current, {
          backgroundColor: scrolled ? "rgba(3, 3, 3, 0.95)" : "rgba(3, 3, 3, 0)",
          borderBottomColor: scrolled ? "rgba(201, 169, 110, 0.2)" : "rgba(201, 169, 110, 0)",
          paddingTop: scrolled ? "0.8rem" : "1.25rem",
          paddingBottom: scrolled ? "0.8rem" : "1.25rem",
          backdropFilter: scrolled ? "blur(10px)" : "blur(0px)",
          duration: 0.4,
          ease: "power2.out",
        });
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isScrolled]);

  return (
    <nav ref={navRef} className={`${styles.nav} ${isScrolled ? styles.scrolled : ""}`}>
      <div className="container">
        <div className={styles.inner}>
          
          {/* Logo */}
          <a ref={logoRef} href="#" className={styles.logo}>
            <div className={styles.logoMono}>BI</div>
            <div className={styles.logoText}>
              <span className={styles.name}>Branko Iriart</span>
              <span className={styles.tagline}>Estética Facial</span>
            </div>
          </a>

          {/* Nav Links */}
          <ul className={styles.links}>
            {NAV_LINKS.map(link => (
              <li key={link.label}>
                <a href={link.href} className={styles.link}>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          {/* CTA Mobile / Desktop highlight */}
          <a 
            href="https://wa.me/541173608299" 
            target="_blank" 
            rel="noreferrer" 
            className={styles.cta}
          >
            Reservar
          </a>

        </div>
      </div>
    </nav>
  );
}
