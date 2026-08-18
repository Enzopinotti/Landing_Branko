import { FormEvent, useEffect, useMemo, useState } from 'react'
import { Save } from 'lucide-react'
import type { CmsSettings } from '@/cms/types'
import { Spinner } from '../components/Ui'
import styles from '../AdminApp.module.scss'

const emptySettings: Partial<CmsSettings> = {
  site_name: '',
  professional_name: '',
  professional_license: '',
  whatsapp_number: '',
  whatsapp_booking_message: '',
  whatsapp_consult_message: '',
  instagram_handle: '',
  instagram_url: '',
  patients_metric: '',
  followers_metric: '',
  treatments_metric: '',
  personalized_metric: '',
  status: 'published',
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  help,
  textarea = false,
  type = 'text',
  wide = false,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  help?: string
  textarea?: boolean
  type?: string
  wide?: boolean
}) {
  const id = `setting-${label.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`
  return (
    <label className={`${styles.formField} ${wide ? styles.formFieldWide : ''}`} htmlFor={id}>
      <span>{label}</span>
      {textarea ? (
        <textarea id={id} rows={4} value={value} placeholder={placeholder} onChange={(event) => onChange(event.target.value)} />
      ) : (
        <input id={id} type={type} value={value} placeholder={placeholder} onChange={(event) => onChange(event.target.value)} />
      )}
      {help && <small>{help}</small>}
    </label>
  )
}

export default function GeneralView({
  settings,
  busy,
  onSave,
}: {
  settings?: CmsSettings
  busy: boolean
  onSave: (record: Partial<CmsSettings>) => Promise<void>
}) {
  const [draft, setDraft] = useState<Partial<CmsSettings>>({ ...emptySettings, ...(settings || {}) })

  useEffect(() => {
    setDraft({ ...emptySettings, ...(settings || {}) })
  }, [settings])

  const dirty = useMemo(() => JSON.stringify({ ...emptySettings, ...(settings || {}) }) !== JSON.stringify(draft), [draft, settings])

  const set = (key: keyof CmsSettings, value: string) => setDraft((current) => ({ ...current, [key]: value }))

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    await onSave(draft)
  }

  return (
    <section className={styles.pageSection}>
      <div className={styles.sectionHeading}>
        <div>
          <span className={styles.eyebrow}>Configuración transversal</span>
          <h2>Datos generales</h2>
          <p>Contacto, redes, mensajes de WhatsApp y métricas que se reutilizan en toda la landing.</p>
        </div>
        <span className={`${styles.unsavedBadge} ${dirty ? styles.unsavedBadgeActive : ''}`}>
          {dirty ? 'Cambios sin guardar' : 'Sin cambios pendientes'}
        </span>
      </div>

      <form className={styles.formCard} onSubmit={submit}>
        <div className={styles.formSectionTitle}>
          <h3>Identidad profesional</h3>
          <p>Datos que aparecen en títulos, credenciales y presentación.</p>
        </div>
        <div className={styles.formGrid}>
          <Field label="Nombre del sitio" value={draft.site_name || ''} onChange={(value) => set('site_name', value)} placeholder="Branko Iriart" />
          <Field label="Nombre profesional" value={draft.professional_name || ''} onChange={(value) => set('professional_name', value)} placeholder="Dr. Branko Iriart" />
          <Field label="Matrícula / credencial" value={draft.professional_license || ''} onChange={(value) => set('professional_license', value)} placeholder="IMP 15.493" />
        </div>

        <div className={styles.formDivider} />
        <div className={styles.formSectionTitle}>
          <h3>WhatsApp</h3>
          <p>Mensajes prearmados para reservar y consultar.</p>
        </div>
        <div className={styles.formGrid}>
          <Field label="Número de WhatsApp" value={draft.whatsapp_number || ''} onChange={(value) => set('whatsapp_number', value)} placeholder="541173608299" help="Usá código de país y área, sólo números." />
          <Field label="Mensaje para reservar" value={draft.whatsapp_booking_message || ''} onChange={(value) => set('whatsapp_booking_message', value)} textarea wide placeholder="Hola Dr. Branko, quiero reservar un turno." />
          <Field label="Mensaje para consultar" value={draft.whatsapp_consult_message || ''} onChange={(value) => set('whatsapp_consult_message', value)} textarea wide placeholder="Hola Dr. Branko, me gustaría hacer una consulta." />
        </div>

        <div className={styles.formDivider} />
        <div className={styles.formSectionTitle}>
          <h3>Redes y métricas</h3>
          <p>Valores visibles en la sección de presentación.</p>
        </div>
        <div className={styles.formGrid}>
          <Field label="Usuario de Instagram" value={draft.instagram_handle || ''} onChange={(value) => set('instagram_handle', value)} placeholder="@biesteticafacial" />
          <Field label="URL de Instagram" value={draft.instagram_url || ''} onChange={(value) => set('instagram_url', value)} placeholder="https://instagram.com/..." type="url" />
          <Field label="Pacientes" value={draft.patients_metric || ''} onChange={(value) => set('patients_metric', value)} placeholder="+500" />
          <Field label="Seguidores" value={draft.followers_metric || ''} onChange={(value) => set('followers_metric', value)} placeholder="+2.700" />
          <Field label="Tratamientos" value={draft.treatments_metric || ''} onChange={(value) => set('treatments_metric', value)} placeholder="6+" />
          <Field label="Enfoque personalizado" value={draft.personalized_metric || ''} onChange={(value) => set('personalized_metric', value)} placeholder="100%" />
        </div>

        <div className={styles.formActionsSticky}>
          <span>{dirty ? 'Hay cambios pendientes.' : 'Los datos están sincronizados.'}</span>
          <button className={styles.primaryButton} type="submit" disabled={busy || !dirty}>
            {busy ? <Spinner /> : <Save size={17} />}
            {busy ? 'Guardando...' : 'Guardar cambios'}
          </button>
        </div>
      </form>
    </section>
  )
}
