import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import API_CONFIG from '../../config/api'
import httpService from '../../services/httpService'
import storageService from '../../services/storageService'
import AlertMessage from '../common/AlertMessage'
import LoadingSpinner from '../common/LoadingSpinner'

function formatDate(value) {
  const date = new Date(value)
  return Number.isNaN(date.getTime())
    ? '—'
    : new Intl.DateTimeFormat('es', { dateStyle: 'medium' }).format(date)
}

function ForumAdminView() {
  const [topics, setTopics] = useState([])
  const [search, setSearch] = useState('')
  const [recentOnly, setRecentOnly] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [reload, setReload] = useState(0)
  const isAdmin = storageService.getUserRole() === 'admin'

  useEffect(() => {
    let isMounted = true

    async function loadTopics() {
      if (!isAdmin) {
        setError('Inicia sesión como administrador para consultar esta sección.')
        setIsLoading(false)
        return
      }

      try {
        const response = await httpService.get(API_CONFIG.ENDPOINTS.FORUM, false)
        if (!Array.isArray(response.data)) {
          throw new Error('La API devolvió una lista de temas no válida.')
        }
        if (isMounted) setTopics(response.data)
      } catch (requestError) {
        if (isMounted) setError(requestError.message || 'No se pudieron cargar las publicaciones.')
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }

    loadTopics()
    return () => { isMounted = false }
  }, [isAdmin, reload])

  function retryLoad() {
    setError('')
    setIsLoading(true)
    setReload((count) => count + 1)
  }

  const visibleTopics = useMemo(() => {
    const threshold = Date.now() - 7 * 24 * 60 * 60 * 1000
    const query = search.trim().toLocaleLowerCase()
    return topics.filter((topic) => {
      const matchesDate = !recentOnly || new Date(topic.created_at).getTime() >= threshold
      const matchesSearch = !query ||
        `${topic.title} ${topic.message} ${topic.author_name} ${topic.author_lastname} ${topic.category}`
          .toLocaleLowerCase()
          .includes(query)
      return matchesDate && matchesSearch
    })
  }, [recentOnly, search, topics])

  const lastWeekCount = topics.filter(
    (topic) => Date.now() - new Date(topic.created_at).getTime() <= 7 * 24 * 60 * 60 * 1000
  ).length

  return (
    <div className="admin-page section-wrap">
      <div className="admin-top">
        <div>
          <p className="eyebrow">PANEL DE GESTION / FORO</p>
          <h1>Conversaciones bajo control</h1>
          <p className="hero-lead">Revisa las publicaciones de la comunidad.</p>
        </div>
        <Link className="button button-dark" to="/foro">Ver foro <span>↗</span></Link>
      </div>
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
      {isLoading ? <LoadingSpinner /> : isAdmin && !error && (
        <>
          <div className="stat-strip forum-stats">
            <div><span>Conversaciones</span><strong>{topics.length}</strong><small>Publicadas en el foro</small></div>
            <div><span>Esta semana</span><strong>{lastWeekCount}</strong><small>Últimos 7 días</small></div>
            <div><span>Categorías</span><strong>{new Set(topics.map((topic) => topic.category)).size}</strong><small>Con publicaciones</small></div>
          </div>
          <div className="table-panel">
            <div className="table-toolbar">
              <h2>Publicaciones ({visibleTopics.length})</h2>
              <div className="admin-forum-tools">
                <div className="filter-tabs">
                  <button className={!recentOnly ? 'active' : ''} type="button" onClick={() => setRecentOnly(false)}>Todas</button>
                  <button className={recentOnly ? 'active' : ''} type="button" onClick={() => setRecentOnly(true)}>Esta semana</button>
                </div>
                <input
                  className="search-input"
                  placeholder="Buscar publicación"
                  aria-label="Buscar publicación"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                />
              </div>
            </div>
            <div className="table-scroll">
              <table>
                <thead><tr><th>Tema</th><th>Categoría</th><th>Autor</th><th>Estado</th><th>Fecha</th></tr></thead>
                <tbody>
                  {visibleTopics.map((topic) => (
                    <tr key={topic.id}>
                      <td>
                        <div className="thread-cell">
                          <strong>{topic.title}</strong>
                          <span>{topic.message}</span>
                        </div>
                      </td>
                      <td>{topic.category}</td>
                      <td>{`${topic.author_name || ''} ${topic.author_lastname || ''}`.trim() || 'Usuario'}</td>
                      <td><span className="status status-activo">Publicado</span></td>
                      <td>{formatDate(topic.created_at)}</td>
                    </tr>
                  ))}
                  {!visibleTopics.length && (
                    <tr><td colSpan="5">No hay publicaciones que coincidan con el filtro.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default ForumAdminView
