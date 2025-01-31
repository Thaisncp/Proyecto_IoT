import React, { useEffect, useState } from 'react';
import '../components/css/style.css';
import BarraMenu from './BarraMenu';
import LineChartJS from '../utilidades/LineChartJS';
import { PeticionGet } from '../hooks/Conexion';

const MapComponent = () => {
    const [filtro, setFiltro] = useState('dia'); // Estado para controlar la selección del filtro
    const [dataGrafica, setDataGrafica] = useState({
        fechas: [],
        valores: []
    });
    const [loading, setLoading] = useState(true); // Estado de carga
    const [error, setError] = useState(false); // Estado de error

    const handleFiltroChange = (event) => {
        setFiltro(event.target.value); // Actualizar el estado según la opción seleccionada
    };

    useEffect(() => {
        const fetchData = async () => {
            console.log('Iniciando la carga de datos...'); // Verificar si comienza la solicitud
            setLoading(true);
            setError(false);
            try {
                const endpoint = filtro === 'dia' ? 'datos/dia' : 'datos/semana';
                console.log(`Endpoint solicitado: ${endpoint}`); // Verificar qué endpoint se solicita

                const response = await PeticionGet("", endpoint);
                console.log('Respuesta recibida:', response); // Verificar la respuesta completa

                if (!response || !response.info) {
                    throw new Error('Datos de respuesta no válidos');
                }

                const ruidoData = response.info.map(dato => ({
                    fecha: dato.fecha,
                    valor: dato.dato
                }));

                console.log('Datos procesados:', ruidoData); // Verificar los datos procesados

                setDataGrafica({
                    fechas: ruidoData.map(d => d.fecha),
                    valores: ruidoData.map(d => d.valor)
                });
            } catch (error) {
                console.error('Error al obtener datos de ruido:', error);
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [filtro]);

    console.log('Estado de la gráfica:', dataGrafica); // Verificar el estado de la gráfica

    return (
        <div>
            <header>
                <BarraMenu />
            </header>
            <main>
                <div className="container-fluid">
                    <div className="row justify-content-center mt-4 mb-4">
                        <div className="col-12 col-lg-8 col-xxl-7 d-flex flex-column">
                            {loading ? (
                                <div className="text-center">Cargando datos...</div>
                            ) : error ? (
                                <div className="text-center text-danger">Error al cargar los datos.</div>
                            ) : (
                                <LineChartJS 
                                    data={{
                                        labels: dataGrafica.fechas,
                                        datasets: [
                                            {
                                                label: 'Ruido (dB)',
                                                data: dataGrafica.valores,
                                                borderColor: '#3b82f6',
                                                backgroundColor: 'rgba(59, 130, 246, 0.5)'
                                            }
                                        ]
                                    }}
                                    nombreFoto="RuidoGrafica"
                                />
                            )}
                        </div>
                        <div className="col-12 col-lg-4 col-xxl-4 d-flex">
                            <div className="shadow-lg p-4 flex-fill w-100">
                                <div className="mx-auto w-100">
                                    <label className="texto-primario-h4">Filtrar por periodo:</label>
                                    <select 
                                        id="filtro" 
                                        value={filtro} 
                                        onChange={handleFiltroChange}
                                        className="form-select mt-2"
                                    >
                                        <option value="dia">Día</option>
                                        <option value="semana">Semana</option>
                                    </select>
                                </div>
                                {/* Separación antes de la tabla */}
                                <div className="crud shadow-lg p-3 mb-5 bg-body rounded mt-5" style={{ display: 'flex', flexDirection: 'column' }}>
                                    <div className="col">
                                        <div className="table-responsive">
                                            <table className="table table-striped">
                                                <thead>
                                                    <tr>
                                                        <th>CLASIFICACIÓN</th>
                                                        <th>RANGO</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td>BUENO</td>
                                                        <td className="text-center">0 - 49 dB</td>
                                                    </tr>
                                                    <tr>
                                                        <td>REGULADOR</td>
                                                        <td className="text-center">50 - 70 dB</td>
                                                    </tr>
                                                    <tr>
                                                        <td>MALO</td>
                                                        <td className="text-center">71 - 100 dB</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
     
};

export default MapComponent;
