import { Activity, ArrowRight, CircleHelp, FileText, Image as ImageIcon, MapPin, MessageSquareQuote, Sparkles } from 'lucide-react'
import type { CmsOverviewData } from '@/cms/types'
import type { AdminView } from '../adminConfig'
import { EmptyState, StatusBadge } from '../components/Ui'
import styles from '../AdminApp.module.scss'

const metricCards:Array<{key:keyof CmsOverviewData['counts'];label:string;hint:string;view:AdminView;icon:typeof FileText}>=[
  {key:'content',label:'Textos',hint:'bloques administrables',view:'content',icon:FileText},{key:'treatments',label:'Tratamientos',hint:'servicios',view:'treatments',icon:Sparkles},{key:'resultCases',label:'Resultados',hint:'casos',view:'resultCases',icon:ImageIcon},{key:'testimonials',label:'Testimonios',hint:'opiniones',view:'testimonials',icon:MessageSquareQuote},{key:'locations',label:'Ubicaciones',hint:'puntos de atención',view:'locations',icon:MapPin},{key:'faqs',label:'Preguntas frecuentes',hint:'respuestas',view:'faqs',icon:CircleHelp},{key:'media',label:'Biblioteca',hint:'imágenes',view:'media',icon:ImageIcon},
]
const labels:Record<string,string>={treatments:'Tratamientos',resultCases:'Resultados',testimonials:'Testimonios',locations:'Ubicaciones',faqs:'Preguntas frecuentes'}
const actionLabels:Record<string,string>={login:'Inicio de sesión',logout:'Cierre de sesión',create:'Registro creado',update:'Registro actualizado',archive:'Registro archivado',restore:'Registro restaurado',upload:'Imagen subida',link:'Imagen vinculada',unlink:'Imagen desvinculada',change_password:'Contraseña actualizada',setup:'CMS inicializado'}
function formatDate(value:string){if(!value)return'—';try{return new Intl.DateTimeFormat('es-AR',{day:'2-digit',month:'short',hour:'2-digit',minute:'2-digit'}).format(new Date(value))}catch{return value}}

export default function OverviewView({overview,onNavigate}:{overview:CmsOverviewData;onNavigate:(view:AdminView)=>void}){
  return <section className={styles.pageSection}>
    <div className={styles.heroPanel}><div><span className={styles.eyebrow}>Todo en orden</span><h2>{overview.settings.professional_name || 'Dr. Branko Iriart'}</h2><p>El panel administra contenido, colecciones, imágenes y acceso sin tocar la estructura visual de la landing.</p></div><div className={styles.statusPill}><span /> CMS conectado</div></div>
    <div className={styles.metricsGrid}>{metricCards.map((item)=>{const Icon=item.icon,summary=overview.counts[item.key];return <button className={styles.metricCardButton} key={item.key} type="button" onClick={()=>onNavigate(item.view)}><div className={styles.metricIcon}><Icon size={18}/></div><span>{item.label}</span><strong>{summary.published}<small> / {summary.total}</small></strong><p>{item.hint} · {summary.draft} borrador{summary.draft===1?'':'es'}</p><ArrowRight size={16} className={styles.metricArrow}/></button>})}</div>
    <div className={styles.dashboardGrid}>
      <article className={styles.panelCard}><div className={styles.sectionHeadingCompact}><div><span className={styles.eyebrow}>Publicación</span><h3>Estado de colecciones</h3></div></div><div className={styles.collectionRows}>{(['treatments','resultCases','testimonials','locations','faqs'] as const).map((key)=><button className={styles.collectionRowButton} type="button" key={key} onClick={()=>onNavigate(key)}><span>{labels[key]}</span><div><StatusBadge status={overview.counts[key].published?'published':'draft'}/><strong>{overview.counts[key].published}</strong><small> de {overview.counts[key].total}</small></div></button>)}</div></article>
      <article className={styles.panelCard}><div className={styles.sectionHeadingCompact}><div><span className={styles.eyebrow}>Auditoría</span><h3>Actividad reciente</h3></div><button className={styles.textButton} type="button" onClick={()=>onNavigate('activity')}>Ver todo <ArrowRight size={14}/></button></div>{overview.recentActivity.length?<div className={styles.activityList}>{overview.recentActivity.slice(0,6).map((item)=><div className={styles.activityItem} key={item.audit_id}><div className={styles.activityIcon}><Activity size={15}/></div><div><strong>{actionLabels[item.action]||item.action}</strong><span>{item.entity||'Sistema'}</span></div><time>{formatDate(item.created_at)}</time></div>)}</div>:<EmptyState title="Todavía no hay actividad" description="Las acciones del panel van a aparecer acá."/>}</article>
    </div>
  </section>
}
