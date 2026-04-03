import React from 'react';
import { Edit, Trash2, Folder } from 'lucide-react';

const CategoriaGastoTable = ({ categorias, onEdit, onDelete }) => {
    return (
        <div className="overflow-x-auto bg-white rounded-xl shadow-sm border border-gray-100 mt-2">
            <table className="w-full text-left border-collapse table-auto">
                <thead>
                    <tr className="bg-gray-50 border-b border-gray-100 text-xs uppercase text-gray-500 font-semibold">
                        <th className="p-4">Nombre de Categoría</th>
                        <th className="p-4 text-right">Acciones</th>
                    </tr>
                </thead>
                <tbody className="text-sm text-gray-700 divide-y divide-gray-50">
                    {categorias.length > 0 ? (
                        categorias.map((cat) => (
                            <tr key={cat.id} className="hover:bg-gray-50/50 transition-colors">
                                <td className="p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-primary-50 rounded-lg">
                                            <Folder className="w-4 h-4 text-primary-600" />
                                        </div>
                                        <span className="font-medium text-gray-900">{cat.nombre}</span>
                                    </div>
                                </td>
                                <td className="p-4 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <button 
                                            onClick={() => onEdit(cat)} 
                                            className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors"
                                            title="Editar"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </button>
                                        <button 
                                            onClick={() => onDelete(cat)} 
                                            className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors"
                                            title="Eliminar"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="2" className="p-10 text-center text-gray-500 italic">
                                No tienes categorías personalizadas creadas.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default CategoriaGastoTable;
