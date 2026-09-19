import { Link } from 'react-router-dom'

function AddTopicView() {
  return (
    <div className="site-page section-wrap add-topic-page">
      <Link className="back-link" to="/foro">← Volver al foro</Link>
      <div className="add-topic-header">
        <p className="eyebrow">NUEVA CONVERSACION</p>
        <h1>Comparte una idea con la <em>comunidad.</em></h1>
        <p className="hero-lead">Abre un tema y permite que otras personas aporten sus experiencias sobre el ahorro de energia.</p>
      </div>
      <form className="topic-form">
        <label>
          Categoria
          <select defaultValue="">
            <option value="" disabled>Selecciona una categoria</option>
            <option value="hogar">HOGAR</option>
            <option value="energia-solar">ENERGIA SOLAR</option>
            <option value="equipamiento">EQUIPAMIENTO</option>
            <option value="retos">RETOS</option>
          </select>
        </label>
        <label>
          Titulo del tema
          <input type="text" placeholder="Escribe un titulo claro para tu tema" />
        </label>
        <label>
          Mensaje
          <textarea placeholder="Cuenta a la comunidad sobre tu pregunta, experiencia o idea..." rows="9" />
        </label>
        <div className="topic-form-footer">
          <span>Tu aporte ayuda a que la comunidad siga aprendiendo.</span>
          <button className="button publish-button" type="button">Publicar <span>↗</span></button>
        </div>
      </form>
    </div>
  )
}

export default AddTopicView
