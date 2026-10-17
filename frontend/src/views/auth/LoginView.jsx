import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import API_CONFIG from '../../config/api'
import httpService from '../../services/httpService'
import storageService from '../../services/storageService'
import AlertMessage from '../common/AlertMessage'

function LoginView() {
  const navigate = useNavigate()
  const location = useLocation()
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setIsSubmitting(true)
    const formData = new FormData(event.currentTarget)

    try {
      const response = await httpService.post(API_CONFIG.ENDPOINTS.LOGIN, {
        correo: formData.get('correo'),
        contrasena: formData.get('contrasena')
      }, false)
      const user = response.data
      const token = user?.session_token?.split(/\s+/).pop()
      if (!token || !user.role) {
        throw new Error('La API no devolvió una sesión válida.')
      }

      const userData = { ...user }
      delete userData.session_token
      const sessionStored = storageService.setToken(token) &&
        storageService.setUser(userData) &&
        storageService.setUserRole(user.role)
      if (!sessionStored) {
        storageService.clearSession()
        throw new Error('No se pudo guardar la sesión en este navegador.')
      }
      window.dispatchEvent(new Event('auth-change'))

      const requestedPath = location.state?.from
      const destination = requestedPath === '/foro/nuevo-tema'
        ? requestedPath
        : user.role === 'admin' ? '/admin/usuarios' : '/foro'
      navigate(destination, { replace: true })
    } catch (requestError) {
      setError(requestError.message || 'No se pudo iniciar sesión.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-aside">
        <Link className="brand brand-light" to="/" />
        <div>
          <h1>Las buenas ideas se comparten.</h1>
          <p>Vuelve a la comunidad que convierte la curiosidad en hábitos sostenibles.</p>
        </div>
        <span className="aside-note">ECOWATT</span>
      </div>
      <div className="auth-form-wrap">
        <div className="auth-form">
          <p className="eyebrow">BIENVENIDO DE VUELTA</p>
          <h2>Iniciar sesión</h2>
          <p className="form-subtitle">Entra para seguir tu recorrido.</p>
          {location.state?.message && (
            <AlertMessage type="success" duration={0} message={location.state.message} />
          )}
          {error && <AlertMessage type="error" duration={0} message={error} />}
          <form onSubmit={handleSubmit}>
            <label>
              Correo electrónico
              <input type="email" name="correo" autoComplete="email" required />
            </label>
            <label>
              Contraseña
              <div className="password-field">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="contrasena"
                  autoComplete="current-password"
                  required
                />
                <button type="button" onClick={() => setShowPassword((visible) => !visible)}>
                  {showPassword ? 'Ocultar' : 'Mostrar'}
                </button>
              </div>
            </label>
            <button className="button button-dark button-full" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Entrando…' : 'Entrar'} <span>↗</span>
            </button>
          </form>
          <p className="auth-switch">¿No tienes cuenta? <Link to="/registro">Crear una cuenta</Link></p>
        </div>
      </div>
    </div>
  )
}

export default LoginView
