import { PlusCircle } from "lucide-react";
import FilterBar from "../Components/Filter/FilterBar";
import PageHeader from "../Components/HeaderPage/PageHeader";
import { useEffect, useState, useCallback } from "react";
import api from "../api/axios";
import { ESTADOS_TAREA, PRIORIDADES } from "../utils/constants";
import EventosTable from "../Components/Eventos/EventosTable";
import Modal from "../Components/Modal/Modal";
import EventoForm from "../Components/Eventos/EventoForm";
import StatusUpdateForm from "../Components/Eventos/StatusUpdateForm";
import { useAlert } from "../context/alertContext";
import ComponentModalEliminar from "../Components/Modal/ModalEliminar";

const EventosPage = () => {
    const [eventos, setEventos] = useState([])
    const [loading, setLoading] = useState(true)
    const [isSubmitting, setIsSubmitting] = useState(false);

    // --- Estados para los filtros ---
    const [estado, setEstado] = useState('')
    const [prioridad, setPrioridad] = useState('')
    const [search, setSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemPerPage = 15

    // --- Estados para el Modal ---
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingEvento, setEditingEvento] = useState(null);
    const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
    const [statusUpdateEvento, setStatusUpdateEvento] = useState(null);
    const [isModalOpenDeleteEvent, setIsModalOpenDeleteEvent] = useState(false);
    const [deleteEvent, setDeleteEvent] = useState(null);


    const { showAlert } = useAlert();

    const fetchEventos = useCallback(async () => {
        setLoading(true);
        try {
            const { data } = await api.get('eventos');
            setEventos(data);
        } catch (error) {
            console.error("Error al cargar los eventos:", error);
            showAlert('No se pudieron cargar los eventos.', 'error');
        } finally {
            setLoading(false);
        }
    }, [showAlert]);

    useEffect(() => {
        fetchEventos();
    }, [fetchEventos]);

    const handleSearch = (e) => {
        setSearch(e.target.value);
        setCurrentPage(1)
    }

    // Funciones para cambiar el estado de evento
    const handleOpenStatusModal = (evento) => {
        setStatusUpdateEvento(evento);
        setIsStatusModalOpen(true);
    };

    const handleCloseStatusModal = () => {
        setIsStatusModalOpen(false);
        setStatusUpdateEvento(null);
    };

    const handleStatusSubmit = async (formData) => {
        if (!statusUpdateEvento) return;
        setIsSubmitting(true);
        try {
            await api.patch(`/eventos/status/${statusUpdateEvento.id}`, formData);
            showAlert('Estado del evento actualizado', 'success');
            handleCloseStatusModal();
            fetchEventos();
        } catch (error) {
            showAlert(error.response?.data?.message || 'No se pudo actualizar el estado.', 'error');
        } finally {
            setIsSubmitting(false);
        }
    }

    // Funcion para crear/editar evento
    const handleOpenModal = (evento = null) => {
        setEditingEvento(evento);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingEvento(null);
    };

    const handleFormSubmit = async (formData) => {
        setIsSubmitting(true);
        try {
            if (editingEvento) {
                await api.patch(`/eventos/${editingEvento.id}`, formData);
                showAlert('Evento actualizado con éxito', 'success');
            } else {
                await api.post('/eventos', formData);
                showAlert('Evento creado con éxito', 'success');
            }
            handleCloseModal();
            fetchEventos();
        } catch (error) {
            showAlert(error.response?.data?.message || 'Ocurrió un error al guardar.', 'error');
        } finally {
            setIsSubmitting(false);
        }
    }

    // Borrar
    const handleOpenModalDeleteEvent = (evento) => {
        setDeleteEvent(evento);
        setIsModalOpenDeleteEvent(true);
    }

    const handleCloseModalDeleteEvent = () => {
        setIsModalOpenDeleteEvent(false);
        setDeleteEvent(null);
    }

    const handleDelete = async (id) => {
        if(!id) return;
        setIsSubmitting(true);
        try {
            await api.delete(`/eventos/${id}`);
            showAlert('Evento eliminado con éxito', 'success');
            handleCloseModalDeleteEvent();
            fetchEventos()
        } catch (error) {
            showAlert(error.response?.data?.message || 'Ocurrió un error al eliminar.', 'error')
        }
        finally {
            setIsSubmitting(false)
        }
    }

    // Lógica de filtrado
    const filteredEventos = eventos.filter(evento => {
        const matchesSearch = evento.titulo.toLowerCase().includes(search.toLowerCase());
        const matchesEstado = estado ? evento.estado === estado : true;
        const matchesPrioridad = prioridad ? evento.prioridad === prioridad : true;
        return matchesSearch && matchesEstado && matchesPrioridad;
    });

    return (
        <div>
            <PageHeader title="Eventos">
                <button title='Nuevo evento' onClick={() => handleOpenModal()}>
                    <PlusCircle className="w-8 h-8 text-primary-400 hover:text-primary-600 rounded-full transition-colors cursor-pointer" />
                </button>
            </PageHeader>
            <FilterBar search={search} handleSearch={handleSearch}>
                {/* select de estado */}
                <select
                    className={`w-full md:w-48 px-2 py-1.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 outline-none transition text-sm ${estado ? 'text-gray-800' : 'text-gray-400'}`}
                    value={estado}
                    onChange={(e) => setEstado(e.target.value)}
                >
                    <option value=''>Todos los estados</option>
                    {ESTADOS_TAREA.map(e => (
                        <option key={e.value} value={e.value} className="text-gray-800">{e.label}</option>
                    ))}
                </select>

                {/* select de prioridad */}
                <select
                    className={`w-full md:w-48 px-2 py-1.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 outline-none transition text-sm ${prioridad ? 'text-gray-800' : 'text-gray-400'}`}
                    value={prioridad}
                    onChange={(e) => setPrioridad(e.target.value)}
                >
                    <option value=''>Todas las prioridades</option>
                    {PRIORIDADES.map(p => (
                        <option key={p.value} value={p.value} className="text-gray-800">{p.label}</option>
                    ))}
                </select>

            </FilterBar>

            {loading ? (
                <div className="text-center py-10 text-gray-500">Cargando eventos...</div>
            ) : (
                <EventosTable eventos={filteredEventos} onEdit={handleOpenModal} onDelete={handleOpenModalDeleteEvent} onToggleStatus={handleOpenStatusModal} />
            )}

            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={editingEvento ? 'Editar Evento' : 'Crear Nuevo Evento'}
            >
                <EventoForm
                    initialData={editingEvento}
                    onSubmit={handleFormSubmit}
                    onCancel={handleCloseModal}
                    isSubmitting={isSubmitting}
                />
            </Modal>

            <Modal
                isOpen={isStatusModalOpen}
                onClose={handleCloseStatusModal}
                title={`Actualizar Estado: ${statusUpdateEvento?.titulo || ''}`}
            >
                <StatusUpdateForm
                    initialData={statusUpdateEvento}
                    onSubmit={handleStatusSubmit}
                    onCancel={handleCloseStatusModal}
                    isSubmitting={isSubmitting}
                />
            </Modal>

            <Modal
                isOpen={isModalOpenDeleteEvent}
                onClose={handleCloseModalDeleteEvent}
                title={`Eliminar evento `}
            >
                <ComponentModalEliminar 
                    onSubmit={handleDelete}
                    data={deleteEvent}
                    onCancel={handleCloseModalDeleteEvent}
                    type="evento"
                />
            </Modal>
        </div>
    );
};
export default EventosPage;
