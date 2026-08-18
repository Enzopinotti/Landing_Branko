import { usePublicContent } from '@/cms/publicContent'
import { HeroGeometric } from './ui/shape-landing-hero'

export default function Hero() {
  const { text, whatsappUrl } = usePublicContent()
  return (
    <section id="inicio">
      <HeroGeometric
        badge={text('hero.badge')}
        title1={text('hero.title_primary')}
        title2={text('hero.title_accent')}
        subtitle={text('hero.subtitle')}
        ctaLabel={text('hero.primary_cta_label')}
        ctaHref={whatsappUrl('booking')}
        ghostLabel={text('hero.secondary_cta_label')}
        ghostHref="#tratamientos"
      />
    </section>
  )
}
