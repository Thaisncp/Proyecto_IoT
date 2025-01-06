var models = require('../models');
var datoRecolectado = models.DatoRecolectado;
const { Op } = require('sequelize');

class DatosController {
    async listarDatos(req, res) {
        try {
            const listar = await datoRecolectado.findAll({
                attributes: ['dato', 'fecha', 'hora', 'external_id'],
                order: [['fecha', 'DESC'], ['hora', 'DESC']]
            });
            res.json({ msg: 'OK!', code: 200, info: listar });
        } catch (error) {
            console.error('Error al listar datos de Ruido:', error);
            res.status(500).json({ msg: 'Error al listar datos de Ruido', code: 500 });
        }
    }

    async listarDatosSemana(req, res) {
        try {
            const endDate = new Date();
            const startDate = new Date(endDate); 
            startDate.setDate(startDate.getDate() - 7);

            const listar = await datoRecolectado.findAll({
                attributes: ['dato', 'fecha', 'hora', 'external_id'],
                where: {
                    fecha: {
                        [Op.between]: [startDate, endDate] 
                    }
                },
            });
            res.json({ msg: 'OK!', code: 200, info: listar });
        } catch (error) {
            console.error('Error al listar datos de Ruido por semana:', error);
            res.status(500).json({ msg: 'Error al listar datos de Ruido por semana', code: 500 });
        }
    }

    async listarDatosDia(req, res) {
        try {
            const ultimoDato = await datoRecolectado.findOne({
                attributes: ['fecha'],
                order: [['createdAt', 'DESC']],
            });
    
            if (!ultimoDato) {
                return res.status(404).json({ msg: 'No se encontraron datos', code: 404 });
            }
  
            const fecha = ultimoDato.fecha;

            const listar = await datoRecolectado.findAll({
                attributes: ['dato', 'fecha', 'hora', 'external_id'],
                where: {
                    fecha,
                },
            });
    
            res.json({ msg: 'OK!', code: 200, info: listar });
        } catch (error) {
            console.error('Error al listar datos de Ruido por día:', error);
            res.status(500).json({ msg: 'Error al listar datos de Ruido por día', code: 500 });
        }
    }
    
}
module.exports = DatosController;