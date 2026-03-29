import { LogOut } from "lucide-react";
import { Link } from "react-router-dom";
import LogoImg from '../../../public/logo-horizontal-1.png'

const SidebarDesktop = ({ isActive, navItems, logout, user }) => {
    return (
        <aside className="hidden md:flex flex-col w-60 h-screen fixed left-0 top-0 bg-white border-r border-gray-200 z-30">

            {/* Header Sidebar */}
            <div className="p-4 border-b border-gray-100 flex flex-col items-center">
                <img src={LogoImg} alt="Logo" className="h-18 object-contain" />
            </div>

            {/* ITEMS */}
            <nav className="flex-1 overflow-y-auto p-2 space-y-1">
                {navItems.map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors duration-200 ${isActive(item.path)
                            ? 'bg-surface-border text-title font-semibold'
                            : 'text-body hover:bg-gray-100 hover:text-primary-700'
                            }`}
                    >
                        {item.icon}
                        <span>{item.label}</span>
                    </Link>
                ))}
            </nav>

            {/* Footer Sidebar (Usuario) */}
            <div className="p-4 border-t border-gray-200 bg-gray-50">
                <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-3 overflow-hidden">
                        {/* Avatar */}
                        <div className="w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold shadow-sm shrink-0">
                            {user?.nombre?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        {/* Info */}
                        <div className="flex flex-col overflow-hidden">
                            <p className="text-sm font-semibold text-gray-900 truncate" title={user?.nombre}>{user?.nombre || 'Usuario'}</p>
                            <p className="text-xs text-gray-500 truncate capitalize">{user?.role?.toLowerCase() || 'Rol'}</p>
                        </div>
                    </div>
                    
                    {/* Botón Logout */}
                    <button
                        onClick={logout}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                        title="Cerrar Sesión"
                    >
                        <LogOut className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </aside>
    )
}

export default SidebarDesktop