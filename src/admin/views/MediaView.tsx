import { FormEvent, useEffect, useMemo, useRef, useState } from 'react'
import { Archive, Edit3, ImagePlus, RotateCcw, Search, Upload } from 'lucide-react'
import type { CmsMedia, CmsMediaLink, CmsMediaSectionData, CmsStatus } from '@/cms/types'
import { Modal } from '../components/Modal'
import { EmptyState, Spinner, StatusBadge } from '../components/Ui'
import styles from '../AdminApp.module.scss'

function formatBytes(value: number | string) { const bytes = Number(value) || 0; if (bytes < 1024) return `${bytes} B`; if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`; return `${(bytes / 1024 / 1024).toFixed(1)} MB` }
function activeLinksFor(mediaId: string, links: CmsMediaLink[]) { return links.filter((link) => link.media_id === mediaId && link.status !== 'archived') }
function mediaKindLabel(value?: string) { return ({ treatment:'Tratamiento',before_after:'Antes / después',process:'Proceso',product:'Producto',profile:'Perfil',clinic:'Consultorio',general:'General' } as Record<string,string>)[value || 'general'] || 'General' }
function validImage(file: File) { return ['image/jpeg','image/png','image/webp'].includes(file.type) && file.size <= 6 * 1024 * 1024 }

export default function MediaView({ data, busy, onUpload, onUpdate, onArchive, onRestore }: {
  data: CmsMediaSectionData
  busy: boolean
  onUpload: (file: File, altText: string) => Promise<unknown>
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
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const previewUrl = useMemo(() => file ? URL.createObjectURL(file) : '', [file])

  useEffect(() => () => { if (previewUrl) URL.revokeObjectURL(previewUrl) }, [previewUrl])

  const filtered = useMemo(() => {
    const needle = search.trim().toLowerCase()
    return [...data.media]
      .filter((media) => status === 'all' || media.status === status)
      .filter((media) => !needle || `${media.file_name} ${media.alt_text} ${media.caption || ''} ${media.kind || ''} ${media.tags || ''}`.toLowerCase().includes(needle))
      .sort((a,b) => String(b.created_at || '').localeCompare(String(a.created_at || '')))
  }, [data.media, search, status])

  const chooseFile = (next?: File | null) => { if (!next || !validImage(next)) return; setFile(next) }
  const openUpload = () => { setFile(null); setAltText(''); setDragActive(false); setUploadOpen(true) }
  const upload = async (event: FormEvent) => { event.preventDefault(); if (!file || !validImage(file)) return; try { await onUpload(file,altText); setUploadOpen(false); setFile(null); setAltText('') } catch { /* feedback global */ } }
  const saveAlt = async (event: FormEvent) => { event.preventDefault(); if (!editing) return; try { await onUpdate(editing.media_id,altText); setEditing(null) } catch { /* feedback global */ } }
  const safeRestore = (media: CmsMedia) => { void onRestore(media).catch(() => undefined) }

  return (
    <section className={styles.pageSection}>
      <div className={styles.sectionHeading}><div><span className={styles.eyebrow}>Google Drive</span><h2>Biblioteca de imágenes</h2><p>Subí una sola vez y reutilizá el mismo archivo en tratamientos, resultados y otros campos sin duplicarlo.</p></div><button className={styles.primaryButton} type="button" onClick={openUpload}><Upload size={17} /> Subir imagen</button></div>
      <div className={styles.toolbar}><label className={styles.searchBox}><Search size={17} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar por nombre, alt, tipo o etiqueta..." /></label><div className={styles.filterPills}>{(['all','published','archived'] as const).map((value) => <button key={value} type="button" className={status === value ? styles.filterPillActive : styles.filterPill} onClick={() => setStatus(value)}>{value === 'all' ? 'Todas' : value === 'published' ? 'Activas' : 'Archivadas'}</button>)}</div><span className={styles.resultCount}>{filtered.length} imagen{filtered.length === 1 ? '' : 'es'}</span></div>

      {filtered.length ? <div className={styles.mediaGrid}>{filtered.map((media) => { const usage = activeLinksFor(media.media_id,data.mediaLinks); return <article className={styles.mediaCard} key={media.media_id}><button className={styles.mediaThumb} type="button" onClick={() => { setEditing(media); setAltText(media.alt_text || '') }}><img src={media.public_url} alt={media.alt_text || ''} loading="lazy" /><span className={styles.mediaHover}><Edit3 size={18} /> Editar</span></button><div className={styles.mediaCardBody}><div className={styles.recordTitleLine}><strong title={media.file_name}>{media.file_name}</strong><StatusBadge status={media.status} /></div><p>{media.caption || media.alt_text || 'Sin descripción'}</p><div className={styles.mediaMeta}><span>{mediaKindLabel(media.kind)}</span><span>{formatBytes(media.file_size)}</span><span>{usage.length} uso{usage.length === 1 ? '' : 's'}</span></div><div className={styles.mediaCardActions}><button className={styles.iconTextButton} type="button" onClick={() => { setEditing(media); setAltText(media.alt_text || '') }}><Edit3 size={15} /> Editar</button>{media.status === 'archived' ? <button className={styles.iconTextButton} type="button" disabled={busy} onClick={() => safeRestore(media)}><RotateCcw size={15} /> Restaurar</button> : <button className={styles.iconTextButtonDanger} type="button" disabled={busy || usage.length > 0} onClick={() => setConfirming(media)} title={usage.length ? 'Quitá primero sus vínculos activos.' : undefined}><Archive size={15} /> Archivar</button>}</div></div></article> })}</div> : <EmptyState title="No hay imágenes para mostrar" description="Probá cambiando los filtros o subí una nueva imagen." action={<button className={styles.secondaryButton} type="button" onClick={openUpload}><ImagePlus size={16} /> Subir imagen</button>} />}

      <Modal open={uploadOpen} title="Subir imagen" eyebrow="Biblioteca" description="Arrastrá una foto o elegila desde tu equipo. JPG, PNG o WebP de hasta 6 MB." size="md" busy={busy} onClose={() => !busy && setUploadOpen(false)} footer={<><button className={styles.secondaryButton} type="button" onClick={() => setUploadOpen(false)} disabled={busy}>Cancelar</button><button className={styles.primaryButton} type="submit" form="media-upload" disabled={busy || !file}>{busy ? <Spinner /> : <Upload size={16} />} {busy ? 'Subiendo...' : 'Subir a Drive'}</button></>}>
        <form id="media-upload" className={styles.uploadForm} onSubmit={upload}><input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp" hidden onChange={(event) => chooseFile(event.target.files?.[0])} /><button className={`${styles.dropzone} ${(file || dragActive) ? styles.dropzoneSelected : ''}`} data-autofocus type="button" onClick={() => fileInputRef.current?.click()} onDragEnter={(event) => { event.preventDefault(); setDragActive(true) }} onDragOver={(event) => { event.preventDefault(); setDragActive(true) }} onDragLeave={(event) => { event.preventDefault(); setDragActive(false) }} onDrop={(event) => { event.preventDefault(); setDragActive(false); chooseFile(event.dataTransfer.files?.[0]) }}><ImagePlus size={28} /><strong>{dragActive ? 'Soltá la imagen acá' : file ? file.name : 'Arrastrá una imagen o hacé click'}</strong><span>{file ? `${formatBytes(file.size)} · ${file.type}` : 'JPG, PNG o WebP · máximo 6 MB'}</span></button>{previewUrl && <div className={styles.uploadPreview}><img src={previewUrl} alt="Vista previa local" /></div>}<label className={styles.formField}><span>Texto alternativo</span><textarea rows={3} value={altText} onChange={(event) => setAltText(event.target.value)} placeholder="Describí qué se ve y el contexto del tratamiento." /><small>Este texto ayuda a accesibilidad y a entender la imagen fuera de contexto.</small></label></form>
      </Modal>

      <Modal open={!!editing} title="Editar imagen" eyebrow="Metadatos" description="Revisá el texto alternativo y dónde se está usando el archivo." size="lg" busy={busy} onClose={() => !busy && setEditing(null)} footer={<><button className={styles.secondaryButton} type="button" onClick={() => setEditing(null)} disabled={busy}>Cancelar</button><button className={styles.primaryButton} type="submit" form="media-edit" disabled={busy}>{busy ? <Spinner /> : <Edit3 size={16} />} Guardar</button></>}>
        {editing && <form id="media-edit" className={styles.mediaEditor} onSubmit={saveAlt}><img src={editing.public_url} alt={editing.alt_text || ''} /><div className={styles.mediaEditorFields}><label className={styles.formField}><span>Texto alternativo</span><textarea data-autofocus rows={4} value={altText} onChange={(event) => setAltText(event.target.value)} /><small>Describí qué se ve; evitá repetir “imagen de”.</small></label>{(editing.caption || editing.kind || editing.tags) && <div className={styles.usageList}><span className={styles.fieldLabel}>Clasificación</span><div><strong>{mediaKindLabel(editing.kind)}</strong><span>{editing.tags || 'sin etiquetas'}</span></div>{editing.caption && <p>{editing.caption}</p>}</div>}<div className={styles.usageList}><span className={styles.fieldLabel}>Usos activos</span>{activeLinksFor(editing.media_id,data.mediaLinks).length ? activeLinksFor(editing.media_id,data.mediaLinks).map((link) => <div key={link.media_link_id}><strong>{link.entity_type}</strong><span>{link.field_key}</span></div>) : <p>Esta imagen no está vinculada a ningún contenido.</p>}</div></div></form>}
      </Modal>

      <Modal open={!!confirming} title="Archivar imagen" eyebrow="Confirmación" description="La imagen dejará de aparecer en la biblioteca activa pero el archivo de Drive y la auditoría se conservan." size="sm" busy={busy} onClose={() => !busy && setConfirming(null)} footer={<><button className={styles.secondaryButton} type="button" onClick={() => setConfirming(null)} disabled={busy}>Cancelar</button><button className={styles.dangerButton} type="button" disabled={busy} onClick={() => { if (!confirming) return; void onArchive(confirming).then(() => setConfirming(null)).catch(() => undefined) }}>{busy ? <Spinner /> : <Archive size={16} />} Archivar</button></>}><p className={styles.confirmText}>¿Querés archivar <strong>{confirming?.file_name}</strong>?</p></Modal>
    </section>
  )
}
