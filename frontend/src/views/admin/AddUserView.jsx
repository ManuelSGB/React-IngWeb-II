import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import API_CONFIG from '../../config/api'
import httpService from '../../services/httpService'
import storageService from '../../services/storageService'
import AlertMessage from '../common/AlertMessage'

function AddUserView() {
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const isAdmin = storageService.getUserRole() === 'admin'

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setIsSaving(true)
    const formData = new FormData(event.currentTarget)

    try {
      await httpService.post(API_CONFIG.ENDPOINTS.ADMIN_CREATE_USER, {
        nombre: formData.get('nombre'),
        apellido: formData.get('apellido'),
        correo: formData.get('correo'),
        contrasena: formData.get('contrasena'),
        rol: formData.get('rol'),
        estado: formData.get('estado')
      })
      navigate('/admin/usuarios', { state: { message: 'Usuario agregado correctamente.' } })
    } catch (requestError) {
      setError(requestError.message || 'No se pudo agregar el usuario.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="site-page section-wrap add-user-page">
      <Link className="back-link" to="/admin/usuarios">← Volver a usuarios</Link>
      <div className="add-topic-header">
        <p className="eyebrow">PANEL DE GESTION / NUEVO USUARIO</p>
        <h1>Agrega una persona a la <em>comunidad.</em></h1>
        <p className="hero-lead">Completa los datos del perfil y define el acceso que tendra dentro de EcoWatt.</p>
      </div>
      {!isAdmin && (
        <div>
          <AlertMessage type="error" duration={0} message="Inicia sesión como administrador para agregar usuarios." />
          <Link to="/login">Iniciar sesión</Link>
        </div>
      )}
      {error && <AlertMessage type="error" duration={0} message={error} />}
      <form className="topic-form admin-user-form" onSubmit={handleSubmit}>
        <div className="form-row">
          <label>
            Nombre
            <input type="text" name="nombre" maxLength={50} placeholder="Nombre" required />
          </label>
          <label>
            Apellido
            <input type="text" name="apellido" maxLength={50} placeholder="Apellido" required />
          </label>
        </div>
        <div className="form-row">
          <label>
            Correo electronico
            <input type="email" name="correo" maxLength={100} placeholder="persona@ejemplo.com" required />
          </label>
          <label>
            Contraseña
            <input type="password" name="contrasena" maxLength={255} placeholder="Crea una contraseña" required />
          </label>
        </div>
        <div className="form-row">
          <label>
            Rol
            <select name="rol" defaultValue="user" required>
              <option value="" disabled>Selecciona un rol</option>
              <option value="admin">Administrador</option>
              <option value="user">Usuario</option>
            </select>
          </label>
          <label>
            Estado
            <select name="estado" defaultValue="activo" required>
              <option value="" disabled>Selecciona un estado</option>
              <option value="activo">Activo</option>
              <option value="inactivo">Inactivo</option>
            </select>
          </label>
        </div>
        <div className="topic-form-footer">
          <span>Los datos podran editarse despues desde el directorio.</span>
          <button className="button publish-button" type="submit" disabled={!isAdmin || isSaving}>
            {isSaving ? 'Guardando…' : 'Agregar usuario'} <span>↗</span>
          </button>
        </div>
      </form>
    </div>
  )
}

export default AddUserView
