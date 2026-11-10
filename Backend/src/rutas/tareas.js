const express = require('express');
const router = express.Router();
const tareasCtrl = require('../controladores/tareas');
const autenticacion = require('../middleware/autenticacion');

router.post('/', autenticacion, tareasCtrl.crear);
router.get('/', autenticacion, tareasCtrl.obtenerMias);
router.get('/:id', autenticacion, tareasCtrl.obtenerPorId);
router.put('/:id', autenticacion, tareasCtrl.actualizar);
router.patch('/:id/status', autenticacion, tareasCtrl.cambiarEstado);
router.delete('/:id', autenticacion, tareasCtrl.eliminar);

module.exports = router;
