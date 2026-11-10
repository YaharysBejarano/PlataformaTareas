import { Link } from 'react-router-dom';
import { useAuth } from '../contextos/ContextoAutenticacion';
import { buildWhatsAppUrl, WHATSAPP_SOPORTE } from '../utilidades/whatsapp';

const MENSAJE_SOPORTE = 'Hola, necesito ayuda con TaskFlow.';

export default function PiePagina() {
  const { user } = useAuth();
  const urlSoporte = WHATSAPP_SOPORTE
    ? buildWhatsAppUrl(WHATSAPP_SOPORTE, MENSAJE_SOPORTE)
    : null;
  const anio = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <div className="site-footer-brand">
          <Link to="/" className="navbar-brand">
            <span><img className="footer-logo" src="/logo.png" alt="TaskFlow" /></span>
            TaskFlow
          </Link>
          <p className="site-footer-tagline">
            Organiza tus tareas diarias, establece prioridades y completa tus objetivos con eficiencia.
          </p>
        </div>

        <nav className="site-footer-nav" aria-label="Pie de página">
          <div className="site-footer-col">
            <h4>Aplicación</h4>
            <Link to="/">Inicio</Link>
            {user && <Link to="/tasks">Mis tareas</Link>}
            {user && <Link to="/perfil">Mi perfil</Link>}
          </div>
          <div className="site-footer-col">
            <h4>Cuenta</h4>
            {user ? (
              <>
                <span className="site-footer-user">👤 {user.name}</span>
                <span className="card-meta" style={{ fontSize: '0.8rem', marginTop: '0.3rem', display: 'block' }}>
                  {user.email}
                </span>
              </>
            ) : (
              <>
                <Link to="/login">Iniciar sesión</Link>
                <Link to="/register">Registrarse</Link>
              </>
            )}
          </div>
          <div className="site-footer-col">
            <h4>Soporte</h4>
            {urlSoporte ? (
              <a
                href={urlSoporte}
                target="_blank"
                rel="noopener noreferrer"
                className="site-footer-whatsapp"
              >
                💬 WhatsApp
              </a>
            ) : (
              <span className="card-meta">Soporte disponible</span>
            )}
          </div>
        </nav>
      </div>

      <div className="site-footer-bottom">
        <p>© {anio} TaskFlow. Todos los derechos reservados. 🚀</p>
      </div>
    </footer>
  );
}
