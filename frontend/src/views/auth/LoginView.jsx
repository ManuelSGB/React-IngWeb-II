import { Link } from 'react-router-dom'

function LoginView() {
  return <div className="auth-page"><div className="auth-aside"><Link className="brand brand-light" to="/"></Link><div><h1>Las buenas ideas se comparten.</h1><p>Vuelve a la comunidad que convierte la curiosidad en hábitos sostenibles.</p></div><span className="aside-note">ECOWATT</span></div><div className="auth-form-wrap"><div className="auth-form"><p className="eyebrow">BIENVENIDO DE VUELTA</p><h2>Iniciar sesión</h2><p className="form-subtitle">Entra para seguir tu recorrido.</p><form><label>Correo electrónico<input type="email" placeholder="tu@correo.com" /></label><label>Contraseña<div className="password-field"><input type="password" placeholder="••••••••" /><button type="button">Mostrar</button></div></label><div className="form-options"><label className="check-label"><input type="checkbox" /> Recordarme</label><a href="/login">Olvidé mi contraseña</a></div><button className="button button-dark button-full" type="button">Entrar <span>↗</span></button></form><p className="auth-switch">¿No tienes cuenta? <Link to="/registro">Crear una cuenta</Link></p></div></div></div>
}

export default LoginView
