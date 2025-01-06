import React, { useState, useEffect } from 'react';
import BarraMenu from './BarraMenu';
import { PeticionGet } from '../hooks/Conexion';
import 'bootstrap/dist/css/bootstrap.min.css';

const Historial = () => {
  const [datos, setDatos] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await PeticionGet('', 'datos');
        console.log(data);
        // Agrupar datos por fecha y hora
        const historialAgrupado = agruparDatos(data.info);
        setDatos(historialAgrupado);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  // Función para agrupar datos por fecha y hora
  const agruparDatos = (datos) => {
    return datos.map((dato) => ({
      fecha: dato.fecha,
      hora: dato.hora,
      nivelRuido: dato.dato, // Campo ajustado al nivel de ruido
      estadoHabitacion: calcularEstadoHabitacion(dato.dato), // Calcular estado en base al nivel de ruido
    }));
  };

  // Función para calcular el estado de la habitación
  const calcularEstadoHabitacion = (nivelRuido) => {
    if (nivelRuido < 50) return 'Bueno';
    if (nivelRuido >= 50 && nivelRuido <= 70) return 'Moderado';
    return 'Alto';
  };

  return (
    <div>
      <header>
        <BarraMenu />
      </header>
      <section>
        <h3 className="texto-primario-h3">HISTORIAL</h3>
        <div className="crud shadow-lg p-3 mb-5 bg-body rounded">
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Hora</th>
                  <th>Nivel de Ruido (dB)</th>
                  <th>Estado de la Habitación</th>
                </tr>
              </thead>
              <tbody>
                {datos.map((dato, index) => (
                  <tr key={index}>
                    <td lassName='text-center'>{dato.fecha}</td>
                    <td lassName='text-center'>{dato.hora}</td>
                    <td lassName='text-center'>{dato.nivelRuido}</td>
                    <td lassName='text-center'>{dato.estadoHabitacion}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Historial;
