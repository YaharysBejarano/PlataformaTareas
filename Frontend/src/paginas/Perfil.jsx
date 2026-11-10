import { useEffect, useState } from 'react';
import { useAuth } from '../contextos/ContextoAutenticacion';
import { useToast } from '../contextos/ContextoNotificaciones';
import CampoWhatsApp from '../componentes/CampoWhatsApp';
import { ETIQUETAS_ROL } from '../utilidades/etiquetas';
import {
  combinarTelefono,
  INDICATIVO_POR_DEFECTO,
  separarTelefono,
} from '../utilidades/indicativos';

export default function Perfil() {
  const { user, actualizarPerfil } = useAuth();
  const { addToast } = useToast();
  const [formulario, setFormulario] = useState({
    name: '',
    email: '',
    indicativo: INDICATIVO_POR_DEFECTO,
    numero: '',
  });
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      const { indicativo, numero } = separarTelefono(user.phone);
      setFormulario({
        name: user.name || '',
        email: user.email || '',
        indicativo,
        numero,
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormulario((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setCargando(true);

    const phone = combinarTelefono(formulario.indicativo, formulario.numero);

    try {
      await actualizarPerfil({
        name: formulario.name.trim(),
        email: formulario.email.trim(),
        phone: phone || null,
      });
      addToast('Perfil actualizado correctamente.', 'success');
    } catch (err) {
      console.error(err);
      const msg =
        err.response?.data?.message ||
        (err.request
          ? 'No se pudo conectar con el servidor.'
          : 'Error al actualizar el perfil.');
      setError(msg);
      addToast(msg, 'error');
    } finally {
      setCargando(false);
    }
  };

  if (!user) return null;

  return (
    <>
      <header className="page-header">
        <h1>Mi perfil</h1>
        <p>Actualiza tu información de contacto y cuenta.</p>
      </header>

      <div className="perfil-layout">
        <aside className="card perfil-resumen">
          <h2>{user.name}</h2>
          <p className="card-meta">{user.email}</p>
          <span className="badge badge-role">{ETIQUETAS_ROL[user.role] || user.role}</span>
          {user.phone && (
            <p className="card-meta" style={{ marginTop: '0.75rem' }}>
              WhatsApp: +{user.phone}
            </p>
          )}
        </aside>

        <section className="card form-card" style={{ maxWidth: 'none', margin: 0 }}>
          <h2>Editar datos</h2>
          {error && <div className="alert alert-error" role="alert">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Nombre completo</label>
              <input
                id="name"
                className="input"
                type="text"
                name="name"
                value={formulario.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Correo electrónico</label>
              <input
                id="email"
                className="input"
                type="email"
                name="email"
                value={formulario.email}
                onChange={handleChange}
                required
              />
            </div>
            <CampoWhatsApp
              idPrefix="perfil"
              indicativo={formulario.indicativo}
              numero={formulario.numero}
              onIndicativoChange={(v) => setFormulario((f) => ({ ...f, indicativo: v }))}
              onNumeroChange={(v) => setFormulario((f) => ({ ...f, numero: v }))}
              required={false}
            />
            <p className="card-meta" style={{ marginBottom: '1rem' }}>
              Opcional. Facilita la comunicación por WhatsApp.
            </p>
            <button type="submit" className="btn btn-primary" disabled={cargando}>
              {cargando ? 'Guardando…' : 'Guardar cambios'}
            </button>
          </form>
        </section>
      </div>
    </>
  );
}
