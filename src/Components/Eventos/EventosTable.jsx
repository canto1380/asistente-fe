import { useState } from 'react';
import { ArrowUpDown, Calendar, Edit, Trash2, Clock, CheckCircle2, XCircle, AlertCircle, HelpCircle, Ban, CircleCheck } from 'lucide-react';
import { formatDate } from '../../utils/dateFormatter';

const EventosTable = ({ eventos, onEdit, onDelete, onToggleStatus }) => {
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

    // --- Lógica de Ordenamiento ---
    const sortedEventos = [...eventos].sort((a, b) => {
        if (!sortConfig.key) return 0;

        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

        // Manejo especial para fechas
        if (sortConfig.key === 'inicio') {
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

    // --- Badges Visuales ---
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
        <div className="overflow-x-auto bg-white rounded-lg shadow-sm border border-gray-200 mt-4">
            <table className="w-full text-left border-collapse table-auto"> {/* Added table-auto for better column width distribution */}
                <thead>
                    <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase text-gray-500 font-semibold">
                        <th className="py-2 px-1 md:p-4 cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => requestSort('titulo')}>
                            <div className="flex items-center gap-1">
                                Título
                                <ArrowUpDown className={`w-3 h-3 ${sortConfig.key === 'titulo' ? 'text-primary-600' : 'text-gray-400'}`} />
                            </div>
                        </th>
                        <th className="py-2 px-1 md:p-4 cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => requestSort('inicio')}>
                            <div className="flex items-center gap-1">
                                Inicio
                                <ArrowUpDown className={`w-3 h-3 ${sortConfig.key === 'inicio' ? 'text-primary-600' : 'text-gray-400'}`} />
                            </div>
                        </th>
                        <th className="py-2 px-1 md:p-4 cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => requestSort('estado')}>
                            <div className="flex items-center gap-1">
                                Estado
                                <ArrowUpDown className={`w-3 h-3 ${sortConfig.key === 'estado' ? 'text-primary-600' : 'text-gray-400'}`} />
                            </div>
                        </th>
                        <th className="py-2 px-1 md:p-4 cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => requestSort('prioridad')}>
                            <div className="flex items-center gap-1">
                                Prioridad
                                <ArrowUpDown className={`w-3 h-3 ${sortConfig.key === 'prioridad' ? 'text-primary-600' : 'text-gray-400'}`} />
                            </div>
                        </th>
                        <th className="py-2 px-1 md:p-4 text-right">Acciones</th>
                    </tr>
                </thead>
                <tbody className="text-xs text-gray-700 divide-y divide-gray-100">
                    {sortedEventos.length > 0 ? (
                        sortedEventos.map((evento) => (
                            <tr key={evento.id} className="hover:bg-gray-50 transition-colors">
                                <td className="p-2 md:p-4 font-medium text-gray-900">{evento.titulo}</td>
                                <td className="p-2 md:p-4">
                                    <div className="flex flex-col">
                                        <span className="flex items-center gap-1"><Calendar className="w-3 h-3 text-gray-400 hidden md:block" /> {formatDate(evento.inicio)}</span>
                                        {evento.hora && <span className="text-xs text-gray-500 pl-4">{evento.hora} hs</span>}
                                    </div>
                                </td>
                                <td className="p-2 md:p-4">{getStatusBadge(evento.estado)}</td>
                                <td className="p-2 md:p-4">{getPriorityBadge(evento.prioridad)}</td>
                                <td className="p-2 md:p-4 text-right">
                                    <div className="flex items-center justify-end gap-1 md:gap-2">
                                        <button onClick={() => onEdit && onEdit(evento)} className="p-1 hover:bg-blue-50 text-blue-600 rounded transition-colors" title="Editar"><Edit className="w-4 h-4" /></button>
                                        <button onClick={() => onDelete && onDelete(evento)} className="p-1 hover:bg-red-50 text-red-600 rounded transition-colors" title="Eliminar"><Trash2 className="w-4 h-4" /></button>

                                        <button
                                            onClick={() => onToggleStatus && onToggleStatus(evento)}
                                            className={`${!evento.activo ? 'text-emerald-600 hover:text-emerald-800 hover:bg-emerald-50' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'} p-1.5 rounded-md transition-colors`}
                                            title={!evento.activo ? "Abrir" : "Cerrar"}
                                        >
                                            {!evento.activo ? (
                                                <CircleCheck className='w-4 h-4' />
                                            ) : (
                                                <Ban className="w-4 h-4" />
                                            )}
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr><td colSpan="5" className="p-8 text-center text-gray-500">No se encontraron eventos.</td></tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};
export default EventosTable;
