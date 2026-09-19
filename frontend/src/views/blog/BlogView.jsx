const articles = [
  { tag: 'GUIA PRACTICA', title: 'Tu casa tambien puede respirar', excerpt: 'Pequenos cambios en iluminacion, cocina y climatizacion que reducen el consumo sin complicarte la vida.', date: '12 JUN 2026', tone: 'sage' },
  { tag: 'HABITOS', title: 'El reto de los 15 minutos', excerpt: 'Una rutina sencilla para detectar consumos fantasma y empezar a ahorrar desde hoy.', date: '08 JUN 2026', tone: 'yellow' },
  { tag: 'COMUNIDAD', title: 'Historias que encienden', excerpt: 'Conoce a personas que transformaron su manera de usar la energia en casa.', date: '01 JUN 2026', tone: 'coral' },
]

function BlogView() {
  return (
    <div className="site-page">
      <section className="blog-hero section-wrap">
        <div className="hero-copy">
          <p className="eyebrow">BLOG / FORO DE ENERGIA CONSCIENTE</p>
          <h1>Ahorro de <em>energía</em></h1>
          <p className="hero-lead">Conoce tu consumo de energia y aprende a gestionarlo de la mejor manera.</p>
          <div className="hero-actions"><a className="button button-dark" href="#articulos">Explorar más <span>↘</span></a><a className="quiet-link" href="/foro">Conversar en el foro</a></div>
        </div>
          <img className="hero-banner" src="/banner.png" alt="Banner sobre ahorro de energia" />
      </section>
      <section className="ticker"><div className="ticker-inner"></div></section>
      <section className="section-wrap article-section" id="articulos">
        <div className="section-heading"><div><p className="eyebrow">PARA EMPEZAR</p><h2>Lecturas para encender ideas</h2></div><a className="quiet-link" href="/foro">Ver todo el archivo ↗</a></div>
        <div className="article-grid">{articles.map((article) => <article className="article-card" key={article.title}><div className={`article-image ${article.tone}`}><span>{article.tone === 'sage' ? '01' : article.tone === 'yellow' ? '02' : '03'}</span></div><div className="article-body"><p className="eyebrow">{article.tag}</p><h3>{article.title}</h3><p>{article.excerpt}</p><small>{article.date} · 5 MIN DE LECTURA</small></div></article>)}</div>
      </section>
    </div>
  )
}

export default BlogView
