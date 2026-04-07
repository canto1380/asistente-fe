import { Eye, ExternalLink, Calendar, Tag, Clock, CheckCircle2, XCircle, HelpCircle, ArrowUpDown } from 'lucide-react';
import { formatDate } from '../../utils/dateFormatter';
import { useState } from 'react';

const GastosTable = ({ gastos, onViewDetail, onNavigateToSource }) => {
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

    const getOrigenLabel = (gasto) => {
        if (gasto.evento) return { label: 'Evento', color: 'bg-blue-100 text-blue-700', title: gasto.evento.titulo };
        if (gasto.tarea) return { label: 'Tarea', color: 'bg-purple-100 text-purple-700', title: gasto.tarea.titulo };
        if (gasto.listaTarea) return { label: 'Lista de tareas', color: 'bg-orange-100 text-orange-700', title: gasto.listaTarea.titulo };
        return { label: 'General', color: 'bg-gray-100 text-gray-700', title: 'Sin asignar' };
    };

    const getStatusBadge = (gasto) => {
        let status;
        let label;

        if (gasto.evento) {
            status = gasto.evento.estado;
            label = status?.toLowerCase();
        } else if (gasto.tarea) {
            status = gasto.tarea.estado;
            label = status?.toLowerCase();
        } else if (gasto.listaTarea) {
            // listaTarea.estado is a boolean: true means 'Cerrada', false means 'Abierta'
            if (gasto.listaTarea.estado === true) {
                status = 'COMPLETADA'; // For green color
                label = 'cerrada';
            } else {
                status = 'PENDIENTE'; // For yellow color
                label = 'abierta';
            }
        } else {
            return null; // No status to display
        }

        if (!status) return null;

        const config = {
            PENDIENTE: { color: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: <Clock className="w-3 h-3 hidden md:block" /> },
            COMPLETADA: { color: 'bg-green-100 text-green-800 border-green-200', icon: <CheckCircle2 className="w-3 h-3 hidden md:block" /> },
            CANCELADA: { color: 'bg-red-100 text-red-800 border-red-200', icon: <XCircle className="w-3 h-3 hidden md:block" /> },
        };

        const style = config[status] || { color: 'bg-gray-100 text-gray-800', icon: <HelpCircle className="w-3 h-3 hidden md:block" /> };
        return (
            <span className={`flex items-center gap-1.5 w-fit px-2.5 py-0.5 rounded-full text-xs font-medium border ${style.color}`}>
                {style.icon}
                <span className="capitalize">{label}</span>
            </span>
        );
    };

    // --- Logica de ordenamiento --- //
    const sortedGastos = [...gastos].sort((a, b) => {
        if (!sortConfig.key) return 0;

        let aValue, bValue;

        // Obtener valores para columnas calculadas o anidadas
        if (sortConfig.key === 'titulo') {
            aValue = getInfo(a).titulo.toLowerCase();
            bValue = getInfo(b).titulo.toLowerCase();
        } else if (sortConfig.key === 'tipo') {
            aValue = getInfo(a).tipo;
            bValue = getInfo(b).tipo;
        } else {
            aValue = a[sortConfig.key];
            bValue = b[sortConfig.key];
        }

        // Manejo especial para fechas
        if (sortConfig.key === 'activador') {
            aValue = new Date(aValue || 0).getTime();
            bValue = new Date(bValue || 0).getTime();
        }

        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
    });
    const requestSort = (key) => {
        let direction = 'asc';
        console.log('sort:', sortConfig)
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            console.log('entra: ', sortConfig.key)
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    }; 

    console.log(sortedGastos)

    return (
        <div className="overflow-x-auto bg-white rounded-xl border border-gray-200 shadow-sm">
            <table className="w-full text-left border-collapse">
                <thead>

                    <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase text-gray-500 font-semibold">
                        <th className="py-2 px-1 md:p-4 cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => requestSort('fecha')}>
                            <div className="flex items-center gap-1">
                                Fecha
                                <ArrowUpDown className={`w-3 h-3 ${sortConfig.key === 'fecha' ? 'text-primary-600' : 'text-gray-400'}`} />
                            </div>
                        </th>
                        <th className="py-2 px-1 md:p-4 cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => requestSort('descripcion')}>
                            <div className="flex items-center gap-1">
                                Descripción
                                <ArrowUpDown className={`w-3 h-3 ${sortConfig.key === 'descripcion' ? 'text-primary-600' : 'text-gray-400'}`} />
                            </div>
                        </th>
                        <th className="py-2 px-1 md:p-4 cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => requestSort('categoria')}>
                            <div className="flex items-center gap-1">
                                Categoría
                                <ArrowUpDown className={`w-3 h-3 ${sortConfig.key === 'categoria' ? 'text-primary-600' : 'text-gray-400'}`} />
                            </div>
                        </th>
                        <th className="py-2 px-1 md:p-4 cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => requestSort('estado')}>
                            <div className="flex items-center gap-1">
                                Estado
                                <ArrowUpDown className={`w-3 h-3 ${sortConfig.key === 'estado' ? 'text-primary-600' : 'text-gray-400'}`} />
                            </div>
                        </th>
                        <th className="py-2 px-1 md:p-4 cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => requestSort('monto')}>
                            <div className="flex items-center gap-1">
                                Monto
                                <ArrowUpDown className={`w-3 h-3 ${sortConfig.key === 'monto' ? 'text-primary-600' : 'text-gray-400'}`} />
                            </div>
                        </th>
                        <th className="p-4 text-center">Acciones</th>
                    </tr>
                </thead>
                <tbody className="text-sm divide-y divide-gray-100">
                    {sortedGastos.length > 0 ? (
                        sortedGastos.map((gasto) => {
                            const origen = getOrigenLabel(gasto);
                            return (
                                <tr key={gasto.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="p-4 whitespace-nowrap text-gray-600">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-4 h-4 text-gray-400 hidden md:block" />
                                            {formatDate(gasto?.evento?.inicio || gasto?.tarea?.fechaVencimiento || gasto?.listaTarea?.fin)}
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex flex-col">
                                            <span className="font-semibold text-gray-800">{gasto.descripcion || origen.title}</span>
                                            <span className={`text-[10px] mt-1 px-2 py-0.5 rounded-full w-fit font-bold uppercase ${origen.color}`}>
                                                {origen.label}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <span className="flex items-center gap-1.5 text-gray-600">
                                            <Tag className="w-3.5 h-3.5 text-primary-400 hidden md:block" />
                                            {gasto.categoriaGasto?.nombre}
                                        </span>
                                    </td>
                                    <td className="p-2 md:p-4">{getStatusBadge(gasto)}</td>
                                    <td className="p-4 text-right font-bold text-gray-900">
                                        ${Number(gasto.total).toLocaleString()}
                                    </td>
                                    <td className="p-4">
                                        <div className="flex justify-center gap-2">
                                            <button
                                                onClick={() => onViewDetail(gasto)}
                                                className="p-2 hover:bg-gray-100 text-gray-500 rounded-lg transition-colors"
                                                title="Ver detalle"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </button>
                                            {(gasto.eventoId || gasto.tareaId || gasto.listaTareaId) && (
                                                <button
                                                    onClick={() => onNavigateToSource(gasto)}
                                                    className="p-2 hover:bg-primary-50 text-primary-600 rounded-lg transition-colors"
                                                    title="Ir al origen"
                                                >
                                                    <ExternalLink className="w-4 h-4" />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            );
                        })
                    ) : (
                        <tr><td colSpan="5" className="p-10 text-center text-gray-400 italic">No se encontraron gastos para este periodo.</td></tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default GastosTable;
