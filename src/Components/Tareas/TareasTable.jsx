import { useState } from "react"
import { ArrowUpDown, Calendar, Edit, Trash2, Clock, CheckCircle2, XCircle, HelpCircle, CircleCheck, Ban, DollarSign } from 'lucide-react';
import { formatDate, getDateStatus } from '../../utils/dateFormatter';

const TareasTable = ({ tareas, onEdit, onDelete, onToggleStatus, bandListaTareas }) => {
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' })

    // -- Logica de ordenamiento -- //
    const sortedTareas = [...tareas].sort((a, b) => {
        if (!sortConfig.key) return 0

        let aValue = a[sortConfig.key]
        let bValue = b[sortConfig.key]

        // -- Manejo especial para fechas -- //
        if (sortConfig.key === 'fechaVencimiento') {
            aValue = new Date(aValue || 0).getTime()
            bValue = new Date(bValue || 0).getTime()
        }

        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1
        return 0
    })

    const requestSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    // --- Badges Visuales --- //
    const getStatusBadge = (status) => {
        const config = {
            PENDIENTE: { color: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: <Clock className="w-3 h-3 hidden md:block" /> },
            COMPLETADA: { color: 'bg-green-100 text-green-800 border-green-200', icon: <CheckCircle2 className="w-3 h-3 hidden md:block" /> },
            CANCELADA: { color: 'bg-red-100 text-red-800 border-red-200', icon: <XCircle className="w-3 h-3 hidden md:block" /> },
        };

        const style = config[status] || { color: 'bg-gray-100 text-gray-800', icon: <HelpCircle className="w-3 h-3 hidden md:block" /> };

        return (
            <span className={`flex items-center gap-1.5 w-fit px-2.5 py-0.5 rounded-full text-xs font-medium border ${style.color}`}>
                {style.icon}
                <span className="capitalize">{status?.toLowerCase()}</span>
            </span>
        );
    };
    const getPriorityBadge = (priority) => {
        const styles = {
            BAJA: 'bg-slate-100 text-slate-600 border-slate-200',
            MEDIA: 'bg-yellow-100 text-yellow-600 border-yellow-200',
            ALTA: 'bg-red-50 text-red-600 border-red-200',
        };
        return (
            <span className={`px-2 py-0.5 rounded text-xs font-semibold border ${styles[priority] || 'bg-gray-100'}`}>
                {priority}
            </span>
        );
    };

    return (
        <div className="overflow-x-auto bg-white rounded-lg shadow-sm border border-gray-200 mt-2">
            <table className="w-full text-left border-collapse table-auto">
                <thead>
                    <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase text-gray-500 font-semibold">
                        <th className="p-3 cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => requestSort('titulo')}>
                            <div className="flex items-center gap-1">Título <ArrowUpDown className="w-3 h-3 text-gray-400" /></div>
                        </th>
                        {!bandListaTareas && (
                            <th className="p-3 cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => requestSort('fechaVencimiento')}>
                                <div className="flex items-center gap-1">Vencimiento <ArrowUpDown className="w-3 h-3 text-gray-400" /></div>
                            </th>
                        )}
                        <th className="p-3 cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => requestSort('estado')}>
                            <div className="flex items-center gap-1">Estado <ArrowUpDown className="w-3 h-3 text-gray-400" /></div>
                        </th>
                        <th className="p-3 cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => requestSort('prioridad')}>
                            <div className="flex items-center gap-1">Prioridad <ArrowUpDown className="w-3 h-3 text-gray-400" /></div>
                        </th>
                        <th className="p-3 cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => requestSort('gasto')}>
                            <div className="flex items-center gap-1">Gasto <ArrowUpDown className="w-3 h-3 text-gray-400" /></div>
                        </th>
                        <th className="p-3 text-right">Acciones</th>
                    </tr>
                </thead>
                <tbody className="text-xs text-gray-700 divide-y divide-gray-100">
                    {sortedTareas.length > 0 ? (
                        sortedTareas.map((tarea) => (
                            (() => {
                                const status = getDateStatus(tarea.fechaVencimiento);
                                return (
                                    <tr key={tarea.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="p-3 font-medium text-gray-900">{tarea.titulo}</td>
                                        {!bandListaTareas && (
                                            <td className="p-3">
                                                {tarea.fechaVencimiento ? (
                                                    <span className={`flex items-center gap-1 font-medium ${status?.color}`}><Calendar className="w-3 h-3" /> {formatDate(tarea.fechaVencimiento)}</span>
                                                ) : '-'}
                                            </td>
                                        )}
                                        <td className="p-3">{getStatusBadge(tarea.estado)}</td>
                                        <td className="p-3">{getPriorityBadge(tarea.prioridad)}</td>
                                        <td className="p-3">
                                            {tarea.gasto > 0 ? (
                                                <span className="flex items-center gap-1 text-gray-600 font-medium"><DollarSign className="w-3 h-3 text-green-600" /> {tarea.gasto}</span>
                                            ) : '-'}
                                        </td>
                                        <td className="p-3 text-right">
                                            <div className="flex items-center justify-end gap-1 md:gap-2">
                                                <button onClick={() => onEdit && onEdit(tarea)} className="p-1.5 hover:bg-blue-50 text-blue-600 rounded transition-colors" title="Editar"><Edit className="w-4 h-4" /></button>
                                                <button onClick={() => onDelete && onDelete(tarea)} className="p-1.5 hover:bg-red-50 text-red-600 rounded transition-colors" title="Eliminar"><Trash2 className="w-4 h-4" /></button>
                                                <button onClick={() => onToggleStatus && onToggleStatus(tarea)} className={`p-1.5 rounded transition-colors ${tarea.estado === 'COMPLETADA' || tarea.estado === 'CANCELADA' ? 'hover:bg-gray-100 text-gray-400' : 'hover:bg-green-50 text-green-600'}`} title="Cambiar Estado">
                                                    {tarea.estado === 'COMPLETADA' ? <Ban className="w-4 h-4" /> : <CircleCheck className="w-4 h-4" />}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })()
                        ))
                    ) : (
                        <tr><td colSpan="6" className="p-8 text-center text-gray-500">No hay tareas para mostrar.</td></tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default TareasTable;