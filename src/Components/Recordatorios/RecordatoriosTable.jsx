import React from 'react';
import { Calendar, Clock, Trash2, Edit, Bell, ListChecks, ClipboardCheck, Info } from 'lucide-react';
import { formatDate, getDateStatus } from '../../utils/dateFormatter';

const RecordatoriosTable = ({ recordatorios, onEdit, onDelete, onViewDetail }) => {
    const getInfo = (r) => {
        if (r.evento) return { titulo: r.evento.titulo, tipo: 'Evento', color: 'text-blue-600 bg-blue-50', icon: <Calendar className="w-3 h-3" /> };
        if (r.listaTarea) return { titulo: r.listaTarea.titulo, tipo: 'Lista de tareas', color: 'text-orange-600 bg-orange-50', icon: <ListChecks className="w-3 h-3" /> };
        if (r.tarea) return { titulo: r.tarea.titulo, tipo: 'Tarea', color: 'text-purple-600 bg-purple-50', icon: <ClipboardCheck className="w-3 h-3" /> };
        return { titulo: 'Sin título', tipo: 'General', color: 'text-gray-600 bg-gray-50', icon: <Bell className="w-3 h-3" /> };
    };

    const getStatusStyle = (estado) => {
        const styles = {
            PENDIENTE: 'bg-yellow-100 text-yellow-700 border-yellow-200',
            ENVIADO: 'bg-green-100 text-green-700 border-green-200',
            CANCELADO: 'bg-red-100 text-red-700 border-red-200',
            ACTUALIZADO: 'bg-blue-100 text-blue-700 border-blue-200'
        };
        return styles[estado] || 'bg-gray-100 text-gray-700';
    };

    return (
        <div className="overflow-x-auto bg-white rounded-xl border border-gray-200 shadow-sm">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-gray-50 border-b border-gray-200 text-[10px] uppercase text-gray-500 font-bold">
                        <th className="p-4">Título</th>
                        <th className="p-4">Tipo</th>
                        <th className="p-4">Estado</th>
                        <th className="p-4">Fecha Aviso</th>
                        <th className="p-4 text-center">Acciones</th>
                    </tr>
                </thead>
                <tbody className="text-sm divide-y divide-gray-100">
                    {recordatorios.map((r) => {
                        const info = getInfo(r);
                        const statusStyle = getStatusStyle(r.estado);
                        return (
                            <tr key={r.id} className="hover:bg-gray-50 transition-colors group cursor-pointer" onClick={() => onViewDetail(r)}>
                                <td className="p-4 font-semibold text-gray-800">{info.titulo}</td>
                                <td className="p-4">
                                    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${info.color}`}>
                                        {info.icon} {info.tipo}
                                    </span>
                                </td>
                                <td className="p-4">
                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border uppercase ${statusStyle}`}>
                                        {r.estado}
                                    </span>
                                </td>
                                <td className="p-4 text-gray-600">
                                    <div className="flex flex-col">
                                        <span className="font-medium">{formatDate(r.activador)}</span>
                                        <span className="text-[10px] text-gray-400 flex items-center gap-1">
                                            <Clock className="w-2.5 h-2.5" /> {new Date(r.activador).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                </td>
                                <td className="p-4" onClick={(e) => e.stopPropagation()}>
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
                        );
                    })}
                    {recordatorios.length === 0 && (
                        <tr><td colSpan="5" className="p-10 text-center text-gray-400 italic">No hay recordatorios que coincidan con los filtros.</td></tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default RecordatoriosTable;
