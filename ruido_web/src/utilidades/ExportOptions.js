import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { PeticionGet } from '../hooks/Conexion';

export default function ExportOptions({ nombreFoto }) {
    const [data, setData] = useState([]); // Solo datos de ruido

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await PeticionGet("", "datos/semana");
                console.log(response.info);  // Verifica la respuesta
                setData(response.info); // Guardamos los datos de la respuesta

            } catch (error) {
                console.error('Error al obtener los datos:', error);
            }
        };

        fetchData();
    }, []);


    const exportDataToExcel = async () => {
        if (!data || data.length === 0) {
            console.error('No hay datos completos para exportar a Excel.');
            return;
        }

        const excelData = data.map((item) => ({
            Fecha: item.fecha,
            Hora: item.hora,
            Ruido: item.dato,
        }));

        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(excelData);
        XLSX.utils.book_append_sheet(wb, ws, 'Datos de Ruido');
        XLSX.writeFile(wb, `${nombreFoto}_week_data_${Date.now()}.xlsx`);
    };

    const exportDataToTxt = async () => {
        if (!data || data.length === 0) {
            console.error('No hay datos completos para exportar a TXT.');
            return;
        }

        const txtData = data.map(item => `${item.fecha} ${item.hora} ${item.dato}\n`).join('');
        const blob = new Blob([txtData], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${nombreFoto}_week_data_${Date.now()}.txt`);
        link.click();
    };

    const exportDataToPdf = async () => {
        if (!data || data.length === 0) {
            console.error('No hay datos completos para exportar a PDF.');
            return;
        }

        const doc = new jsPDF();
        const titulo = `DATOS DE RUIDO - ${nombreFoto} (Semana)`;
        const tituloX = doc.internal.pageSize.getWidth() / 2;
        const margenSuperiorTitulo = 15;
        doc.text(titulo, tituloX, margenSuperiorTitulo, { align: 'center' });

        const tableData = data.map(item => [
            item.fecha,
            item.hora,
            item.dato,
        ]);

        doc.autoTable({
            head: [['Fecha', 'Hora', 'Ruido (dB)']],
            body: tableData,
            startY: margenSuperiorTitulo + 10,
            styles: { overflow: 'linebreak' },
        });

        doc.save(`${nombreFoto}_week_data_${Date.now()}.pdf`);
    };

    return (
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            <button style={{ flex: 1, margin: '5px', display: 'flex', alignItems: 'center' }} className="boton btn" onClick={exportDataToExcel}>
                <i className="fas fa-file-excel" style={{ marginRight: '10px' }}></i>
                XLSX
            </button>
            <button style={{ flex: 1, margin: '5px', display: 'flex', alignItems: 'center' }} className="boton btn" onClick={exportDataToTxt}>
                <i className="fas fa-file-alt" style={{ marginRight: '10px' }}></i>
                TXT
            </button>
            <button style={{ flex: 1, margin: '5px', display: 'flex', alignItems: 'center' }} className="boton btn" onClick={exportDataToPdf}>
                <i className="fas fa-file-pdf" style={{ marginRight: '10px' }}></i>
                PDF
            </button>
        </div>
    );
}
