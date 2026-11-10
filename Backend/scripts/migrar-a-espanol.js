/**
 * Copia datos de tablas en inglés a tablas en español si el destino está vacío.
 * Uso: node scripts/migrar-a-espanol.js
 */
require('dotenv').config();
const sequelize = require('../src/config/baseDatos');

async function contarTabla(tabla) {
  const [[fila]] = await sequelize.query(`SELECT COUNT(*) AS c FROM \`${tabla}\``);
  return Number(fila.c);
}

async function migrar() {
  await sequelize.authenticate();
  console.log(`Conectado a ${process.env.DB_NAME}`);

  const pares = [
    {
      origen: 'users',
      destino: 'usuarios',
      sql: `INSERT INTO usuarios (id, nombre, email, contrasena, rol, telefono, creado_en, actualizado_en)
            SELECT id, name, email, passwordHash, role, phone, createdAt, updatedAt FROM users
            WHERE id NOT IN (SELECT id FROM usuarios)`,
    },
    {
      origen: 'subjects',
      destino: 'materias',
      sql: `INSERT INTO materias (id, nombre, creado_en, actualizado_en)
            SELECT id, name, createdAt, updatedAt FROM subjects
            WHERE id NOT IN (SELECT id FROM materias)`,
    },
    {
      origen: 'tutor_subjects',
      destino: 'tutor_materias',
      sql: `INSERT INTO tutor_materias (id, tutor_id, materia_id, precio_hora, creado_en, actualizado_en)
            SELECT id, tutorId, subjectId, hourlyRate, createdAt, updatedAt FROM tutor_subjects
            WHERE id NOT IN (SELECT id FROM tutor_materias)`,
    },
    {
      origen: 'sessions',
      destino: 'sesiones',
      sql: `INSERT INTO sesiones (id, estudiante_id, tutor_id, materia_id, programado_en, notas, estado, creado_en, actualizado_en)
            SELECT id, studentId, tutorId, subjectId, scheduledAt, notes, COALESCE(status,'PENDING'), createdAt, updatedAt FROM sessions
            WHERE id NOT IN (SELECT id FROM sesiones)`,
    },
  ];

  for (const { origen, destino, sql } of pares) {
    try {
      const totalOrigen = await contarTabla(origen);
      const totalDestino = await contarTabla(destino);
      if (totalOrigen === 0) {
        console.log(`- ${origen}: vacía, se omite`);
        continue;
      }
      if (totalDestino > 0) {
        console.log(`- ${destino}: ya tiene ${totalDestino} fila(s), se omite`);
        continue;
      }
      await sequelize.query(sql);
      const migrados = await contarTabla(destino);
      console.log(`✓ ${origen} → ${destino}: ${migrados} fila(s) migradas`);
    } catch (err) {
      if (err.message.includes("doesn't exist")) {
        console.log(`- ${origen}: no existe, se omite`);
      } else {
        throw err;
      }
    }
  }

  const usuarios = await contarTabla('usuarios');
  console.log(`\nListo. usuarios: ${usuarios} registro(s).`);
  await sequelize.close();
}

migrar().catch((err) => {
  console.error('Error en migración:', err.message);
  process.exit(1);
});
