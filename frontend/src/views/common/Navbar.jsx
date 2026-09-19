// src/views/common/Navbar.jsx
import { Link, NavLink } from 'react-router-dom'
import '../../styles/Navbar.css'

const Navbar = () => {
  return (
    <header className="navbar">
      <div className="navbar-container">
        <Link className="brand" to="/">
          <img className="brand-logo" src="/EcoWatt.jpeg" alt="EcoWatt" />
        </Link>
        <nav className="navbar-menu" aria-label="Navegacion principal">
          <NavLink className="nav-link" to="/" end>Aprende</NavLink>
          <NavLink className="nav-link" to="/foro">Foro</NavLink>
          <NavLink className="nav-link nav-link-admin" to="/admin/usuarios">Panel de gestion</NavLink>
        </nav>
        <div className="navbar-actions">
          <Link className="text-link" to="/login">Iniciar sesion</Link>
          <Link className="button button-small button-dark" to="/registro">Unirme</Link>
        </div>
      </div>
    </header>
  )
}

export default Navbar