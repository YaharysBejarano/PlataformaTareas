import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../contextos/ContextoAutenticacion';
import { useToast } from '../contextos/ContextoNotificaciones';
import { ETIQUETAS_ROL } from '../utilidades/etiquetas';

export default function BarraNavegacion() {
  const { user, logout } = useAuth();
  const { addToast } = useToast();

  const handleLogout = () => {
    logout();
    addToast('Sesión cerrada correctamente.', 'info');
  };

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand">
          <span><img className="navbar-logo" src="/logo.png" alt="TaskFlow" /></span>
          TaskFlow
        </Link>

        <nav className="navbar-links" aria-label="Principal">
          <NavLink to="/" className="nav-link" end>Inicio</NavLink>
          {user && (
            <>
              <NavLink to="/tasks" className="nav-link">Mis tareas</NavLink>
              <NavLink to="/perfil" className="nav-link">Mi perfil</NavLink>
            </>
          )}
        </nav>

        <div className="navbar-user">
          {user ? (
            <>
              <span className="user-pill">
                {user.name}
              </span>
              <button type="button" className="btn btn-ghost btn-sm" onClick={handleLogout}>
                Salir
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost btn-sm">Iniciar sesión</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Registrarse</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
