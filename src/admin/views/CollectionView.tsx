import { FormEvent, useEffect, useMemo, useRef, useState } from 'react'
import { Archive, Edit3, ImagePlus, Link2Off, Plus, RotateCcw, Search, Save, Upload } from 'lucide-react'
import type { CmsCollectionRecord, CmsMedia, CmsMediaLink, CmsMediaSectionData, CmsStatus } from '@/cms/types'
import type { CollectionDefinition } from '../adminConfig'
import { FormField } from '../components/FormField'
import { Modal } from '../components/Modal'
import { EmptyState, Spinner, StatusBadge } from '../components/Ui'
import styles from '../AdminApp.module.scss'

function rowValue(record: CmsCollectionRecord, key: string) { return String((record as unknown as Record<string, unknown>)[key] ?? '') }
function rowId(record: CmsCollectionRecord, definition: CollectionDefinition) { return rowValue(record, definition.idField) }
function formatBytes(value: number | string) { const bytes = Number(value) || 0; if (bytes < 1024) return `${bytes} B`; if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`; return `${(bytes / 1024 / 1024).toFixed(1)} MB` }
function validImage(file: File) { return ['image/jpeg','image/png','image/webp'].includes(file.type) && file.size <= 6 * 1024 * 1024 }

export default function CollectionView({ definition, records, busy, mediaData, mediaLoading, onEnsureMedia, onSave, onArchive, onRestore, onUploadMedia, onLinkMedia, onUnlinkMedia }: {
  definition: CollectionDefinition
  records: CmsCollectionRecord[]
  busy: boolean
  mediaData?: CmsMediaSectionData
  mediaLoading: boolean
  onEnsureMedia: () => Promise<void>
  onSave: (id: string | null, record: Record<string, unknown>) => Promise<CmsCollectionRecord>
  onArchive: (record: CmsCollectionRecord) => Promise<void>
  onRestore: (record: CmsCollectionRecord) => Promise<void>
  onUploadMedia: (file: File, altText: string) => Promise<CmsMedia>
  onLinkMedia: (payload: Record<string, unknown>) => Promise<CmsMediaLink>
  onUnlinkMedia: (mediaLinkId: string) => Promise<void>
}) {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<'all' | CmsStatus>('all')
  const [editorOpen, setEditorOpen] = useState(false)
  const [editing, setEditing] = useState<CmsCollectionRecord | null>(null)
  const [draft, setDraft] = useState<Record<string, string>>({})
  const [confirming, setConfirming] = useState<CmsCollectionRecord | null>(null)
  const [pickerSlot, setPickerSlot] = useState<string | null>(null)
  const [pickerSearch, setPickerSearch] = useState('')
  const [pickerDragActive, setPickerDragActive] = useState(false)
  const [uploadBusy, setUploadBusy] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const sorted = useMemo(() => {
    const needle = search.trim().toLowerCase()
    return [...records].filter((record) => status === 'all' || record.status === status).filter((record) => !needle || Object.values(record).some((value) => String(value ?? '').toLowerCase().includes(needle))).sort((a, b) => Number(rowValue(a, 'sort_order') || 9999) - Number(rowValue(b, 'sort_order') || 9999))
  }, [records, search, status])
  const currentId = editing ? rowId(editing, definition) : ''
  const activeMedia = useMemo(() => (mediaData?.media || []).filter((item) => item.status !== 'archived'), [mediaData])
  const pickerMedia = useMemo(() => { const needle = pickerSearch.trim().toLowerCase(); return activeMedia.filter((item) => !needle || `${item.file_name} ${item.alt_text} ${item.caption || ''} ${item.kind || ''} ${item.tags || ''}`.toLowerCase().includes(needle)) }, [activeMedia, pickerSearch])

  useEffect(() => {
    if (editorOpen && editing && definition.mediaSlots?.length) void onEnsureMedia().catch(() => undefined)
  }, [definition.mediaSlots, editing, editorOpen, onEnsureMedia])

  const openCreate = () => { setEditing(null); setDraft({ status: 'draft', sort_order: String(records.length + 1) }); setEditorOpen(true) }
  const openEdit = (record: CmsCollectionRecord) => { const next: Record<string, string> = {}; definition.fields.forEach((field) => { next[field.key] = rowValue(record, field.key) }); setEditing(record); setDraft(next); setEditorOpen(true) }
  const closeEditor = () => { if (busy || uploadBusy) return; setEditorOpen(false); setEditing(null); setDraft({}); setPickerSlot(null); setPickerSearch(''); setPickerDragActive(false) }

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    try {
      const saved = await onSave(editing ? rowId(editing, definition) : null, draft)
      setEditing(saved)
      const next: Record<string, string> = {}; definition.fields.forEach((field) => { next[field.key] = rowValue(saved, field.key) }); setDraft(next)
      if (!definition.mediaSlots?.length) closeEditor()
      else void onEnsureMedia().catch(() => undefined)
    } catch { /* feedback global */ }
  }

  const linksForCurrent = (fieldKey: string) => (mediaData?.mediaLinks || []).filter((link) => link.status !== 'archived' && link.entity_type === definition.key && link.entity_id === currentId && link.field_key === fieldKey)
  const mediaForLink = (link?: CmsMediaLink) => mediaData?.media.find((item) => item.media_id === link?.media_id)

  const chooseMedia = async (media: CmsMedia) => {
    if (!pickerSlot || !currentId) return
    try {
      await onLinkMedia({ mediaId: media.media_id, entityType: definition.key, entityId: currentId, fieldKey: pickerSlot, replaceField: true, sortOrder: 0 })
      setPickerSlot(null); setPickerSearch(''); setPickerDragActive(false)
    } catch { /* feedback global */ }
  }

  const uploadFromPicker = async (file?: File) => {
    if (!file || !pickerSlot || !currentId || !validImage(file)) return
    setUploadBusy(true)
    try {
      const media = await onUploadMedia(file, `${definition.singular} · ${editing ? rowValue(editing, definition.primaryField) : ''}`)
      await chooseMedia(media)
    } catch { /* feedback global */ }
    finally { setUploadBusy(false); setPickerDragActive(false); if (fileInputRef.current) fileInputRef.current.value = '' }
  }

  const safeRestore = (record: CmsCollectionRecord) => { void onRestore(record).catch(() => undefined) }
  const safeUnlink = (id: string) => { void onUnlinkMedia(id).catch(() => undefined) }
  const openPicker = (slot: string) => { setPickerSlot(slot); setPickerDragActive(false); void onEnsureMedia().catch(() => undefined) }

  return (
    <section className={styles.pageSection}>
      <div className={styles.sectionHeading}><div><span className={styles.eyebrow}>Colección administrable</span><h2>{definition.title}</h2><p>{definition.description}</p></div><button className={styles.primaryButton} type="button" onClick={openCreate}><Plus size={17} /> Nuevo {definition.singular}</button></div>
      <div className={styles.toolbar}><label className={styles.searchBox}><Search size={17} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder={`Buscar ${definition.title.toLowerCase()}...`} /></label><div className={styles.filterPills}>{(['all','published','draft','archived'] as const).map((value) => <button key={value} type="button" className={status === value ? styles.filterPillActive : styles.filterPill} onClick={() => setStatus(value)}>{value === 'all' ? 'Todos' : value === 'published' ? 'Publicados' : value === 'draft' ? 'Borradores' : 'Archivados'}</button>)}</div><span className={styles.resultCount}>{sorted.length} registro{sorted.length === 1 ? '' : 's'}</span></div>

      {sorted.length ? <div className={styles.recordTable}>{sorted.map((record) => <article className={styles.recordRow} key={rowId(record,definition)}><div className={styles.orderHandle}>{rowValue(record,'sort_order') || '—'}</div><div className={styles.recordMain}><div className={styles.recordTitleLine}><strong>{rowValue(record,definition.primaryField) || 'Sin título'}</strong><StatusBadge status={record.status} /></div>{definition.secondaryField && <p>{rowValue(record,definition.secondaryField) || 'Sin dato secundario'}</p>}<small>Actualizado {record.updated_at ? new Date(record.updated_at).toLocaleString('es-AR') : '—'}</small></div><div className={styles.recordActions}>{record.status === 'archived' ? <button className={styles.iconTextButton} type="button" disabled={busy} onClick={() => safeRestore(record)}><RotateCcw size={15} /> Restaurar</button> : <><button className={styles.iconTextButton} type="button" onClick={() => openEdit(record)}><Edit3 size={15} /> Editar</button><button className={styles.iconTextButtonDanger} type="button" onClick={() => setConfirming(record)}><Archive size={15} /> Archivar</button></>}</div></article>)}</div> : <EmptyState title={`No hay ${definition.title.toLowerCase()}`} description="Probá cambiando los filtros o creá el primer registro." action={<button className={styles.secondaryButton} type="button" onClick={openCreate}><Plus size={16} /> Crear {definition.singular}</button>} />}

      <Modal open={editorOpen && !pickerSlot} title={editing ? `Editar ${definition.singular}` : `Nuevo ${definition.singular}`} eyebrow={definition.title} description={editing ? 'Los cambios se reflejan en la landing cuando el registro está publicado.' : 'Completá los datos principales. Podés publicarlo ahora o dejarlo como borrador.'} size="xl" busy={busy || uploadBusy} onClose={closeEditor} footer={<><button className={styles.secondaryButton} type="button" onClick={closeEditor} disabled={busy || uploadBusy}>Cerrar</button><button className={styles.primaryButton} type="submit" form="collection-editor" disabled={busy || uploadBusy}>{busy ? <Spinner /> : <Save size={16} />} {busy ? 'Guardando...' : editing ? 'Guardar cambios' : 'Crear registro'}</button></>}>
        <form id="collection-editor" className={styles.formGrid} onSubmit={submit}>{definition.fields.map((field) => <FormField key={field.key} field={field} value={draft[field.key]} disabled={busy} onChange={(value) => setDraft((current) => ({ ...current, [field.key]: value }))} />)}</form>
        {!!definition.mediaSlots?.length && <div className={styles.modalSubsection}><div className={styles.formSectionTitle}><h3>Imágenes vinculadas</h3><p>{editing ? 'Elegí imágenes existentes o arrastrá una nueva. El mismo archivo puede reutilizarse.' : 'Guardá primero el registro para poder asociar imágenes.'}</p></div>{editing && <div className={styles.mediaSlots}>{definition.mediaSlots.map((slot) => { const link = linksForCurrent(slot.key)[0]; const media = mediaForLink(link); return <div className={styles.mediaSlot} key={slot.key}><div className={styles.mediaSlotPreview}>{media ? <img src={media.public_url} alt={media.alt_text || ''} /> : <ImagePlus size={26} />}</div><div className={styles.mediaSlotCopy}><strong>{slot.label}</strong><p>{media?.file_name || slot.help}</p></div><div className={styles.mediaSlotActions}><button className={styles.secondaryButton} type="button" onClick={() => openPicker(slot.key)} disabled={mediaLoading || busy}>{mediaLoading ? <Spinner /> : <ImagePlus size={15} />} {media ? 'Cambiar' : 'Elegir'}</button>{link && <button className={styles.iconButtonDanger} type="button" disabled={busy} onClick={() => safeUnlink(link.media_link_id)} aria-label={`Quitar ${slot.label}`}><Link2Off size={16} /></button>}</div></div> })}</div>}</div>}
      </Modal>

      <Modal open={!!pickerSlot} title="Elegir imagen" eyebrow="Biblioteca" description="Seleccioná una imagen existente o arrastrá una nueva. El archivo puede reutilizarse en distintos lugares." size="xl" busy={busy || uploadBusy} onClose={() => !busy && !uploadBusy && setPickerSlot(null)} footer={<button className={styles.secondaryButton} type="button" onClick={() => setPickerSlot(null)} disabled={busy || uploadBusy}>Volver al registro</button>}>
        <div className={styles.pickerToolbar}><label className={styles.searchBox}><Search size={16} /><input value={pickerSearch} onChange={(event) => setPickerSearch(event.target.value)} placeholder="Buscar imagen..." /></label><input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp" hidden onChange={(event) => void uploadFromPicker(event.target.files?.[0])} /><button className={styles.primaryButton} type="button" disabled={uploadBusy} onClick={() => fileInputRef.current?.click()}>{uploadBusy ? <Spinner /> : <Upload size={16} />} {uploadBusy ? 'Subiendo...' : 'Subir imagen'}</button></div>
        <button className={`${styles.dropzone} ${pickerDragActive ? styles.dropzoneSelected : ''}`} type="button" disabled={uploadBusy} onClick={() => fileInputRef.current?.click()} onDragEnter={(event) => { event.preventDefault(); setPickerDragActive(true) }} onDragOver={(event) => { event.preventDefault(); setPickerDragActive(true) }} onDragLeave={(event) => { event.preventDefault(); setPickerDragActive(false) }} onDrop={(event) => { event.preventDefault(); setPickerDragActive(false); void uploadFromPicker(event.dataTransfer.files?.[0]) }}><ImagePlus size={24} /><strong>{pickerDragActive ? 'Soltá la imagen acá' : 'También podés arrastrar una imagen'}</strong><span>JPG, PNG o WebP · máximo 6 MB</span></button>
        {pickerMedia.length ? <div className={styles.mediaPickerGrid}>{pickerMedia.map((media) => <button className={styles.mediaPickerCard} type="button" key={media.media_id} onClick={() => void chooseMedia(media)} disabled={busy || uploadBusy}><img src={media.public_url} alt={media.alt_text || ''} loading="lazy" /><span><strong>{media.file_name}</strong><small>{media.kind && media.kind !== 'general' ? `${media.kind} · ` : ''}{formatBytes(media.file_size)}</small></span></button>)}</div> : <EmptyState title="Biblioteca vacía" description="Subí la primera imagen para poder asociarla." />}
      </Modal>

      <Modal open={!!confirming} title={`Archivar ${definition.singular}`} eyebrow="Confirmación" description="El registro dejará de publicarse pero seguirá disponible para restaurarlo." size="sm" busy={busy} onClose={() => !busy && setConfirming(null)} footer={<><button className={styles.secondaryButton} type="button" onClick={() => setConfirming(null)} disabled={busy}>Cancelar</button><button className={styles.dangerButton} type="button" disabled={busy} onClick={() => { if (!confirming) return; void onArchive(confirming).then(() => setConfirming(null)).catch(() => undefined) }}>{busy ? <Spinner /> : <Archive size={16} />} Archivar</button></>}><p className={styles.confirmText}>¿Querés archivar <strong>{confirming ? rowValue(confirming,definition.primaryField) : ''}</strong>?</p></Modal>
    </section>
  )
}
