import { useEffect, useState } from "react"
import { useAlert } from "../../context/alertContext"
import { Clock } from "lucide-react"
import { ESTADOS_TAREA, PRIORIDADES } from "../../utils/constants"
import { getRequest } from "../../api/apiRequest"
import Tooltip from "../Tooltip/Tooltip"

const TareasForm = ({ initialData, onSubmit, onCancel, isSubmitting }) => {
    const [formData, setFormData] = useState({
        listaTareaId: '',
        titulo: '',
        descripcion: '',
        fechaVencimiento: '',
        estado: 'PENDIENTE',
        prioridad: 'MEDIA',
        gasto: 0,
        categoriaGastoId: '',
        horaRecordatorio: '15:00', // Valor por defecto
    })

    const [listasTareas, setListasTareas] = useState([])
    const [categoriasGasto, setCategoriasGasto] = useState([])
    const { showAlert } = useAlert()

    // --- Carga de lista tareas --- //
    useEffect(() => {
        const fetchListaTareas = async () => {
            try {
                const { data } = await getRequest('listas-tareas')
                setListasTareas(data)
            } catch (error) {
                showAlert('No se pudieron cargar las listas de tareas', 'error')
            }
        }
        fetchListaTareas()
    }, [showAlert])
    // --- Carga de categorias de gasto --- //
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

    // --- Llenar el formulario si estamos en edicion --- //
    useEffect(() => {
        if (initialData) {
            const categoriaId = initialData.gastos?.[0]?.categoriaGastoId || '';
            setFormData({
                listaTareaId: initialData.listaTareaId || null,
                titulo: initialData.titulo || '',
                descripcion: initialData.descripcion || '',
                fechaVencimiento: initialData.fechaVencimiento ? initialData.fechaVencimiento.split('T')[0] : null,
                estado: initialData.estado || 'PENDIENTE',
                prioridad: initialData.prioridad || 'MEDIA',
                gasto: initialData.gasto || 0,
                categoriaGastoId: categoriaId,
                horaRecordatorio: '15:00', // No guardamos la hora en Tarea, así que reseteamos o mantenemos default al editar
            })
        } else {
            setFormData({
                listaTareaId: '',
                titulo: '',
                descripcion: '',
                fechaVencimiento: null,
                estado: 'PENDIENTE',
                prioridad: 'MEDIA',
                gasto: 0,
                categoriaGastoId: null,
                horaRecordatorio: '15:00',
            })
        }
    }, [initialData])

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }


    const handleSubmit = (e) => {
        e.preventDefault()

        const isIndependent = !formData.listaTareaId;
        const hasGasto = Number(formData.gasto) > 0;

        // Validación: Tarea independiente con gasto debe tener categoría.
        if (isIndependent && hasGasto && !formData.categoriaGastoId) {
            showAlert('Una tarea independiente con gasto debe tener una categoría de gasto.', 'warning');
            return;
        }


        let finalData = { ...formData };

        // Si la tarea pertenece a una lista, nos aseguramos de no enviar la categoría desde aquí.
        // El backend la tomará de la lista.
        if (!isIndependent || !hasGasto) {
            delete finalData.categoriaGastoId;
        }

        finalData.gasto = finalData.gasto ? Number(finalData.gasto) : 0;
        finalData.listaTareaId = finalData.listaTareaId || null;
        finalData.fechaVencimiento = finalData.fechaVencimiento ? new Date(finalData.fechaVencimiento) : null;
        onSubmit(finalData)
    }

    const hasGasto = formData.gasto && Number(formData.gasto) > 0

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
                    <label htmlFor="listaTareaId" className="block text-sm font-medium text-gray-700">Lista de Tarea</label>
                    <select
                        name="listaTareaId" id="listaTareaId" value={formData.listaTareaId} onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                    >
                        <option value="">Selecciona una lista de tarea...</option>
                        {listasTareas
                            // .filter(listaTarea => listaTarea.estado === false)
                            .map(listaTarea => (
                                <option key={listaTarea.id} value={listaTarea.id}>{listaTarea.titulo}</option>
                            ))}
                    </select>
                </div>

                {!formData.listaTareaId && (
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <label htmlFor="fechaVencimiento" className="...">Fecha de Vencimiento</label>
                            <Tooltip text="Si defines una fecha, se creará un recordatorio automático para las 15:00 hs de ese día." />
                        </div>
                        <input type="date" name="fechaVencimiento" id="fechaVencimiento" value={formData.fechaVencimiento} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm" />
                        
                        {/* Bloque de configuración de recordatorio */}
                        <div className="mt-3 p-3 bg-blue-50 rounded-md border border-blue-100">
                            <div className="flex items-center gap-2 mb-2 text-blue-800 font-medium text-xs uppercase tracking-wider">
                                <Clock className="w-3 h-3" /> Configuración de Recordatorio
                            </div>
                            <div className="flex items-center gap-3">
                                <label htmlFor="horaRecordatorio" className="text-sm text-gray-600">Hora:</label>
                                <input type="time" name="horaRecordatorio" id="horaRecordatorio" value={formData.horaRecordatorio} onChange={handleChange} className="block w-32 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" />
                            </div>
                        </div>
                    </div>
                )}

                <div>
                    <label htmlFor="gasto" className="block text-sm font-medium text-gray-700">Gasto Total (opcional)</label>
                    <input type="number" name="gasto" id="gasto" value={formData.gasto} onChange={handleChange} min="0" step="0.01" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm" />
                </div>

                {formData.gasto > 0 && !formData.listaTareaId && (
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

                )}

                <div>
                    <label htmlFor="prioridad" className="block text-sm font-medium text-gray-700">Prioridad</label>
                    <select name="prioridad" id="prioridad" value={formData.prioridad} onChange={handleChange} className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm `}>
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
                    {isSubmitting ? 'Guardando...' : (initialData ? 'Actualizar Tarea' : 'Crear Tarea')}
                </button>
            </div>
        </form>
    )

}

export default TareasForm