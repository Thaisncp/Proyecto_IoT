import React, { useState, useEffect } from 'react';
import BarraMenu from './BarraMenu';
import { PeticionGet } from '../hooks/Conexion';
import 'bootstrap/dist/css/bootstrap.min.css';

const Historial = () => {
  const [datos, setDatos] = useState([]);
  const [paginaActual, setPaginaActual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(0);
  const itemsPorPagina = 20;

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log(`Solicitud a la página ${paginaActual} con ${itemsPorPagina} items`);
        
        // Solicitar los datos con la paginación aplicada
        const response = await PeticionGet('', `datos?pagina=${paginaActual}&items=${itemsPorPagina}`);
        
        console.log('Respuesta del servidor:', response); // Ver la respuesta completa
        
        if (response && response.info && Array.isArray(response.info)) {
          setDatos(response.info); // Los datos de ruido
          
          // Verificar que 'total' esté presente en la respuesta
          if (response.total) {
            setTotalPaginas(Math.ceil(response.total / itemsPorPagina)); // Calculamos el total de páginas
          } else {
            console.error('El campo "total" no está presente en la respuesta.');
            setTotalPaginas(0);
          }
        } else {
          setDatos([]);
          setTotalPaginas(0);
          console.error('No se encontraron datos en la respuesta o la respuesta no tiene el formato esperado.');
        }
      } catch (error) {
        console.error('Error al cargar los datos:', error);
        setDatos([]);
        setTotalPaginas(0);
      }
    };

    fetchData();
  }, [paginaActual]);

  // Función para calcular el estado de la habitación según el nivel de ruido
  const calcularEstadoHabitacion = (nivelRuido) => {
    if (nivelRuido < 50) return 'Bueno';
    if (nivelRuido >= 50 && nivelRuido <= 70) return 'Moderado';
    return 'Alto';
  };

  // Función para manejar la paginación anterior
  const handlePaginaAnterior = () => {
    if (paginaActual > 1) {
      setPaginaActual(paginaActual - 1);
    }
  };

  // Función para manejar la paginación siguiente
  const handlePaginaSiguiente = () => {
    if (paginaActual < totalPaginas) {
      setPaginaActual(paginaActual + 1);
    }
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
                {datos.length > 0 ? (
                  datos.map((dato, index) => (
                    <tr key={index}>
                      <td className="text-center">{dato.fecha}</td>
                      <td className="text-center">{dato.hora}</td>
                      <td className="text-center">{dato.dato}</td>
                      <td className="text-center">{calcularEstadoHabitacion(dato.dato)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center">No hay datos disponibles</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Controles de paginación */}
          <div className="d-flex justify-content-between">
            <button
              className="btn"
              style={{backgroundColor: "#164E63", color: "white"}}
              onClick={handlePaginaAnterior}
              disabled={paginaActual === 1}
            >
              Página Anterior
            </button>
            <span>
              Página {paginaActual} de {totalPaginas}
            </span>
            <button
              className="btn"
              style={{backgroundColor: "#164E63", color: "white"}}
              onClick={handlePaginaSiguiente}
              disabled={paginaActual === totalPaginas || totalPaginas === 0}
            >
              Página Siguiente
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Historial;
