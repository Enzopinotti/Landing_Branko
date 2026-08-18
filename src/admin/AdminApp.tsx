import { lazy, Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  Activity,
  CircleHelp,
  Eye,
  EyeOff,
  FileText,
  Images,
  LayoutDashboard,
  LogOut,
  MapPin,
  Menu,
  MessageSquareQuote,
  RefreshCw,
  Settings2,
  ShieldCheck,
  Sparkles,
  X,
} from 'lucide-react'
import brankoMonogram from '@/assets/branko-monogram.svg'
import { cmsClient, CmsClientError, isCmsAuthError } from '@/cms/client'
import { clearAdminSession, getOrCreateClientId, readAdminSession, saveAdminSession } from '@/cms/session'
import type {
  CmsAuditRecord,
  CmsCollectionKey,
  CmsCollectionRecord,
  CmsContentRecord,
  CmsMedia,
  CmsMediaLink,
  CmsMediaSectionData,
  CmsOverviewData,
  CmsSectionData,
  CmsSectionKey,
  CmsSettings,
} from '@/cms/types'
import { collectionDefinitions, navGroups, type AdminView, viewToSection } from './adminConfig'
import { SectionLoader, Spinner, ToastRegion, type ToastData } from './components/Ui'
import styles from './AdminApp.module.scss'

const OverviewView = lazy(() => import('./views/OverviewView'))
const GeneralView = lazy(() => import('./views/GeneralView'))
const ContentView = lazy(() => import('./views/ContentView'))
const CollectionView = lazy(() => import('./views/CollectionView'))
const MediaView = lazy(() => import('./views/MediaView'))
const ActivityView = lazy(() => import('./views/ActivityView'))
const SecurityView = lazy(() => import('./views/SecurityView'))

type AuthState = 'checking' | 'signedOut' | 'signedIn'
type CacheEntry = { data: CmsSectionData; loadedAt: number }

const CACHE_TTL_MS = 45_000

const iconByView: Record<AdminView, typeof LayoutDashboard> = {
  overview: LayoutDashboard,
  general: Settings2,
  content: FileText,
  treatments: Sparkles,
  resultCases: Images,
  testimonials: MessageSquareQuote,
  locations: MapPin,
  faqs: CircleHelp,
  media: Images,
  activity: Activity,
  security: ShieldCheck,
}

const validViews = new Set<AdminView>(['overview', 'general', 'content', 'treatments', 'resultCases', 'testimonials', 'locations', 'faqs', 'media', 'activity', 'security'])

function viewFromHash(): AdminView {
  const value = window.location.hash.replace(/^#\/?/, '') as AdminView
  return validViews.has(value) ? value : 'overview'
}

function messageFromError(error: unknown) {
  if (error instanceof CmsClientError) return error.message
  if (error instanceof Error) return error.message
  return 'Ocurrió un error inesperado.'
}

function fileToDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result || ''))
    reader.onerror = () => reject(new Error('No se pudo leer la imagen.'))
    reader.readAsDataURL(file)
  })
}

function upsertById<T extends Record<string, unknown>>(rows: T[], record: T, idField: string) {
  const id = String(record[idField] ?? '')
  const index = rows.findIndex((row) => String(row[idField] ?? '') === id)
  if (index === -1) return [...rows, record]
  return rows.map((row, rowIndex) => rowIndex === index ? record : row)
}

function AdminApp() {
  const [authState, setAuthState] = useState<AuthState>('checking')
  const [sessionToken, setSessionToken] = useState('')
  const [activeView, setActiveView] = useState<AdminView>(() => viewFromHash())
  const [overview, setOverview] = useState<CmsOverviewData | null>(null)
  const [overviewLoading, setOverviewLoading] = useState(false)
  const [cache, setCache] = useState<Partial<Record<CmsSectionKey, CacheEntry>>>({})
  const [loadingSections, setLoadingSections] = useState<Partial<Record<CmsSectionKey, boolean>>>({})
  const [sectionErrors, setSectionErrors] = useState<Partial<Record<CmsSectionKey, string>>>({})
  const [mutationBusy, setMutationBusy] = useState(false)
  const [loginBusy, setLoginBusy] = useState(false)
  const [loginError, setLoginError] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const [toasts, setToasts] = useState<ToastData[]>([])
  const inflight = useRef<Partial<Record<CmsSectionKey, Promise<CmsSectionData>>>>({})

  const pushToast = useCallback((type: ToastData['type'], message: string) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`
    setToasts((current) => [...current, { id, type, message }])
    window.setTimeout(() => setToasts((current) => current.filter((toast) => toast.id !== id)), 4200)
  }, [])

  const signOutLocally = useCallback(() => {
    clearAdminSession()
    setSessionToken('')
    setOverview(null)
    setCache({})
    setAuthState('signedOut')
    setActiveView('overview')
    window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}#/overview`)
  }, [])

  const handleAsyncError = useCallback((error: unknown, fallback?: string) => {
    if (isCmsAuthError(error)) {
      signOutLocally()
      pushToast('error', 'La sesión venció. Volvé a ingresar.')
      return
    }
    pushToast('error', messageFromError(error) || fallback || 'No se pudo completar la operación.')
  }, [pushToast, signOutLocally])

  const loadOverview = useCallback(async (token: string, force = false) => {
    if (!force && overview) return overview
    setOverviewLoading(true)
    try {
      const next = await cmsClient.overview(token)
      setOverview(next)
      return next
    } finally {
      setOverviewLoading(false)
    }
  }, [overview])

  const loadSection = useCallback(async <T extends CmsSectionData>(sectionKey: CmsSectionKey, force = false): Promise<T> => {
    const existing = cache[sectionKey]
    if (!force && existing && Date.now() - existing.loadedAt < CACHE_TTL_MS) return existing.data as T
    if (!force && inflight.current[sectionKey]) return inflight.current[sectionKey] as Promise<T>
    if (!sessionToken) throw new Error('Sesión no disponible.')

    setLoadingSections((current) => ({ ...current, [sectionKey]: true }))
    setSectionErrors((current) => ({ ...current, [sectionKey]: '' }))
    const request = cmsClient.section<T>(sessionToken, sectionKey)
      .then((data) => {
        setCache((current) => ({ ...current, [sectionKey]: { data, loadedAt: Date.now() } }))
        return data
      })
      .catch((error) => {
        setSectionErrors((current) => ({ ...current, [sectionKey]: messageFromError(error) }))
        throw error
      })
      .finally(() => {
        setLoadingSections((current) => ({ ...current, [sectionKey]: false }))
        delete inflight.current[sectionKey]
      })
    inflight.current[sectionKey] = request as Promise<CmsSectionData>
    return request
  }, [cache, sessionToken])

  const refreshOverviewInBackground = useCallback(() => {
    if (!sessionToken) return
    cmsClient.overview(sessionToken).then(setOverview).catch(() => undefined)
  }, [sessionToken])

  const setSectionData = useCallback((sectionKey: CmsSectionKey, data: CmsSectionData) => {
    setCache((current) => ({ ...current, [sectionKey]: { data, loadedAt: Date.now() } }))
  }, [])

  useEffect(() => {
    const onHashChange = () => setActiveView(viewFromHash())
    window.addEventListener('hashchange', onHashChange)
    if (!window.location.hash) window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}#/overview`)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  useEffect(() => {
    let active = true
    const stored = readAdminSession()
    if (!stored) {
      setAuthState('signedOut')
      return () => { active = false }
    }
    setSessionToken(stored.token)
    cmsClient.overview(stored.token)
      .then((data) => {
        if (!active) return
        setOverview(data)
        setAuthState('signedIn')
      })
      .catch(() => {
        if (!active) return
        signOutLocally()
      })
    return () => { active = false }
  }, [signOutLocally])

  useEffect(() => {
    if (authState !== 'signedIn') return
    const sectionKey = viewToSection[activeView]
    if (!sectionKey) return
    void loadSection(sectionKey).catch((error) => {
      if (isCmsAuthError(error)) handleAsyncError(error)
    })
  }, [activeView, authState, handleAsyncError, loadSection])

  const navigate = useCallback((view: AdminView) => {
    if (view === activeView) return
    window.location.hash = `/${view}`
    setMobileNavOpen(false)
  }, [activeView])

  const prefetchView = useCallback((view: AdminView) => {
    if (authState !== 'signedIn') return
    const key = viewToSection[view]
    if (key && !cache[key]) void loadSection(key).catch(() => undefined)
  }, [authState, cache, loadSection])

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!password.trim()) return
    setLoginBusy(true)
    setLoginError('')
    try {
      const result = await cmsClient.login(password, getOrCreateClientId())
      const saved = saveAdminSession(result.token!, result.expiresIn!)
      setSessionToken(saved.token)
      const data = await cmsClient.overview(saved.token)
      setOverview(data)
      setPassword('')
      setAuthState('signedIn')
    } catch (error) {
      setLoginError(messageFromError(error))
    } finally {
      setLoginBusy(false)
    }
  }

  const handleLogout = () => {
    const token = sessionToken
    signOutLocally()
    if (token) void cmsClient.logout(token).catch(() => undefined)
  }

  const refreshCurrent = async () => {
    if (!sessionToken) return
    try {
      if (activeView === 'overview') {
        await loadOverview(sessionToken, true)
        pushToast('success', 'Resumen actualizado.')
        return
      }
      const key = viewToSection[activeView]
      if (!key) return
      await loadSection(key, true)
      pushToast('success', 'Contenido actualizado.')
    } catch (error) {
      handleAsyncError(error)
    }
  }

  const runMutation = useCallback(async <T,>(task: () => Promise<T>, successMessage: string): Promise<T> => {
    setMutationBusy(true)
    try {
      const result = await task()
      pushToast('success', successMessage)
      refreshOverviewInBackground()
      return result
    } catch (error) {
      handleAsyncError(error)
      throw error
    } finally {
      setMutationBusy(false)
    }
  }, [handleAsyncError, pushToast, refreshOverviewInBackground])

  const saveSettings = async (record: Partial<CmsSettings>) => {
    const saved = await runMutation(() => cmsClient.saveSettings(sessionToken, record), 'Datos generales guardados.')
    setSectionData('settings', [saved])
    setOverview((current) => current ? { ...current, settings: saved } : current)
  }

  const saveContent = async (record: Partial<CmsContentRecord>) => {
    const saved = await runMutation(() => cmsClient.saveContent(sessionToken, record as Record<string, unknown>), 'Texto guardado.') as CmsContentRecord
    const rows = (cache.content?.data as CmsContentRecord[] | undefined) || []
    setSectionData('content', upsertById(rows as unknown as Record<string, unknown>[], saved as unknown as Record<string, unknown>, 'content_id') as unknown as CmsContentRecord[])
  }

  const saveCollection = async (key: CmsCollectionKey, id: string | null, record: Record<string, unknown>) => {
    const saved = await runMutation(
      () => id ? cmsClient.updateRecord(sessionToken, key, id, record) : cmsClient.createRecord(sessionToken, key, record),
      id ? 'Registro actualizado.' : 'Registro creado.',
    ) as CmsCollectionRecord
    const definition = collectionDefinitions[key]
    const rows = (cache[key]?.data as CmsCollectionRecord[] | undefined) || []
    setSectionData(key, upsertById(rows as unknown as Record<string, unknown>[], saved as unknown as Record<string, unknown>, definition.idField) as unknown as CmsCollectionRecord[])
    return saved
  }

  const archiveCollection = async (key: CmsCollectionKey, record: CmsCollectionRecord) => {
    const definition = collectionDefinitions[key]
    const id = String((record as unknown as Record<string, unknown>)[definition.idField] || '')
    const saved = await runMutation(() => cmsClient.archiveRecord(sessionToken, key, id), 'Registro archivado.') as CmsCollectionRecord
    const rows = (cache[key]?.data as CmsCollectionRecord[] | undefined) || []
    setSectionData(key, upsertById(rows as unknown as Record<string, unknown>[], saved as unknown as Record<string, unknown>, definition.idField) as unknown as CmsCollectionRecord[])
  }

  const restoreCollection = async (key: CmsCollectionKey, record: CmsCollectionRecord) => {
    const definition = collectionDefinitions[key]
    const id = String((record as unknown as Record<string, unknown>)[definition.idField] || '')
    const saved = await runMutation(() => cmsClient.restoreRecord(sessionToken, key, id), 'Registro restaurado como borrador.') as CmsCollectionRecord
    const rows = (cache[key]?.data as CmsCollectionRecord[] | undefined) || []
    setSectionData(key, upsertById(rows as unknown as Record<string, unknown>[], saved as unknown as Record<string, unknown>, definition.idField) as unknown as CmsCollectionRecord[])
  }

  const ensureMedia = useCallback(async () => { await loadSection<CmsMediaSectionData>('media') }, [loadSection])

  const uploadMedia = async (file: File, altText: string) => {
    const base64 = await fileToDataUrl(file)
    const saved = await runMutation(() => cmsClient.uploadMedia(sessionToken, { fileName: file.name, mimeType: file.type, base64, altText }), 'Imagen subida a la biblioteca.')
    const mediaData = (cache.media?.data as CmsMediaSectionData | undefined) || { media: [], mediaLinks: [] }
    setSectionData('media', { ...mediaData, media: [...mediaData.media, saved] })
    return saved
  }

  const updateMedia = async (mediaId: string, altText: string) => {
    const saved = await runMutation(() => cmsClient.updateMedia(sessionToken, mediaId, altText), 'Imagen actualizada.')
    const mediaData = (cache.media?.data as CmsMediaSectionData | undefined) || { media: [], mediaLinks: [] }
    setSectionData('media', { ...mediaData, media: mediaData.media.map((item) => item.media_id === mediaId ? saved : item) })
  }

  const archiveMedia = async (media: CmsMedia) => {
    const saved = await runMutation(() => cmsClient.archiveMedia(sessionToken, media.media_id), 'Imagen archivada.')
    const mediaData = (cache.media?.data as CmsMediaSectionData | undefined) || { media: [], mediaLinks: [] }
    const next = saved || { ...media, status: 'archived' as const, archived_at: new Date().toISOString() }
    setSectionData('media', { ...mediaData, media: mediaData.media.map((item) => item.media_id === media.media_id ? next : item) })
  }

  const restoreMedia = async (media: CmsMedia) => {
    const saved = await runMutation(() => cmsClient.restoreMedia(sessionToken, media.media_id), 'Imagen restaurada.')
    const mediaData = (cache.media?.data as CmsMediaSectionData | undefined) || { media: [], mediaLinks: [] }
    const next = saved || { ...media, status: 'published' as const, archived_at: '' }
    setSectionData('media', { ...mediaData, media: mediaData.media.map((item) => item.media_id === media.media_id ? next : item) })
  }

  const linkMedia = async (payload: Record<string, unknown>) => {
    const saved = await runMutation(() => cmsClient.linkMedia(sessionToken, payload), 'Imagen vinculada.')
    const mediaData = (cache.media?.data as CmsMediaSectionData | undefined) || { media: [], mediaLinks: [] }
    const entityType = String(payload.entityType || '')
    const entityId = String(payload.entityId || '')
    const fieldKey = String(payload.fieldKey || '')
    const links = mediaData.mediaLinks.map((link) => (
      link.status !== 'archived' && link.entity_type === entityType && link.entity_id === entityId && link.field_key === fieldKey
        ? { ...link, status: 'archived' as const, archived_at: new Date().toISOString() }
        : link
    ))
    setSectionData('media', { ...mediaData, mediaLinks: [...links, saved] })
    return saved
  }

  const unlinkMedia = async (mediaLinkId: string) => {
    await runMutation(() => cmsClient.unlinkMedia(sessionToken, mediaLinkId), 'Imagen desvinculada.')
    const mediaData = (cache.media?.data as CmsMediaSectionData | undefined) || { media: [], mediaLinks: [] }
    setSectionData('media', {
      ...mediaData,
      mediaLinks: mediaData.mediaLinks.map((link) => link.media_link_id === mediaLinkId ? { ...link, status: 'archived' as const, archived_at: new Date().toISOString() } : link),
    })
  }

  const changePassword = async (currentPassword: string, newPassword: string) => {
    const result = await runMutation(() => cmsClient.changePassword(sessionToken, currentPassword, newPassword), 'Contraseña actualizada. Las sesiones anteriores quedaron invalidadas.')
    const saved = saveAdminSession(result.token!, result.expiresIn!)
    setSessionToken(saved.token)
  }

  const sectionKey = viewToSection[activeView]
  const currentEntry = sectionKey ? cache[sectionKey] : undefined
  const currentLoading = sectionKey ? !!loadingSections[sectionKey] : overviewLoading
  const currentError = sectionKey ? sectionErrors[sectionKey] : ''

  const currentTitle = useMemo(() => {
    for (const group of navGroups) {
      const item = group.items.find((candidate) => candidate.id === activeView)
      if (item) return item.label
    }
    return 'Resumen'
  }, [activeView])

  if (authState === 'checking') {
    return <main className={styles.loadingScreen}><Spinner size={30} /><span>Validando sesión</span></main>
  }

  if (authState === 'signedOut') {
    return (
      <main className={styles.loginScreen}>
        <section className={styles.loginCard}>
          <div className={styles.loginBrand}>
            <img src={brankoMonogram} alt="" aria-hidden="true" />
            <div><strong>Branko Iriart</strong><span>Panel de contenidos</span></div>
          </div>
          <div className={styles.loginCopy}>
            <span className={styles.eyebrow}>Acceso privado</span>
            <h1>Administrá la landing con claridad.</h1>
            <p>Textos, tratamientos, resultados, testimonios, ubicaciones e imágenes desde un solo lugar.</p>
          </div>
          <form className={styles.loginForm} onSubmit={handleLogin}>
            <label htmlFor="admin-password">Contraseña</label>
            <div className={styles.passwordField}>
              <input id="admin-password" type={showPassword ? 'text' : 'password'} value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" autoFocus />
              <button type="button" onClick={() => setShowPassword((value) => !value)} aria-label="Mostrar u ocultar contraseña">{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button>
            </div>
            {loginError && <p className={styles.formError}>{loginError}</p>}
            <button className={styles.primaryButton} disabled={loginBusy || !password.trim()} type="submit">{loginBusy ? <Spinner /> : <ShieldCheck size={17} />}{loginBusy ? 'Ingresando...' : 'Ingresar al panel'}</button>
          </form>
        </section>
      </main>
    )
  }

  const renderView = () => {
    if (activeView === 'overview') {
      if (!overview) return <SectionLoader label="Cargando resumen" />
      return <OverviewView overview={overview} onNavigate={navigate} />
    }
    if (activeView === 'security') return <SecurityView busy={mutationBusy} onChangePassword={changePassword} />
    if (!sectionKey || !currentEntry) {
      if (currentError) return <div className={styles.loadError}><strong>No pudimos cargar esta sección.</strong><p>{currentError}</p><button className={styles.secondaryButton} type="button" onClick={() => sectionKey && void loadSection(sectionKey, true).catch(handleAsyncError)}>Reintentar</button></div>
      return <SectionLoader />
    }

    if (activeView === 'general') return <GeneralView settings={(currentEntry.data as CmsSettings[])[0]} busy={mutationBusy} onSave={saveSettings} />
    if (activeView === 'content') return <ContentView records={currentEntry.data as CmsContentRecord[]} busy={mutationBusy} onSave={saveContent} />
    if (activeView === 'media') return <MediaView data={currentEntry.data as CmsMediaSectionData} busy={mutationBusy} onUpload={uploadMedia} onUpdate={updateMedia} onArchive={archiveMedia} onRestore={restoreMedia} />
    if (activeView === 'activity') return <ActivityView records={currentEntry.data as CmsAuditRecord[]} />
    if (activeView in collectionDefinitions) {
      const key = activeView as CmsCollectionKey
      return (
        <CollectionView
          definition={collectionDefinitions[key]}
          records={currentEntry.data as CmsCollectionRecord[]}
          busy={mutationBusy}
          mediaData={cache.media?.data as CmsMediaSectionData | undefined}
          mediaLoading={!!loadingSections.media}
          onEnsureMedia={ensureMedia}
          onSave={(id, record) => saveCollection(key, id, record)}
          onArchive={(record) => archiveCollection(key, record)}
          onRestore={(record) => restoreCollection(key, record)}
          onUploadMedia={uploadMedia}
          onLinkMedia={linkMedia}
          onUnlinkMedia={unlinkMedia}
        />
      )
    }
    return null
  }

  return (
    <div className={styles.adminShell}>
      <aside className={`${styles.sidebar} ${mobileNavOpen ? styles.sidebarOpen : ''}`}>
        <div className={styles.sidebarBrand}>
          <img src={brankoMonogram} alt="" aria-hidden="true" />
          <div><strong>Branko Iriart</strong><span>Administración</span></div>
          <button className={styles.mobileClose} type="button" onClick={() => setMobileNavOpen(false)} aria-label="Cerrar navegación"><X size={19} /></button>
        </div>

        <nav className={styles.nav} aria-label="Secciones del panel">
          {navGroups.map((group) => (
            <div className={styles.navGroup} key={group.label}>
              <span className={styles.navGroupLabel}>{group.label}</span>
              {group.items.map((item) => {
                const Icon = iconByView[item.id]
                const selected = activeView === item.id
                return (
                  <button
                    className={selected ? styles.navItemActive : styles.navItem}
                    key={item.id}
                    type="button"
                    onClick={() => navigate(item.id)}
                    onMouseEnter={() => prefetchView(item.id)}
                    onFocus={() => prefetchView(item.id)}
                  >
                    <Icon size={17} />
                    <span><strong>{item.label}</strong><small>{item.description}</small></span>
                    {selected && <i />}
                  </button>
                )
              })}
            </div>
          ))}
        </nav>

        <button className={styles.logoutButton} type="button" onClick={handleLogout}><LogOut size={17} /> Cerrar sesión</button>
      </aside>
      {mobileNavOpen && <button className={styles.mobileBackdrop} aria-label="Cerrar navegación" type="button" onClick={() => setMobileNavOpen(false)} />}

      <main className={styles.main}>
        <header className={styles.topbar}>
          <div className={styles.topbarTitle}>
            <button className={styles.mobileMenu} type="button" onClick={() => setMobileNavOpen(true)} aria-label="Abrir navegación"><Menu size={20} /></button>
            <div><span className={styles.eyebrow}>CMS · Branko Iriart</span><h1>{currentTitle}</h1></div>
          </div>
          <div className={styles.topbarActions}>
            {currentLoading && currentEntry && <span className={styles.backgroundSync}><Spinner size={14} /> Actualizando</span>}
            <button className={styles.secondaryButton} type="button" onClick={() => void refreshCurrent()} disabled={currentLoading || mutationBusy || activeView === 'security'}>
              <RefreshCw className={currentLoading ? styles.spinner : undefined} size={16} /> Sincronizar
            </button>
          </div>
        </header>

        <Suspense fallback={<SectionLoader />}>
          {renderView()}
        </Suspense>
      </main>

      <ToastRegion toasts={toasts} onDismiss={(id) => setToasts((current) => current.filter((toast) => toast.id !== id))} />
    </div>
  )
}

export default AdminApp
