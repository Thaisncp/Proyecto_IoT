const mqtt = require('mqtt');
const { DatoRecolectado } = require('../models');

// Conexión al servidor MQTT
const client = mqtt.connect('mqtt://20.205.17.176');

const topic = 'ruido';

client.on('connect', () => {
    console.log('Conectado al servidor MQTT');
    client.subscribe(topic, (err) => {
        if (err) {
            console.error('Error al suscribirse al tópico:', err.message);
        } else {
            console.log(`Suscrito al tópico: ${topic}`);
        }
    });
});

client.on('message', async (topic, message) => {
    try {
        // Convertir mensaje a JSON
        const data = JSON.parse(message.toString());
        const dato = data.ruido;

        // Obtener fecha y hora actuales
        const fecha = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
        const hora = new Date().toTimeString().split(' ')[0]; // HH:mm:ss

        // Guardar en la base de datos
        await DatoRecolectado.create({
            dato,
            fecha,
            hora,
        });

        console.log(`Dato guardado: Ruido = ${dato}, Fecha = ${fecha}, Hora = ${hora}`);
    } catch (error) {
        console.error('Error al procesar el mensaje MQTT:', error.message);
    }
});
