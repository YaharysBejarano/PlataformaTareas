import { Link } from 'react-router-dom';
import { useAuth } from '../contextos/ContextoAutenticacion';

export default function Inicio() {
  const { user, loading } = useAuth();

  return (
    <>
      <section className="hero">
        <div className="hero-content">
          <h1>Organiza tu día con Planora</h1>
          <p>
            Crea, gestiona y completa tus tareas diarias de forma eficiente.
            Prioriza tus actividades, establece fechas de vencimiento y mantén todo bajo control.
          </p>

          <div className="hero-actions">
            {loading ? (
              <span className="btn btn-secondary" aria-disabled="true">
                Cargando...
              </span>
            ) : user ? (
              <>
                <Link to="/tasks" className="btn btn-primary">
                  ✨ Mis tareas
                </Link>
                <Link to="/perfil" className="btn btn-secondary">
                  Mi perfil
                </Link>
              </>
            ) : (
              <>
                <Link to="/register" className="btn btn-primary">
                  🚀 Crear cuenta gratis
                </Link>
                <Link to="/login" className="btn btn-secondary">
                  Iniciar sesión
                </Link>
              </>
            )}
          </div>
        </div>

        <div className="hero-graphic" aria-hidden="true">
          <div className="graphic-element"></div>
        </div>
      </section>

      <section className="features">
        <article className="card feature-card">
          <div className="feature-icon" aria-hidden="true">✓</div>
          <h3>Crear tareas</h3>
          <p className="card-meta">
            Crea tareas con título, descripción, prioridad y fecha de vencimiento.
            Organiza todo lo que necesitas hacer.
          </p>
        </article>

        <article className="card feature-card">
          <div className="feature-icon" aria-hidden="true">🔍</div>
          <h3>Buscar y filtrar</h3>
          <p className="card-meta">
            Encuentra tus tareas rápidamente por título o filtra por estado y prioridad.
            Acceso rápido a lo importante.
          </p>
        </article>

        <article className="card feature-card">
          <div className="feature-icon" aria-hidden="true">📊</div>
          <h3>Controla tu progreso</h3>
          <p className="card-meta">
            Cambia el estado de tus tareas: Pendiente, En Progreso o Completada.
            Visualiza tu avance en tiempo real.
          </p>
        </article>
      </section>
    </>
  );
}
