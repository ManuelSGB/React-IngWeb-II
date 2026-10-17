import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import API_CONFIG from '../../config/api'
import httpService from '../../services/httpService'
import AlertMessage from '../common/AlertMessage'
import LoadingSpinner from '../common/LoadingSpinner'

const categories = ['HOGAR', 'ENERGIA SOLAR', 'EQUIPAMIENTO', 'RETOS']

function formatDate(value) {
  const date = new Date(value)
  return Number.isNaN(date.getTime())
    ? ''
    : new Intl.DateTimeFormat('es', { dateStyle: 'medium', timeStyle: 'short' }).format(date)
}

function ForumView() {
  const location = useLocation()
  const [topics, setTopics] = useState([])
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [order, setOrder] = useState('newest')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [reload, setReload] = useState(0)

  useEffect(() => {
    let isMounted = true

    async function loadTopics() {
      try {
        const response = await httpService.get(API_CONFIG.ENDPOINTS.FORUM, false)
        if (!Array.isArray(response.data)) {
          throw new Error('La API devolvió una lista de temas no válida.')
        }
        if (isMounted) setTopics(response.data)
      } catch (requestError) {
        if (isMounted) setError(requestError.message || 'No se pudieron cargar los temas.')
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }

    loadTopics()
    return () => { isMounted = false }
  }, [reload])

  function retryLoad() {
    setError('')
    setIsLoading(true)
    setReload((count) => count + 1)
  }

  const visibleTopics = useMemo(() => {
    const query = search.trim().toLocaleLowerCase()
    return topics
      .filter((topic) => !category || topic.category === category)
      .filter((topic) => (
        !query ||
        `${topic.title} ${topic.message} ${topic.author_name} ${topic.author_lastname} ${topic.category}`
          .toLocaleLowerCase()
          .includes(query)
      ))
      .sort((first, second) => {
        const difference = new Date(second.created_at) - new Date(first.created_at)
        return order === 'newest' ? difference : -difference
      })
  }, [category, order, search, topics])

  return (
    <div className="site-page section-wrap forum-page">
      <div className="page-intro">
        <div>
          <p className="eyebrow">ESPACIO DE CONVERSACION</p>
          <h1>El foro de la energia <em>cotidiana.</em></h1>
          <p className="hero-lead">Pregunta, comparte lo que has aprendido y encuentra compania para tus proximos habitos.</p>
        </div>
        <Link className="button button-dark" to="/foro/nuevo-tema">+ Nuevo tema</Link>
      </div>
      {location.state?.message && (
        <AlertMessage type="success" duration={0} message={location.state.message} />
      )}
      {error && (
        <div>
          <AlertMessage type="error" duration={0} message={error} />
          <button className="retry-button" type="button" onClick={retryLoad}>
            Reintentar
          </button>
        </div>
      )}
      <div className="forum-toolbar">
        <div className="filter-tabs">
          <button
            className={order === 'newest' ? 'active' : ''}
            type="button"
            onClick={() => setOrder('newest')}
          >
            Mas recientes
          </button>
          <button
            className={order === 'oldest' ? 'active' : ''}
            type="button"
            onClick={() => setOrder('oldest')}
          >
            Mas antiguos
          </button>
        </div>
        <div className="forum-filters">
          <select
            aria-label="Filtrar por categoria"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
          >
            <option value="">Todas las categorias</option>
            {categories.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
          <input
            className="search-input"
            placeholder="Buscar en el foro"
            aria-label="Buscar en el foro"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>
      </div>
      {isLoading ? <LoadingSpinner /> : !error && (
        <div className="topic-list">
          {visibleTopics.map((topic) => {
            const author = `${topic.author_name || ''} ${topic.author_lastname || ''}`.trim() || 'Usuario'
            return (
              <article className="topic-row" key={topic.id}>
                <div className="topic-avatar">
                  {author.split(/\s+/).map((word) => word[0]).join('')}
                </div>
                <div className="topic-main">
                  <div className="topic-meta">
                    <span className="category-pill">{topic.category}</span>
                  </div>
                  <h3>{topic.title}</h3>
                  <p>{topic.message}</p>
                  <p>Iniciado por <strong>{author}</strong></p>
                </div>
                <div className="topic-replies">
                  <strong>Publicado</strong>
                  <span>{formatDate(topic.created_at)}</span>
                </div>
              </article>
            )
          })}
          {!visibleTopics.length && (
            <p className="empty-state">
              {topics.length ? 'No hay temas que coincidan con los filtros.' : 'Aún no hay conversaciones. ¡Inicia la primera!'}
            </p>
          )}
        </div>
      )}
      {!isLoading && !error && (
        <div className="forum-footer">
          <span>Mostrando {visibleTopics.length} de {topics.length} conversaciones</span>
        </div>
      )}
    </div>
  )
}

export default ForumView
