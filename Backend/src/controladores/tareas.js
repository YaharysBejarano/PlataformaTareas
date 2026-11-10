const db = require('../modelos');
const { Op, ValidationError } = require('sequelize');

const Tarea = db.Tarea;
const ESTADOS_TAREA = ['PENDIENTE', 'EN_PROGRESO', 'COMPLETADA', 'CANCELADA'];
const PRIORIDADES_TAREA = ['BAJA', 'MEDIA', 'ALTA'];

const crear = async (req, res) => {
  try {
    const { titulo, descripcion, prioridad, fechaVencimiento } = req.body || {};
    const usuarioId = req.user.id;

    if (typeof titulo !== 'string' || titulo.trim() === '') {
      return res.status(400).json({ message: 'El título es requerido' });
    }
    if (descripcion !== undefined && descripcion !== null && typeof descripcion !== 'string') {
      return res.status(400).json({ message: 'La descripción debe ser texto' });
    }
    if (prioridad !== undefined && !PRIORIDADES_TAREA.includes(prioridad)) {
      return res.status(400).json({ message: 'Prioridad inválida' });
    }

    const tarea = await Tarea.create({
      usuarioId,
      titulo: titulo.trim(),
      descripcion: descripcion?.trim() || null,
      prioridad: prioridad || 'MEDIA',
      fechaVencimiento: fechaVencimiento || null,
      estado: 'PENDIENTE',
    });

    return res.status(201).json(tarea);
  } catch (error) {
    console.error('Error al crear tarea:', error);
    if (error instanceof ValidationError) {
      return res.status(400).json({ message: error.errors[0]?.message || 'Datos de tarea inválidos' });
    }
    return res.status(500).json({ message: 'Error al crear tarea' });
  }
};

const obtenerMias = async (req, res) => {
  try {
    const usuarioId = req.user.id;
    const { estado, prioridad, search } = req.query;

    const where = { usuarioId };

    if (estado) {
      if (!ESTADOS_TAREA.includes(estado)) {
        return res.status(400).json({ message: 'Estado inválido' });
      }
      where.estado = estado;
    }
    if (prioridad) {
      if (!PRIORIDADES_TAREA.includes(prioridad)) {
        return res.status(400).json({ message: 'Prioridad inválida' });
      }
      where.prioridad = prioridad;
    }
    if (search) {
      where[Op.or] = [
        { titulo: { [Op.like]: `%${search}%` } },
        { descripcion: { [Op.like]: `%${search}%` } },
      ];
    }

    const tareas = await Tarea.findAll({
      where,
      order: [['creado_en', 'DESC']],
    });

    return res.json(tareas);
  } catch (error) {
    console.error('Error al obtener tareas:', error);
    return res.status(500).json({ message: 'Error al obtener tareas' });
  }
};

const obtenerPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const usuarioId = req.user.id;

    const tarea = await Tarea.findByPk(id);

    if (!tarea) {
      return res.status(404).json({ message: 'Tarea no encontrada' });
    }

    if (tarea.usuarioId !== usuarioId) {
      return res.status(403).json({ message: 'No tienes permisos para esta tarea' });
    }

    return res.json(tarea);
  } catch (error) {
    console.error('Error al obtener tarea:', error);
    return res.status(500).json({ message: 'Error al obtener tarea' });
  }
};

const actualizar = async (req, res) => {
  try {
    const { id } = req.params;
    const usuarioId = req.user.id;
    const { titulo, descripcion, prioridad, fechaVencimiento, estado } = req.body || {};

    const tarea = await Tarea.findByPk(id);

    if (!tarea) {
      return res.status(404).json({ message: 'Tarea no encontrada' });
    }

    if (tarea.usuarioId !== usuarioId) {
      return res.status(403).json({ message: 'No tienes permisos para esta tarea' });
    }

    if (titulo !== undefined) {
      if (typeof titulo !== 'string' || !titulo.trim()) {
        return res.status(400).json({ message: 'El título no puede estar vacío' });
      }
      tarea.titulo = titulo.trim();
    }
    if (descripcion !== undefined) {
      if (descripcion !== null && typeof descripcion !== 'string') {
        return res.status(400).json({ message: 'La descripción debe ser texto' });
      }
      tarea.descripcion = descripcion?.trim() || null;
    }
    if (prioridad !== undefined) {
      if (!PRIORIDADES_TAREA.includes(prioridad)) {
        return res.status(400).json({ message: 'Prioridad inválida' });
      }
      tarea.prioridad = prioridad;
    }
    if (fechaVencimiento !== undefined) {
      tarea.fechaVencimiento = fechaVencimiento || null;
    }
    if (estado !== undefined) {
      if (!ESTADOS_TAREA.includes(estado)) {
        return res.status(400).json({ message: 'Estado inválido' });
      }
      tarea.estado = estado;
    }

    await tarea.save();
    return res.json(tarea);
  } catch (error) {
    console.error('Error al actualizar tarea:', error);
    if (error instanceof ValidationError) {
      return res.status(400).json({ message: error.errors[0]?.message || 'Datos de tarea inválidos' });
    }
    return res.status(500).json({ message: 'Error al actualizar tarea' });
  }
};

const cambiarEstado = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body || {};
    const usuarioId = req.user.id;

    if (!ESTADOS_TAREA.includes(estado)) {
      return res.status(400).json({ message: 'Estado inválido' });
    }

    const tarea = await Tarea.findByPk(id);

    if (!tarea) {
      return res.status(404).json({ message: 'Tarea no encontrada' });
    }

    if (tarea.usuarioId !== usuarioId) {
      return res.status(403).json({ message: 'No tienes permisos para esta tarea' });
    }

    tarea.estado = estado;
    await tarea.save();
    return res.json(tarea);
  } catch (error) {
    console.error('Error al cambiar estado:', error);
    if (error instanceof ValidationError) {
      return res.status(400).json({ message: error.errors[0]?.message || 'Estado inválido' });
    }
    return res.status(500).json({ message: 'Error al cambiar estado' });
  }
};

const eliminar = async (req, res) => {
  try {
    const { id } = req.params;
    const usuarioId = req.user.id;

    const tarea = await Tarea.findByPk(id);

    if (!tarea) {
      return res.status(404).json({ message: 'Tarea no encontrada' });
    }

    if (tarea.usuarioId !== usuarioId) {
      return res.status(403).json({ message: 'No tienes permisos para esta tarea' });
    }

    await tarea.destroy();
    return res.json({ message: 'Tarea eliminada correctamente' });
  } catch (error) {
    console.error('Error al eliminar tarea:', error);
    return res.status(500).json({ message: 'Error al eliminar tarea' });
  }
};

module.exports = {
  crear,
  obtenerMias,
  obtenerPorId,
  actualizar,
  cambiarEstado,
  eliminar,
};
