import { useMemo, useRef, useState } from 'react'
import { ImagePlus, Link2Off, Search, Upload } from 'lucide-react'
import type { CmsMedia, CmsMediaLink, CmsMediaSectionData } from '@/cms/types'
import { Modal } from './Modal'
import { EmptyState, Spinner } from './Ui'
import styles from '../AdminApp.module.scss'

function formatBytes(value: number | string) {
  const bytes = Number(value) || 0
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

function validImage(file: File) {
  return ['image/jpeg','image/png','image/webp'].includes(file.type) && file.size <= 6 * 1024 * 1024
}

export function MediaSlotField({ label, help, entityType, entityId, fieldKey, altText, mediaData, mediaLoading, busy, onEnsureMedia, onUploadMedia, onLinkMedia, onUnlinkMedia }: {
  label: string
  help: string
  entityType: string
  entityId: string
  fieldKey: string
  altText: string
  mediaData?: CmsMediaSectionData
  mediaLoading: boolean
  busy: boolean
  onEnsureMedia: () => Promise<void>
  onUploadMedia: (file: File, altText: string) => Promise<CmsMedia>
  onLinkMedia: (payload: Record<string, unknown>) => Promise<CmsMediaLink>
  onUnlinkMedia: (mediaLinkId: string) => Promise<void>
}) {
  const [pickerOpen, setPickerOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [dragActive, setDragActive] = useState(false)
  const [uploadBusy, setUploadBusy] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const activeMedia = useMemo(() => (mediaData?.media || []).filter((media) => media.status === 'published'), [mediaData])
  const pickerMedia = useMemo(() => {
    const needle = search.trim().toLowerCase()
    return activeMedia.filter((media) => !needle || `${media.file_name} ${media.alt_text} ${media.caption || ''} ${media.tags || ''}`.toLowerCase().includes(needle))
  }, [activeMedia, search])
  const link = mediaData?.mediaLinks.find((item) => item.status !== 'archived' && item.entity_type === entityType && item.entity_id === entityId && item.field_key === fieldKey)
  const selectedMedia = mediaData?.media.find((item) => item.media_id === link?.media_id)

  const openPicker = () => {
    if (!entityId) return
    setSearch('')
    setPickerOpen(true)
    void onEnsureMedia().catch(() => undefined)
  }

  const closePicker = () => {
    if (busy || uploadBusy) return
    setPickerOpen(false)
    setDragActive(false)
  }

  const chooseMedia = async (media: CmsMedia) => {
    try {
      await onLinkMedia({ mediaId: media.media_id, entityType, entityId, fieldKey, replaceField: true, sortOrder: 0 })
      setPickerOpen(false)
    } catch { /* feedback global */ }
  }

  const uploadImage = async (file?: File) => {
    if (!file || !validImage(file)) return
    setUploadBusy(true)
    try {
      const media = await onUploadMedia(file, altText)
      await chooseMedia(media)
    } catch { /* feedback global */ }
    finally {
      setUploadBusy(false)
      setDragActive(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const unlink = () => {
    if (link) void onUnlinkMedia(link.media_link_id).catch(() => undefined)
  }

  return (
    <div className={styles.formFieldWide}>
      <span className={styles.fieldLabel}>{label}</span>
      <div className={styles.mediaSlots}>
        <div className={styles.mediaSlot}>
          <div className={styles.mediaSlotPreview}>{selectedMedia ? <img src={selectedMedia.public_url} alt={selectedMedia.alt_text || ''} /> : <ImagePlus size={26} />}</div>
          <div className={styles.mediaSlotCopy}><strong>{selectedMedia?.file_name || 'Sin foto seleccionada'}</strong><p>{help}</p></div>
          <div className={styles.mediaSlotActions}>
            <button className={styles.secondaryButton} type="button" onClick={openPicker} disabled={busy || mediaLoading || !entityId}>{mediaLoading ? <Spinner /> : <ImagePlus size={15} />} {selectedMedia ? 'Cambiar' : 'Elegir foto'}</button>
            {link && <button className={styles.iconButtonDanger} type="button" disabled={busy} onClick={unlink} aria-label={`Quitar ${label.toLowerCase()}`}><Link2Off size={16} /></button>}
          </div>
        </div>
      </div>

      <Modal open={pickerOpen} title={`Elegir ${label.toLowerCase()}`} eyebrow="Biblioteca de imágenes" description="Elegí una foto existente o subí una nueva desde tu dispositivo." size="xl" busy={busy || uploadBusy} onClose={closePicker} footer={<button className={styles.secondaryButton} type="button" onClick={closePicker} disabled={busy || uploadBusy}>Volver</button>}>
        <div className={styles.pickerToolbar}>
          <label className={styles.searchBox}><Search size={16} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar imagen..." /></label>
          <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp" hidden onChange={(event) => void uploadImage(event.target.files?.[0])} />
          <button className={styles.primaryButton} type="button" disabled={uploadBusy} onClick={() => fileInputRef.current?.click()}>{uploadBusy ? <Spinner /> : <Upload size={16} />} {uploadBusy ? 'Subiendo...' : 'Subir foto'}</button>
        </div>
        <button className={`${styles.dropzone} ${dragActive ? styles.dropzoneSelected : ''}`} type="button" disabled={uploadBusy} onClick={() => fileInputRef.current?.click()} onDragEnter={(event) => { event.preventDefault(); setDragActive(true) }} onDragOver={(event) => { event.preventDefault(); setDragActive(true) }} onDragLeave={(event) => { event.preventDefault(); setDragActive(false) }} onDrop={(event) => { event.preventDefault(); setDragActive(false); void uploadImage(event.dataTransfer.files?.[0]) }}><ImagePlus size={24} /><strong>{dragActive ? 'Soltá la foto acá' : 'También podés arrastrar una foto'}</strong><span>JPG, PNG o WebP · máximo 6 MB</span></button>
        {pickerMedia.length ? <div className={styles.mediaPickerGrid}>{pickerMedia.map((media) => <button className={styles.mediaPickerCard} type="button" key={media.media_id} onClick={() => void chooseMedia(media)} disabled={busy || uploadBusy}><img src={media.public_url} alt={media.alt_text || ''} loading="lazy" /><span><strong>{media.file_name}</strong><small>{media.alt_text || formatBytes(media.file_size)}</small></span></button>)}</div> : <EmptyState title="Todavía no hay fotos disponibles" description="Subí una foto del doctor para agregarla a la presentación." />}
      </Modal>
    </div>
  )
}
