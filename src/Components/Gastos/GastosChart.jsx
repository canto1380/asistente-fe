import React, { useMemo } from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  PointElement,
  LineElement
} from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';
import { formatCurrency } from '../../utils/dateFormatter';

// Registramos los componentes de Chart.js
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  PointElement,
  LineElement
);

const GastosCharts = ({ gastos }) => {
    // --- 1. Procesamiento de Datos ---

    // Agrupar por Categoría
    const gastosPorCategoria = useMemo(() => {
        const agrupadro = {};
        gastos.forEach(g => {
            const catNombre = g.categoriaGasto?.nombre || 'Sin Categoría';
            if (!agrupadro[catNombre]) agrupadro[catNombre] = 0;
            agrupadro[catNombre] += Number(g.total);
        });
        // Ordenar de mayor a menor gasto
        return Object.entries(agrupadro)
            .sort(([, a], [, b]) => b - a)
            .reduce((r, [k, v]) => ({ ...r, [k]: v }), {});
    }, [gastos]);

    // Agrupar por Día (Evolución)
    const gastosPorDia = useMemo(() => {
        const agrupadro = {};
        gastos.forEach(g => {
            const dia = new Date(g.fecha).getDate(); // 1, 2, 3...
            if (!agrupadro[dia]) agrupadro[dia] = 0;
            agrupadro[dia] += Number(g.total);
        });
        return agrupadro;
    }, [gastos]);


    // --- 2. Configuración de Gráficos ---

    // Paleta de colores profesional
    const backgroundColors = [
        'rgba(59, 130, 246, 0.8)',   // Blue
        'rgba(16, 185, 129, 0.8)',   // Emerald
        'rgba(245, 158, 11, 0.8)',   // Amber
        'rgba(239, 68, 68, 0.8)',    // Red
        'rgba(139, 92, 246, 0.8)',   // Violet
        'rgba(236, 72, 153, 0.8)',   // Pink
        'rgba(99, 102, 241, 0.8)',   // Indigo
        'rgba(14, 165, 233, 0.8)',   // Sky
    ];

    const dataDoughnut = {
        labels: Object.keys(gastosPorCategoria),
        datasets: [
            {
                data: Object.values(gastosPorCategoria),
                backgroundColor: backgroundColors,
                borderColor: '#ffffff',
                borderWidth: 2,
            },
        ],
    };

    const optionsDoughnut = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'right',
                labels: {
                    usePointStyle: true,
                    pointStyle: 'circle',
                    font: { size: 11 }
                }
            },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        return ` ${context.label}: ${formatCurrency(context.raw)}`;
                    }
                }
            }
        },
    };


    if (gastos.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-64 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                <p className="text-gray-400 font-medium">No hay datos suficientes para generar gráficos</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Gráfico de Distribución (Torta) */}
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col">
                <h3 className="text-gray-700 font-bold text-sm mb-4">Distribución por Categorías</h3>
                <div className="flex-grow relative h-64 w-full">
                     <Doughnut data={dataDoughnut} options={optionsDoughnut} />
                </div>
            </div>

        </div>
    );
};

export default GastosCharts;
