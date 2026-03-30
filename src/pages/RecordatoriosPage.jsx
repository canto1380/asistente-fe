import React, { useState, useEffect, useCallback } from 'react';
import PageHeader from '../Components/HeaderPage/PageHeader';
import FilterBar from '../Components/Filter/FilterBar';
import RecordatoriosTable from '../Components/Recordatorios/RecordatoriosTable';
import Modal from '../Components/Modal/Modal';
import { getRequest, deleteRequest, patchRequest } from '../api/apiRequest';
import { useAlert } from '../context/alertContext';
import { Bell, Search } from 'lucide-react';

const RecordatoriosPage = () => {
    const [recordatorios, setRecordatorios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [estadoFilter, setEstadoFilter] = useState('');
    const [tipoFilter, setTipoFilter] = useState('');
    const [fechaFilter, setFechaFilter] = useState('');

    const [selectedRecordatorio, setSelectedRecordatorio] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [editData, setEditData] = useState({ fecha: '', hora: '' });

    const { showAlert } = useAlert();

    const fetchRecordatorios = useCallback(async () => {
        setLoading(true);
        try {
            const { data } = await getRequest('recordatorios'); // Asegúrate de tener este endpoint en el backend
            setRecordatorios(data);
        } catch (error) {
            showAlert('Error al cargar recordatorios', 'error');
        } finally {
            setLoading(false);
        }
    }, [showAlert]);

    useEffect(() => { fetchRecordatorios(); }, [fetchRecordatorios]);

    const handleDelete = async (id) => {
        if (!window.confirm('¿Eliminar definitivamente este recordatorio?')) return;
        try {
            await deleteRequest(`recordatorios/${id}`);
            showAlert('Recordatorio eliminado', 'success');
            fetchRecordatorios();
        } catch (error) { showAlert('Error al eliminar', 'error'); }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            // Construimos la fecha con zona horaria Argentina para que el backend la procese igual que en la creación
            const isoString = `${editData.fecha}T${editData.hora}:00-03:00`;
            await patchRequest(`recordatorios/${selectedRecordatorio.id}`, { activador: new Date(isoString) });
            showAlert('Fecha de aviso actualizada', 'success');
            setIsEditModalOpen(false);
            fetchRecordatorios();
        } catch (error) { showAlert('Error al actualizar', 'error'); }
    };

    const filtered = recordatorios.filter(r => {
        const titulo = (r.evento?.titulo || r.tarea?.titulo || r.listaTarea?.titulo || '').toLowerCase();
        const matchesSearch = titulo.includes(search.toLowerCase());
        const matchesEstado = estadoFilter ? r.estado === estadoFilter : true;
        const matchesFecha = fechaFilter ? r.activador.startsWith(fechaFilter) : true;
        const matchesTipo = !tipoFilter ? true :
            tipoFilter === 'EVENTO' ? r.eventoId :
                tipoFilter === 'TAREA' ? (r.tareaId && !r.listaTareaId) :
                    tipoFilter === 'LISTA' ? r.listaTareaId : true;

        return matchesSearch && matchesEstado && matchesFecha && matchesTipo;
    });

    return (
        <div className="space-y-6 pb-20">
            <PageHeader title="Recordatorios" />

            <FilterBar search={search} handleSearch={(e) => setSearch(e.target.value)}>
                <select value={estadoFilter} onChange={(e) => setEstadoFilter(e.target.value)} className="w-full md:w-40 px-3 py-2 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-primary-500 outline-none">
                    <option value="">Todos los estados</option>
                    <option value="PENDIENTE">Pendientes</option>
                    <option value="ENVIADO">Enviados</option>
                </select>
                <select value={tipoFilter} onChange={(e) => setTipoFilter(e.target.value)} className="w-full md:w-40 px-3 py-2 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-primary-500 outline-none">
                    <option value="">Todos los tipos</option>
                    <option value="EVENTO">Eventos</option>
                    <option value="TAREA">Tareas Independientes</option>
                    <option value="LISTA">Listas de Tareas</option>
                </select>
                <input type="date" value={fechaFilter} onChange={(e) => setFechaFilter(e.target.value)} className="w-full md:w-40 px-3 py-2 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-primary-500 outline-none" />
            </FilterBar>

            {loading ? (
                <div className="text-center py-20 animate-pulse text-gray-400">Cargando recordatorios...</div>
            ) : (
                <RecordatoriosTable
                    recordatorios={filtered}
                    onDelete={handleDelete}
                    onViewDetail={(r) => { setSelectedRecordatorio(r); setIsDetailModalOpen(true); }}
                    onEdit={(r) => {
                        setSelectedRecordatorio(r);
                        const dt = new Date(r.activador);
                        setEditData({
                            fecha: dt.toISOString().split('T')[0],
                            hora: dt.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
                        });
                        setIsEditModalOpen(true);
                    }}
                />
            )}

            {/* Modal de Edición */}
            <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Editar Recordatorio">
                <form onSubmit={handleUpdate} className="space-y-4">
                    <p className="text-xs text-gray-500 bg-gray-50 p-2 rounded">Solo se permite modificar el momento del aviso.</p>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Nueva Fecha</label>
                        <input type="date" value={editData.fecha} onChange={(e) => setEditData({ ...editData, fecha: e.target.value })} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Nueva Hora</label>
                        <input type="time" value={editData.hora} onChange={(e) => setEditData({ ...editData, hora: e.target.value })} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm" />
                    </div>
                    <div className="flex justify-end gap-3 pt-4">
                        <button type="button" onClick={() => setIsEditModalOpen(false)} className="px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-md">Cancelar</button>
                        <button type="submit" className="px-4 py-2 text-sm text-white bg-primary-600 rounded-md hover:bg-primary-700">Guardar Cambios</button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default RecordatoriosPage;
