import { Activity } from 'lucide-react'
import type { CmsAuditRecord } from '@/cms/types'
import { EmptyState } from '../components/Ui'
import styles from '../AdminApp.module.scss'

const actionLabels: Record<string, string> = {
  login: 'Inicio de sesión',
  login_failed: 'Acceso rechazado',
  logout: 'Cierre de sesión',
  create: 'Creación',
  update: 'Actualización',
  archive: 'Archivo',
  restore: 'Restauración',
  upload: 'Carga de imagen',
  link: 'Vínculo de imagen',
  unlink: 'Desvinculación',
  change_password: 'Cambio de contraseña',
  reset: 'Reset de contraseña',
  setup: 'Inicialización',
}

function formatDate(value: string) {
  try {
    return new Intl.DateTimeFormat('es-AR', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(new Date(value))
  } catch {
    return value
  }
}

export default function ActivityView({ records }: { records: CmsAuditRecord[] }) {
  return (
    <section className={styles.pageSection}>
      <div className={styles.sectionHeading}>
        <div>
          <span className={styles.eyebrow}>Auditoría</span>
          <h2>Actividad reciente</h2>
          <p>Últimas acciones registradas por el backend. Sirve para entender qué cambió y cuándo.</p>
        </div>
      </div>

      {records.length ? (
        <div className={styles.timeline}>
          {records.map((record) => (
            <article className={styles.timelineItem} key={record.audit_id}>
              <div className={styles.timelineIcon}><Activity size={16} /></div>
              <div className={styles.timelineBody}>
                <div className={styles.recordTitleLine}>
                  <strong>{actionLabels[record.action] || record.action}</strong>
                  <span className={styles.auditChannel}>{record.channel}</span>
                </div>
                <p><span>{record.entity || 'Sistema'}</span>{record.entity_id ? ` · ${record.entity_id}` : ''}</p>
                <small>Actor: {record.actor || 'system'}</small>
              </div>
              <time>{formatDate(record.created_at)}</time>
            </article>
          ))}
        </div>
      ) : <EmptyState title="Sin actividad reciente" description="Las acciones administrativas van a aparecer acá." />}
    </section>
  )
}
