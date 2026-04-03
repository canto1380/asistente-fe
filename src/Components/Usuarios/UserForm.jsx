import React, { useState, useEffect } from 'react';

const UserForm = ({ initialData, onSubmit, onCancel, isSubmitting, roles }) => {
    const [formData, setFormData] = useState({
        nombre: '',
        apellido: '',
        email: '',
        password: '',
        roleId: ''
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                nombre: initialData.nombre || '',
                apellido: initialData.apellido || '',
                email: initialData.email || '',
                password: '', // La contraseña no se precarga por seguridad
                roleId: initialData.rolId || ''
            });
        } else {
            setFormData({
                nombre: '',
                apellido: '',
                email: '',
                password: '',
                roleId: ''
            });
        }
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    const isFormValid = formData.nombre.trim() && formData.apellido.trim() && formData.email.trim() && (initialData ? true : formData.password.trim());

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1 ml-1">Nombre</label>
                    <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} required placeholder="Nombre" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm" />
                </div>
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1 ml-1">Apellido</label>
                    <input type="text" name="apellido" value={formData.apellido} onChange={handleChange} required placeholder="Apellido" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm" />
                </div>
            </div>
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1 ml-1">Email</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="email@ejemplo.com" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm" />
            </div>
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1 ml-1">Contraseña {initialData ? '(dejar vacío para no cambiar)' : ''}</label>
                <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder={initialData ? '********' : 'Contraseña'} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm" />
            </div>
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1 ml-1">Rol</label>
                <select name="roleId" value={formData.roleId} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm">
                    <option value="">Selecciona un rol</option>
                    {roles.map(role => (
                        <option key={role.id} value={role.id}>{role.nombre}</option>
                    ))}
                </select>
            </div>
            <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={onCancel} className="px-5 py-2 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors">
                    Cancelar
                </button>
                <button type="submit" disabled={isSubmitting || !isFormValid} className="px-5 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-xl shadow-lg shadow-primary-200 transition-all disabled:opacity-50">
                    {isSubmitting ? 'Guardando...' : initialData ? 'Actualizar Usuario' : 'Crear Usuario'}
                </button>
            </div>
        </form>
    );
};

export default UserForm;
