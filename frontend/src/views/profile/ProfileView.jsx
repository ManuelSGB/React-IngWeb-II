import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import API_CONFIG from '../../config/api'
import httpService from '../../services/httpService'
import storageService from '../../services/storageService'
import AlertMessage from '../common/AlertMessage'
import LoadingSpinner from '../common/LoadingSpinner'

const categories = ['HOGAR', 'ENERGIA SOLAR', 'EQUIPAMIENTO', 'RETOS']

function formatDate(value) {
  const date = new Date(value)
  return Number.isNaN(date.getTime())
    ? '—'
    : new Intl.DateTimeFormat('es', { dateStyle: 'medium' }).format(date)
}

function ProfileView() {
  const [profile, setProfile] = useState(null)
  const [topics, setTopics] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [passwordNotice, setPasswordNotice] = useState('')
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [savingTopicId, setSavingTopicId] = useState(null)
  const [editingTopicId, setEditingTopicId] = useState(null)
  const [reload, setReload] = useState(0)

  useEffect(() => {
    let isMounted = true

    async function loadProfile() {
      if (!storageService.getToken()) {
        setError('Inicia sesión para ver tu perfil.')
        setIsLoading(false)
        return
      }

      try {
        const [profileResponse, topicsResponse] = await Promise.all([
          httpService.get(API_CONFIG.ENDPOINTS.PROFILE),
          httpService.get(API_CONFIG.ENDPOINTS.MY_TOPICS)
        ])
        if (!profileResponse.data || !Array.isArray(topicsResponse.data)) {
          throw new Error('La API devolvió información de perfil no válida.')
        }
        if (isMounted) {
          setProfile(profileResponse.data)
          setTopics(topicsResponse.data)
          storageService.setUser(profileResponse.data)
          storageService.setUserRole(profileResponse.data.role)
          window.dispatchEvent(new Event('auth-change'))
        }
      } catch (requestError) {
        if (isMounted) setError(requestError.message || 'No se pudo cargar el perfil.')
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }

    loadProfile()
    return () => { isMounted = false }
  }, [reload])

  function retryLoad() {
    setError('')
    setIsLoading(true)
    setReload((current) => current + 1)
  }

  async function changePassword(event) {
    event.preventDefault()
    setPasswordError('')
    setPasswordNotice('')
    const form = event.currentTarget
    const formData = new FormData(form)
    const currentPassword = formData.get('currentPassword')
    const newPassword = formData.get('newPassword')
    const confirmPassword = formData.get('confirmPassword')

    if (newPassword !== confirmPassword) {
      setPasswordError('La nueva contraseña y su confirmación no coinciden.')
      return
    }
    if (newPassword.length < 6) {
      setPasswordError('La nueva contraseña debe tener al menos 6 caracteres.')
      return
    }

    setIsChangingPassword(true)
    try {
      const response = await httpService.patch(API_CONFIG.ENDPOINTS.CHANGE_PASSWORD, {
        currentPassword,
        newPassword
      })
      setPasswordNotice(response.message || 'Contraseña actualizada correctamente.')
      form.reset()
    } catch (requestError) {
      setPasswordError(requestError.message || 'No se pudo actualizar la contraseña.')
    } finally {
      setIsChangingPassword(false)
    }
  }

  async function updateTopic(event, topic) {
    event.preventDefault()
    setError('')
    setNotice('')
    setSavingTopicId(topic.id)
    const formData = new FormData(event.currentTarget)
    const updatedTopic = {
      categoria: formData.get('categoria'),
      titulo: formData.get('titulo'),
      mensaje: formData.get('mensaje')
    }

    try {
      await httpService.put(
        API_CONFIG.ENDPOINTS.TOPIC_BY_ID.replace(':id', topic.id),
        updatedTopic
      )
      setTopics((currentTopics) => currentTopics.map((item) => (
        item.id === topic.id
          ? { ...item, category: updatedTopic.categoria, title: updatedTopic.titulo, message: updatedTopic.mensaje }
          : item
      )))
      setEditingTopicId(null)
      setNotice('Publicación actualizada correctamente.')
    } catch (requestError) {
      setError(requestError.message || 'No se pudo actualizar la publicación.')
    } finally {
      setSavingTopicId(null)
    }
  }

  async function deleteTopic(topic) {
    if (!window.confirm(`¿Eliminar la publicación "${topic.title}"? Esta acción no se puede deshacer.`)) return
    setError('')
    setNotice('')
    setSavingTopicId(topic.id)
    try {
      await httpService.delete(API_CONFIG.ENDPOINTS.TOPIC_BY_ID.replace(':id', topic.id))
      setTopics((currentTopics) => currentTopics.filter((item) => item.id !== topic.id))
      setNotice('Publicación eliminada correctamente.')
    } catch (requestError) {
      setError(requestError.message || 'No se pudo eliminar la publicación.')
    } finally {
      setSavingTopicId(null)
    }
  }

  if (isLoading) {
    return <div className="profile-page section-wrap"><LoadingSpinner /></div>
  }

  if (error && !profile) {
    return (
      <div className="profile-page section-wrap">
        <p className="eyebrow">MI ESPACIO</p>
        <h1>Mi perfil</h1>
        <AlertMessage type="error" duration={0} message={error} />
        {storageService.getToken()
          ? <button className="retry-button" type="button" onClick={retryLoad}>Reintentar</button>
          : <Link className="button button-dark" to="/login">Iniciar sesión</Link>}
      </div>
    )
  }

  return (
    <div className="profile-page section-wrap">
      <div className="profile-heading">
        <div>
          <p className="eyebrow">MI ESPACIO</p>
          <h1>Mi perfil</h1>
          <p className="hero-lead">Consulta los datos de tu cuenta y administra tus publicaciones.</p>
        </div>
      </div>

      {error && <AlertMessage type="error" duration={0} message={error} />}
      {notice && <AlertMessage type="success" duration={0} message={notice} />}

      <section className="profile-card">
        <div className="profile-section-heading">
          <div><p className="eyebrow">CUENTA</p><h2>Mis datos</h2></div>
        </div>
        <dl className="profile-details">
          <div><dt>Nombre</dt><dd>{profile.name} {profile.lastname}</dd></div>
          <div><dt>Correo electrónico</dt><dd>{profile.email}</dd></div>
          <div><dt>Rol</dt><dd>{profile.role === 'admin' ? 'Administrador' : 'Usuario'}</dd></div>
          <div><dt>Estado</dt><dd>{profile.status === 'activo' ? 'Activo' : 'Inactivo'}</dd></div>
          <div><dt>Miembro desde</dt><dd>{formatDate(profile.created_at)}</dd></div>
        </dl>
      </section>

      <section className="profile-card">
        <div className="profile-section-heading">
          <div><p className="eyebrow">SEGURIDAD</p><h2>Cambiar contraseña</h2></div>
        </div>
        {passwordError && <AlertMessage type="error" duration={0} message={passwordError} />}
        {passwordNotice && <AlertMessage type="success" duration={0} message={passwordNotice} />}
        <form className="profile-password-form" onSubmit={changePassword}>
          <label>Contraseña actual<input type="password" name="currentPassword" autoComplete="current-password" required /></label>
          <label>Nueva contraseña<input type="password" name="newPassword" autoComplete="new-password" minLength={6} maxLength={255} required /></label>
          <label>Confirmar nueva contraseña<input type="password" name="confirmPassword" autoComplete="new-password" minLength={6} maxLength={255} required /></label>
          <button className="button button-dark" type="submit" disabled={isChangingPassword}>
            {isChangingPassword ? 'Actualizando…' : 'Actualizar contraseña'}
          </button>
        </form>
      </section>

      <section className="profile-card">
        <div className="profile-section-heading">
          <div><p className="eyebrow">FORO</p><h2>Mis publicaciones ({topics.length})</h2></div>
          <Link className="quiet-link" to="/foro/nuevo-tema">+ Nuevo tema</Link>
        </div>
        {!topics.length ? (
          <p className="profile-empty">Todavía no has publicado temas en el foro.</p>
        ) : (
          <div className="profile-topics">
            {topics.map((topic) => (
              <article className="profile-topic" key={topic.id}>
                {editingTopicId === topic.id ? (
                  <form className="topic-form profile-topic-form" onSubmit={(event) => updateTopic(event, topic)}>
                    <label>
                      Categoría
                      <select name="categoria" defaultValue={topic.category} required>
                        {categories.map((category) => <option key={category} value={category}>{category}</option>)}
                      </select>
                    </label>
                    <label>
                      Título
                      <input name="titulo" defaultValue={topic.title} maxLength={150} required />
                    </label>
                    <label>
                      Mensaje
                      <textarea name="mensaje" defaultValue={topic.message} rows="5" required />
                    </label>
                    <div className="profile-topic-actions">
                      <button className="button button-dark" type="submit" disabled={savingTopicId === topic.id}>
                        {savingTopicId === topic.id ? 'Guardando…' : 'Guardar cambios'}
                      </button>
                      <button className="text-button" type="button" onClick={() => setEditingTopicId(null)}>Cancelar</button>
                    </div>
                  </form>
                ) : (
                  <>
                    <div className="topic-meta"><span className="category-pill">{topic.category}</span></div>
                    <h3>{topic.title}</h3>
                    <p>{topic.message}</p>
                    <small>Publicado el {formatDate(topic.created_at)}</small>
                    <div className="profile-topic-actions">
                      <button className="text-button" type="button" onClick={() => setEditingTopicId(topic.id)}>Editar</button>
                      <button
                        className="text-button text-button-danger"
                        type="button"
                        disabled={savingTopicId === topic.id}
                        onClick={() => deleteTopic(topic)}
                      >
                        {savingTopicId === topic.id ? 'Eliminando…' : 'Eliminar'}
                      </button>
                    </div>
                  </>
                )}
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

export default ProfileView
