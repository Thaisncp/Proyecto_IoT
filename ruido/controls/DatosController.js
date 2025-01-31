var models = require('../models');
var datoRecolectado = models.DatoRecolectado;
const { Op } = require('sequelize');

class DatosController {
    async listarDatos(req, res) {
        try {
            // Obtener los parámetros de paginación desde la solicitud
            const pagina = parseInt(req.query.pagina) || 1;
            const items = parseInt(req.query.items) || 20;
            const offset = (pagina - 1) * items; // Cálculo del desplazamiento
    
            // Realizar la consulta con paginación
            const listar = await datoRecolectado.findAll({
                attributes: ['dato', 'fecha', 'hora', 'external_id'],
                order: [['fecha', 'DESC'], ['hora', 'DESC']],
                limit: items, // Limitar los resultados
                offset: offset // Desplazamiento para paginación
            });
    
            // Obtener el total de registros para calcular las páginas
            const totalRegistros = await datoRecolectado.count();
    
            // Responder con los datos y el total de registros
            res.json({
                msg: 'OK!',
                code: 200,
                info: listar,
                total: totalRegistros // Devolver el total de registros
            });
        } catch (error) {
            console.error('Error al listar datos de Ruido:', error);
            res.status(500).json({ msg: 'Error al listar datos de Ruido', code: 500 });
        }
    }
    
    async ultimo(req, res) {
        try {
            const ultimoDato = await datoRecolectado.findOne({
                attributes: ['dato', 'fecha', 'hora', 'external_id'],
                order: [['fecha', 'DESC'], ['hora', 'DESC']]
            });
    
            if (ultimoDato) {
                res.json({ msg: 'OK!', code: 200, info: ultimoDato });
            } else {
                res.status(404).json({ msg: 'No se encontraron datos', code: 404 });
            }
        } catch (error) {
            console.error('Error al obtener el último dato de Ruido:', error);
            res.status(500).json({ msg: 'Error al obtener el último dato de Ruido', code: 500 });
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