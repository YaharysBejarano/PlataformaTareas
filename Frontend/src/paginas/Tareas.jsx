import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contextos/ContextoAutenticacion';
import { useToast } from '../contextos/ContextoNotificaciones';
import api from '../api/cliente';
import '../estilos/Tareas.css';

function Tareas() {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [tareas, setTareas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [busqueda, setBusqueda] = useState('');
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [editando, setEditando] = useState(null);
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    prioridad: 'MEDIA',
    fechaVencimiento: '',
  });

  const ESTADOS = ['PENDIENTE', 'EN_PROGRESO', 'COMPLETADA', 'CANCELADA'];

  const solicitarTareas = useCallback(async () => {
    const params = new URLSearchParams();
    if (busqueda) params.append('search', busqueda);

    const { data } = await api.get(`/tasks?${params}`);
    return data;
  }, [busqueda]);

  const cargarTareas = async () => {
    try {
      setTareas(await solicitarTareas());
    } catch (error) {
      console.error('Error al cargar tareas:', error);
      addToast('Error al cargar tareas', 'error');
    }
  };

  useEffect(() => {
    let activa = true;

    solicitarTareas()
      .then((data) => {
        if (activa) setTareas(data);
      })
      .catch((error) => {
        console.error('Error al cargar tareas:', error);
        if (activa) addToast('Error al cargar tareas', 'error');
      })
      .finally(() => {
        if (activa) setCargando(false);
      });

    return () => {
      activa = false;
    };
  }, [solicitarTareas, addToast]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.titulo.trim()) return;

    try {
      if (editando) {
        await api.put(`/tasks/${editando.id}`, formData);
        addToast('Tarea actualizada', 'success');
      } else {
        await api.post('/tasks', formData);
        addToast('Tarea creada', 'success');
      }
      setFormData({ titulo: '', descripcion: '', prioridad: 'MEDIA', fechaVencimiento: '' });
      setEditando(null);
      setMostrarFormulario(false);
      cargarTareas();
    } catch (error) {
      console.error('Error:', error);
      addToast(error.response?.data?.message || 'Error al guardar tarea', 'error');
    }
  };

  const handleEditar = (tarea) => {
    setEditando(tarea);
    setFormData({
      titulo: tarea.titulo,
      descripcion: tarea.descripcion || '',
      prioridad: tarea.prioridad,
      fechaVencimiento: tarea.fechaVencimiento ? tarea.fechaVencimiento.split('T')[0] : '',
    });
    setMostrarFormulario(true);
  };

  const handleEliminar = async (id) => {
    if (confirm('¿Eliminar esta tarea?')) {
      try {
        await api.delete(`/tasks/${id}`);
        addToast('Tarea eliminada', 'success');
        cargarTareas();
      } catch (error) {
        console.error('Error:', error);
        addToast(error.response?.data?.message || 'Error al eliminar', 'error');
      }
    }
  };

  const handleCambiarEstado = async (id, nuevoEstado) => {
    try {
      await api.patch(`/tasks/${id}/status`, { estado: nuevoEstado });
      cargarTareas();
    } catch (error) {
      console.error('Error:', error);
      addToast(error.response?.data?.message || 'Error al cambiar estado', 'error');
    }
  };

  const handleCancelar = () => {
    setFormData({ titulo: '', descripcion: '', prioridad: 'MEDIA', fechaVencimiento: '' });
    setEditando(null);
    setMostrarFormulario(false);
  };

  const obtenerTareasPorEstado = (estado) => {
    const termino = busqueda.toLowerCase();
    return tareas.filter((t) =>
      t.estado === estado &&
      (!termino ||
        t.titulo.toLowerCase().includes(termino) ||
        t.descripcion?.toLowerCase().includes(termino))
    );
  };

  const getColorPrioridad = (prioridad) => {
    const colores = { ALTA: '#ef4444', MEDIA: '#f59e0b', BAJA: '#3b82f6' };
    return colores[prioridad] || '#6b7280';
  };

  if (!user) return <div className="tareas-empty">Cargando...</div>;

  return (
    <div className="tareas-container">
      <div className="tareas-header">
        <h1>📋 Mi Tablero de Tareas</h1>
        <div className="tareas-header-acciones">
          <input
            type="text"
            placeholder="🔍 Buscar tareas..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="tareas-busqueda-global"
          />
          <button className="btn-crear" onClick={() => setMostrarFormulario(true)}>
            + Nueva Tarea
          </button>
        </div>
      </div>

      {mostrarFormulario && (
        <div className="tareas-formulario-modal">
          <div className="tareas-formulario">
            <h2>{editando ? '✏️ Editar Tarea' : '✨ Nueva Tarea'}</h2>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Título de la tarea"
                value={formData.titulo}
                onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                className="form-control"
                required
              />
              <textarea
                placeholder="Descripción (opcional)"
                value={formData.descripcion}
                onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                className="form-control"
                rows="4"
              />
              <select
                value={formData.prioridad}
                onChange={(e) => setFormData({ ...formData, prioridad: e.target.value })}
                className="form-control"
              >
                <option value="BAJA">🔵 Prioridad Baja</option>
                <option value="MEDIA">🟡 Prioridad Media</option>
                <option value="ALTA">🔴 Prioridad Alta</option>
              </select>
              <input
                type="date"
                value={formData.fechaVencimiento}
                onChange={(e) => setFormData({ ...formData, fechaVencimiento: e.target.value })}
                className="form-control"
              />
              <div className="form-botones">
                <button type="submit" className="btn-guardar">
                  {editando ? 'Actualizar' : 'Crear'}
                </button>
                <button type="button" onClick={handleCancelar} className="btn-cancelar">
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {cargando ? (
        <div className="tareas-empty">⏳ Cargando tareas...</div>
      ) : (
        <div className="kanban-board">
          {ESTADOS.map((estado) => {
            const tareasEstado = obtenerTareasPorEstado(estado);
            const estadoLabel = {
              PENDIENTE: '📝 Por Hacer',
              EN_PROGRESO: '⏳ En Progreso',
              COMPLETADA: '✅ Completadas',
              CANCELADA: '✕ Canceladas',
            }[estado];

            return (
              <div key={estado} className="kanban-columna">
                <div className="kanban-header">
                  <h3>{estadoLabel}</h3>
                  <span className="kanban-count">{tareasEstado.length}</span>
                </div>
                <div className="kanban-tareas">
                  {tareasEstado.length === 0 ? (
                    <div className="kanban-vacio">Sin tareas</div>
                  ) : (
                    tareasEstado.map((tarea) => (
                      <div key={tarea.id} className="kanban-tarea">
                        <div className="tarea-prioridad" style={{ backgroundColor: getColorPrioridad(tarea.prioridad) }}></div>
                        <div className="tarea-contenido">
                          <h4>{tarea.titulo}</h4>
                          {tarea.descripcion && <p className="tarea-desc">{tarea.descripcion}</p>}
                          {tarea.fechaVencimiento && (
                            <span className="tarea-fecha">📅 {new Date(tarea.fechaVencimiento).toLocaleDateString('es-ES')}</span>
                          )}
                        </div>
                        <div className="tarea-controles">
                          {estado !== 'COMPLETADA' && estado !== 'CANCELADA' && estado !== 'EN_PROGRESO' && (
                            <button
                              onClick={() => handleCambiarEstado(tarea.id, 'EN_PROGRESO')}
                              className="btn-mini btn-progreso"
                              title="Comenzar"
                            >
                              ▶
                            </button>
                          )}
                          {estado !== 'COMPLETADA' && estado !== 'CANCELADA' && estado !== 'PENDIENTE' && (
                            <button
                              onClick={() => handleCambiarEstado(tarea.id, 'COMPLETADA')}
                              className="btn-mini btn-completar"
                              title="Completar"
                            >
                              ✓
                            </button>
                          )}
                          {estado !== 'PENDIENTE' && estado !== 'CANCELADA' && (
                            <button
                              onClick={() => handleCambiarEstado(tarea.id, 'PENDIENTE')}
                              className="btn-mini btn-retroceder"
                              title="Retroceder"
                            >
                              ↶
                            </button>
                          )}
                          {estado !== 'CANCELADA' && (
                            <button
                              onClick={() => handleCambiarEstado(tarea.id, 'CANCELADA')}
                              className="btn-mini btn-eliminar"
                              title="Cancelar tarea"
                            >
                              ✕
                            </button>
                          )}
                          {estado === 'CANCELADA' && (
                            <button
                              onClick={() => handleCambiarEstado(tarea.id, 'PENDIENTE')}
                              className="btn-mini btn-retroceder"
                              title="Reactivar tarea"
                            >
                              ↶
                            </button>
                          )}
                          <button
                            onClick={() => handleEditar(tarea)}
                            className="btn-mini btn-editar"
                            title="Editar"
                          >
                            ✎
                          </button>
                          <button
                            onClick={() => handleEliminar(tarea.id)}
                            className="btn-mini btn-eliminar"
                            title="Eliminar"
                          >
                            🗑
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Tareas;
