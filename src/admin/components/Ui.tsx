import { AlertTriangle, CircleCheck, Inbox, LoaderCircle, X } from 'lucide-react'
import type { CmsStatus } from '@/cms/types'
import styles from '../AdminApp.module.scss'

export function Spinner({ size = 17 }: { size?: number }) {
  return <LoaderCircle className={styles.spinner} size={size} aria-hidden="true" />
}

export function SectionLoader({ label = 'Cargando contenido' }: { label?: string }) {
  return (
    <div className={styles.sectionLoader} aria-live="polite" aria-busy="true">
      <div className={styles.skeletonHeading} />
      <div className={styles.skeletonToolbar} />
      <div className={styles.skeletonGrid}>
        <div /><div /><div />
      </div>
      <span><Spinner size={16} /> {label}</span>
    </div>
  )
}

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string
  description: string
  action?: React.ReactNode
}) {
  return (
    <div className={styles.emptyState}>
      <div className={styles.emptyIcon}><Inbox size={22} /></div>
      <h3>{title}</h3>
      <p>{description}</p>
      {action}
    </div>
  )
}

export function StatusBadge({ status }: { status?: CmsStatus }) {
  const current = status || 'draft'
  const labels: Record<CmsStatus, string> = {
    published: 'Publicado',
    draft: 'Borrador',
    archived: 'Archivado',
  }
  return <span className={`${styles.statusBadge} ${styles[`status_${current}`]}`}>{labels[current]}</span>
}

export type ToastData = {
  id: string
  type: 'success' | 'error' | 'info'
  message: string
}

export function ToastRegion({ toasts, onDismiss }: { toasts: ToastData[]; onDismiss: (id: string) => void }) {
  return (
    <div className={styles.toastRegion} aria-live="polite" aria-atomic="false">
      {toasts.map((toast) => (
        <div className={`${styles.toast} ${styles[`toast_${toast.type}`]}`} key={toast.id}>
          {toast.type === 'success' ? <CircleCheck size={18} /> : toast.type === 'error' ? <AlertTriangle size={18} /> : <span className={styles.toastDot} />}
          <span>{toast.message}</span>
          <button type="button" onClick={() => onDismiss(toast.id)} aria-label="Cerrar aviso"><X size={15} /></button>
        </div>
      ))}
    </div>
  )
}
