const { DataTypes } = require('sequelize');
const sequelize = require('../config/baseDatos');

const Tarea = sequelize.define(
  'Tarea',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    usuarioId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'usuario_id',
    },
    titulo: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    estado: {
      type: DataTypes.ENUM('PENDIENTE', 'EN_PROGRESO', 'COMPLETADA', 'CANCELADA'),
      allowNull: false,
      defaultValue: 'PENDIENTE',
    },
    prioridad: {
      type: DataTypes.ENUM('BAJA', 'MEDIA', 'ALTA'),
      allowNull: false,
      defaultValue: 'MEDIA',
      field: 'prioridad',
    },
    fechaVencimiento: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'fecha_vencimiento',
    },
  },
  {
    tableName: 'tareas',
    timestamps: true,
    createdAt: 'creado_en',
    updatedAt: 'actualizado_en',
  }
);

module.exports = Tarea;
