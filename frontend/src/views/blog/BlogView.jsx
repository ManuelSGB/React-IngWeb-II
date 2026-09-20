import { useState } from 'react'
import { calcularConsumo } from '../../utils/calculator'

const articles = [
  { tag: 'COCINA', title: 'Cocina', excerpt: 'Sugerencias de ahorro para la cocina', tone: 'sage', image: '/cocina.jpeg' },
  { tag: 'HABITACION', title: 'Habitación', excerpt: 'Sugerencias de ahorro para la habitación', tone: 'yellow', image: '/habitacion.jpeg' },
  { tag: 'BAÑO', title: 'Baño', excerpt: 'Sugerencias de ahorro para el baño', tone: 'coral', image: '/baño.jpeg' },
]

function BlogView() {
  const [potencia, setPotencia] = useState('')
  const [horas, setHoras] = useState('')
  const [resultado, setResultado] = useState(null)

  function handleCalculate(event) {
    event.preventDefault()

    if (!potencia || !horas) return

    setResultado(calcularConsumo(potencia, horas))
  }

  return (
    <div className="site-page">
      <section className="blog-hero section-wrap">
        <div className="hero-copy">
          <p className="eyebrow">BLOG / FORO DE ENERGIA CONSCIENTE</p>
          <h1>Ahorro de <em>energía</em></h1>
          <p className="hero-lead">Conoce tu consumo de energia y aprende a gestionarlo de la mejor manera.</p>
          <div className="hero-actions"><a className="button button-dark" href="#ahorro-energetico">Explorar más <span>↘</span></a><a className="quiet-link" href="/foro">Conversar en el foro</a></div>
        </div>
          <img className="hero-banner" src="/banner.png" alt="Banner sobre ahorro de energia" />
      </section>
      <section className="ticker"><div className="ticker-inner"></div></section>
      <section className="section-wrap article-section" id="ahorro-energetico">
        <div className="section-heading intro-heading"><div><p className="eyebrow">¿QUE ENCONTRARÁS?</p><h2>Ahorro energético</h2><br></br><p className="hero-lead">En esta página encontrarás información sobre el ahorro energético; como mejorar la eficencia de energía en tu hogar; tips para evitar aumentar el consumo (y con esto el costo de tu factura); y una calculadora de consumo energético, en la cual podrás verificar que el consumo reflejado en tu factura de electricidad es correcto de acuerdo a los electrodomésticos que tienes.</p></div></div><br></br>
        <div className="energy-info"><div className="energy-info-copy"><h3>Importancia del ahorro energético</h3><br></br><p className="hero-lead">El ahorro energético es crucial tanto para el bienestar del planeta como para la economía de los individuos y las empresas. Al reducir el consumo de energía, disminuimos la emisión de gases contaminantes que contribuyen al cambio climático, protegiendo el medio ambiente y preservando los recursos naturales para las futuras generaciones. Además, el ahorro de energía ayuda a reducir la dependencia de fuentes no renovables, promoviendo el uso de energías limpias y sostenibles. Este tipo de medidas, como la eficiencia energética en la industria, el transporte y los hogares, puede marcar una diferencia significativa en la lucha contra la crisis ambiental.</p></div>
        <img className="energy-info-image" src="/ahorro_energetico.png" alt="Ilustración sobre ahorro energético" /></div>
      </section>
      <section className="section-wrap article-section" id="energia-renovable">
        <div className="energy-info renewable-info"><img className="energy-info-image" src="/energia_renovable.png" alt="Ilustración sobre energia renovable" /><div className="energy-info-copy"><p className="eyebrow">APRENDE SOBRE...</p><h2>Energía renovable</h2><br></br><p className="hero-lead">Se dice que una energia es renovable cuando su fuente de energia se basa en la utilización de recursos naturales inagotables, como el sol, el viento, el agua o la biomasa.</p><p className="hero-lead">Las energias renovables se caracterizan por no utilizar combustibles fosiles, sino recursos naturales capaces de renovarse ilimitadamente.</p><p className="hero-lead">En la actualidad, el medio ambiente se encuentra en un estado de daño irreversible; el cambio climatico generado por la deforestación y demas actividades contaminantes han consumido los recursos naturales a un nivel preoucpante, dejando en jaque el futuro del planeta tierra, y, por tanto, de la humanidad.</p></div></div>
        <div className="reminder-box"><p><strong>Recuerda:</strong><br />El petróleo, el gas natural, y el carbón no son energías renovables. Estas fuentes se agotan con el tiempo y generan un alto impacto ambiental. Opta por energías limpias como la solar, eólica o hidráulica para cuidar el planeta.</p></div>
      </section>
      <section className="section-wrap article-section" id="sugerencias">
        <div className="section-heading"><div><p className="eyebrow">TE PUEDE INTERESAR</p><h2>Sugerencias energéticas</h2></div></div>
        <div className="article-grid">{articles.map((article) => <article className="article-card" key={article.title}><div className={`article-image ${article.tone}`}><img src={article.image} alt={`Interior de ${article.title.toLowerCase()}`} /><span>{article.tone === 'sage' ? '01' : article.tone === 'yellow' ? '02' : '03'}</span></div><div className="article-body"><p className="eyebrow">{article.tag}</p><h3>{article.title}</h3><p>{article.excerpt}</p><small>{article.date} · 5 MIN DE LECTURA</small><button className="button button-dark article-button" type="button">Ver más</button></div></article>)}</div>
      </section>
      <section className="section-wrap article-section" id="calculadora">
        <div className="section-heading intro-heading"><div><p className="eyebrow">ACERCA DE</p><h2>Cocina</h2><br></br><p className="hero-lead">Para ahorrar energía en la cocina, utiliza electrodomésticos eficientes (de preferencia con etiqueta energética A o superior) y evita abrir el horno innecesariamente mientras cocinas, ya que cada vez que lo haces se pierde calor. Cocina con tapas en las ollas para conservar el calor y aprovecha el tamaño adecuado de hornilla según el recipiente. Además, descongela los alimentos con tiempo para no usar el microondas y apaga los aparatos que no estés utilizando. Para ahorrar energía en la cocina, utiliza electrodomésticos eficientes (de preferencia con etiqueta energética A o superior) y evita abrir el horno innecesariamente mientras cocinas, ya que cada vez que lo haces se pierde calor. Cocina con tapas en las ollas para conservar el calor y aprovecha el tamaño adecuado de hornilla según el recipiente. Además, descongela los alimentos con tiempo para no usar el microondas y apaga los aparatos que no estés utilizando.</p></div></div><br></br>
        <img className="energy-info-image" src="/consumo.png" alt="Ilustración sobre consumo" />
        <div className="section-heading intro-heading"><div><p className="eyebrow">ACERCA DE</p><h2>Habitación</h2><br></br><p className="hero-lead">En las habitaciones, aprovecha al máximo la luz natural durante el día y utiliza focos LED de bajo consumo. Apaga las luces y los dispositivos electrónicos cuando no estén en uso y evita dejarlos en modo “stand by”. Instala cortinas térmicas para mantener la temperatura y reducir el uso de calefacción o aire acondicionado. Un buen aislamiento en puertas y ventanas también puede ayudarte a mantener una temperatura agradable sin gastar energía extra.</p></div></div><br></br>
        <img className="energy-info-image" src="/bombilloled.jpg" alt="Imagen de bombillo led" />
        <div className="section-heading intro-heading"><div><p className="eyebrow">ACERCA DE</p><h2>Baño</h2><br></br><p className="hero-lead">En el baño, reduce el uso del calentador de agua bajando unos grados la temperatura y tomando duchas más cortas. Instala aireadores o reductores de flujo en las duchas y grifos para disminuir el consumo de agua caliente. Si usas un termo eléctrico, programa su uso solo en los momentos necesarios. Además, asegúrate de reparar cualquier fuga, ya que el agua caliente desperdiciada también implica un gasto energético adicional.</p></div></div><br></br>
        <img className="energy-info-image" src="/calentador.jpg" alt="Imagen de calentador " />
      </section>
      <section className="section-wrap article-section" id="articulos">
        <div className="energy-info"><div className="energy-info-copy"><p className="eyebrow">CONOCE TU CONSUMO</p><h2>Calculadora</h2><br></br><p className="hero-lead">Para medir el consumo de tus aparatos electrónicos ingresa el voltaje de tu dispositivo en Watts (W), como se muestra en la imagen, y registra el tiempo que usas el dispositivo en horas.<br />La calculadora arrojará dos resultados: el primer resultado es el consumo en kilovatio-hora (kWh), y el segundo resultado es el valor de consumo en pesos del uso del aparato en el tiempo que registraste.</p></div>
        <img className="energy-info-image" src="/panel.png" alt="Imagen de panel de ejemplo" /></div>
        <form className="calculator" onSubmit={handleCalculate}>
          <div className="calculator-header"><p className="eyebrow">CALCULA TU CONSUMO</p><h2>¿Cuánto consumes?</h2><p>Ingresa la potencia de tu aparato y las horas de uso para obtener una estimación.</p></div>
          <div className="calculator-fields">
            <label htmlFor="potencia">Potencia del aparato (W)<input id="potencia" type="number" min="0" step="any" value={potencia} onChange={(event) => setPotencia(event.target.value)} placeholder="Ej. 100" required /></label>
            <label htmlFor="horas">Horas de uso<input id="horas" type="number" min="0" step="any" value={horas} onChange={(event) => setHoras(event.target.value)} placeholder="Ej. 5" required /></label>
            <button className="button button-dark" type="submit">Calcular consumo <span>↗</span></button>
          </div>
          {resultado && <div className="calculator-results" aria-live="polite"><div><span>Consumo estimado</span><strong>{resultado.consumo.toFixed(2)} kWh</strong></div><div><span>Costo estimado</span><strong>${resultado.costo.toFixed(0)} COP</strong></div></div>}
        </form>
      </section>
    </div>
  )
}

export default BlogView
