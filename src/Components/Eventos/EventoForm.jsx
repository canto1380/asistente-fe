import { useState, useEffect } from 'react';
import { getRequest } from '../../api/apiRequest';
import { useAlert } from '../../context/alertContext';
import { PRIORIDADES, ESTADOS_TAREA } from '../../utils/constants';
import Tooltip from '../Tooltip/Tooltip';

const EventoForm = ({ initialData, onSubmit, onCancel, isSubmitting }) => {
    const [formData, setFormData] = useState({
        titulo: '',
        descripcion: '',
        inicio: '',
        hora: '',
        gastoTotal: 0,
        categoriaGastoId: '',
        prioridad: 'MEDIA',
        estado: 'PENDIENTE',
    });
    const [categoriasGasto, setCategoriasGasto] = useState([]);
    const { showAlert } = useAlert();

    // Cargar categorías de gasto al montar el componente
    useEffect(() => {
        const fetchCategorias = async () => {
            try {
                const { data } = await getRequest('categoria-gasto');
                setCategoriasGasto(data);
            } catch (error) {
                console.error("Error al cargar categorías de gasto:", error);
                showAlert('No se pudieron cargar las categorías de gasto.', 'error');
            }
        };
        fetchCategorias();
    }, [showAlert]);


    // Llenar el formulario si estamos editando
    useEffect(() => {
        if (initialData) {
            // Acceso seguro a la categoría del gasto usando optional chaining (?.)
            // Esto evita errores si un evento no tiene gastos asociados.
            const categoriaId = initialData.gastos?.[0]?.categoriaGastoId || '';
            setFormData({
                titulo: initialData.titulo || '',
                descripcion: initialData.descripcion || '',
                inicio: initialData.inicio ? initialData.inicio.split('T')[0] : '', // Extraer solo la fecha YYYY-MM-DD
                hora: initialData.hora || '',
                gastoTotal: initialData.gastoTotal || 0,
                categoriaGastoId: categoriaId,
                prioridad: initialData.prioridad || 'MEDIA',
                estado: initialData.estado || 'PENDIENTE',
            });
        } else {
            // Resetear para un nuevo evento
            setFormData({
                titulo: '', descripcion: '', inicio: '', hora: '',
                gastoTotal: 0, categoriaGastoId: '', prioridad: 'MEDIA', estado: 'PENDIENTE',
            });
        }
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'gastoTotal') {
            const newGastoTotal = value ? Number(value) : 0;
            setFormData(prev => ({
                ...prev,
                gastoTotal: newGastoTotal,
                // Si el nuevo gasto es 0 o no es un número válido, se limpia la categoría.
                categoriaGastoId: newGastoTotal > 0 ? prev.categoriaGastoId : '',
            }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (Number(formData.gastoTotal) > 0 && !formData.categoriaGastoId) {
            showAlert('Si el evento tiene un gasto, debes seleccionar una categoría.', 'warning');
            return;
        }

        // Combina la fecha y la hora en un solo campo 'inicio' para el backend.
        const combinedInicio = formData.inicio && formData.hora
            ? `${formData.inicio}T${formData.hora}:00`
            : formData.inicio;

        const activo = formData.estado === 'PENDIENTE' ? true : false
        const conversionGasto = formData.gastoTotal ? Number(formData.gastoTotal) : 0
        const categoriaGastoId = formData.categoriaGastoId !== '' ? formData.categoriaGastoId : null
        const hora = formData.hora !== '' ? formData.hora : null

        // Preparamos los datos finales para enviar a la API
        const finalData = { ...formData, inicio: combinedInicio, activo: activo, gastoTotal: conversionGasto, categoriaGastoId, hora };
        onSubmit(finalData);
    };

    const hasGasto = formData.gastoTotal && Number(formData.gastoTotal) > 0;
    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                    <label htmlFor="titulo" className="block text-sm font-medium text-gray-700">Título</label>
                    <input type="text" name="titulo" id="titulo" value={formData.titulo} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm" />
                </div>

                <div className="md:col-span-2">
                    <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700">Descripción</label>
                    <textarea name="descripcion" id="descripcion" value={formData.descripcion} onChange={handleChange} rows="3" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"></textarea>
                </div>

                <div>
                    <label htmlFor="inicio" className="block text-sm font-medium text-gray-700">Fecha del Evento</label>
                    <input type="date" name="inicio" id="inicio" value={formData.inicio} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm" />
                </div>
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <label htmlFor="hora" className="...">Hora</label>
                        <Tooltip text="Si no defines hora, NO se generará recordatorio. Si defines hora, el recordatorio sonará 30 minutos antes del evento." />
                    </div>
                    <input type="time" name="hora" id="hora" value={formData.hora} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm" />
                </div>

                <div>
                    <label htmlFor="gastoTotal" className="block text-sm font-medium text-gray-700">Gasto Total (opcional)</label>
                    <input type="number" name="gastoTotal" id="gastoTotal" value={formData.gastoTotal} onChange={handleChange} min="0" step="0.01" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm" />
                </div>

                <div>
                    <label htmlFor="categoriaGastoId" className="block text-sm font-medium text-gray-700">Categoría de Gasto</label>
                    <select
                        name="categoriaGastoId" id="categoriaGastoId" value={formData.categoriaGastoId} onChange={handleChange}
                        disabled={!hasGasto} required={hasGasto}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                    >
                        <option value="">{hasGasto ? 'Selecciona una categoría...' : 'Sin gasto asociado'}</option>
                        {categoriasGasto.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label htmlFor="prioridad" className="block text-sm font-medium text-gray-700">Prioridad</label>
                    <select name="prioridad" id="prioridad" value={formData.prioridad} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm">
                        {PRIORIDADES.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
                    </select>
                </div>

                <div>
                <div className="flex items-center gap-2 mb-1">
                    <label htmlFor="estado" className="block text-sm font-medium text-gray-700">Estado</label>
                    <Tooltip text="Si el estado no es PENDIENTE, NO se va a generar el recordatorio." />
                </div>
                    <select name="estado" id="estado" value={formData.estado} onChange={handleChange} disabled={initialData} className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm ${initialData && 'cursor-not-allowed bg-gray-100 text-gray-400'}`}>
                        {ESTADOS_TAREA.map(e => <option key={e.value} value={e.value}>{e.label}</option>)}
                    </select>
                </div>
            </div>

            <div className="flex justify-end gap-4 pt-4">
                <button type="button" onClick={onCancel} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                    Cancelar
                </button>
                <button type="submit" disabled={isSubmitting} className="px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:bg-primary-300 disabled:cursor-not-allowed">
                    {isSubmitting ? 'Guardando...' : (initialData ? 'Actualizar Evento' : 'Crear Evento')}
                </button>
            </div>
        </form>
    );
};

export default EventoForm;