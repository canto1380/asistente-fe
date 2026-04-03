import React from 'react';
import { Edit, Trash2, User, Shield, Mail } from 'lucide-react';

const UserTable = ({ users, onEdit, onDelete, onAssignRole }) => {
    console.log(users)
    return (
        <div className="overflow-x-auto bg-white rounded-xl shadow-sm border border-gray-100 mt-2">
            <table className="w-full text-left border-collapse table-auto">
                <thead>
                    <tr className="bg-gray-50 border-b border-gray-100 text-xs uppercase text-gray-500 font-semibold">
                        <th className="p-4">Usuario</th>
                        <th className="p-4">Email</th>
                        <th className="p-4">Rol</th>
                        <th className="p-4 text-right">Acciones</th>
                    </tr>
                </thead>
                <tbody className="text-sm text-gray-700 divide-y divide-gray-50">
                    {users.length > 0 ? (
                        users.map((user) => (
                            <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                                <td className="p-4">
                                    <div className="flex items-center gap-3">
                                        <User className="w-4 h-4 hidden md:block text-blue-600" />
                                        <span className="font-medium text-gray-900">{user.nombre} {user.apellido}</span>
                                    </div>
                                </td>
                                <td className="p-4">
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <Mail className="w-4 h-4 hidden md:block" />
                                        <span>{user.email}</span>
                                    </div>
                                </td>
                                <td className="p-4">
                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium`}>
                                        {user.role?.nombre || 'Sin Rol'}
                                    </span>
                                </td>
                                <td className="p-4 text-right">
                                    <div className="flex items-center justify-end gap-1">
                                        <button onClick={() => onAssignRole(user)} className="p-2 hover:bg-purple-50 text-purple-600 rounded-lg transition-colors" title="Asignar Rol">
                                            <Shield className="w-4 h-4" />
                                        </button>
                                        <button onClick={() => onEdit(user)} className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors" title="Editar">
                                            <Edit className="w-4 h-4" />
                                        </button>
                                        <button onClick={() => onDelete(user)} className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors" title="Eliminar">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4" className="p-10 text-center text-gray-500 italic">
                                No hay usuarios registrados.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default UserTable;
