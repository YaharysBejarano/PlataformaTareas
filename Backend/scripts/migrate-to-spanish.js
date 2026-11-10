/**
 * Copia datos de tablas en inglés (users, subjects, …) a tablas en español
 * (usuarios, materias, …) si las tablas destino están vacías.
 *
 * Uso: node scripts/migrate-to-spanish.js
 */
require('dotenv').config();
const sequelize = require('../src/config/database');

async function tableCount(table) {
  const [[row]] = await sequelize.query(`SELECT COUNT(*) AS c FROM \`${table}\``);
  return Number(row.c);
}

async function migrate() {
  await sequelize.authenticate();
  console.log(`Conectado a ${process.env.DB_NAME}`);

  const pairs = [
    {
      from: 'users',
      to: 'usuarios',
      sql: `INSERT INTO usuarios (id, nombre, email, contrasena, rol, telefono, creado_en, actualizado_en)
            SELECT id, name, email, passwordHash, role, phone, createdAt, updatedAt FROM users
            WHERE id NOT IN (SELECT id FROM usuarios)`,
    },
    {
      from: 'subjects',
      to: 'materias',
      sql: `INSERT INTO materias (id, nombre, creado_en, actualizado_en)
            SELECT id, name, createdAt, updatedAt FROM subjects
            WHERE id NOT IN (SELECT id FROM materias)`,
    },
    {
      from: 'tutor_subjects',
      to: 'tutor_materias',
      sql: `INSERT INTO tutor_materias (id, tutor_id, materia_id, precio_hora, creado_en, actualizado_en)
            SELECT id, tutorId, subjectId, hourlyRate, createdAt, updatedAt FROM tutor_subjects
            WHERE id NOT IN (SELECT id FROM tutor_materias)`,
    },
    {
      from: 'sessions',
      to: 'sesiones',
      sql: `INSERT INTO sesiones (id, estudiante_id, tutor_id, materia_id, programado_en, notas, estado, creado_en, actualizado_en)
            SELECT id, studentId, tutorId, subjectId, scheduledAt, notes, COALESCE(status,'PENDING'), createdAt, updatedAt FROM sessions
            WHERE id NOT IN (SELECT id FROM sesiones)`,
    },
  ];

  for (const { from, to, sql } of pairs) {
    try {
      const fromCount = await tableCount(from);
      const toCount = await tableCount(to);
      if (fromCount === 0) {
        console.log(`- ${from}: vacía, se omite`);
        continue;
      }
      if (toCount > 0) {
        console.log(`- ${to}: ya tiene ${toCount} fila(s), se omite migración desde ${from}`);
        continue;
      }
      await sequelize.query(sql);
      const migrated = await tableCount(to);
      console.log(`✓ ${from} → ${to}: ${migrated} fila(s) migradas`);
    } catch (err) {
      if (err.message.includes("doesn't exist")) {
        console.log(`- ${from}: no existe, se omite`);
      } else {
        throw err;
      }
    }
  }

  const usuarios = await tableCount('usuarios');
  console.log(`\nListo. usuarios: ${usuarios} registro(s).`);
  await sequelize.close();
}

migrate().catch((err) => {
  console.error('Error en migración:', err.message);
  process.exit(1);
});
