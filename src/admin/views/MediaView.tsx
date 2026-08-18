import { FormEvent, useMemo, useRef, useState } from 'react'
import { Archive, Edit3, ImagePlus, RotateCcw, Search, Upload } from 'lucide-react'
import type { CmsMedia, CmsMediaLink, CmsMediaSectionData, CmsStatus } from '@/cms/types'
import { Modal } from '../components/Modal'
import { EmptyState, Spinner, StatusBadge } from '../components/Ui'
import styles from '../AdminApp.module.scss'

function formatBytes(value: number | string) {
  const bytes = Number(value) || 0
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

function fileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result || ''))
    reader.onerror = () => reject(new Error('No se pudo leer la imagen.'))
    reader.readAsDataURL(file)
  })
}

function activeLinksFor(mediaId: string, links: CmsMediaLink[]) {
  return links.filter((link) => link.media_id === mediaId && link.status !== 'archived')
}

export default function MediaView({
  data,
  busy,
  onUpload,
  onUpdate,
  onArchive,
  onRestore,
}: {
  data: CmsMediaSectionData
  busy: boolean
  onUpload: (file: File, altText: string) => Promise<void>
  onUpdate: (mediaId: string, altText: string) => Promise<void>
  onArchive: (media: CmsMedia) => Promise<void>
  onRestore: (media: CmsMedia) => Promise<void>
}) {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<'all' | CmsStatus>('all')
  const [uploadOpen, setUploadOpen] = useState(false)
  const [editing, setEditing] = useState<CmsMedia | null>(null)
  const [confirming, setConfirming] = useState<CmsMedia | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [altText, setAltText] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const filtered = useMemo(() => {
    const needle = search.trim().toLowerCase()
    return [...data.media]
      .filter((media) => status === 'all' || media.status === status)
      .filter((media) => !needle || `${media.file_name} ${media.alt_text}`.toLowerCase().includes(needle))
      .sort((a, b) => String(b.created_at || '').localeCompare(String(a.created_at || '')))
  }, [data.media, search, status])

  const openUpload = () => {
    setFile(null)
    setAltText('')
    setUploadOpen(true)
  }

  const upload = async (event: FormEvent) => {
    event.preventDefault()
    if (!file) return
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) throw new Error('Usá JPG, PNG o WebP.')
    if (file.size > 6 * 1024 * 1024) throw new Error('La imagen supera el máximo de 6 MB.')
    await onUpload(file, altText)
    setUploadOpen(false)
    setFile(null)
    setAltText('')
  }

  const saveAlt = async (event: FormEvent) => {
    event.preventDefault()
    if (!editing) return
    await onUpdate(editing.media_id, altText)
    setEditing(null)
  }

  return (
    <section className={styles.pageSection}>
      <div className={styles.sectionHeading}>
        <div>
          <span className={styles.eyebrow}>Google Drive</span>
          <h2>Biblioteca de imágenes</h2>
          <p>Subí una sola vez y reutilizá el mismo archivo en distintos campos sin duplicarlo.</p>
        </div>
        <button className={styles.primaryButton} type="button" onClick={openUpload}><Upload size={17} /> Subir imagen</button>
      </div>

      <div className={styles.toolbar}>
        <label className={styles.searchBox}><Search size={17} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar por nombre o alt text..." /></label>
        <div className={styles.filterPills}>
          {(['all', 'published', 'archived'] as const).map((value) => (
            <button key={value} type="button" className={status === value ? styles.filterPillActive : styles.filterPill} onClick={() => setStatus(value)}>
              {value === 'all' ? 'Todas' : value === 'published' ? 'Activas' : 'Archivadas'}
            </button>
          ))}
        </div>
        <span className={styles.resultCount}>{filtered.length} imagen{filtered.length === 1 ? '' : 'es'}</span>
      </div>

      {filtered.length ? (
        <div className={styles.mediaGrid}>
          {filtered.map((media) => {
            const usage = activeLinksFor(media.media_id, data.mediaLinks)
            return (
              <article className={styles.mediaCard} key={media.media_id}>
                <button className={styles.mediaThumb} type="button" onClick={() => { setEditing(media); setAltText(media.alt_text || '') }}>
                  <img src={media.public_url} alt={media.alt_text || ''} loading="lazy" />
                  <span className={styles.mediaHover}><Edit3 size={18} /> Editar</span>
                </button>
                <div className={styles.mediaCardBody}>
                  <div className={styles.recordTitleLine}>
                    <strong title={media.file_name}>{media.file_name}</strong>
                    <StatusBadge status={media.status} />
                  </div>
                  <p>{media.alt_text || 'Sin texto alternativo'}</p>
                  <div className={styles.mediaMeta}>
                    <span>{formatBytes(media.file_size)}</span>
                    <span>{usage.length} uso{usage.length === 1 ? '' : 's'}</span>
                  </div>
                  <div className={styles.mediaCardActions}>
                    <button className={styles.iconTextButton} type="button" onClick={() => { setEditing(media); setAltText(media.alt_text || '') }}><Edit3 size={15} /> Editar</button>
                    {media.status === 'archived' ? (
                      <button className={styles.iconTextButton} type="button" disabled={busy} onClick={() => onRestore(media)}><RotateCcw size={15} /> Restaurar</button>
                    ) : (
                      <button className={styles.iconTextButtonDanger} type="button" disabled={busy || usage.length > 0} onClick={() => setConfirming(media)} title={usage.length ? 'Quitá primero sus vínculos activos.' : undefined}><Archive size={15} /> Archivar</button>
                    )}
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      ) : (
        <EmptyState title="No hay imágenes para mostrar" description="Probá cambiando los filtros o subí una nueva imagen." action={<button className={styles.secondaryButton} type="button" onClick={openUpload}><ImagePlus size={16} /> Subir imagen</button>} />
      )}

      <Modal
        open={uploadOpen}
        title="Subir imagen"
        eyebrow="Biblioteca"
        description="JPG, PNG o WebP de hasta 6 MB. El archivo quedará disponible para reutilizarse."
        size="md"
        busy={busy}
        onClose={() => !busy && setUploadOpen(false)}
        footer={(
          <>
            <button className={styles.secondaryButton} type="button" onClick={() => setUploadOpen(false)} disabled={busy}>Cancelar</button>
            <button className={styles.primaryButton} type="submit" form="media-upload" disabled={busy || !file}>{busy ? <Spinner /> : <Upload size={16} />} {busy ? 'Subiendo...' : 'Subir a Drive'}</button>
          </>
        )}
      >
        <form id="media-upload" className={styles.uploadForm} onSubmit={upload}>
          <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp" hidden onChange={(event) => setFile(event.target.files?.[0] || null)} />
          <button className={`${styles.dropzone} ${file ? styles.dropzoneSelected : ''}`} data-autofocus type="button" onClick={() => fileInputRef.current?.click()}>
            <ImagePlus size={28} />
            <strong>{file ? file.name : 'Elegí una imagen'}</strong>
            <span>{file ? `${formatBytes(file.size)} · ${file.type}` : 'JPG, PNG o WebP · máximo 6 MB'}</span>
          </button>
          {file && (
            <div className={styles.uploadPreview}>
              <img src={URL.createObjectURL(file)} alt="Vista previa local" />
            </div>
          )}
          <label className={styles.formField}>
            <span>Texto alternativo</span>
            <textarea rows={3} value={altText} onChange={(event) => setAltText(event.target.value)} placeholder="Describí la imagen para accesibilidad y SEO." />
          </label>
        </form>
      </Modal>

      <Modal
        open={!!editing}
        title="Editar imagen"
        eyebrow="Metadatos"
        description="El archivo de Drive no cambia; podés mejorar su texto alternativo y revisar dónde se usa."
        size="lg"
        busy={busy}
        onClose={() => !busy && setEditing(null)}
        footer={(
          <>
            <button className={styles.secondaryButton} type="button" onClick={() => setEditing(null)} disabled={busy}>Cancelar</button>
            <button className={styles.primaryButton} type="submit" form="media-edit" disabled={busy}>{busy ? <Spinner /> : <Edit3 size={16} />} Guardar</button>
          </>
        )}
      >
        {editing && (
          <form id="media-edit" className={styles.mediaEditor} onSubmit={saveAlt}>
            <img src={editing.public_url} alt={editing.alt_text || ''} />
            <div className={styles.mediaEditorFields}>
              <label className={styles.formField}>
                <span>Texto alternativo</span>
                <textarea data-autofocus rows={4} value={altText} onChange={(event) => setAltText(event.target.value)} />
                <small>Describí qué se ve; evitá repetir “imagen de”.</small>
              </label>
              <div className={styles.usageList}>
                <span className={styles.fieldLabel}>Usos activos</span>
                {activeLinksFor(editing.media_id, data.mediaLinks).length ? activeLinksFor(editing.media_id, data.mediaLinks).map((link) => (
                  <div key={link.media_link_id}><strong>{link.entity_type}</strong><span>{link.field_key}</span></div>
                )) : <p>Esta imagen no está vinculada a ningún contenido.</p>}
              </div>
            </div>
          </form>
        )}
      </Modal>

      <Modal
        open={!!confirming}
        title="Archivar imagen"
        eyebrow="Confirmación"
        description="La imagen dejará de aparecer en la biblioteca activa pero el archivo de Drive y la auditoría se conservan."
        size="sm"
        busy={busy}
        onClose={() => !busy && setConfirming(null)}
        footer={(
          <>
            <button className={styles.secondaryButton} type="button" onClick={() => setConfirming(null)} disabled={busy}>Cancelar</button>
            <button className={styles.dangerButton} type="button" disabled={busy} onClick={async () => { if (!confirming) return; await onArchive(confirming); setConfirming(null) }}>{busy ? <Spinner /> : <Archive size={16} />} Archivar</button>
          </>
        )}
      >
        <p className={styles.confirmText}>¿Querés archivar <strong>{confirming?.file_name}</strong>?</p>
      </Modal>
    </section>
  )
}
