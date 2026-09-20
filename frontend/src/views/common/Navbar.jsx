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
          <div className="nav-dropdown">
            <NavLink className="nav-link" to="/" end>Aprende</NavLink>
            <div className="nav-dropdown-menu">
              <a href="/#energia-renovable">Energía renovable</a>
              <a href="/#sugerencias">Sugerencias</a>
              <a href="/#calculadora">Calculadora</a>
            </div>
          </div>
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