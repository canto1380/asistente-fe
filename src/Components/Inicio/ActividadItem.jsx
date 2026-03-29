import { Calendar, ClipboardCheck, ArrowRight, ListChecks } from "lucide-react";
import { getRelativeTime, formatDate } from "../../utils/dateFormatter";
import { useNavigate } from "react-router-dom";

const ActividadItem = ({ actividad }) => {
    const navigate = useNavigate();

    // Lógica para diferenciar el tipo de actividad
    // - `tipoPeriodo` es único de ListaTarea.
    // - `inicio` existe en Evento y ListaTarea.
    // - `fechaVencimiento` es de Tarea.
    const isLista = 'tipoPeriodo' in actividad;
    const isEvent = !isLista && 'inicio' in actividad;
    const isTarea = !isLista && !isEvent;


    const date = isEvent ? actividad.inicio : isLista ? actividad.fin : actividad.fechaVencimiento;

    const relativeTime = getRelativeTime(date);
    const formattedDate = formatDate(date);

    const isOverdue = new Date(date) < new Date() && !relativeTime.includes('hoy');

    const handleNavigate = () => {
        // Redirigir a la página correspondiente
        navigate(isEvent ? '/eventos' : '/tareas'); // Tanto Tarea como ListaTarea van a /tareas
    };

    return (
        <div className="flex items-start gap-4 p-3 hover:bg-gray-50 rounded-lg border border-transparent hover:border-gray-100 transition-all">
            <div className={`p-2 rounded-full mt-1 ${isEvent ? 'bg-blue-100 text-blue-600' : isLista ? 'bg-orange-100 text-orange-600' : 'bg-purple-100 text-purple-600'}`}>
                {isEvent ? <Calendar className="w-5 h-5" title='Evento'/> : isLista ? <ListChecks className="w-5 h-5" title='lista de tareas' /> : <ClipboardCheck className="w-5 h-5" title='tarea' />}
            </div>
            <div className="flex-grow">
                <span className="font-semibold text-gray-800 text-sm">{actividad.titulo}</span>
                <span className="text-xs text-gray-400"> • </span>
                <span className="text-xs text-gray-500 font-medium">
                {isEvent ? 'Evento' : isLista ? 'Lista de tareas' : 'Tarea'}
                </span>
                {actividad.descripcion && (
                    <p className="text-xs text-gray-600 mt-1 truncate" title={actividad.descripcion}>
                        {actividad.descripcion}
                    </p>
                )}
                {relativeTime && (
                    <div className="flex items-center gap-2 mt-2">
                        <p className={`text-xs font-medium ${isOverdue ? 'text-red-600' : 'text-gray-500'}`}>
                            {relativeTime}
                        </p>
                        <span className="text-xs text-gray-400">•</span>
                        <p className="text-xs text-gray-500">{formattedDate}</p>
                    </div>

                )}
            </div>
            <button
                onClick={handleNavigate}
                className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-full transition-colors self-center"
            >
                <ArrowRight className="w-5 h-5" />
            </button>
        </div>
    );
};

export default ActividadItem;
