import React, { useState } from 'react';
import { Calendar, Clock, Trash2, Edit, Bell, ListChecks, ClipboardCheck, Info, ArrowUpDown, Check, CheckCircle, XCircle } from 'lucide-react';
import { formatDate, getDateStatus } from '../../utils/dateFormatter';

const RecordatoriosTable = ({ recordatorios, onEdit, onDelete, onViewDetail }) => {
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });


    const getInfo = (r) => {
        if (r.evento) return { titulo: r.evento.titulo, tipo: 'Evento', color: 'text-blue-600 bg-blue-50', icon: <Calendar className="w-3 h-3 hidden md:block" /> };
        if (r.listaTarea) return { titulo: r.listaTarea.titulo, tipo: 'Lista de tareas', color: 'text-orange-600 bg-orange-50', icon: <ListChecks className="w-3 h-3 hidden md:block" /> };
        if (r.tarea) return { titulo: r.tarea.titulo, tipo: 'Tarea', color: 'text-purple-600 bg-purple-50', icon: <ClipboardCheck className="w-3 h-3 hidden md:block" /> };
        return { titulo: 'Sin título', tipo: 'General', color: 'text-gray-600 bg-gray-50', icon: <Bell className="w-3 h-3 hidden md:block" /> };
    };

    const getStatusStyle = (estado) => {
        const styles = {
            PENDIENTE: {color: 'bg-yellow-100 text-yellow-700 border-yellow-200', icon: <Clock className="w-3 h-3 hidden md:block" /> },
            ENVIADO: {color: 'bg-green-100 text-green-700 border-green-200', icon: <CheckCircle className="w-3 h-3 hidden md:block" />},
            CANCELADO: {color: 'bg-red-100 text-red-700 border-red-200', icon: <XCircle className="w-3 h-3 hidden md:block" />},
            ACTUALIZADO: {color: 'bg-blue-100 text-blue-700 border-blue-200', icon: <CheckCircle className="w-3 h-3 hidden md:block" />}
        };

        const style = styles[estado] || 'bg-gray-100 text-gray-700';
        return (
            <span className={`flex items-center gap-1.5 w-fit px-2.5 py-0.5 rounded-full text-xs font-medium border ${style.color}`}>
                {style.icon}
                <span className="capitalize">{estado}</span>
            </span>
        )
    };

    // --- Logica de ordenamiento --- //
    const sortedRecordatorios = [...recordatorios].sort((a, b) => {
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
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    return (
        <div className="overflow-x-auto bg-white rounded-xl border border-gray-200 shadow-sm">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase text-gray-500 font-semibold">
                        <th className="py-2 px-1 md:p-4 cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => requestSort('titulo')}>
                            <div className="flex items-center gap-1">
                                Título
                                <ArrowUpDown className={`w-3 h-3 ${sortConfig.key === 'titulo' ? 'text-primary-600' : 'text-gray-400'}`} />
                            </div>
                        </th>
                        <th className="py-2 px-1 md:p-4 cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => requestSort('tipo')}>
                            <div className="flex items-center gap-1">
                                Tipo
                                <ArrowUpDown className={`w-3 h-3 ${sortConfig.key === 'tipo' ? 'text-primary-600' : 'text-gray-400'}`} />
                            </div>
                        </th>
                        <th className="py-2 px-1 md:p-4 cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => requestSort('estado')}>
                            <div className="flex items-center gap-1">
                                Estado
                                <ArrowUpDown className={`w-3 h-3 ${sortConfig.key === 'estado' ? 'text-primary-600' : 'text-gray-400'}`} />
                            </div>
                        </th>
                        <th className="py-2 px-1 md:p-4 cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => requestSort('activador')}>
                            <div className="flex items-center gap-1">
                                Fecha aviso
                                <ArrowUpDown className={`w-3 h-3 ${sortConfig.key === 'activador' ? 'text-primary-600' : 'text-gray-400'}`} />
                            </div>
                        </th>
                        <th className="p-2 text-center">Acciones</th>
                    </tr>
                </thead>
                <tbody className="text-sm divide-y divide-gray-100">
                    {sortedRecordatorios.length > 0 ? (
                        sortedRecordatorios.map((r) => {
                            const info = getInfo(r);
                            const statusStyle = getStatusStyle(r.estado);
                            return (
                                <tr key={r.id} className="hover:bg-gray-50 transition-colors group cursor-pointer" onClick={() => onViewDetail(r)}>
                                    <td className="p-2 font-semibold text-gray-800">{info.titulo}</td>
                                    <td className="p-2">
                                        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${info.color}`}>
                                            {info.icon} {info.tipo}
                                        </span>
                                    </td>
                                    <td className="p-2">
                                        <span className={`px-2 py-0.5 `}>
                                        {statusStyle}
                                        </span>
                                    </td>
                                    <td className="p-2 text-gray-600">
                                        <div className="flex flex-col">
                                            <span className="font-medium">{formatDate(r.activador)}</span>
                                            <span className="text-[10px] text-gray-400 flex items-center gap-1">
                                                <Clock className="w-2.5 h-2.5" /> {new Date(r.activador).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="p-2" onClick={(e) => e.stopPropagation()}>
                                        <div className="flex justify-center gap-2">
                                            <button onClick={() => onEdit(r)} className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors">
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button onClick={() => onDelete(r.id)} className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )
                        }
                        )
                    ) : (
                        <tr><td colSpan="5" className="p-8 text-center text-gray-500">No se encontraron recordatorios.</td></tr>
                    )}

                </tbody>
            </table>
        </div>
    );
};

export default RecordatoriosTable;
