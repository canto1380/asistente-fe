import React from 'react';
import { Edit, Trash2, Eye, Key } from 'lucide-react';

const PermissionTable = ({ permisos, onEdit, onDelete, onView }) => {
    return (
        <div className="overflow-x-auto bg-white rounded-xl shadow-sm border border-gray-100 mt-2">
            <table className="w-full text-left border-collapse table-auto">
                <thead>
                    <tr className="bg-gray-50 border-b border-gray-100 text-xs uppercase text-gray-500 font-semibold">
                        <th className="p-4">Permiso</th>
                        <th className="p-4">Descripción</th>
                        <th className="p-4 text-right">Acciones</th>
                    </tr>
                </thead>
                <tbody className="text-sm text-gray-700 divide-y divide-gray-50">
                    {permisos.map((p) => (
                        <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                            <td className="p-4">
                                <div className="flex items-center gap-3">
                                    <Key className="w-4 h-4 hidden md:block text-indigo-600" />
                                    <span className="font-medium text-gray-900">{p.codigo}</span>
                                </div>
                            </td>
                            <td className="p-4 text-gray-500 max-w-xs truncate">{p.descripcion || '-'}</td>
                            <td className="p-4 text-right">
                                <div className="flex items-center justify-end gap-1">
                                    <button onClick={() => onView(p)} className="p-2 hover:bg-gray-100 text-gray-600 rounded-lg transition-colors" title="Ver Detalle">
                                        <Eye className="w-4 h-4" />
                                    </button>
                                    <button onClick={() => onEdit(p)} className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors" title="Editar">
                                        <Edit className="w-4 h-4" />
                                    </button>
                                    <button onClick={() => onDelete(p)} className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors" title="Eliminar">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
export default PermissionTable;
