import { Eye, ExternalLink, Calendar, Tag, Clock, CheckCircle2, XCircle, HelpCircle } from 'lucide-react';
import { formatDate } from '../../utils/dateFormatter';

const GastosTable = ({ gastos, onViewDetail, onNavigateToSource }) => {
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
    return (
        <div className="overflow-x-auto bg-white rounded-xl border border-gray-200 shadow-sm">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-gray-50 border-b border-gray-200 text-[10px] uppercase text-gray-500 font-bold">
                        <th className="p-4">Fecha</th>
                        <th className="p-4">Descripción / Origen</th>
                        <th className="p-4">Categoría</th>
                        <th className="p-4">Estado</th>
                        <th className="p-4 text-right">Monto</th>
                        <th className="p-4 text-center">Acciones</th>
                    </tr>
                </thead>
                <tbody className="text-sm divide-y divide-gray-100">
                    {gastos.length > 0 ? (
                        gastos.map((gasto) => {
                            const origen = getOrigenLabel(gasto);
                            return (
                                <tr key={gasto.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="p-4 whitespace-nowrap text-gray-600">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-4 h-4 text-gray-400" />
                                            {formatDate(gasto.fecha)}
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
                                            <Tag className="w-3.5 h-3.5 text-primary-400" />
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
