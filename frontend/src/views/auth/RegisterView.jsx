import { Link } from 'react-router-dom'

function RegisterView() {
  return <div className="auth-page"><div className="auth-aside register-aside"><Link className="brand brand-light" to="/"></Link><div><h1>Empieza con una acción pequeña.</h1><p>Forma parte de una comunidad que aprende y avanza junta.</p></div><span className="aside-note">ECOWATT</span></div><div className="auth-form-wrap"><div className="auth-form"><p className="eyebrow">UNETE A LA CONVERSACIÓN</p><h2>Crear cuenta</h2><p className="form-subtitle">Tu próximo hábito empieza aqui.</p><form><label>Nombre completo<input type="text" placeholder="¿Cómo te llamas?" /></label><label>Correo electrónico<input type="email" placeholder="tu@correo.com" /></label><label>Contraseña<input type="password" placeholder="Minimo 8 caracteres" /></label><label className="check-label"><input type="checkbox" /> Acepto los términos de la comunidad</label><button className="button button-dark button-full" type="button">Crear mi cuenta <span>↗</span></button></form><p className="auth-switch">¿Ya tienes una cuenta? <Link to="/login">Iniciar sesión</Link></p></div></div></div>
}

export default RegisterView
