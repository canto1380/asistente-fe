import { useEffect, useState } from "react";
import { useAlert } from "../../context/alertContext";
import { Clock } from "lucide-react";
import { TIPOPERIODO } from "../../utils/constants";
import { getRequest } from "../../api/apiRequest";
import Tooltip from "../Tooltip/Tooltip";
import { formatDate } from "../../utils/dateFormatter";

const ListaTareaForm = ({ initialData, onSubmit, onCancel, isSubmitting }) => {
    const [formData, setFormData] = useState({
        titulo: '',
        descripcion: '',
        tipoPeriodo: '',
        categoriaGastoId: '',
        estado: false,
        mes: '',
        anio: '',
        inicio: '',
        fin: '',
        horaRecordatorio: '15:00'
    });

    const [categoriasGasto, setCategoriasGasto] = useState([]);
    const [fechaFin, setFechaFin] = useState(undefined)
    const { showAlert } = useAlert();

    useEffect(() => {
        let dateCalc = '';
        if (formData.tipoPeriodo === 'SEMANAL' && formData.inicio) {
            const start = new Date(formData.inicio);
            if (!isNaN(start.getTime())) {
                const day = start.getUTCDay();
                const diff = (7 - day) % 7;
                const nextSunday = new Date(start);
                nextSunday.setUTCDate(start.getUTCDate() + diff);
                dateCalc = nextSunday.toISOString().split('T')[0];
            }
        } else if (formData.tipoPeriodo === 'MENSUAL' && formData.mes && formData.anio) {
            // Calculamos el último día del mes seleccionado
            const lastDay = new Date(formData.anio, formData.mes, 0);
            if (!isNaN(lastDay.getTime())) {
                const yyyy = lastDay.getFullYear();
                const mm = String(lastDay.getMonth() + 1).padStart(2, '0');
                const dd = String(lastDay.getDate()).padStart(2, '0');
                dateCalc = `${yyyy}-${mm}-${dd}`;
            }
        } else if (formData.tipoPeriodo === 'CUSTOM' && formData.fin) {
            dateCalc = formData.fin;
        }
        setFechaFin(dateCalc);
    }, [formData.tipoPeriodo, formData.inicio, formData.mes, formData.anio, formData.fin])

    useEffect(() => {
        const fetchCategorias = async () => {
            try {
                const { data } = await getRequest('categoria-gasto');
                setCategoriasGasto(data);
            } catch (error) {
                showAlert('No se pudieron cargar las categorías de gasto.', 'error');
            }
        };
        fetchCategorias();
    }, [showAlert]);

    useEffect(() => {
        if (initialData) {
            setFormData({
                titulo: initialData.titulo || '',
                descripcion: initialData.descripcion || '',
                tipoPeriodo: initialData.tipoPeriodo || 'CUSTOM',
                categoriaGastoId: initialData.categoriaGastoId || '',
                estado: initialData.estado || false,
                mes: Number(initialData.mes) || null,
                anio: Number(initialData.anio) || null,
                inicio: initialData.inicio ? initialData.inicio.split('T')[0] : null,
                fin: initialData.fin ? initialData.fin.split('T')[0] : null,
                horaRecordatorio: '15:00', // Default al editar
            });
        } else {
            setFormData({
                titulo: '',
                descripcion: '',
                tipoPeriodo: 'CUSTOM',
                categoriaGastoId: '',
                estado: false,
                mes: null,
                anio: null,
                inicio: null,
                fin: null,
                horaRecordatorio: '15:00'
            });
        }
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.categoriaGastoId) {
            showAlert('Toda lista de tareas debe tener una categoría de gasto asociada.', 'warning');
            return;
        }
        onSubmit(formData);
    };

    const meses = [
        { value: 1, label: 'Enero' }, { value: 2, label: 'Febrero' }, { value: 3, label: 'Marzo' },
        { value: 4, label: 'Abril' }, { value: 5, label: 'Mayo' }, { value: 6, label: 'Junio' },
        { value: 7, label: 'Julio' }, { value: 8, label: 'Agosto' }, { value: 9, label: 'Septiembre' },
        { value: 10, label: 'Octubre' }, { value: 11, label: 'Noviembre' }, { value: 12, label: 'Diciembre' }
    ];

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                    <label htmlFor="titulo" className="block text-sm font-medium text-gray-700">Título de la Lista</label>
                    <input type="text" name="titulo" id="titulo" value={formData.titulo} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm" />
                </div>

                <div className="md:col-span-2">
                    <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700">Descripción</label>
                    <textarea name="descripcion" id="descripcion" value={formData.descripcion} onChange={handleChange} rows="2" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"></textarea>
                </div>

                <div>
                    <label htmlFor="categoriaGastoId" className="block text-sm font-medium text-gray-700">Categoría de Gasto Asociada</label>
                    <select name="categoriaGastoId" id="categoriaGastoId" value={formData.categoriaGastoId} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm">
                        <option value="">Selecciona una categoría...</option>
                        {categoriasGasto.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <label htmlFor="tipoPeriodo" className="block text-sm font-medium text-gray-700">Período</label>
                        <Tooltip text={`El recordatorio se generará para las 15:00 hs del día calculado:\n· Último día del mes (Mensual).\n· Domingo siguiente a la fecha inicio (Semanal).\n· Fecha Fin (Custom).`} position="top" />
                    </div>
                    <select name="tipoPeriodo" id="tipoPeriodo" value={formData.tipoPeriodo} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm">
                        {TIPOPERIODO.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
                    </select>
                </div>

                {/* Campos condicionales según Tipo de Periodo */}
                {formData.tipoPeriodo === 'MENSUAL' && (
                    <>
                        <div>
                            <label htmlFor="mes" className="block text-sm font-medium text-gray-700">Mes</label>
                            <select name="mes" id="mes" value={formData.mes} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm">
                                {meses.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="anio" className="block text-sm font-medium text-gray-700">Año</label>
                            <input type="number" name="anio" id="anio" value={formData.anio} onChange={handleChange} min="2020" max="2100" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm" />
                        </div>
                    </>
                )}

                {formData.tipoPeriodo === 'SEMANAL' && (
                    <div className="md:col-span-2">
                        <label htmlFor="inicio" className="block text-sm font-medium text-gray-700">Fecha de Inicio (Referencia)</label>
                        <input type="date" name="inicio" id="inicio" value={formData.inicio} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm" />
                        <p className="text-xs text-gray-500 mt-1">Se calculará la semana automáticamente a partir de esta fecha.</p>
                    </div>
                )}

                {formData.tipoPeriodo === 'CUSTOM' && (
                    <>
                        <div>
                            <label htmlFor="inicio" className="block text-sm font-medium text-gray-700">Fecha Inicio</label>
                            <input type="date" name="inicio" id="inicio" value={formData.inicio} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm" />
                        </div>
                        <div>
                            <label htmlFor="fin" className="block text-sm font-medium text-gray-700">Fecha Fin</label>
                            <input type="date" name="fin" id="fin" value={formData.fin} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm" />
                        </div>
                    </>
                )}

                {/* Bloque de configuración de recordatorio */}
                <div className="md:col-span-2 mt-2 p-3 bg-blue-50 rounded-md border border-blue-100">
                    <div className="flex items-center gap-2 mb-2 text-blue-800 font-medium text-xs uppercase tracking-wider">
                        <Clock className="w-3 h-3" /> Configuración de Recordatorio
                    </div>
                    <div className="flex items-center gap-3">
                        <label htmlFor="horaRecordatorio" className="text-sm text-gray-600">Fecha de aviso:</label>
                        <input type="date" name="fechaFin" id="fechaFin" value={fechaFin ? fechaFin : ''} disabled className="block w-32 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm text-gray-600 cursor-not-allowed" />
                    </div>
                    <div className="flex items-center gap-3">
                        <label htmlFor="horaRecordatorio" className="text-sm text-gray-600">Hora de aviso:</label>
                        <input type="time" name="horaRecordatorio" id="horaRecordatorio" value={formData.horaRecordatorio} onChange={handleChange} className="block w-32 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" />
                    </div>
                </div>
            </div>

            <div className="flex justify-end gap-4 pt-4">
                <button type="button" onClick={onCancel} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                    Cancelar
                </button>
                <button type="submit" disabled={isSubmitting} className="px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:bg-primary-300 disabled:cursor-not-allowed">
                    {isSubmitting ? 'Guardando...' : (initialData ? 'Actualizar Lista' : 'Crear Lista')}
                </button>
            </div>
        </form>
    );
};

export default ListaTareaForm;
