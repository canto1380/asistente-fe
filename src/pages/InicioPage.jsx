import { useEffect, useState } from "react";
import { getRequest } from "../api/apiRequest";
import PageHeader from "../Components/HeaderPage/PageHeader";
import ResumenGastos from "../Components/Gastos/ResumenGastos";
import ListaActividades from "../Components/Inicio/ListaActividades";
import { useAuth } from "../context/AuthContext";

const InicioPage = () => {
    const [resumen, setResumen] = useState({ total: 0, mes: 0, anio: 0 });
    const [actividades, setActividades] = useState([]);
    const [currentDate, setCurrentDate] = useState('');
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        const timer = setInterval(() => {
            const now = new Date();
            const datePart = now.toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' });
            const timePart = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
            setCurrentDate(`${datePart} | ${timePart}`);
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        const fetchDashboardData = async () => {
            setLoading(true);
            try {
                // 1. Fetch de gastos del mes actual
                const now = new Date();
                const mes = now.getMonth() + 1;
                const anio = now.getFullYear();
                const gastosResponse = await getRequest(`gastos/mensual?mes=${mes}&anio=${anio}`);
                setResumen({
                    total: gastosResponse.data.total,
                    mes: mes,
                    anio: anio,
                });

                // 2. Fetch de eventos y tareas pendientes
                const [eventosResponse, tareasResponse, listaTareaResponse] = await Promise.all([
                    getRequest('eventos'),
                    getRequest('tareas'),
                    getRequest('listas-tareas')
                ]);
                const eventosPendientes = eventosResponse.data.filter(evento => evento.estado === 'PENDIENTE');
                const tareasPendientes = tareasResponse.data.filter(tarea => tarea.estado === 'PENDIENTE' && tarea.listaTareaId === null);
                const listasTareas = listaTareaResponse.data.filter(listaTarea => listaTarea.estado === false);

                // 3. Combinar, ordenar y guardar
                const todasLasActividades = [...eventosPendientes, ...tareasPendientes, ...listasTareas];
                todasLasActividades.sort((a, b) => {
                    const dateA = new Date('inicio' in a ? a.inicio : a.fechaVencimiento);
                    const dateB = new Date('inicio' in b ? b.inicio : b.fechaVencimiento);
                    return dateA - dateB;
                });

                setActividades(todasLasActividades);

            } catch (error) {
                console.error("Error al cargar el dashboard:", error);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchDashboardData();
        }
    }, [user]);
    return (
        <div>
            <PageHeader title={`¡Hola, ${user?.nombre}!`} subtitle={currentDate} />

            <div className="flex flex-col gap-6">
                {/* Resumen de gastos arriba */}
                <div className="w-full">
                    <ResumenGastos total={resumen.total} mes={resumen.mes} anio={resumen.anio} btnIrPanel={true} />
                </div>

                {/* Lista de actividades abajo */}
                <div className="w-full">
                    <ListaActividades actividades={actividades} loading={loading} />
                </div>
            </div>
        </div>
    )
}

export default InicioPage;