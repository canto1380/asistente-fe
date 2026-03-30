import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Search, ChevronDown, ChevronUp } from "lucide-react";
import FilterBar from "../Components/Filter/FilterBar";
import PageHeader from "../Components/HeaderPage/PageHeader";
import ResumenGastos from "../Components/Gastos/ResumenGastos";
import GastosTable from "../Components/Gastos/GastosTable";
import GastoDetailView from "../Components/Gastos/GastoDetailView";
import Modal from "../Components/Modal/Modal";
import { getRequest } from "../api/apiRequest";
import { useAlert } from "../context/alertContext";
import GastosCharts from "../Components/Gastos/GastosChart";

const GastosPage = () => {
    const navigate = useNavigate();
    const { showAlert } = useAlert();

    // Inicializamos con el mes actual (del 1 al último día)
    const now = new Date();
    const [mes, setMes] = useState(now.getMonth() + 1);
    const [anio, setAnio] = useState(now.getFullYear());

    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];
    const [desde, setDesde] = useState(firstDay);
    const [hasta, setHasta] = useState(lastDay);

    const [categorias, setCategorias] = useState([])
    const [categoriaSelected, setCategoriaSelected] = useState("")
    const [search, setSearch] = useState("");
    const [reporte, setReporte] = useState({ total: 0, detalles: [] });
    const [loading, setLoading] = useState(true);
    const [isExpanded, setIsExpanded] = useState(true);
    const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'desc' });

    const [selectedGasto, setSelectedGasto] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);


    const fetchCategoriaGasto = async () => {
        setLoading(true)
        try {
            const { data } = await getRequest('categoria-gasto');
            setCategorias(data);
        } catch (error) {
            showAlert("Error al cargar las categorías de gastos", "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategoriaGasto();
    }, []);

    const fetchReporte = async () => {
        setLoading(true);
        try {
            // Evitamos enviar el parámetro si no hay una categoría seleccionada
            let url = `gastos/mensual?mes=${mes}&anio=${anio}`;
            if (categoriaSelected) {
                url += `&categoriaGasto=${categoriaSelected}`;
            }
            const { data } = await getRequest(url);
            setReporte(data);
        } catch (error) {
            showAlert("Error al cargar el reporte de gastos", "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReporte();
    }, [mes, anio, categoriaSelected]);

    const filteredGastos = reporte.detalles.filter(g =>
        g.descripcion?.toLowerCase().includes(search.toLowerCase()) ||
        g.categoriaGasto?.nombre?.toLowerCase().includes(search.toLowerCase()) ||
        g.evento?.titulo?.toLowerCase().includes(search.toLowerCase()) ||
        g.tarea?.titulo?.toLowerCase().includes(search.toLowerCase())
    );

    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const sortedGastos = useMemo(() => {
        const items = [...filteredGastos];
        if (!sortConfig.key) return items;

        return items.sort((a, b) => {
            let aValue = a[sortConfig.key];
            let bValue = b[sortConfig.key];

            // Lógica para campos especiales o anidados
            if (sortConfig.key === 'categoria') {
                aValue = a.categoriaGasto?.nombre || '';
                bValue = b.categoriaGasto?.nombre || '';
            } else if (sortConfig.key === 'total') {
                aValue = Number(aValue);
                bValue = Number(bValue);
            } else if (sortConfig.key === 'createdAt' || sortConfig.key === 'fecha') {
                aValue = new Date(aValue).getTime();
                bValue = new Date(bValue).getTime();
            }

            if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
            if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
            return 0;
        });
    }, [filteredGastos, sortConfig]);

    const handleNavigate = (gasto) => {
        if (gasto.eventoId) navigate('/eventos');
        else if (gasto.tareaId || gasto.listaTareaId) navigate('/tareas');
    };

    const displayMonth = new Date(desde).getMonth(); // 0-indexed
    const meses = [
        "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
        "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];

    return (
        <div className="space-y-6 pb-20">
            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="animate-pulse text-gray-400 font-medium">Cargando reporte...</div>
                </div>
            ) : (
                <>
                    <PageHeader title="Panel de Gastos" />

                    <FilterBar search={search} handleSearch={(e) => setSearch(e.target.value)}>
                        <select
                            value={categoriaSelected}
                            onChange={(e) => setCategoriaSelected(e.target.value)}
                            className="w-full md:w-40 px-3 py-2 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-primary-500 outline-none"
                        >
                            <option value="">Todos las categorias</option>
                            {categorias && categorias.map((cat) => (
                                <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                            ))}
                        </select>
                        <select
                            value={mes}
                            onChange={(e) => setMes(Number(e.target.value))}
                            className="w-full md:w-40 px-3 py-2 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-primary-500 outline-none"
                        >
                            {meses.map((m, idx) => (
                                <option key={idx} value={idx + 1}>{m}</option>
                            ))}
                        </select>
                        <input
                            type="number"
                            value={anio}
                            onChange={(e) => setAnio(Number(e.target.value))}
                            className="w-full md:w-28 px-3 py-2 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-primary-500 outline-none"
                            placeholder="Año"
                        />
                        {/* <div className="flex flex-col md:flex-row gap-2 items-center">
                    <span className="text-xs text-gray-500 font-bold">DESDE</span>
                    <input 
                        type="date" 
                        value={desde} 
                        onChange={(e) => setDesde(e.target.value)}
                        className="w-full md:w-40 px-3 py-2 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-primary-500 outline-none"
                    />
                    <span className="text-xs text-gray-500 font-bold">HASTA</span>
                    <input 
                        type="date" 
                        value={hasta} 
                        onChange={(e) => setHasta(e.target.value)}
                        className="w-full md:w-40 px-3 py-2 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-primary-500 outline-none"
                    />
                </div> */}
                    </FilterBar>
                    <div className="space-y-4">
                        {/* Resumen Colapsable */}

                        {/* Gráficos Estadísticos */}
                        <GastosCharts gastos={reporte.detalles} />

                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                            <div
                                className="cursor-pointer hover:bg-gray-50 transition-colors"
                                onClick={() => setIsExpanded(!isExpanded)}
                            >
                                <ResumenGastos
                                    total={reporte.total}
                                    mes={mes} // Pasa el mes 1-indexado
                                    anio={anio}
                                />
                                <div className="flex justify-center pb-2 text-gray-400">
                                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                                </div>
                            </div>

                            {isExpanded && (
                                <div className="p-4 border-t border-gray-50 bg-white">
                                    <div className="flex justify-between items-center mb-4 px-2">
                                        <h3 className="text-sm font-bold text-gray-700 uppercase tracking-tight">
                                            Desglose de Gastos - {meses[displayMonth]}
                                        </h3>
                                        <span>
                                            {filteredGastos.length} REGISTROS
                                        </span>
                                    </div>
                                    <GastosTable
                                        gastos={sortedGastos}
                                        sortConfig={sortConfig}
                                        onSort={handleSort}
                                        onViewDetail={(g) => { setSelectedGasto(g); setIsModalOpen(true); }}
                                        onNavigateToSource={handleNavigate}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </>
            )}
            <Modal
                isOpen={isModalOpen}
                onClose={() => { setIsModalOpen(false); setSelectedGasto(null); }}
                title="Detalle del Gasto"
            >
                <GastoDetailView gasto={selectedGasto} />
            </Modal>
        </div>
    );
};

export default GastosPage;