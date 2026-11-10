import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contextos/ContextoAutenticacion';
import { useToast } from '../contextos/ContextoNotificaciones';

export default function IniciarSesion() {
  const { login } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [formulario, setFormulario] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  const handleChange = (e) => {
    setFormulario((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setCargando(true);
    try {
      const user = await login(formulario.email, formulario.password);
      addToast(`¡Bienvenido, ${user.name}! Sesión iniciada correctamente.`, 'success');
      navigate('/');
    } catch (err) {
      console.error(err);
      const msg =
        err.response?.data?.message ||
        (err.request
          ? 'No se pudo conectar con el servidor. Verifica que el backend esté en marcha.'
          : 'Credenciales inválidas. Verifica tu email y contraseña.');
      setError(msg);
      addToast(msg, 'error');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="form-card">
      <header className="page-header" style={{ textAlign: 'center' }}>
        <h1>Bienvenido de nuevo</h1>
        <p>Inicia sesión para gestionar tus tareas</p>
      </header>

      {error && <div className="alert alert-error" role="alert">{error}</div>}

      <form className="card" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            className="input"
            type="email"
            name="email"
            value={formulario.email}
            onChange={handleChange}
            required
            autoComplete="email"
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Contraseña</label>
          <input
            id="password"
            className="input"
            type="password"
            name="password"
            value={formulario.password}
            onChange={handleChange}
            required
            autoComplete="current-password"
          />
        </div>
        <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={cargando}>
          {cargando ? 'Entrando…' : 'Iniciar sesión'}
        </button>
      </form>

      <p className="auth-footer">
        ¿No tienes cuenta? <Link to="/register">Regístrate aquí</Link>
      </p>
    </div>
  );
}
