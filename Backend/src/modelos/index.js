const sequelize = require('../config/baseDatos');
const Usuario = require('./Usuario');
const Tarea = require('./Tarea');

Usuario.hasMany(Tarea, { foreignKey: 'usuarioId', as: 'tareas' });
Tarea.belongsTo(Usuario, { foreignKey: 'usuarioId', as: 'usuario' });

module.exports = {
  sequelize,
  Usuario,
  Tarea,
};
