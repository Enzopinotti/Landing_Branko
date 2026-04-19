import { HeroGeometric } from './ui/shape-landing-hero'

export default function Hero() {
  return (
    <section id="inicio">
      <HeroGeometric
        badge="Estética Facial de Alta Precisión · IMP 15.493"
        title1="La belleza que ya"
        title2="tenés."
        subtitle="Botox, Plasma PRP, Ácido Hialurónico y más. Tratamientos personalizados en Ensenada y La Plata. Sin paquetes estándar."
        ctaLabel="Reservar turno"
        ctaHref="https://wa.me/541173608299?text=Hola%20Dr.%20Branko!%20Quiero%20reservar%20un%20turno."
        ghostLabel="Ver tratamientos"
        ghostHref="#tratamientos"
      />
    </section>
  )
}
