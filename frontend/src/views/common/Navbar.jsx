// src/views/common/Navbar.jsx
import { Link, useNavigate, useLocation } from 'react-router-dom'
import '../../styles/Navbar.css'
 
const Navbar = () => {  
 
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          <Link to="/">
            <h2>Sistema Web</h2>
          </Link>
        </div>
      </div>
    </nav>
  )
}
 
export default Navbar