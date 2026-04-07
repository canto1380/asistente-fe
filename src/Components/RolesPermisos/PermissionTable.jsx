import React, { useState } from 'react';
import { Edit, Trash2, Eye, Key, ArrowUpDown } from 'lucide-react';

const PermissionTable = ({ permisos, onEdit, onDelete, onView }) => {
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' })

    // -- Logica de ordenamiento -- //
    const sortedPermisos = [...permisos].sort((a, b) => {
        if (!sortConfig.key) return 0

        let aValue = a[sortConfig.key]
        let bValue = b[sortConfig.key]

        // -- Manejo especial para fechas -- //
        if (sortConfig.key === 'fechaVencimiento') {
            aValue = new Date(aValue || 0).getTime()
            bValue = new Date(bValue || 0).getTime()
        }

        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1
        return 0
    })

    const requestSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };
    return (
        <div className="overflow-x-auto bg-white rounded-xl shadow-sm border border-gray-100 mt-2">
            <table className="w-full text-left border-collapse table-auto">
                <thead>
                    <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase text-gray-500 font-semibold">
                        <th className="p-3 cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => requestSort('codigo')}>
                            <div className="flex items-center gap-1">Permiso <ArrowUpDown className="w-3 h-3 text-gray-400" /></div>
                        </th>
                        <th className="p-3 cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => requestSort('descripcion')}>
                            <div className="flex items-center gap-1">Descripción <ArrowUpDown className="w-3 h-3 text-gray-400" /></div>
                        </th>
                        <th className="p-4 text-right">Acciones</th>
                    </tr>
                </thead>
                <tbody className="text-sm text-gray-700 divide-y divide-gray-50">
                    {sortedPermisos.length > 0 ? (
                        sortedPermisos.map((p) => (
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

                        )
                        )) : (
                        <tr><td colSpan="6" className="p-8 text-center text-gray-500">No hay permisos para mostrar.</td></tr>
                    )
                    }
                </tbody>
            </table>
        </div>
    );
};
export default PermissionTable;
