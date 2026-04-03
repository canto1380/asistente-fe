import React, { useState, useEffect } from 'react';

const CategoriaGastoForm = ({ initialData, onSubmit, onCancel, isSubmitting }) => {
    const [nombre, setNombre] = useState('');

    useEffect(() => {
        if (initialData) {
            setNombre(initialData.nombre || '');
        }
    }, [initialData]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ nombre });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label htmlFor="nombre" className="block text-sm font-semibold text-gray-700 mb-1 ml-1">
                    Nombre de la Categoría
                </label>
                <input
                    type="text"
                    id="nombre"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    required
                    placeholder="Ej: Alimentación, Transporte, Ocio..."
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-sm"
                />
            </div>

            <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={onCancel} className="px-5 py-2.5 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors">
                    Cancelar
                </button>
                <button type="submit" disabled={isSubmitting || !nombre.trim()} className="px-5 py-2.5 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-xl shadow-lg shadow-primary-200 transition-all disabled:opacity-50">
                    {isSubmitting ? 'Guardando...' : initialData ? 'Actualizar Categoría' : 'Crear Categoría'}
                </button>
            </div>
        </form>
    );
};

export default CategoriaGastoForm;
