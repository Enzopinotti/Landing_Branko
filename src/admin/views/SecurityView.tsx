import { FormEvent, useMemo, useState } from 'react'
import { Eye, EyeOff, KeyRound, ShieldCheck } from 'lucide-react'
import { Spinner } from '../components/Ui'
import styles from '../AdminApp.module.scss'

export default function SecurityView({ busy, onChangePassword }: { busy: boolean; onChangePassword: (currentPassword: string, newPassword: string) => Promise<void> }) {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPasswords, setShowPasswords] = useState(false)
  const [localError, setLocalError] = useState('')

  const strength = useMemo(() => {
    let score = 0
    if (newPassword.length >= 12) score += 1
    if (/[A-Z]/.test(newPassword) && /[a-z]/.test(newPassword)) score += 1
    if (/\d/.test(newPassword)) score += 1
    if (/[^A-Za-z0-9]/.test(newPassword)) score += 1
    return score
  }, [newPassword])

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    setLocalError('')
    if (newPassword !== confirmPassword) {
      setLocalError('La confirmación no coincide con la nueva contraseña.')
      return
    }
    if (newPassword.length < 12 || !/[A-Za-z]/.test(newPassword) || !/\d/.test(newPassword)) {
      setLocalError('Usá al menos 12 caracteres combinando letras y números.')
      return
    }
    await onChangePassword(currentPassword, newPassword)
    setCurrentPassword('')
    setNewPassword('')
    setConfirmPassword('')
  }

  return (
    <section className={styles.pageSection}>
      <div className={styles.sectionHeading}>
        <div>
          <span className={styles.eyebrow}>Acceso privado</span>
          <h2>Seguridad</h2>
          <p>La contraseña se guarda como hash + salt y el cambio invalida automáticamente las sesiones anteriores.</p>
        </div>
      </div>

      <div className={styles.securityGrid}>
        <form className={styles.securityCard} onSubmit={submit}>
          <div className={styles.securityCardIcon}><KeyRound size={22} /></div>
          <div className={styles.formSectionTitle}>
            <h3>Cambiar contraseña</h3>
            <p>Después del cambio, esta sesión recibe un token nuevo y cualquier otra sesión deja de ser válida.</p>
          </div>

          <label className={styles.formField}>
            <span>Contraseña actual</span>
            <div className={styles.passwordField}>
              <input type={showPasswords ? 'text' : 'password'} autoComplete="current-password" value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} required />
              <button type="button" onClick={() => setShowPasswords((value) => !value)} aria-label="Mostrar u ocultar contraseñas">{showPasswords ? <EyeOff size={17} /> : <Eye size={17} />}</button>
            </div>
          </label>

          <label className={styles.formField}>
            <span>Nueva contraseña</span>
            <input type={showPasswords ? 'text' : 'password'} autoComplete="new-password" value={newPassword} onChange={(event) => setNewPassword(event.target.value)} required />
            <div className={styles.strengthBar} aria-label={`Fortaleza ${strength} de 4`}>
              {[1, 2, 3, 4].map((value) => <span className={strength >= value ? styles.strengthActive : ''} key={value} />)}
            </div>
            <small>Mínimo 12 caracteres con letras y números. Recomendado: mayúsculas y símbolos.</small>
          </label>

          <label className={styles.formField}>
            <span>Confirmar nueva contraseña</span>
            <input type={showPasswords ? 'text' : 'password'} autoComplete="new-password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} required />
          </label>

          {localError && <p className={styles.formError}>{localError}</p>}
          <button className={styles.primaryButton} type="submit" disabled={busy || !currentPassword || !newPassword || !confirmPassword}>{busy ? <Spinner /> : <ShieldCheck size={17} />} {busy ? 'Actualizando...' : 'Actualizar contraseña'}</button>
        </form>

        <aside className={styles.securityInfoCard}>
          <ShieldCheck size={30} />
          <h3>Protecciones activas</h3>
          <ul>
            <li>Sesiones temporales de 6 horas.</li>
            <li>Token administrativo fuera de la URL.</li>
            <li>Resultados administrativos one-shot.</li>
            <li>Rate limiting de intentos de acceso.</li>
            <li>Auditoría de acciones administrativas.</li>
            <li>Contraseña nunca almacenada en texto plano.</li>
          </ul>
        </aside>
      </div>
    </section>
  )
}
