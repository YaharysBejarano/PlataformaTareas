import { Navigate } from 'react-router-dom';
import { useAuth } from '../contextos/ContextoAutenticacion';

export default function RutaProtegida({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading-state">
        <div className="loading-spinner" />
        <p>Cargando…</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
