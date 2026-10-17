// src/views/common/Navbar.jsx
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import storageService from '../../services/storageService'
import '../../styles/Navbar.css'

const Navbar = () => {
  const navigate = useNavigate()
  const [user, setUser] = useState(() => storageService.getUser())

  useEffect(() => {
    const updateUser = () => setUser(storageService.getUser())
    window.addEventListener('auth-change', updateUser)
    window.addEventListener('storage', updateUser)
    return () => {
      window.removeEventListener('auth-change', updateUser)
      window.removeEventListener('storage', updateUser)
    }
  }, [])

  function handleLogout() {
    if (!storageService.clearSession()) return
    setUser(null)
    window.dispatchEvent(new Event('auth-change'))
    navigate('/')
  }

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
          {user?.role === 'admin' && (
            <NavLink className="nav-link nav-link-admin" to="/admin/usuarios">Panel de gestion</NavLink>
          )}
        </nav>
        <div className="navbar-actions">
          {user ? (
            <>
              <span className="text-link">{user.name} {user.lastname}</span>
              <Link className="text-link profile-link" to="/perfil">Mi perfil</Link>
              <button className="text-link logout-link" type="button" onClick={handleLogout}>Cerrar sesión</button>
            </>
          ) : (
            <>
              <Link className="text-link" to="/login">Iniciar sesion</Link>
              <Link className="button button-small button-dark" to="/registro">Unirme</Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}

export default Navbar