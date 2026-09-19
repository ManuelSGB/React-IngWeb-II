import { Link } from 'react-router-dom'

function AddUserView() {
  return (
    <div className="site-page section-wrap add-user-page">
      <Link className="back-link" to="/admin/usuarios">← Volver a usuarios</Link>
      <div className="add-topic-header">
        <p className="eyebrow">PANEL DE GESTION / NUEVO USUARIO</p>
        <h1>Agrega una persona a la <em>comunidad.</em></h1>
        <p className="hero-lead">Completa los datos del perfil y define el acceso que tendra dentro de EcoWatt.</p>
      </div>
      <form className="topic-form admin-user-form">
        <div className="form-row">
          <label>
            Nombre completo
            <input type="text" placeholder="Nombre y apellido" />
          </label>
          <label>
            Correo electronico
            <input type="email" placeholder="persona@ejemplo.com" />
          </label>
        </div>
        <div className="form-row">
          <label>
            Rol
            <select defaultValue="">
              <option value="" disabled>Selecciona un rol</option>
              <option value="moderador">Moderador</option>
              <option value="miembro">Miembro</option>
            </select>
          </label>
          <label>
            Estado
            <select defaultValue="">
              <option value="" disabled>Selecciona un estado</option>
              <option value="activo">Activo</option>
              <option value="inactivo">Inactivo</option>
            </select>
          </label>
        </div>
        <div className="form-row">
          <label>
            Contraseña
            <input type="password" placeholder="Crea una contraseña" />
          </label>
          <label>
            Fecha de registro
            <input type="date" />
          </label>
        </div>
        <div className="topic-form-footer">
          <span>Los datos podran editarse despues desde el directorio.</span>
          <button className="button publish-button" type="button">Agregar usuario <span>↗</span></button>
        </div>
      </form>
    </div>
  )
}

export default AddUserView
