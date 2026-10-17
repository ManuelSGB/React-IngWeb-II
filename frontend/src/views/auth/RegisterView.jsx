import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import API_CONFIG from '../../config/api'
import httpService from '../../services/httpService'
import AlertMessage from '../common/AlertMessage'

function RegisterView() {
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setIsSubmitting(true)
    const formData = new FormData(event.currentTarget)

    try {
      await httpService.post(API_CONFIG.ENDPOINTS.REGISTER, {
        nombre: formData.get('nombre'),
        apellido: formData.get('apellido'),
        correo: formData.get('correo'),
        contrasena: formData.get('contrasena')
      }, false)
      navigate('/login', {
        replace: true,
        state: { message: 'Cuenta creada. Inicia sesión para continuar.' }
      })
    } catch (requestError) {
      setError(requestError.message || 'No se pudo crear la cuenta.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-aside register-aside">
        <Link className="brand brand-light" to="/" />
        <div>
          <h1>Empieza con una acción pequeña.</h1>
          <p>Forma parte de una comunidad que aprende y avanza junta.</p>
        </div>
        <span className="aside-note">ECOWATT</span>
      </div>
      <div className="auth-form-wrap">
        <div className="auth-form">
          <p className="eyebrow">UNETE A LA CONVERSACIÓN</p>
          <h2>Crear cuenta</h2>
          <p className="form-subtitle">Tu próximo hábito empieza aqui.</p>
          {error && <AlertMessage type="error" duration={0} message={error} />}
          <form onSubmit={handleSubmit}>
            <label>
              Nombre
              <input type="text" name="nombre" maxLength={50} autoComplete="given-name" required />
            </label>
            <label>
              Apellido
              <input type="text" name="apellido" maxLength={50} autoComplete="family-name" required />
            </label>
            <label>
              Correo electrónico
              <input type="email" name="correo" maxLength={100} autoComplete="email" required />
            </label>
            <label>
              Contraseña
              <input
                type="password"
                name="contrasena"
                maxLength={255}
                autoComplete="new-password"
                minLength={6}
                required
              />
            </label>
            <label className="check-label">
              <input type="checkbox" required /> Acepto los términos de la comunidad
            </label>
            <button className="button button-dark button-full" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Creando cuenta…' : 'Crear mi cuenta'} <span>↗</span>
            </button>
          </form>
          <p className="auth-switch">¿Ya tienes una cuenta? <Link to="/login">Iniciar sesión</Link></p>
        </div>
      </div>
    </div>
  )
}

export default RegisterView
