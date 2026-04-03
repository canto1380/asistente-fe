import React, { useState, useEffect, useCallback } from 'react';
import PageHeader from '../Components/HeaderPage/PageHeader';
import FilterBar from '../Components/Filter/FilterBar';
import Modal from '../Components/Modal/Modal';
import ComponentModalEliminar from '../Components/Modal/ModalEliminar';
import { PlusCircle } from 'lucide-react';
import api from '../api/axios';
import { useAlert } from '../context/alertContext';

import UserTable from '../Components/Usuarios/UserTable';
import UserForm from '../Components/Usuarios/UserForm';

const UsersPage = () => {
    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState([]); // Para el selector de roles
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Estados para Modales
    const [modalState, setModalState] = useState({
        type: null, // 'user', 'deleteUser', 'assignRole'
        data: null
    });

    const { showAlert } = useAlert();

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const [usersRes, rolesRes] = await Promise.all([
                api.get('usuarios'),
                api.get('roles')
            ]);
            setUsers(usersRes.data);
            setRoles(rolesRes.data);
        } catch (error) {
            showAlert('Error al cargar datos de usuarios o roles', 'error');
        } finally {
            setLoading(false);
        }
    }, [showAlert]);

    useEffect(() => { fetchData(); }, [fetchData]);

    const handleOpenModal = (type, data = null) => setModalState({ type, data });
    const handleCloseModal = () => setModalState({ type: null, data: null });

    // --- Lógica de Usuarios ---
    const onSubmitUser = async (formData) => {
        setIsSubmitting(true);
        try {
            if (modalState.data?.id) {
                // Si se está editando, no enviamos la contraseña si está vacía
                const dataToUpdate = formData.password ? formData : { ...formData, password: undefined };
                await api.patch(`usuarios/${modalState.data.id}`, dataToUpdate);
                showAlert('Usuario actualizado', 'success');
            } else {
                await api.post('usuarios', formData);
                showAlert('Usuario creado', 'success');
            }
            fetchData();
            handleCloseModal();
        } catch (error) {
            showAlert(error.response?.data?.message || 'Error en operación', 'error');
        } finally { setIsSubmitting(false); }
    };

    const onDeleteUser = async (id) => {
        setIsSubmitting(true);
        try {
            await api.delete(`usuarios/${id}`);
            showAlert('Usuario eliminado', 'success');
            fetchData();
            handleCloseModal();
        } catch (error) {
            showAlert(error.response?.data?.message || 'Error al eliminar usuario', 'error');
        } finally { setIsSubmitting(false); }
    };

    const onAssignRoleToUser = async (userId, roleId) => {
        setIsSubmitting(true);
        try {
            await api.patch(`usuarios/${userId}/assign-role`, { roleId }); // Asumiendo este endpoint
            showAlert('Rol asignado con éxito', 'success');
            fetchData();
            handleCloseModal();
        } catch (error) {
            showAlert(error.response?.data?.message || 'Error al asignar rol', 'error');
        } finally { setIsSubmitting(false); }
    };

    const filteredUsers = users.filter(u =>
        u.nombre.toLowerCase().includes(search.toLowerCase()) ||
        u.apellido.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-6 pb-20">
            <PageHeader title="Gestión de Usuarios">
                <button onClick={() => handleOpenModal('user')} title="Nuevo Usuario">
                    <PlusCircle className="w-8 h-8 text-primary-500 hover:text-primary-700 transition-colors cursor-pointer" />
                </button>
            </PageHeader>

            <FilterBar search={search} handleSearch={(e) => setSearch(e.target.value)} placeholder="Buscar usuario por nombre, apellido o email..." />

            {loading ? (
                <div className="text-center py-12 text-gray-400 animate-pulse">Cargando usuarios...</div>
            ) : (
                <UserTable
                    users={filteredUsers}
                    onEdit={(u) => handleOpenModal('user', u)}
                    onDelete={(u) => handleOpenModal('deleteUser', u)}
                    onAssignRole={(u) => handleOpenModal('assignRole', u)}
                />
            )}

            {/* Modal Formulario de Usuario (Crear/Editar) */}
            <Modal isOpen={modalState.type === 'user'} onClose={handleCloseModal} title={modalState.data ? 'Editar Usuario' : 'Nuevo Usuario'}>
                <UserForm
                    initialData={modalState.data}
                    onSubmit={onSubmitUser}
                    onCancel={handleCloseModal}
                    isSubmitting={isSubmitting}
                    roles={roles} // Pasamos los roles para el selector
                />
            </Modal>

            {/* Modal Eliminar Usuario */}
            <Modal isOpen={modalState.type === 'deleteUser'} onClose={handleCloseModal} title="Eliminar Usuario">
                <ComponentModalEliminar
                    onSubmit={onDeleteUser}
                    data={modalState.data}
                    onCancel={handleCloseModal}
                    type="usuario"
                />
            </Modal>

            {/* Modal Asignar Rol a Usuario */}
            <Modal isOpen={modalState.type === 'assignRole'} onClose={handleCloseModal} title={`Asignar Rol a ${modalState.data?.nombre} ${modalState.data?.apellido}`}>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1 ml-1">Seleccionar Rol</label>
                        <select
                            value={modalState.data?.rolId || ''}
                            onChange={(e) => onAssignRoleToUser(modalState.data.id, e.target.value)}
                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                            disabled={isSubmitting}
                        >
                            <option value="">Sin Rol</option>
                            {roles.map(role => (
                                <option key={role.id} value={role.id}>{role.nombre}</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex justify-end pt-4">
                        <button
                            type="button"
                            onClick={handleCloseModal}
                            className="px-5 py-2 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                        >
                            Cerrar
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default UsersPage;
