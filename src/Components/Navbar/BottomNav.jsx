import { LogOut } from "lucide-react";
import { Link } from "react-router-dom";

const BottomNav = ({ isActive, navItems, logout }) => {
    return (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-30 flex justify-around items-center pb-safe">
            {navItems.map((item) => (
                <Link
                    key={item.path}
                    to={item.path}
                    className={`flex flex-col items-center justify-center w-full py-2 ${isActive(item.path) ? 'text-primary-900' : 'text-gray-400 hover:text-gray-600'
                        }`}
                >
                    <div className={`${isActive(item.path) ? 'scale-110' : ''} transition-transform`}>
                        {item.icon}
                    </div>
                    <span className="text-[10px] mt-1 font-medium">{item.label}</span>
                </Link>
            ))}
            <button
                onClick={logout}
                className="flex flex-col items-center justify-center w-full py-2 text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                title="Cerrar Sesión"
            >
                <LogOut className="w-5 h-5" />
                <span className="text-[10px] mt-1 font-medium">Salir</span>
            </button>
        </nav>
    )
};

export default BottomNav;