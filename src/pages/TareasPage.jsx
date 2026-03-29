import { useState, useEffect } from "react";
import FilterBar from "../Components/Filter/FilterBar";
import PageHeader from "../Components/HeaderPage/PageHeader";
import { useAlert } from "../context/alertContext";
import { PRIORIDADES, ESTADOS_TAREA } from "../utils/constants";
import { PlusCircle } from "lucide-react";
import api from "../api/axios";
import TareasTable from "../Components/Tareas/TareasTable";
import ListaTareaTable from "../Components/ListaTareas/ListaTareasTable";
import ListaTareaForm from "../Components/ListaTareas/ListaTareaForm";
import Modal from "../Components/Modal/Modal";
import TareasForm from "../Components/Tareas/TareasForm";
import ComponentModalEliminar from "../Components/Modal/ModalEliminar";
import StatusUpdateForm from "../Components/Eventos/StatusUpdateForm";


const TareasPage = () => {
    const [tareas, setTareas] = useState([])
    const [listasTareas, setListasTareas] = useState()
    const [loading, setLoading] = useState(true)
    const [isSubmitting, setIsSubmitting] = useState(false);

    // --- Estados para los filtros --- //
    const [estado, setEstado] = useState('')
    const [prioridad, setPrioridad] = useState('')
    const [search, setSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemPerPage = 15

    // --- Estados para modal de tareas --- //
    const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
    const [editingTarea, setEditingTarea] = useState(null);
    const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
    const [statusUpdateTarea, setStatusUpdateTarea] = useState(null);
    const [isModalOpenDeleteEvent, setIsModalOpenDeleteEvent] = useState(false);
    const [deleteEvent, setDeleteEvent] = useState(null);

    // --- Estados para modal de lista de tareas --- //
    const [isAddEditListasModalOpen, setIsAddEditListasModalOpen] = useState(false);
    const [editingListas, setEditingListas] = useState(null);
    const [isDeleteListasModalOpen, setIsDeleteListasModalOpen] = useState(false);
    const [deleteLista, setDeleteLista] = useState(null);

    const { showAlert } = useAlert()

    // --- Carga de tareas y listas --- //
    const fetchTareasYListas = async () => {
        setLoading(true);
        try {
            const [tareasResponse, listasResponse] = await Promise.all([
                api.get('tareas'),
                api.get('listas-tareas')
            ])
            setTareas(tareasResponse.data)
            setListasTareas(listasResponse.data)
        } catch (error) {
            showAlert('No se pudieron cargar las tareas y las listas', 'error')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchTareasYListas()
    }, [])

    // --- Funciones de filtros --- //
    const handleSearch = (e) => {
        setSearch(e.target.value);
        setCurrentPage(1)
    }
    // Lógica de filtrado
    const filteredTareas = tareas.filter(tarea => {
        const matchesSearch = tarea.titulo.toLowerCase().includes(search.toLowerCase());
        const matchesEstado = estado ? tarea.estado === estado : true;
        const matchesPrioridad = prioridad ? tarea.prioridad === prioridad : true;
        return matchesSearch && matchesEstado && matchesPrioridad;
    });

    // --- Funciones para actualizar estado de tarea --- //
    const handleOpenStatusModal = (tarea) => {
        setStatusUpdateTarea(tarea);
        setIsStatusModalOpen(true);
    };

    const handleCloseStatusModal = () => {
        setIsStatusModalOpen(false);
        setStatusUpdateTarea(null);
    };

    const handleStatusSubmit = async (formData) => {
        if (!statusUpdateTarea) return;
        setIsSubmitting(true);
        try {
            await api.patch(`/tareas/toggle/${statusUpdateTarea.id}`, formData);
            showAlert('Estado de la tarea actualizado', 'success');
            handleCloseStatusModal();
            fetchTareasYListas();
        } catch (error) {
            showAlert(error.response?.data?.message || 'No se pudo actualizar el estado.', 'error');
        } finally {
            setIsSubmitting(false);
        }
    }

    // --- Funciones para crear/editar tarea --- //
    const handleOpenModal = (tarea = null) => {
        setEditingTarea(tarea);
        setIsAddEditModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsAddEditModalOpen(false);
        setEditingTarea(null);
    };

    const handleFormSubmit = async (formData) => {
        setIsSubmitting(true);
        try {
            if (editingTarea) {
                await api.patch(`/tareas/${editingTarea.id}`, formData);
                showAlert('Tarea actualizada con éxito', 'success');
            } else {
                await api.post('/tareas', formData);
                showAlert('Tarea creada con éxito', 'success');
            }
            handleCloseModal();
            fetchTareasYListas();
        } catch (error) {
            showAlert(error.response?.data?.message || 'Ocurrió un error al guardar.', 'error');
        } finally {
            setIsSubmitting(false);
        }
    }

    // --- Fcuniones para borrar tarea --- //
    const handleOpenModalDeleteEvent = (tarea) => {
        setDeleteEvent(tarea);
        setIsModalOpenDeleteEvent(true);
    }

    const handleCloseModalDeleteEvent = () => {
        setIsModalOpenDeleteEvent(false);
        setDeleteEvent(null);
    }

    const handleDeleteTarea = async (id) => {
        if (!id) return;
        setIsSubmitting(true);
        try {
            await api.delete(`/tareas/${id}`);
            showAlert('Tarea eliminada con éxito', 'success');
            handleCloseModalDeleteEvent();
            fetchTareasYListas()
        } catch (error) {
            showAlert(error.response?.data?.message || 'Ocurrió un error al eliminar.', 'error')
        }
        finally {
            setIsSubmitting(false)
        }
    }

    // --- Funciones para crear/editar LISTA de tareas --- //
    const handleOpenListaModal = (tarea = null) => {
        setEditingListas(tarea);
        setIsAddEditListasModalOpen(true);
    };

    const handleCloseListaModal = () => {
        setIsAddEditListasModalOpen(false);
        setEditingTarea(null);
    };

    const handleListaSubmit = async (formData) => {
        setIsSubmitting(true);
        formData.mes = Number(formData.mes)
        formData.anio = Number(formData.anio)
        try {
            if (editingListas) {
                await api.patch(`/listas-tareas/${editingListas.id}`, formData);
                showAlert('Lista de tareas actualizada con éxito', 'success');
            } else {
                const res = await api.post('/listas-tareas', formData);
                showAlert(res.data.message ||'Lista de tareas creada con éxito', 'success');
            }
            handleCloseListaModal()
            fetchTareasYListas();
        } catch (error) {
            showAlert(error.response?.data?.message || 'Ocurrió un error al guardar la lista.', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    // borar lista de tarea
    const handleOpenModalDeleteListaTarea = (listaTarea) => {
        setDeleteLista(listaTarea);
        setIsDeleteListasModalOpen(true)
    }

    const handleCloseModalDeleteListaTarea = () => {
        setIsDeleteListasModalOpen(false);
        setDeleteLista(null);
    }
    const handleDeleteListaTarea = async (id) => {
        if (!id) return;
        setIsSubmitting(true);
        try {
            await api.delete(`/listas-tareas/${id}`);
            showAlert('Lista de tareas eliminada con éxito', 'success');
            handleCloseModalDeleteListaTarea();
            fetchTareasYListas()
        } catch (error) {
            showAlert(error.response?.data?.message || 'Ocurrió un error al eliminar.', 'error')
        }
        finally {
            setIsSubmitting(false)
        }
    }


    // --- Separación de Tareas --- //
    // 1. Tareas Independientes (sin listaTareaId)
    const independentTareas = filteredTareas.filter(t => !t.listaTareaId);

    // 2. Las tareas que SI tienen lista se pasarán al componente de Listas,
    //    el cual filtrará internamente cuáles le pertenecen a cada lista.

    return (
        <div className="space-y-6 pb-20">
            <PageHeader title="Tareas">
                <button title='Nueva tarea' onClick={() => handleOpenModal()}>
                    <PlusCircle className="w-8 h-8 text-primary-400 hover:text-primary-600 rounded-full transition-colors cursor-pointer" />
                </button>
            </PageHeader>
            <FilterBar search={search} handleSearch={handleSearch}>
                {/* Select de estado */}
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
                <div className="text-center py-10 text-gray-500">Cargando tareas...</div>
            ) : (
                <>
                    {/* Sección de Listas de Tareas */}
                    {listasTareas && (
                        <div className="mb-8">
                            <div className="flex justify-start items-center mb-3">
                                <h2 className="text-lg font-semibold text-gray-700 mb-0 px-1">Listas de Tareas</h2>
                                <button title='Nueva lista de tarea' onClick={() => handleOpenListaModal()}>
                                    <PlusCircle className="w-6 h-6 text-primary-400 hover:text-primary-600 rounded-full transition-colors cursor-pointer" />
                                </button>
                            </div>
                            <ListaTareaTable
                                listas={listasTareas}
                                tareas={filteredTareas} // Pasamos todas las filtradas, el componente las distribuye
                                onEditList={handleOpenListaModal}
                                onDeleteList={handleOpenModalDeleteListaTarea}
                                onEditTarea={handleOpenModal}
                                onDeleteTarea={handleOpenModalDeleteEvent}
                                onToggleStatusTarea={handleOpenStatusModal}
                            />
                        </div>
                    )}

                    {/* Sección de Tareas Independientes */}
                    <div>
                        <h2 className="text-lg font-semibold text-gray-700 mb-2 px-1">Tareas Independientes</h2>
                        <TareasTable
                            tareas={independentTareas}
                            onEdit={handleOpenModal}
                            onDelete={handleOpenModalDeleteEvent}
                            onToggleStatus={handleOpenStatusModal}
                            bandListaTareas={false}
                        />
                    </div>
                </>
            )}
            {/* // --- Modal para crear o editar tarea --- // */}
            <Modal
                isOpen={isAddEditModalOpen}
                onClose={handleCloseModal}
                title={editingTarea ? 'Editar Tarea' : 'Crear Nueva Tarea'}
            >
                <TareasForm
                    initialData={editingTarea}
                    onSubmit={handleFormSubmit}
                    onCancel={handleCloseModal}
                    isSubmitting={isSubmitting}
                />
            </Modal>

            {/* // --- Modal para crear o editar LISTA de tareas --- // */}
            <Modal
                isOpen={isAddEditListasModalOpen}
                onClose={() => { setIsAddEditListasModalOpen(false); setEditingListas(null); }}
                title={editingListas ? 'Editar Lista de Tareas' : 'Crear Nueva Lista de Tareas'}
            >
                <ListaTareaForm
                    initialData={editingListas}
                    onSubmit={handleListaSubmit}
                    onCancel={() => { setIsAddEditListasModalOpen(false); setEditingListas(null); }}
                    isSubmitting={isSubmitting}
                />
            </Modal>


            {/* // --- Modal para editar estado tarea --- // */}
            <Modal
                isOpen={isStatusModalOpen}
                onClose={handleCloseStatusModal}
                title={`Actualizar Estado: ${statusUpdateTarea?.titulo || ''}`}
            >
                <StatusUpdateForm
                    initialData={statusUpdateTarea}
                    onSubmit={handleStatusSubmit}
                    onCancel={handleCloseStatusModal}
                    isSubmitting={isSubmitting}
                />
            </Modal>

            {/* // --- Modal para eliminar tarea --- // */}
            <Modal
                isOpen={isModalOpenDeleteEvent}
                onClose={handleCloseModalDeleteEvent}
                title={`Eliminar tarea `}
            >
                <ComponentModalEliminar 
                 onSubmit={handleDeleteTarea}
                 data={deleteEvent}
                 onCancel={handleCloseModalDeleteEvent}
                 type="tarea"
                
                />
            </Modal>

            {/* // --- Modal para eliminar lista tarea --- // */}
            <Modal
                isOpen={isDeleteListasModalOpen}
                onClose={handleCloseModalDeleteListaTarea}
                title={`Eliminar lista de tareas`}
            >
                <ComponentModalEliminar 
                 onSubmit={handleDeleteListaTarea}
                 data={deleteLista}
                 onCancel={handleCloseModalDeleteListaTarea}
                 type="lista de tarea"
                
                />
            </Modal>

        </div>
    );
};
export default TareasPage;