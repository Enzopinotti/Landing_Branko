import { FormEvent, useMemo, useState } from 'react'
import { Archive, Edit3, Plus, RotateCcw, Search, Save } from 'lucide-react'
import type { CmsContentRecord, CmsStatus } from '@/cms/types'
import { contentGroupLabels } from '../adminConfig'
import { Modal } from '../components/Modal'
import { EmptyState, Spinner, StatusBadge } from '../components/Ui'
import styles from '../AdminApp.module.scss'

type Draft = Partial<CmsContentRecord>
const freshDraft = (): Draft => ({ content_key: '', label: '', value: '', value_type: 'text', status: 'published' })
const groupFor = (record: CmsContentRecord) => contentGroupLabels[record.content_key.split('.')[0] || 'general'] || record.content_key.split('.')[0] || 'General'

export default function ContentView({ records, busy, onSave }: { records: CmsContentRecord[]; busy: boolean; onSave: (record: Draft) => Promise<void> }) {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<'all' | CmsStatus>('all')
  const [editorOpen, setEditorOpen] = useState(false)
  const [editing, setEditing] = useState<CmsContentRecord | null>(null)
  const [draft, setDraft] = useState<Draft>(freshDraft)
  const [confirming, setConfirming] = useState<CmsContentRecord | null>(null)

  const filtered = useMemo(() => {
    const needle = search.trim().toLowerCase()
    return [...records].filter((record) => status === 'all' || record.status === status).filter((record) => !needle || `${record.label} ${record.content_key} ${record.value}`.toLowerCase().includes(needle)).sort((a, b) => groupFor(a).localeCompare(groupFor(b)) || a.label.localeCompare(b.label))
  }, [records, search, status])
  const grouped = useMemo(() => { const map = new Map<string, CmsContentRecord[]>(); filtered.forEach((record) => { const group = groupFor(record); map.set(group, [...(map.get(group) || []), record]) }); return [...map.entries()] }, [filtered])

  const openCreate = () => { setEditing(null); setDraft(freshDraft()); setEditorOpen(true) }
  const openEdit = (record: CmsContentRecord) => { setEditing(record); setDraft({ ...record }); setEditorOpen(true) }
  const closeEditor = () => { if (busy) return; setEditorOpen(false); setEditing(null); setDraft(freshDraft()) }
  const submit = async (event: FormEvent) => { event.preventDefault(); try { await onSave(draft); closeEditor() } catch { /* toast global */ } }
  const changeStatus = async (record: CmsContentRecord, next: CmsStatus) => { try { await onSave({ ...record, status: next }); setConfirming(null) } catch { /* toast global */ } }

  return (
    <section className={styles.pageSection}>
      <div className={styles.sectionHeading}><div><span className={styles.eyebrow}>Copy administrable</span><h2>Textos de la landing</h2><p>Cada clave representa un bloque puntual. Se agrupan por prefijo para encontrarlos rápido.</p></div><button className={styles.primaryButton} type="button" onClick={openCreate}><Plus size={17} /> Nuevo texto</button></div>
      <div className={styles.toolbar}><label className={styles.searchBox}><Search size={17} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar por nombre, clave o contenido..." /></label><div className={styles.filterPills}>{(['all','published','draft','archived'] as const).map((value) => <button key={value} type="button" className={status === value ? styles.filterPillActive : styles.filterPill} onClick={() => setStatus(value)}>{value === 'all' ? 'Todos' : value === 'published' ? 'Publicados' : value === 'draft' ? 'Borradores' : 'Archivados'}</button>)}</div></div>
      {grouped.length ? <div className={styles.contentGroups}>{grouped.map(([group,items]) => <section className={styles.contentGroup} key={group}><div className={styles.contentGroupHeader}><h3>{group}</h3><span>{items.length} campo{items.length === 1 ? '' : 's'}</span></div><div className={styles.recordTable}>{items.map((record) => <article className={styles.recordRow} key={record.content_id}><div className={styles.recordMain}><div className={styles.recordTitleLine}><strong>{record.label || record.content_key}</strong><StatusBadge status={record.status} /></div><code>{record.content_key}</code><p>{record.value || 'Sin contenido'}</p></div><div className={styles.recordActions}>{record.status === 'archived' ? <button className={styles.iconTextButton} type="button" onClick={() => void changeStatus(record,'draft')} disabled={busy}><RotateCcw size={15} /> Restaurar</button> : <><button className={styles.iconTextButton} type="button" onClick={() => openEdit(record)}><Edit3 size={15} /> Editar</button><button className={styles.iconTextButtonDanger} type="button" onClick={() => setConfirming(record)}><Archive size={15} /> Archivar</button></>}</div></article>)}</div></section>)}</div> : <EmptyState title="No encontramos textos" description="Probá cambiando los filtros o creá un nuevo campo administrable." action={<button className={styles.secondaryButton} type="button" onClick={openCreate}><Plus size={16} /> Crear texto</button>} />}

      <Modal open={editorOpen} title={editing ? 'Editar texto' : 'Nuevo texto'} eyebrow="Contenido" description="La clave técnica se usa para conectar este valor con la landing." size="lg" busy={busy} onClose={closeEditor} footer={<><button className={styles.secondaryButton} type="button" onClick={closeEditor} disabled={busy}>Cancelar</button><button className={styles.primaryButton} type="submit" form="content-editor" disabled={busy || !draft.content_key?.trim()}>{busy ? <Spinner /> : <Save size={16} />} {busy ? 'Guardando...' : 'Guardar texto'}</button></>}>
        <form id="content-editor" className={styles.formGrid} onSubmit={submit}>
          <label className={styles.formField}><span>Clave técnica <em>*</em></span><input data-autofocus value={draft.content_key || ''} disabled={!!editing} onChange={(event) => setDraft((current) => ({ ...current, content_key: event.target.value }))} placeholder="hero.title" required /><small>Usá formato sección.campo, por ejemplo <code>hero.subtitle</code>.</small></label>
          <label className={styles.formField}><span>Nombre visible</span><input value={draft.label || ''} onChange={(event) => setDraft((current) => ({ ...current, label: event.target.value }))} placeholder="Título principal" /></label>
          <label className={styles.formField}><span>Tipo de valor</span><select value={draft.value_type || 'text'} onChange={(event) => setDraft((current) => ({ ...current, value_type: event.target.value }))}><option value="text">Texto corto</option><option value="textarea">Texto largo</option><option value="url">Enlace</option><option value="number">Número</option></select></label>
          <label className={styles.formField}><span>Estado</span><select value={draft.status || 'published'} onChange={(event) => setDraft((current) => ({ ...current, status: event.target.value as CmsStatus }))}><option value="published">Publicado</option><option value="draft">Borrador</option><option value="archived">Archivado</option></select></label>
          <label className={`${styles.formField} ${styles.formFieldWide}`}><span>Contenido</span><textarea rows={7} value={draft.value || ''} onChange={(event) => setDraft((current) => ({ ...current, value: event.target.value }))} placeholder="Escribí el contenido que va a ver el paciente." /></label>
        </form>
      </Modal>

      <Modal open={!!confirming} title="Archivar texto" eyebrow="Confirmación" description="El texto dejará de publicarse, pero seguirá disponible para restaurarlo después." size="sm" busy={busy} onClose={() => !busy && setConfirming(null)} footer={<><button className={styles.secondaryButton} type="button" onClick={() => setConfirming(null)} disabled={busy}>Cancelar</button><button className={styles.dangerButton} type="button" disabled={busy} onClick={() => confirming && void changeStatus(confirming,'archived')}>{busy ? <Spinner /> : <Archive size={16} />} Archivar</button></>}><p className={styles.confirmText}>¿Querés archivar <strong>{confirming?.label || confirming?.content_key}</strong>?</p></Modal>
    </section>
  )
}
