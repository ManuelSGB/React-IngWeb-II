import { Link } from 'react-router-dom'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import API_CONFIG from '../../config/api'
import httpService from '../../services/httpService'
import storageService from '../../services/storageService'
import AlertMessage from '../common/AlertMessage'

function AddTopicView() {
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const isSignedIn = Boolean(storageService.getToken())

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setIsSaving(true)
    const formData = new FormData(event.currentTarget)

    try {
      await httpService.post(API_CONFIG.ENDPOINTS.FORUM, {
        categoria: formData.get('categoria'),
        titulo: formData.get('titulo'),
        mensaje: formData.get('mensaje')
      })
      navigate('/foro', { state: { message: 'Tu tema se publicó correctamente.' } })
    } catch (requestError) {
      setError(requestError.message || 'No se pudo publicar el tema.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="site-page section-wrap add-topic-page">
      <Link className="back-link" to="/foro">← Volver al foro</Link>
      <div className="add-topic-header">
        <p className="eyebrow">NUEVA CONVERSACION</p>
        <h1>Comparte una idea con la <em>comunidad.</em></h1>
        <p className="hero-lead">Abre un tema y permite que otras personas aporten sus experiencias sobre el ahorro de energia.</p>
      </div>
      {!isSignedIn && (
        <AlertMessage type="error" duration={0} message="Inicia sesión para publicar un tema." />
      )}
      {error && <AlertMessage type="error" duration={0} message={error} />}
      <form className="topic-form" onSubmit={handleSubmit}>
        <label>
          Categoria
          <select name="categoria" defaultValue="" required>
            <option value="" disabled>Selecciona una categoria</option>
            <option value="HOGAR">HOGAR</option>
            <option value="ENERGIA SOLAR">ENERGIA SOLAR</option>
            <option value="EQUIPAMIENTO">EQUIPAMIENTO</option>
            <option value="RETOS">RETOS</option>
          </select>
        </label>
        <label>
          Titulo del tema
          <input type="text" name="titulo" maxLength={150} placeholder="Escribe un titulo claro para tu tema" required />
        </label>
        <label>
          Mensaje
          <textarea name="mensaje" placeholder="Cuenta a la comunidad sobre tu pregunta, experiencia o idea..." rows="9" required />
        </label>
        <div className="topic-form-footer">
          <span>Tu aporte ayuda a que la comunidad siga aprendiendo.</span>
          {isSignedIn ? (
            <button className="button publish-button" type="submit" disabled={isSaving}>
              {isSaving ? 'Publicando…' : 'Publicar'} <span>↗</span>
            </button>
          ) : (
            <Link className="button publish-button" to="/login" state={{ from: '/foro/nuevo-tema' }}>
              Iniciar sesión <span>↗</span>
            </Link>
          )}
        </div>
      </form>
    </div>
  )
}

export default AddTopicView
