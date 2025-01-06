import { Line } from 'react-chartjs-2';
import React, { useRef } from 'react';
import ExportOptions from './ExportOptions';

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

export default function LineChartJS({ data, nombreFoto }) {
    const chartRef = useRef(null);

    // Opciones para la gráfica
    const misoptions = {
        scales: {
            y: {
                min: 0,
                title: {
                    display: true,
                    text: 'Nivel de Ruido (dB)'
                }
            },
            x: {
                title: {
                    display: true,
                    text: 'Fecha'
                }
            }
        }
    };

    return (
        <div className="flex-fill w-100">
            <div className="shadow-lg flex-fill w-100 mb-2" ref={chartRef}>
                <h5 className="texto-primario-h3 mb-0">Gráfica de Ruido Semanal</h5>
                <div className="card-body d-flex w-100 p-4">
                    <Line data={data} options={misoptions} />
                </div>
                <div className="p-4">
                    <div className="shadow-lg w-100 p-2 mb-2">
                        <ExportOptions chartRef={chartRef} nombreFoto={nombreFoto} data={data} />
                    </div>
                </div>
            </div>
        </div>
    );
}
