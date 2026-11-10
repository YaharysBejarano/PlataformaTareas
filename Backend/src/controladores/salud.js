const { sequelize, Usuario } = require('../modelos');

exports.estado = async (req, res) => {
  try {
    await sequelize.authenticate();
    const totalUsuarios = await Usuario.count();

    return res.json({
      status: 'ok',
      database: {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        name: process.env.DB_NAME,
        usersTable: 'usuarios',
        userCount: totalUsuarios,
      },
      hint: 'Esquema: usuarios, tareas.',
    });
  } catch (err) {
    console.error(err);
    return res.status(503).json({
      status: 'error',
      message: 'No se pudo conectar a la base de datos',
      error: err.message,
    });
  }
};
