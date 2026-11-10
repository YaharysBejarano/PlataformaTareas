const express = require('express');
const router = express.Router();
const autenticacion = require('../controladores/autenticacion');
const autenticacionMiddleware = require('../middleware/autenticacion');

router.post('/register', autenticacion.registrar);
router.post('/login', autenticacion.iniciarSesion);
router.get('/me', autenticacionMiddleware, autenticacion.perfil);
router.patch('/me', autenticacionMiddleware, autenticacion.actualizarPerfil);

module.exports = router;
