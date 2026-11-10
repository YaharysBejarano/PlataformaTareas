const express = require('express');
const router = express.Router();

const rutasAutenticacion = require('./autenticacion');
const rutasTareas = require('./tareas');
const salud = require('../controladores/salud');

router.get('/health', salud.estado);
router.use('/auth', rutasAutenticacion);
router.use('/tasks', rutasTareas);

module.exports = router;
