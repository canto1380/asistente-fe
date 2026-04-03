import React, { useState, useEffect } from 'react';

const PermissionForm = ({ initialData, onSubmit, onCancel, isSubmitting }) => {
    const [formData, setFormData] = useState({
        codigo: '',
        descripcion: ''
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                codigo: initialData.codigo || '',
                descripcion: initialData.descripcion || ''
            });
        }
    }, [initialData]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1 ml-1">Código del Permiso</label>
                <input
                    type="text"
                    value={formData.codigo}
                    onChange={(e) => setFormData({ ...formData, codigo: e.target.value.toUpperCase() })}
                    required
                    placeholder="Ej: USER_CREATE"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                />
            </div>
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1 ml-1">Descripción</label>
                <textarea
                    value={formData.descripcion}
                    onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                    rows="3"
                    placeholder="Describe qué funcionalidades habilita este permiso..."
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                />
            </div>
            <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={onCancel} className="px-5 py-2 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors">
                    Cancelar
                </button>
                <button type="submit" disabled={isSubmitting || !formData.codigo.trim() || !formData.descripcion.trim()} className="px-5 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-xl shadow-lg shadow-primary-200 transition-all disabled:opacity-50">
                    {isSubmitting ? 'Guardando...' : initialData ? 'Actualizar Permiso' : 'Crear Permiso'}
                </button>
            </div>
        </form>
    );
};
export default PermissionForm;
