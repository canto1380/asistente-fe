import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const PrivateRoutes = ({ requiredPermission, requiredRole }) => {
    const { user, loading } = useAuth()
    if (loading) return <div className="p-4 text-center">Verificando sesión...</div>;
    if (!user) return <Navigate to="/login" />;

    // 1. Validar Permiso (si se requiere)
    if (requiredPermission && !hasPermission(requiredPermission || 'Todos')) {
        return <Navigate to="/" replace />;
    }

    // 2. Validar Rol (si se requiere)
    if (requiredRole) {
        const rolesPermitidos = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
        if (!user.role || !rolesPermitidos.includes(user.role)) {
            return <Navigate to="/" replace />;
        }
    }

    return <Outlet />;
}