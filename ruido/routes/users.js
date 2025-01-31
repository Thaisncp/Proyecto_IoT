var express = require('express');
var router = express.Router();
const DatosController = require('../controls/DatosController');
var datosController = new DatosController();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/datos/semana', datosController.listarDatosSemana);
router.get('/datos/dia', datosController.listarDatosDia);
router.get('/datos', datosController.listarDatos);
router.get('/ultimo', datosController.ultimo);


module.exports = router;
