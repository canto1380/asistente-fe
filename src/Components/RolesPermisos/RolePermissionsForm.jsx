import React, { useState } from 'react';
import { Search, ShieldCheck } from 'lucide-react';

const RolePermissionsForm = ({ role, allPermissions, assignedPermissionIds, onUpdate, onCancel, isSubmitting }) => {
    const [search, setSearch] = useState('');
    const [selectedIds, setSelectedIds] = useState(assignedPermissionIds || []);

    console.log('role:', role)
    console.log('allPermissions', allPermissions)
    console.log('assignedPermissionIds', assignedPermissionIds)

    const togglePermission = (id) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
        );
    };

    const filtered = allPermissions.filter(p =>
        p.codigo.toLowerCase().includes(search.toLowerCase()) ||
        p.descripcion?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-4">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                    type="text"
                    placeholder="Buscar permisos..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
            </div>

            <div className="max-h-[400px] overflow-y-auto pr-2 space-y-2 custom-scrollbar">
                {filtered.map((permiso) => (
                    <div
                        key={permiso.id}
                        className="flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors"
                    >
                        <div className="flex items-center gap-3">
                            <ShieldCheck className={`w-5 h-5 ${selectedIds.includes(permiso.id) ? 'text-primary-600' : 'text-gray-300'}`} />
                            <div>
                                <p className="text-sm font-medium text-gray-900">{permiso.codigo}</p>
                                <p className="text-xs text-gray-500 line-clamp-1">{permiso.descripcion}</p>
                            </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                className="sr-only peer"
                                checked={selectedIds.includes(permiso.id)}
                                onChange={() => togglePermission(permiso.id)}
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                        </label>
                    </div>
                ))}
                {filtered.length === 0 && (
                    <p className="text-center py-10 text-gray-400 italic text-sm">No se encontraron permisos.</p>
                )}
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
                <button type="button" onClick={onCancel} className="px-5 py-2 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors">
                    Cerrar
                </button>
                <button
                    onClick={() => onUpdate(selectedIds)}
                    disabled={isSubmitting}
                    className="px-5 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-xl shadow-lg shadow-primary-200 transition-all disabled:opacity-50"
                >
                    {isSubmitting ? 'Guardando...' : 'Guardar Cambios'}
                </button>
            </div>
        </div>
    );
};

export default RolePermissionsForm;
