import { FileText } from "lucide-react";
import ActividadItem from "./ActividadItem";

const ListaActividades = ({ actividades, loading }) => {
    return (
        <div className="bg-white p-6 rounded-lg border border-gray-200 h-full">
            <h3 className="font-bold text-gray-800 mb-4">Próximas Actividades y Vencimientos</h3>
            {loading ? (
                <p className="text-sm text-gray-500">Cargando actividades...</p>
            ) : actividades.length > 0 ? (
                <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
                    {actividades.map(act => (
                        <ActividadItem key={`${'inicio' in act ? 'evt' : 'tsk'}-${act.id}`} actividad={act} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-lg">
                    <FileText className="w-10 h-10 mx-auto text-gray-300" />
                    <p className="mt-2 text-sm font-medium text-gray-500">¡Todo al día!</p>
                    <p className="text-xs text-gray-400">No tienes eventos o tareas pendientes.</p>
                </div>
            )}
        </div>
    );
};

export default ListaActividades;
