import { useState } from 'react';
import { ChevronDown, ChevronRight, Edit, Trash2, DollarSign, Calendar } from 'lucide-react';
import TareasTable from '../Tareas/TareasTable';
import { formatDate, getDateStatus } from '../../utils/dateFormatter';

const ListaTareasItem = ({ lista, tareas, onEditList, onDeleteList, onEditTarea, onDeleteTarea, onToggleStatusTarea }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const getVencimientoLista = () => {
        if (lista.tipoPeriodo === 'MENSUAL' && lista.anio && lista.mes) {
            return lista.fin
        }
        if (lista.tipoPeriodo === 'SEMANAL') {
            const created = new Date(lista.inicio);
            const day = created.getUTCDay(); // 0=Dom, 6=Sáb
            const diff = (7 - day) % 7;
            const nextSunday = new Date(created);
            nextSunday.setUTCDate(created.getUTCDate() + diff);
            return nextSunday.toISOString();
        }
        if (lista.tipoPeriodo === 'CUSTOM') {
            return lista.fin;
        }
        return null;
    };

    const vencimientoIso = getVencimientoLista();
    const vencimientoDisplay = formatDate(vencimientoIso);
    const status = getDateStatus(vencimientoIso);

    return (
        <div className="border border-gray-200 rounded-lg mb-4 overflow-hidden shadow-sm bg-white transition-all hover:shadow-md">
            {/* Encabezado de la Lista (Clickeable para expandir) */}
            <div className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-gray-50 cursor-pointer select-none" onClick={() => setIsExpanded(!isExpanded)}>
                <div className="flex items-center gap-3">
                    <div className="text-gray-400">
                        {isExpanded ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-800 text-lg">{lista.titulo}</h3>
                        <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                            <span className="bg-white border border-gray-200 px-2 py-0.5 rounded-full">{tareas.length} tareas</span>
                            <span className="uppercase tracking-wider">{lista.tipoPeriodo}</span>
                            {vencimientoIso && (
                                <span className={`flex items-center gap-2 border px-2 py-0.5 rounded-full ${status.bg} ${status.color}`}>
                                    <Calendar className="w-3 h-3" />
                                    <span className="font-medium">{vencimientoDisplay}</span>
                                    <span className="border-l border-current pl-2 opacity-80 font-bold text-[10px] uppercase">{status.text}</span>
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-4 mt-3 md:mt-0 pl-8 md:pl-0">
                    <div className="text-right flex flex-col md:items-end">
                        <span className="flex items-center font-bold text-gray-700"><DollarSign className="w-3 h-3 mr-0.5" />{lista.gastoTotal || 0}</span>
                        <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${tareas.length === 0 ? 'bg-gray-100 text-gray-500' : lista.estado ? 'bg-green-100 text-green-700' : 'bg-red-200 text-red-400'}`}>
                            {tareas.length === 0 ? 'Sin tareas' : lista.estado ? 'Completa' : 'Hay pendientes'}
                        </span>
                    </div>
                    <div className="flex items-center gap-1 border-l border-gray-300 pl-4 ml-2" onClick={(e) => e.stopPropagation()}>
                        <button onClick={() => onEditList(lista)} className="p-2 hover:bg-blue-50 text-blue-600 rounded-full transition-colors" title="Editar Lista"><Edit className="w-4 h-4" /></button>
                        <button onClick={() => onDeleteList(lista)} className="p-2 hover:bg-red-50 text-red-600 rounded-full transition-colors" title="Eliminar Lista"><Trash2 className="w-4 h-4" /></button>
                    </div>
                </div>
            </div>

            {/* Cuerpo desplegable (Tabla de Tareas) */}
            {isExpanded && (
                <div className="p-2 md:p-4 border-t border-gray-200 bg-white animation-fade-in">
                    <TareasTable tareas={tareas} onEdit={onEditTarea} onDelete={onDeleteTarea} onToggleStatus={onToggleStatusTarea} bandListaTareas={true} />
                </div>
            )}
        </div>
    );
};

const ListaTareasList = ({ listas, tareas, ...actions }) => {
    if (!listas || listas.length === 0) {
        return (
            <div className="p-8 text-center text-gray-500 bg-white border border-gray-200 rounded-lg">
                No hay listas de tareas para mostrar.
            </div>
        );
    }

    return <div className="space-y-4">
        {
            listas
                .sort((a, b) => new Date(a.fin) - new Date(b.fin))
                .map(lista => <ListaTareasItem key={lista.id} lista={lista} tareas={tareas.filter(t => t.listaTareaId === lista.id)} {...actions} />)}

        </div>;
};
export default ListaTareasList;
