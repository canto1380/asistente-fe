import React, { useState, useEffect, useCallback } from 'react';
import PageHeader from '../Components/HeaderPage/PageHeader';
import FilterBar from '../Components/Filter/FilterBar';
import Modal from '../Components/Modal/Modal';
import ComponentModalEliminar from '../Components/Modal/ModalEliminar';
import CategoriaGastoTable from '../Components/CategoriaGasto/CategoriaGastoTable';
import CategoriaGastoForm from '../Components/CategoriaGasto/CategoriaGastoForm';
import { PlusCircle } from 'lucide-react';
import api from '../api/axios';
import { useAlert } from '../context/alertContext';

const CategoriasGastoPage = () => {
    const [categorias, setCategorias] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Estados para Modales
    const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
    const [editingCategoria, setEditingCategoria] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState(null);

    const { showAlert } = useAlert();

    const fetchCategorias = useCallback(async () => {
        setLoading(true);
        try {
            const { data } = await api.get('categoria-gasto');
            setCategorias(data);
        } catch (error) {
            showAlert('No se pudieron cargar las categorías', 'error');
        } finally {
            setLoading(false);
        }
    }, [showAlert]);

    useEffect(() => {
        fetchCategorias();
    }, [fetchCategorias]);

    const handleOpenForm = (categoria = null) => {
        setEditingCategoria(categoria);
        setIsAddEditModalOpen(true);
    };

    const handleCloseForm = () => {
        setIsAddEditModalOpen(false);
        setEditingCategoria(null);
    };

    const handleSubmit = async (formData) => {
        setIsSubmitting(true);
        try {
            if (editingCategoria) {
                await api.patch(`categoria-gasto/${editingCategoria.id}`, formData);
                showAlert('Categoría actualizada con éxito', 'success');
            } else {
                await api.post('categoria-gasto', formData);
                showAlert('Categoría creada con éxito', 'success');
            }
            handleCloseForm();
            fetchCategorias();
        } catch (error) {
            showAlert(error.response?.data?.message || 'Error al guardar la categoría', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleOpenDelete = (categoria) => {
        setDeleteTarget(categoria);
        setIsDeleteModalOpen(true);
    };

    const handleDelete = async (id) => {
        setIsSubmitting(true);
        try {
            await api.delete(`categoria-gasto/${id}`);
            showAlert('Categoría eliminada', 'success');
            setIsDeleteModalOpen(false);
            fetchCategorias();
        } catch (error) {
            showAlert(error.response?.data?.message || 'No se puede eliminar la categoría si tiene gastos asociados', 'error');
        } finally {
            setIsSubmitting(false);
            setDeleteTarget(null);
        }
    };

    const filtered = categorias.filter(c => 
        c.nombre.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-6 pb-20">
            <PageHeader title="Mis Categorías">
                <button onClick={() => handleOpenForm()} title="Nueva Categoría">
                    <PlusCircle className="w-8 h-8 text-primary-500 hover:text-primary-700 transition-colors cursor-pointer" />
                </button>
            </PageHeader>

            <FilterBar search={search} handleSearch={(e) => setSearch(e.target.value)} />

            {loading ? (
                <div className="text-center py-12 text-gray-400 animate-pulse">Cargando categorías...</div>
            ) : (
                <CategoriaGastoTable 
                    categorias={filtered} 
                    onEdit={handleOpenForm} 
                    onDelete={handleOpenDelete} 
                />
            )}

            {/* Modal Formulario */}
            <Modal 
                isOpen={isAddEditModalOpen} 
                onClose={handleCloseForm} 
                title={editingCategoria ? 'Editar Categoría' : 'Nueva Categoría de Gasto'}
            >
                <CategoriaGastoForm 
                    initialData={editingCategoria}
                    onSubmit={handleSubmit}
                    onCancel={handleCloseForm}
                    isSubmitting={isSubmitting}
                />
            </Modal>

            {/* Modal Eliminar */}
            <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Eliminar Categoría">
                <ComponentModalEliminar 
                    onSubmit={handleDelete}
                    data={deleteTarget}
                    onCancel={() => setIsDeleteModalOpen(false)}
                    type="categoría de gasto"
                />
            </Modal>
        </div>
    );
};

export default CategoriasGastoPage;
