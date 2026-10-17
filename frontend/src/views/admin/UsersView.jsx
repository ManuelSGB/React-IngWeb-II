import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import API_CONFIG from '../../config/api'
import httpService from '../../services/httpService'
import storageService from '../../services/storageService'
import AlertMessage from '../common/AlertMessage'
import LoadingSpinner from '../common/LoadingSpinner'

function formatDate(value) {
  if (!value) return '—'
  const date = new Date(value)
  return Number.isNaN(date.getTime())
    ? '—'
    : new Intl.DateTimeFormat('es', { dateStyle: 'medium' }).format(date)
}

function UsersView() {
  const location = useLocation()
  const [users, setUsers] = useState([])
  const [search, setSearch] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [deletingId, setDeletingId] = useState(null)
  const [updatingStatusId, setUpdatingStatusId] = useState(null)
  const [reload, setReload] = useState(0)
  const isAdmin = storageService.getUserRole() === 'admin'

  useEffect(() => {
    let isMounted = true

    async function loadUsers() {
      if (!isAdmin) {
        setError('Inicia sesión como administrador para consultar el directorio.')
        setIsLoading(false)
        return
      }

      try {
        const response = await httpService.get(API_CONFIG.ENDPOINTS.USERS)
        if (!Array.isArray(response.data)) {
          throw new Error('La API devolvió una lista de usuarios no válida.')
        }
        if (isMounted) setUsers(response.data)
      } catch (requestError) {
        if (isMounted) setError(requestError.message || 'No se pudieron cargar los usuarios.')
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }

    loadUsers()
    return () => { isMounted = false }
  }, [isAdmin, reload])

  function retryLoad() {
    setError('')
    setIsLoading(true)
    setReload((count) => count + 1)
  }

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLocaleLowerCase()
    if (!query) return users
    return users.filter((user) => {
      const fullName = `${user.name || user.nombre || ''} ${user.lastname || user.apellido || ''}`
      return `${fullName} ${user.email || user.correo || ''} ${user.role || user.rol || ''} ${user.status || user.estado || ''}`
        .toLocaleLowerCase()
        .includes(query)
    })
  }, [search, users])

  async function deleteUser(user) {
    const name = `${user.name || user.nombre} ${user.lastname || user.apellido}`.trim()
    if (!window.confirm(`¿Eliminar la cuenta de ${name}? Esta acción no se puede deshacer.`)) return

    setDeletingId(user.id)
    setError('')
    try {
      await httpService.delete(
        API_CONFIG.ENDPOINTS.USER_DELETE.replace(':id', user.id)
      )
      setUsers((currentUsers) => currentUsers.filter((item) => item.id !== user.id))
    } catch (requestError) {
      setError(requestError.message || 'No se pudo eliminar el usuario.')
    } finally {
      setDeletingId(null)
    }
  }

  async function updateUserStatus(user, status) {
    const currentStatus = user.status || user.estado
    if (currentStatus === status) return

    setUpdatingStatusId(user.id)
    setError('')
    try {
      await httpService.patch(
        API_CONFIG.ENDPOINTS.USER_STATUS.replace(':id', user.id),
        { estado: status }
      )
      setUsers((currentUsers) => currentUsers.map((item) => (
        item.id === user.id ? { ...item, status } : item
      )))
    } catch (requestError) {
      setError(requestError.message || 'No se pudo cambiar el estado del usuario.')
    } finally {
      setUpdatingStatusId(null)
    }
  }

  return (
    <div className="admin-page section-wrap">
      <div className="admin-top">
        <div>
          <p className="eyebrow">PANEL DE GESTION / USUARIOS</p>
          <h1>Personas en la comunidad</h1>
          <p className="hero-lead">Administra perfiles, roles y acceso al espacio.</p>
        </div>
        <Link className="button button-dark" to="/admin/usuarios/nuevo">+ Agregar usuario</Link>
      </div>
      {location.state?.message && (
        <AlertMessage type="success" duration={0} message={location.state.message} />
      )}
      {!isAdmin && (
        <div>
          <AlertMessage type="error" duration={0} message={error} />
          <Link to="/login">Iniciar sesión</Link>
        </div>
      )}
      {isAdmin && error && (
        <div>
          <AlertMessage type="error" duration={0} message={error} />
          <button className="retry-button" type="button" onClick={retryLoad}>
            Reintentar
          </button>
        </div>
      )}
      <div className="table-panel">
        <div className="table-toolbar">
          <h2>Directorio de usuarios{!error && ` (${users.length})`}</h2>
          <input
            className="search-input"
            placeholder="Buscar usuario"
            aria-label="Buscar usuario"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>
        {isLoading ? <LoadingSpinner /> : error ? null : (
          <div className="table-scroll">
            <table>
              <thead>
                <tr><th>Usuario</th><th>Rol</th><th>Estado</th><th>Registro</th><th aria-label="Acciones" /></tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => {
                  const name = `${user.name || user.nombre || ''} ${user.lastname || user.apellido || ''}`.trim()
                  const email = user.email || user.correo
                  const role = user.role || user.rol
                  const status = user.status || user.estado
                  return (
                    <tr key={user.id}>
                      <td>
                        <div className="user-cell">
                          <span className="user-avatar">
                            {name.split(/\s+/).map((word) => word[0]).join('')}
                          </span>
                          <div><strong>{name}</strong><span>{email}</span></div>
                        </div>
                      </td>
                      <td>{role === 'admin' ? 'Administrador' : 'Usuario'}</td>
                      <td>
                        <select
                          className={`status-select status-${status}`}
                          aria-label={`Estado de ${name}`}
                          value={status}
                          disabled={updatingStatusId === user.id}
                          onChange={(event) => updateUserStatus(user, event.target.value)}
                        >
                          <option value="activo">Activo</option>
                          <option value="inactivo">Inactivo</option>
                        </select>
                      </td>
                      <td>{formatDate(user.created_at)}</td>
                      <td>
                        <button
                          className="icon-button"
                          type="button"
                          aria-label={`Eliminar a ${name}`}
                          disabled={deletingId === user.id}
                          onClick={() => deleteUser(user)}
                        >
                          {deletingId === user.id ? '…' : '×'}
                        </button>
                      </td>
                    </tr>
                  )
                })}
                {!filteredUsers.length && (
                  <tr><td colSpan="5">No hay usuarios que coincidan con la búsqueda.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default UsersView
