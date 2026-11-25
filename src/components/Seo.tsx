import { useEffect, useMemo } from 'react'
import { usePublicContent } from '../cms/publicContent'

const TITLE = 'Dr. Branko Iriart | Estética Facial en Ensenada y La Plata'
const DESCRIPTION = 'Estética facial y armonización facial con atención personalizada en Ensenada y La Plata. Conocé tratamientos, resultados y coordiná tu consulta con el Dr. Branko Iriart.'

function upsertMeta(selector: string, attributes: Record<string,string>) {
  let element = document.head.querySelector<HTMLMetaElement>(selector)
  if (!element) {
    element = document.createElement('meta')
    document.head.appendChild(element)
  }
  Object.entries(attributes).forEach(([key,value]) => element!.setAttribute(key,value))
}

function upsertCanonical(url: string) {
  let element = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
  if (!element) {
    element = document.createElement('link')
    element.rel = 'canonical'
    document.head.appendChild(element)
  }
  element.href = url
}

export default function Seo() {
  const { data } = usePublicContent()

  const structuredData = useMemo(() => {
    if (typeof window === 'undefined') return null
    const baseUrl = `${window.location.origin}/`
    const locations = data.locations
      .filter((location) => location.city || (location.address && !location.address.startsWith('@')))
      .map((location) => ({
        '@type':'PostalAddress',
        ...(location.address && !location.address.startsWith('@') ? { streetAddress:location.address } : {}),
        ...(location.city ? { addressLocality:location.city } : {}),
        addressRegion:'Buenos Aires',
        addressCountry:'AR',
      }))
    const socialImage = data.media.find((media) => ['profile','clinic','treatment','general'].includes(media.kind || 'general'))

    return {
      '@context':'https://schema.org',
      '@graph':[
        {
          '@type':'WebSite',
          '@id':`${baseUrl}#website`,
          url:baseUrl,
          name:data.site.site_name || 'Branko Iriart',
          inLanguage:'es-AR',
        },
        {
          '@type':'LocalBusiness',
          '@id':`${baseUrl}#business`,
          name:data.site.professional_name || data.site.site_name || 'Dr. Branko Iriart',
          url:baseUrl,
          description:DESCRIPTION,
          ...(data.site.whatsapp_number ? { telephone:`+${String(data.site.whatsapp_number).replace(/\D/g,'')}` } : {}),
          ...(data.site.instagram_url ? { sameAs:[data.site.instagram_url] } : {}),
          ...(locations.length ? { address:locations } : {}),
          areaServed:[...new Set(data.locations.map((location) => location.city).filter(Boolean))],
          ...(socialImage?.public_url ? { image:socialImage.public_url } : {}),
        },
      ],
    }
  },[data])

  useEffect(() => {
    document.title = TITLE
    upsertMeta('meta[name="description"]',{name:'description',content:DESCRIPTION})
    upsertMeta('meta[property="og:title"]',{property:'og:title',content:TITLE})
    upsertMeta('meta[property="og:description"]',{property:'og:description',content:DESCRIPTION})
    upsertMeta('meta[property="og:type"]',{property:'og:type',content:'website'})
    upsertMeta('meta[property="og:locale"]',{property:'og:locale',content:'es_AR'})
    upsertMeta('meta[property="og:site_name"]',{property:'og:site_name',content:data.site.site_name || 'Branko Iriart'})
    upsertMeta('meta[name="twitter:title"]',{name:'twitter:title',content:TITLE})
    upsertMeta('meta[name="twitter:description"]',{name:'twitter:description',content:DESCRIPTION})

    const isPublicHost = !['localhost','127.0.0.1'].includes(window.location.hostname)
    if (isPublicHost) {
      const canonical = `${window.location.origin}/`
      upsertCanonical(canonical)
      upsertMeta('meta[property="og:url"]',{property:'og:url',content:canonical})
    }

    const socialImage = data.media.find((media) => ['profile','clinic','treatment','general'].includes(media.kind || 'general'))
    if (socialImage?.public_url) {
      upsertMeta('meta[property="og:image"]',{property:'og:image',content:socialImage.public_url})
      upsertMeta('meta[property="og:image:alt"]',{property:'og:image:alt',content:socialImage.alt_text || 'Branko Iriart · estética facial'})
      upsertMeta('meta[name="twitter:card"]',{name:'twitter:card',content:'summary_large_image'})
      upsertMeta('meta[name="twitter:image"]',{name:'twitter:image',content:socialImage.public_url})
    }

    const id = 'branko-structured-data'
    let script = document.getElementById(id) as HTMLScriptElement | null
    if (!script) {
      script = document.createElement('script')
      script.id = id
      script.type = 'application/ld+json'
      document.head.appendChild(script)
    }
    script.textContent = JSON.stringify(structuredData)
  },[data,structuredData])

  return null
}
