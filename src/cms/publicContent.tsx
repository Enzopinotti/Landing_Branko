import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react'
import { cmsClient } from './client'
import type { CmsMedia, CmsMediaLink, CmsPublicBootstrapData } from './types'

const fallback: CmsPublicBootstrapData = {
  site: {
    site_name: 'Branko Iriart', professional_name: 'Dr. Branko Iriart', professional_license: 'IMP 15.493',
    whatsapp_number: '541173608299', whatsapp_booking_message: 'Hola Dr. Branko! Quiero reservar un turno.', whatsapp_consult_message: 'Hola Dr. Branko! Me gustaría hacer una consulta.',
    instagram_handle: '@biesteticafacial', instagram_url: 'https://instagram.com/biesteticafacial', patients_metric: '+500', followers_metric: '+2.700', treatments_metric: '6+', personalized_metric: '100%', status: 'published',
  },
  content: {
    'hero.badge': 'Estética Facial de Alta Precisión · IMP 15.493', 'hero.title_primary': 'La belleza que ya', 'hero.title_accent': 'tenés.',
    'hero.subtitle': 'Botox, Plasma PRP, Ácido Hialurónico y más. Tratamientos personalizados en Ensenada y La Plata. Sin paquetes estándar.', 'hero.primary_cta_label': 'Reservar turno', 'hero.secondary_cta_label': 'Ver tratamientos',
    'treatments.eyebrow': 'Tratamientos', 'treatments.title_primary': 'Cada rostro,', 'treatments.title_accent': 'su protocolo.', 'treatments.description': 'Todos los tratamientos son personalizados en consulta previa. Sin paquetes estándar. Sin promesas vacías.', 'treatments.bottom_text': '¿No sabés qué tratamiento es para vos?', 'treatments.bottom_cta_label': 'Pedí una consulta gratuita',
    'about.eyebrow': 'El Doctor', 'about.paragraph_1': 'Especialista en estética y armonización facial con formación en las técnicas más actuales de medicina estética no quirúrgica.', 'about.paragraph_2': 'Mi filosofía es simple: potenciar lo que ya tenés. Cada tratamiento comienza con una consulta personalizada donde evaluamos tu estructura facial, tipo de piel y objetivos antes de aplicar cualquier procedimiento.', 'about.paragraph_3': 'Atiendo en Ensenada y en La Plata. Los turnos se coordinan por WhatsApp.', 'about.quote': 'La belleza estética no se construye. Se revela.', 'about.cta_label': 'Hablá con el Doctor',
    'results.eyebrow': 'Resultados', 'results.title_primary': 'Los resultados', 'results.title_accent': 'hablan solos.', 'results.testimonials_title': 'Lo que dicen los pacientes', 'results.before_label': 'Antes', 'results.after_label': 'Después', 'results.placeholder': 'Consultá por Instagram para ver el caso real',
    'contact.eyebrow': 'Contacto', 'contact.title_primary': 'Empezá', 'contact.title_accent': 'hoy.', 'contact.subtitle': 'El primer paso es la consulta. Escribinos y coordinaremos el tratamiento ideal para vos.', 'contact.cta_label': 'Escribir al Dr. Branko', 'contact.faq_title': 'Preguntas frecuentes',
    'footer.tagline': 'Tu mejor versión, desde adentro hacia afuera.', 'footer.treatments_title': 'Tratamientos', 'footer.locations_title': 'Consultorios', 'footer.cta_text': '¿Listo para transformarte?', 'footer.cta_label': 'Reservar turno', 'footer.disclaimer': 'Los resultados pueden variar. Consulte con un profesional antes de realizar cualquier procedimiento.',
  },
  treatments: [
    { treatment_id:'fallback-botox',slug:'botox',icon_key:'✦',title:'Botox',subtitle:'Toxina Botulínica',description:'Relajación muscular de precisión para suavizar expresiones sin perder naturalidad. Resultado visible en 72 hs.',tag:'Más solicitado',sort_order:1,status:'published' },
    { treatment_id:'fallback-plasma',slug:'plasma',icon_key:'◈',title:'Plasma Rico en Plaquetas',subtitle:'PRP Facial',description:'Regeneración celular usando tu propia sangre para mejorar textura, luminosidad e hidratación profunda.',tag:'',sort_order:2,status:'published' },
    { treatment_id:'fallback-hialuronico',slug:'hialuronico',icon_key:'◉',title:'Ácido Hialurónico',subtitle:'Relleno & Volumen',description:'Definición de labios, pómulos y mentón con técnicas avanzadas de sobreproyección y armonización.',tag:'Popular',sort_order:3,status:'published' },
    { treatment_id:'fallback-bioestimulacion',slug:'bioestimulacion',icon_key:'❋',title:'Bioestimulación',subtitle:'Rejuvenecimiento Dérmico',description:'Estimulación del colágeno natural para una piel más firme, elástica y con efecto lifting progresivo.',tag:'',sort_order:4,status:'published' },
    { treatment_id:'fallback-peeling',slug:'peeling',icon_key:'◇',title:'Peeling Químico',subtitle:'Renovación Celular',description:'Exfoliación controlada de capas superficiales para eliminar manchas, cicatrices y piel opaca.',tag:'',sort_order:5,status:'published' },
    { treatment_id:'fallback-limpieza',slug:'limpieza',icon_key:'○',title:'Limpieza Facial',subtitle:'Tratamiento Base',description:'Protocolo de limpieza profunda adaptado a tu tipo de piel. El primero paso para cualquier tratamiento.',tag:'',sort_order:6,status:'published' },
  ],
  locations: [
    { location_id:'fallback-ensenada',city:'Ensenada',name:'Consultorio Principal',address:'Moreno 119, e/ Cestino y Alberdi',secondary_text:'',external_url:'',sort_order:1,status:'published' },
    { location_id:'fallback-laplata',city:'La Plata',name:'Skin Glow Estética LP',address:'@skinglow.estéticalp',secondary_text:'',external_url:'',sort_order:2,status:'published' },
  ],
  resultCases: [
    { result_case_id:'fallback-case-1',category:'Hialurónico',title:'Relleno nasal sin cirugía',description:'Corrección de punta y dorso nasal con ácido hialurónico. Procedimiento de 30 min, sin recuperación.',sort_order:1,status:'published' },
    { result_case_id:'fallback-case-2',category:'Botox',title:'Suavizado de frente y entrecejo',description:'Tratamiento de arrugas de expresión con resultado natural. Efecto visible a los 3 días.',sort_order:2,status:'published' },
    { result_case_id:'fallback-case-3',category:'Labios',title:'Definición y volumen de labios',description:'Proyección de labios respetando la proporción áurea facial del paciente.',sort_order:3,status:'published' },
    { result_case_id:'fallback-case-4',category:'PRP',title:'Plasma para textura de piel',description:'Tratamiento con plasma rico en plaquetas para mejorar luminosidad, textura e hidratación.',sort_order:4,status:'published' },
  ],
  testimonials: [
    { testimonial_id:'fallback-test-1',display_name:'Victoria R.',text:'El Dr. Branko es un artista. El resultado del botox fue increíblemente natural, nunca pensé que quedaría así de bien.',service:'Botox',sort_order:1,status:'published' },
    { testimonial_id:'fallback-test-2',display_name:'Lucía M.',text:'Me hice el hialurónico en los labios y me encantó. Muy profesional, me explicó todo antes del procedimiento.',service:'Hialurónico',sort_order:2,status:'published' },
    { testimonial_id:'fallback-test-3',display_name:'Julia S.',text:'El plasma cambió mi piel completamente. En tres sesiones noté una diferencia increíble en textura y luminosidad.',service:'Plasma PRP',sort_order:3,status:'published' },
  ],
  faqs: [
    { faq_id:'fallback-faq-1',question:'¿Necesito turno previo?',answer:'Sí, todos los tratamientos requieren una consulta previa. Coordiná tu turno por WhatsApp.',sort_order:1,status:'published' },
    { faq_id:'fallback-faq-2',question:'¿Los tratamientos duelen?',answer:'La mayoría de los procedimientos se realizan con anestesia tópica. La molestia es mínima y tolerable.',sort_order:2,status:'published' },
    { faq_id:'fallback-faq-3',question:'¿Cuánto dura el efecto?',answer:'Depende del tratamiento. El Botox dura entre 3-6 meses. El hialurónico entre 9-18 meses dependiendo de la zona.',sort_order:3,status:'published' },
    { faq_id:'fallback-faq-4',question:'¿Tienen financiación?',answer:'Sí, consultá por los métodos de pago disponibles directamente con el consultorio.',sort_order:4,status:'published' },
  ],
  media: [], mediaLinks: [],
  meta: { app:'Branko Iriart CMS',version:'fallback',schemaVersion:'1',generatedAt:'' },
}

type PublicContentLoadState = 'loading' | 'ready'

type PublicContentContextValue = {
  data: CmsPublicBootstrapData
  remoteActive: boolean
  loadState: PublicContentLoadState
  text: (key: string) => string
  whatsappUrl: (kind?: 'booking' | 'consult') => string
  mediaFor: (entityType: string, entityId: string, fieldKey: string) => CmsMedia | undefined
}

const PublicContentContext = createContext<PublicContentContextValue | null>(null)

function normalizePhone(value?: string) { return String(value || '').replace(/\D/g,'') || '541173608299' }
function buildWhatsapp(phone: string, message?: string) { const base = `https://wa.me/${normalizePhone(phone)}`; return message ? `${base}?text=${encodeURIComponent(message)}` : base }

export function PublicContentProvider({ children }: { children: ReactNode }) {
  const [data,setData] = useState<CmsPublicBootstrapData>(fallback)
  const [remoteActive,setRemoteActive] = useState(false)
  const [loadState,setLoadState] = useState<PublicContentLoadState>('loading')

  useEffect(() => {
    let active = true
    let retryTimer: number | undefined
    let attempt = 0

    const loadRemote = async () => {
      try {
        const remote = await cmsClient.bootstrap()
        if (!active) return
        if (remote.content?.['cms.public_ready'] !== 'true') throw new Error('El CMS público todavía no está listo.')
        const merged = { ...remote, site:{...fallback.site,...remote.site}, content:{...fallback.content,...remote.content} }
        setData(merged)
        setRemoteActive(true)
        setLoadState('ready')
      } catch {
        if (!active) return
        attempt += 1
        const retryDelay = Math.min(1200 + attempt * 800, 5000)
        retryTimer = window.setTimeout(() => { void loadRemote() }, retryDelay)
      }
    }

    void loadRemote()
    return () => {
      active = false
      if (retryTimer) window.clearTimeout(retryTimer)
    }
  }, [])

  const value = useMemo<PublicContentContextValue>(() => ({
    data, remoteActive, loadState,
    text: (key) => data.content[key] ?? fallback.content[key] ?? '',
    whatsappUrl: (kind='booking') => buildWhatsapp(data.site.whatsapp_number, kind === 'booking' ? data.site.whatsapp_booking_message : data.site.whatsapp_consult_message),
    mediaFor: (entityType,entityId,fieldKey) => {
      const link = data.mediaLinks.find((item: CmsMediaLink) => item.entity_type === entityType && item.entity_id === entityId && item.field_key === fieldKey)
      return data.media.find((item: CmsMedia) => item.media_id === link?.media_id)
    },
  }), [data,remoteActive,loadState])

  return <PublicContentContext.Provider value={value}>{children}</PublicContentContext.Provider>
}

export function usePublicContent() {
  const context = useContext(PublicContentContext)
  if (!context) throw new Error('usePublicContent debe usarse dentro de PublicContentProvider.')
  return context
}
