require('dotenv').config();
const express = require('express');
const cors = require('cors');

const db = require('./modelos');
const rutasApi = require('./rutas');

const app = express();
const PORT = process.env.PORT || 4000;
const configuracionRequerida = ['DB_HOST', 'DB_PORT', 'DB_NAME', 'DB_USER', 'JWT_SECRET'];
const faltantes = configuracionRequerida.filter((variable) => !process.env[variable]);

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'API Plataforma de Tareas OK' });
});

app.use('/api', rutasApi);

const infoBd = `${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;

if (faltantes.length) {
  console.error(`Faltan variables de entorno requeridas: ${faltantes.join(', ')}`);
  process.exitCode = 1;
} else {
  db.sequelize
    .sync({ alter: process.env.DB_SYNC_ALTER === 'true' })
    .then(async () => {
      await db.sequelize.authenticate();
      const totalUsuarios = await db.Usuario.count();
      console.log('Base de datos sincronizada');
      console.log(`MySQL → ${infoBd}`);
      console.log(`Tabla de usuarios: usuarios (${totalUsuarios} registro(s))`);
      console.log(`Verifica con: GET http://localhost:${PORT}/api/health`);
      app.listen(PORT, () => {
        console.log(`Servidor escuchando en puerto ${PORT}`);
      });
    })
    .catch((err) => {
      console.error('Error al sincronizar la base de datos:', err);
      process.exitCode = 1;
    });
}
