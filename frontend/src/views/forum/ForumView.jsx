import { Link } from 'react-router-dom'

const topics = [
  { title: 'Como reducir el consumo del calentador?', author: 'Mariana C.', replies: 18, category: 'HOGAR', time: 'Hace 12 min', hot: true },
  { title: 'Compartimos experiencias con paneles solares', author: 'Diego R.', replies: 34, category: 'ENERGIA SOLAR', time: 'Hace 1 h', hot: false },
  { title: 'Bombillas LED: marcas que si recomiendan', author: 'Lucia M.', replies: 9, category: 'EQUIPAMIENTO', time: 'Ayer', hot: false },
  { title: 'Reto: una semana sin consumos fantasma', author: 'Nicolas P.', replies: 27, category: 'RETOS', time: 'Ayer', hot: true },
]

function ForumView() {
  return <div className="site-page section-wrap forum-page"><div className="page-intro"><div><p className="eyebrow">ESPACIO DE CONVERSACION</p><h1>El foro de la energia <em>cotidiana.</em></h1><p className="hero-lead">Pregunta, comparte lo que has aprendido y encuentra compania para tus proximos habitos.</p></div><Link className="button button-dark" to="/foro/nuevo-tema">+ Nuevo tema</Link></div><div className="forum-toolbar"><div className="filter-tabs"><button className="active" type="button">Todos</button><button type="button">Mas recientes</button><button type="button">Sin responder</button></div><input className="search-input" placeholder="Buscar en el foro" aria-label="Buscar en el foro" /></div><div className="topic-list">{topics.map((topic) => <article className="topic-row" key={topic.title}><div className="topic-avatar">{topic.author.split(' ').map((word) => word[0]).join('')}</div><div className="topic-main"><div className="topic-meta"><span className="category-pill">{topic.category}</span>{topic.hot && <span className="hot-pill">EN TENDENCIA</span>}</div><h3>{topic.title}</h3><p>Iniciado por <strong>{topic.author}</strong> · {topic.time}</p></div><div className="topic-replies"><strong>{topic.replies}</strong><span>respuestas</span></div><span className="arrow">↗</span></article>)}</div><div className="forum-footer"><span>Mostrando 4 de 128 conversaciones</span><div className="pagination"><button className="active" type="button">1</button><button type="button">2</button><button type="button">3</button><button type="button">→</button></div></div></div>
}

export default ForumView
