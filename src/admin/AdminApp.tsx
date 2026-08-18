import { FormEvent, useEffect, useMemo, useState } from 'react'
import {
  CircleCheck,
  Eye,
  EyeOff,
  Files,
  Image as ImageIcon,
  LayoutDashboard,
  LoaderCircle,
  LogOut,
  RefreshCw,
  Save,
  Settings2,
  ShieldCheck,
} from 'lucide-react'
import brankoMonogram from '@/assets/branko-monogram.svg'
import { cmsClient, CmsClientError } from '@/cms/client'
import {
  clearAdminSession,
  getOrCreateClientId,
  readAdminSession,
  saveAdminSession,
} from '@/cms/session'
import type { CmsSettings, CmsWorkspaceData } from '@/cms/types'
import styles from './AdminApp.module.scss'

type View = 'overview' | 'general' | 'content' | 'media' | 'security'
type AuthState = 'checking' | 'signedOut' | 'signedIn'

const navItems: Array<{
  id: View
  label: string
  description: string
  icon: typeof LayoutDashboard
}> = [
  { id: 'overview', label: 'Resumen', description: 'Estado general', icon: LayoutDashboard },
  { id: 'general', label: 'Datos generales', description: 'Contacto y métricas', icon: Settings2 },
  { id: 'content', label: 'Contenido', description: 'Colecciones editables', icon: Files },
  { id: 'media', label: 'Biblioteca', description: 'Imágenes del sitio', icon: ImageIcon },
  { id: 'security', label: 'Seguridad', description: 'Acceso al panel', icon: ShieldCheck },
]

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

function messageFromError(error: unknown) {
  if (error instanceof CmsClientError) return error.message
  if (error instanceof Error) return error.message
  return 'Ocurrió un error inesperado.'
}

function AdminApp() {
  const [authState, setAuthState] = useState<AuthState>('checking')
  const [sessionToken, setSessionToken] = useState('')
  const [workspace, setWorkspace] = useState<CmsWorkspaceData | null>(null)
  const [activeView, setActiveView] = useState<View>('overview')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loginBusy, setLoginBusy] = useState(false)
  const [pageBusy, setPageBusy] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [settingsDraft, setSettingsDraft] = useState<Partial<CmsSettings>>(emptySettings)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showSecurityPasswords, setShowSecurityPasswords] = useState(false)

  const syncWorkspace = async (token: string) => {
    const next = await cmsClient.workspace(token)
    setWorkspace(next)
    setSettingsDraft({ ...emptySettings, ...(next.settings[0] || {}) })
    return next
  }

  useEffect(() => {
    let active = true
    const stored = readAdminSession()
    if (!stored) {
      setAuthState('signedOut')
      return () => {
        active = false
      }
    }

    setSessionToken(stored.token)
    syncWorkspace(stored.token)
      .then(() => {
        if (active) setAuthState('signedIn')
      })
      .catch(() => {
        if (!active) return
        clearAdminSession()
        setSessionToken('')
        setWorkspace(null)
        setAuthState('signedOut')
      })

    return () => {
      active = false
    }
  }, [])

  const collectionStats = useMemo(() => {
    if (!workspace) return []
    return [
      ['Tratamientos', workspace.treatments],
      ['Ubicaciones', workspace.locations],
      ['Resultados', workspace.resultCases],
      ['Testimonios', workspace.testimonials],
      ['Preguntas frecuentes', workspace.faqs],
    ].map(([label, rows]) => {
      const records = rows as Array<{ status?: string }>
      return {
        label: label as string,
        total: records.length,
        published: records.filter((record) => record.status === 'published').length,
      }
    })
  }, [workspace])

  const handleLogin = async (event: FormEvent) => {
    event.preventDefault()
    if (!password.trim()) return
    setLoginBusy(true)
    setError('')

    try {
      const result = await cmsClient.login(password, getOrCreateClientId())
      const saved = saveAdminSession(result.token!, result.expiresIn!)
      setSessionToken(saved.token)
      await syncWorkspace(saved.token)
      setPassword('')
      setAuthState('signedIn')
    } catch (loginError) {
      setError(messageFromError(loginError))
    } finally {
      setLoginBusy(false)
    }
  }

  const handleLogout = async () => {
    const token = sessionToken
    clearAdminSession()
    setSessionToken('')
    setWorkspace(null)
    setAuthState('signedOut')
    setActiveView('overview')
    setNotice('')
    setError('')
    if (token) cmsClient.logout(token).catch(() => undefined)
  }

  const handleRefresh = async () => {
    if (!sessionToken) return
    setPageBusy(true)
    setError('')
    setNotice('')
    try {
      await syncWorkspace(sessionToken)
      setNotice('Datos sincronizados con el CMS.')
    } catch (refreshError) {
      setError(messageFromError(refreshError))
    } finally {
      setPageBusy(false)
    }
  }

  const handleSettingsChange = (field: keyof CmsSettings, value: string) => {
    setSettingsDraft((current) => ({ ...current, [field]: value }))
  }

  const handleSaveSettings = async (event: FormEvent) => {
    event.preventDefault()
    if (!sessionToken) return
    setPageBusy(true)
    setError('')
    setNotice('')
    try {
      const saved = await cmsClient.saveSettings(sessionToken, settingsDraft)
      setSettingsDraft({ ...emptySettings, ...saved })
      await syncWorkspace(sessionToken)
      setNotice('Datos generales guardados correctamente.')
    } catch (saveError) {
      setError(messageFromError(saveError))
    } finally {
      setPageBusy(false)
    }
  }

  const handleChangePassword = async (event: FormEvent) => {
    event.preventDefault()
    if (!sessionToken) return
    if (newPassword !== confirmPassword) {
      setError('La confirmación no coincide con la nueva contraseña.')
      return
    }

    setPageBusy(true)
    setError('')
    setNotice('')
    try {
      const result = await cmsClient.changePassword(sessionToken, currentPassword, newPassword)
      const saved = saveAdminSession(result.token!, result.expiresIn!)
      setSessionToken(saved.token)
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      setNotice('Contraseña actualizada. Las sesiones anteriores quedaron invalidadas.')
    } catch (changeError) {
      setError(messageFromError(changeError))
    } finally {
      setPageBusy(false)
    }
  }

  if (authState === 'checking') {
    return (
      <main className={styles.loadingScreen}>
        <LoaderCircle className={styles.spinner} size={30} />
        <span>Validando sesión</span>
      </main>
    )
  }

  if (authState === 'signedOut') {
    return (
      <main className={styles.loginScreen}>
        <section className={styles.loginCard}>
          <div className={styles.loginBrand}>
            <img src={brankoMonogram} alt="" aria-hidden="true" />
            <div>
              <strong>Branko Iriart</strong>
              <span>Panel de contenidos</span>
            </div>
          </div>

          <div className={styles.loginCopy}>
            <span className={styles.eyebrow}>Acceso privado</span>
            <h1>Administrá la landing sin tocar el diseño.</h1>
            <p>Textos, datos, colecciones e imágenes se gestionan desde este espacio.</p>
          </div>

          <form className={styles.loginForm} onSubmit={handleLogin}>
            <label htmlFor="admin-password">Contraseña</label>
            <div className={styles.passwordField}>
              <input
                id="admin-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="current-password"
                autoFocus
              />
              <button type="button" onClick={() => setShowPassword((value) => !value)} aria-label="Mostrar u ocultar contraseña">
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {error && <p className={styles.formError}>{error}</p>}
            <button className={styles.primaryButton} disabled={loginBusy} type="submit">
              {loginBusy ? <LoaderCircle className={styles.spinner} size={17} /> : <ShieldCheck size={17} />}
              {loginBusy ? 'Ingresando...' : 'Ingresar al panel'}
            </button>
          </form>
        </section>
      </main>
    )
  }

  const settings = workspace?.settings[0]
  const activeMedia = workspace?.media.filter((item) => item.status !== 'archived').length || 0
  const publishedContent = workspace?.content.filter((item) => item.status === 'published').length || 0

  return (
    <div className={styles.adminShell}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarBrand}>
          <img src={brankoMonogram} alt="" aria-hidden="true" />
          <div>
            <strong>Branko Iriart</strong>
            <span>Administración</span>
          </div>
        </div>

        <nav className={styles.nav} aria-label="Secciones del panel">
          {navItems.map((item) => {
            const Icon = item.icon
            const selected = activeView === item.id
            return (
              <button
                className={selected ? styles.navItemActive : styles.navItem}
                key={item.id}
                type="button"
                onClick={() => {
                  setActiveView(item.id)
                  setError('')
                  setNotice('')
                }}
              >
                <Icon size={18} />
                <span>
                  <strong>{item.label}</strong>
                  <small>{item.description}</small>
                </span>
              </button>
            )
          })}
        </nav>

        <button className={styles.logoutButton} type="button" onClick={handleLogout}>
          <LogOut size={17} />
          Cerrar sesión
        </button>
      </aside>

      <main className={styles.main}>
        <header className={styles.topbar}>
          <div>
            <span className={styles.eyebrow}>CMS · v0.1</span>
            <h1>{navItems.find((item) => item.id === activeView)?.label}</h1>
          </div>
          <button className={styles.secondaryButton} type="button" onClick={handleRefresh} disabled={pageBusy}>
            <RefreshCw className={pageBusy ? styles.spinner : undefined} size={16} />
            Sincronizar
          </button>
        </header>

        {(error || notice) && (
          <div className={error ? styles.alertError : styles.alertSuccess}>
            {notice && <CircleCheck size={17} />}
            <span>{error || notice}</span>
          </div>
        )}

        {activeView === 'overview' && (
          <section className={styles.pageSection}>
            <div className={styles.heroPanel}>
              <div>
                <span className={styles.eyebrow}>Conexión activa</span>
                <h2>{settings?.professional_name || 'Dr. Branko Iriart'}</h2>
                <p>El panel está conectado al Web App y a la Sheet del CMS. Los cambios se guardan sin alterar la estructura visual de la landing.</p>
              </div>
              <div className={styles.statusPill}><span /> Backend conectado</div>
            </div>

            <div className={styles.metricsGrid}>
              <article className={styles.metricCard}>
                <span>Contenido publicado</span>
                <strong>{publishedContent}</strong>
                <small>textos administrables</small>
              </article>
              <article className={styles.metricCard}>
                <span>Tratamientos</span>
                <strong>{workspace?.treatments.length || 0}</strong>
                <small>registros totales</small>
              </article>
              <article className={styles.metricCard}>
                <span>Biblioteca</span>
                <strong>{activeMedia}</strong>
                <small>imágenes activas</small>
              </article>
              <article className={styles.metricCard}>
                <span>Preguntas frecuentes</span>
                <strong>{workspace?.faqs.length || 0}</strong>
                <small>registros totales</small>
              </article>
            </div>

            <div className={styles.collectionPanel}>
              <div className={styles.sectionHeading}>
                <div>
                  <span className={styles.eyebrow}>Colecciones</span>
                  <h2>Estado del contenido estructurado</h2>
                </div>
              </div>
              <div className={styles.collectionRows}>
                {collectionStats.map((stat) => (
                  <div className={styles.collectionRow} key={stat.label}>
                    <span>{stat.label}</span>
                    <div>
                      <strong>{stat.published}</strong>
                      <small> publicados de {stat.total}</small>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {activeView === 'general' && (
          <section className={styles.pageSection}>
            <div className={styles.sectionHeading}>
              <div>
                <span className={styles.eyebrow}>Configuración</span>
                <h2>Datos generales</h2>
                <p>Información transversal que alimentará contacto, redes y métricas visibles.</p>
              </div>
            </div>

            <form className={styles.formCard} onSubmit={handleSaveSettings}>
              <div className={styles.formGrid}>
                <Field label="Nombre del sitio" value={settingsDraft.site_name || ''} onChange={(value) => handleSettingsChange('site_name', value)} />
                <Field label="Nombre profesional" value={settingsDraft.professional_name || ''} onChange={(value) => handleSettingsChange('professional_name', value)} />
                <Field label="Matrícula / credencial" value={settingsDraft.professional_license || ''} onChange={(value) => handleSettingsChange('professional_license', value)} />
                <Field label="WhatsApp" value={settingsDraft.whatsapp_number || ''} onChange={(value) => handleSettingsChange('whatsapp_number', value)} />
                <Field label="Instagram" value={settingsDraft.instagram_handle || ''} onChange={(value) => handleSettingsChange('instagram_handle', value)} />
                <Field label="URL de Instagram" value={settingsDraft.instagram_url || ''} onChange={(value) => handleSettingsChange('instagram_url', value)} />
                <Field label="Métrica pacientes" value={settingsDraft.patients_metric || ''} onChange={(value) => handleSettingsChange('patients_metric', value)} />
                <Field label="Métrica seguidores" value={settingsDraft.followers_metric || ''} onChange={(value) => handleSettingsChange('followers_metric', value)} />
                <Field label="Métrica tratamientos" value={settingsDraft.treatments_metric || ''} onChange={(value) => handleSettingsChange('treatments_metric', value)} />
                <Field label="Métrica personalizada" value={settingsDraft.personalized_metric || ''} onChange={(value) => handleSettingsChange('personalized_metric', value)} />
              </div>

              <div className={styles.formWideFields}>
                <Field label="Mensaje para reservar" multiline value={settingsDraft.whatsapp_booking_message || ''} onChange={(value) => handleSettingsChange('whatsapp_booking_message', value)} />
                <Field label="Mensaje para consultar" multiline value={settingsDraft.whatsapp_consult_message || ''} onChange={(value) => handleSettingsChange('whatsapp_consult_message', value)} />
              </div>

              <div className={styles.formActions}>
                <button className={styles.primaryButton} disabled={pageBusy} type="submit">
                  {pageBusy ? <LoaderCircle className={styles.spinner} size={17} /> : <Save size={17} />}
                  Guardar cambios
                </button>
              </div>
            </form>
          </section>
        )}

        {activeView === 'content' && (
          <section className={styles.pageSection}>
            <div className={styles.sectionHeading}>
              <div>
                <span className={styles.eyebrow}>Contenido</span>
                <h2>Colecciones listas para administrar</h2>
                <p>La base ya está conectada. El siguiente bloque agrega los formularios CRUD sobre estas mismas colecciones.</p>
              </div>
            </div>
            <div className={styles.contentCards}>
              {collectionStats.map((stat) => (
                <article className={styles.contentCard} key={stat.label}>
                  <strong>{stat.label}</strong>
                  <span>{stat.total} registros</span>
                  <small>{stat.published} publicados</small>
                </article>
              ))}
            </div>
          </section>
        )}

        {activeView === 'media' && (
          <section className={styles.pageSection}>
            <div className={styles.sectionHeading}>
              <div>
                <span className={styles.eyebrow}>Google Drive</span>
                <h2>Biblioteca de imágenes</h2>
                <p>El backend ya soporta upload, reutilización y vínculos. El MediaPicker visual se suma en el próximo bloque.</p>
              </div>
            </div>
            <div className={styles.metricsGrid}>
              <article className={styles.metricCard}>
                <span>Activas</span>
                <strong>{activeMedia}</strong>
                <small>visibles para vincular</small>
              </article>
              <article className={styles.metricCard}>
                <span>Registros totales</span>
                <strong>{workspace?.media.length || 0}</strong>
                <small>incluye archivados</small>
              </article>
              <article className={styles.metricCard}>
                <span>Vínculos</span>
                <strong>{workspace?.mediaLinks.length || 0}</strong>
                <small>relaciones registradas</small>
              </article>
            </div>
          </section>
        )}

        {activeView === 'security' && (
          <section className={styles.pageSection}>
            <div className={styles.sectionHeading}>
              <div>
                <span className={styles.eyebrow}>Seguridad</span>
                <h2>Cambiar contraseña</h2>
                <p>Al cambiarla, todas las sesiones anteriores quedan invalidadas y esta sesión recibe un token nuevo.</p>
              </div>
            </div>

            <form className={styles.securityCard} onSubmit={handleChangePassword}>
              <SecurityField label="Contraseña actual" value={currentPassword} onChange={setCurrentPassword} visible={showSecurityPasswords} autoComplete="current-password" />
              <SecurityField label="Nueva contraseña" value={newPassword} onChange={setNewPassword} visible={showSecurityPasswords} autoComplete="new-password" />
              <SecurityField label="Repetir nueva contraseña" value={confirmPassword} onChange={setConfirmPassword} visible={showSecurityPasswords} autoComplete="new-password" />
              <label className={styles.visibilityToggle}>
                <input type="checkbox" checked={showSecurityPasswords} onChange={(event) => setShowSecurityPasswords(event.target.checked)} />
                Mostrar contraseñas
              </label>
              <div className={styles.securityHint}>Mínimo 12 caracteres, combinando letras y números.</div>
              <button className={styles.primaryButton} type="submit" disabled={pageBusy || !currentPassword || !newPassword || !confirmPassword}>
                {pageBusy ? <LoaderCircle className={styles.spinner} size={17} /> : <ShieldCheck size={17} />}
                Actualizar contraseña
              </button>
            </form>
          </section>
        )}
      </main>
    </div>
  )
}

function Field({
  label,
  value,
  onChange,
  multiline = false,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  multiline?: boolean
}) {
  return (
    <label className={styles.field}>
      <span>{label}</span>
      {multiline ? (
        <textarea value={value} onChange={(event) => onChange(event.target.value)} rows={3} />
      ) : (
        <input value={value} onChange={(event) => onChange(event.target.value)} />
      )}
    </label>
  )
}

function SecurityField({
  label,
  value,
  onChange,
  visible,
  autoComplete,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  visible: boolean
  autoComplete: string
}) {
  return (
    <label className={styles.field}>
      <span>{label}</span>
      <input
        type={visible ? 'text' : 'password'}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        autoComplete={autoComplete}
      />
    </label>
  )
}

export default AdminApp
