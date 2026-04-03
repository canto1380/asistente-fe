import React, { useState, useEffect, useCallback } from 'react';
import PageHeader from '../Components/HeaderPage/PageHeader';
import FilterBar from '../Components/Filter/FilterBar';
import Modal from '../Components/Modal/Modal';
import ComponentModalEliminar from '../Components/Modal/ModalEliminar';
import { PlusCircle, Shield, Settings, Edit, Trash2 } from 'lucide-react';
import api from '../api/axios';
import { useAlert } from '../context/alertContext';

import RoleForm from '../Components/RolesPermisos/RoleForm';
import RolePermissionsForm from '../Components/RolesPermisos/RolePermissionsForm';
import PermissionTable from '../Components/RolesPermisos/PermissionTable';
import PermissionForm from '../Components/RolesPermisos/PermissionForm';

const RolesPermisosPage = () => {
    const [roles, setRoles] = useState([]);
    const [permisos, setPermisos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [searchPermiso, setSearchPermiso] = useState('');
    const { showAlert } = useAlert();

    // Estados para Modales
    const [modalState, setModalState] = useState({
        type: null, // 'role', 'permission', 'rolePermissions', 'deleteRole', 'deletePermission', 'viewPermission'
        data: null
    });

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const [rolesRes, permisosRes] = await Promise.all([
                api.get('roles'),
                api.get('permisos')
            ]);
            setRoles(rolesRes.data);
            setPermisos(permisosRes.data);
        } catch (error) {
            showAlert('Error al cargar datos de seguridad', 'error');
        } finally {
            setLoading(false);
        }
    }, [showAlert]);

    useEffect(() => { fetchData(); }, [fetchData]);

    const handleOpenModal = async (type, data = null) => {
        // Si abrimos la gestión de permisos, traemos los datos frescos del rol
        if (type === 'rolePermissions' && data) {
            try {
                const response = await api.get(`permisos/permisosPorRol/${data.id}`);
                // Extraemos solo los IDs de los permisos asignados
                const assignedPermissionIds = response.data.map(rp => rp.permiso.id);
                setModalState({ type, data: { ...data, assignedPermissionIds } });
            } catch (error) {
                showAlert('Error al cargar permisos del rol', 'error');
                return;
            }
        } else {
            setModalState({ type, data });
        }
    };
    console.log('modalState', modalState)

    const handleCloseModal = () => setModalState({ type: null, data: null });

    // --- Lógica de Roles ---
    const onSubmitRole = async (formData) => {
        setIsSubmitting(true);

        try {
            if (modalState.data?.id) {
                await api.patch(`roles/${modalState.data.id}`, formData);
                showAlert('Rol actualizado', 'success');
            } else {
                await api.post('roles', formData);
                showAlert('Rol creado', 'success');
            }
            fetchData();
            handleCloseModal();
        } catch (error) {
            showAlert(error.response?.data?.message || 'Error en operación', 'error');
        } finally { setIsSubmitting(false); }
    };
    console.log(modalState)
    const onDeleteRole = async (id) => {
        setIsSubmitting(true);
        try {
            await api.delete(`roles/${id}`);
            showAlert('Rol eliminado', 'success');
            fetchData();
            handleCloseModal();
        } catch (error) {
            showAlert(error.response?.data?.message || 'No se puede eliminar un rol asignado a usuarios', 'error');
        } finally { setIsSubmitting(false); }
    };

    const onUpdateRolePermissions = async (newPermissionIds) => {
        setIsSubmitting(true);
        const originalIds = modalState.data.assignedPermissionIds || [];
        
        // Identificamos qué permisos cambiaron (agregados o eliminados)
        const added = newPermissionIds.filter(id => !originalIds.includes(id));
        const removed = originalIds.filter(id => !newPermissionIds.includes(id));
        const changes = [...added, ...removed];

        try {
            // Tu backend usa un toggle (POST /:rolId/:permisoId)
            // Ejecutamos todas las peticiones necesarias
            await Promise.all(changes.map(permisoId => 
                api.post(`roles/${modalState.data.id}/${permisoId}`)
            ));
            
            showAlert('Permisos actualizados con éxito', 'success');
            fetchData();
            handleCloseModal();
        } catch (error) {
            showAlert('Error al actualizar permisos', 'error');
        } finally { setIsSubmitting(false); }
    };

    // --- Lógica de Permisos ---
    const onSubmitPermission = async (formData) => {
        setIsSubmitting(true);
        try {
            if (modalState.data?.id) {
                await api.patch(`permisos/${modalState.data.id}`, formData);
                showAlert('Permiso actualizado', 'success');
            } else {
                await api.post('permisos', formData);
                showAlert('Permiso creado', 'success');
            }
            fetchData();
            handleCloseModal();
        } catch (error) {
            showAlert(error.response?.data?.message || 'Error en operación', 'error');
        } finally { setIsSubmitting(false); }
    };

    const onDeletePermission = async (id) => {
        setIsSubmitting(true);
        try {
            await api.delete(`permisos/${id}`);
            showAlert('Permiso eliminado', 'success');
            fetchData();
            handleCloseModal();
        } catch (error) {
            showAlert(error.response?.data?.message || 'No se puede eliminar un permiso vinculado a roles', 'error');
        } finally { setIsSubmitting(false); }
    };

    const filteredPermisos = permisos.filter(p =>
        p.codigo?.toLowerCase().includes(searchPermiso.toLowerCase()) ||
        p.descripcion?.toLowerCase().includes(searchPermiso.toLowerCase())
    );

    return (
        <div className="space-y-10 pb-20">
            {/* SECCIÓN ROLES */}
            <section>
                <PageHeader title="Roles">
                    <button onClick={() => handleOpenModal('role')} title="Nuevo Rol">
                        <PlusCircle className="w-8 h-8 text-primary-500 hover:text-primary-700 transition-colors cursor-pointer" />
                    </button>
                </PageHeader>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                    {roles.map(role => (
                        <div key={role.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between hover:border-primary-100 transition-all">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-primary-50 rounded-lg"><Shield className="w-5 h-5 text-primary-600" /></div>
                                <h3 className="font-bold text-gray-900 leading-tight truncate">{role.nombre}</h3>
                            </div>
                            <div className="flex items-center justify-end gap-1 pt-3 border-t border-gray-50">
                                <button onClick={() => handleOpenModal('rolePermissions', role)} className="p-2 hover:bg-orange-50 text-orange-600 rounded-lg transition-colors" title="Gestionar Permisos"><Settings className="w-4 h-4" /></button>
                                <button onClick={() => handleOpenModal('role', role)} className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors" title="Editar"><Edit className="w-4 h-4" /></button>
                                <button onClick={() => handleOpenModal('deleteRole', role)} className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors" title="Eliminar"><Trash2 className="w-4 h-4" /></button>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* SECCIÓN PERMISOS */}
            <section>
                <PageHeader title="Permisos">
                    <button onClick={() => handleOpenModal('permission')} title="Nuevo Permiso">
                        <PlusCircle className="w-8 h-8 text-indigo-500 hover:text-indigo-700 transition-colors cursor-pointer" />
                    </button>
                </PageHeader>
                <FilterBar search={searchPermiso} handleSearch={(e) => setSearchPermiso(e.target.value)} placeholder="Buscar permiso por nombre o descripción..." />

                {loading ? (
                    <div className="text-center py-10 text-gray-400">Cargando seguridad...</div>
                ) : (
                    <PermissionTable
                        permisos={filteredPermisos}
                        onEdit={(p) => handleOpenModal('permission', p)}
                        onDelete={(p) => handleOpenModal('deletePermission', p)}
                        onView={(p) => handleOpenModal('viewPermission', p)}
                    />
                )}
            </section>

            {/* MODALES DINÁMICOS */}
            <Modal isOpen={modalState.type === 'role'} onClose={handleCloseModal} title={modalState.data ? 'Editar Rol' : 'Nuevo Rol'}>
                <RoleForm initialData={modalState.data} onSubmit={onSubmitRole} onCancel={handleCloseModal} isSubmitting={isSubmitting} />
            </Modal>

            <Modal isOpen={modalState.type === 'rolePermissions'} onClose={handleCloseModal} title={`Permisos para el rol: ${modalState.data?.nombre}`}>
                <RolePermissionsForm
                    role={modalState.data}
                    allPermissions={permisos}
                    assignedPermissionIds={modalState.data?.assignedPermissionIds}
                    onUpdate={onUpdateRolePermissions}
                    onCancel={handleCloseModal}
                    isSubmitting={isSubmitting}
                />
            </Modal>

            <Modal isOpen={modalState.type === 'permission'} onClose={handleCloseModal} title={modalState.data ? 'Editar Permiso' : 'Nuevo Permiso'}>
                <PermissionForm initialData={modalState.data} onSubmit={onSubmitPermission} onCancel={handleCloseModal} isSubmitting={isSubmitting} />
            </Modal>

            <Modal isOpen={modalState.type === 'deleteRole'} onClose={handleCloseModal} title="Eliminar Rol">
                <ComponentModalEliminar onSubmit={onDeleteRole} data={modalState.data} onCancel={handleCloseModal} type="rol" />
            </Modal>

            <Modal isOpen={modalState.type === 'deletePermission'} onClose={handleCloseModal} title="Eliminar Permiso">
                <ComponentModalEliminar onSubmit={onDeletePermission} data={modalState.data} onCancel={handleCloseModal} type="permiso" />
            </Modal>

            <Modal isOpen={modalState.type === 'viewPermission'} onClose={handleCloseModal} title="Detalle del Permiso">
                <div className="space-y-4">
                    <div><p className="text-xs font-bold text-gray-400 uppercase">Código</p><p className="text-sm font-semibold">{modalState.data?.codigo}</p></div>
                    <div><p className="text-xs font-bold text-gray-400 uppercase">Descripción</p><p className="text-sm text-gray-600 leading-relaxed">{modalState.data?.descripcion || 'Sin descripción'}</p></div>
                    <div className="flex justify-end pt-4"><button onClick={handleCloseModal} className="px-5 py-2 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors">Cerrar</button></div>
                </div>
            </Modal>
        </div>
    );
};

export default RolesPermisosPage;
