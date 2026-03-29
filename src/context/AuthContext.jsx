import { createContext, useContext, useState, useEffect } from "react";
// Importamos nuestra instancia personalizada de axios
import api from "../api/axios";
import { jwtDecode } from "jwt-decode";
import ModalMessage from "../Components/ModalMessage/Modal";

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
    // Inicializamos el usuario leyendo del localStorage si existe
    const [user, setUser] = useState(() => {
        const savedToken = localStorage.getItem('token');

        if (savedToken) {
            try {
                // Decodificamos el token para recuperar la sesión completa
                const decoded = jwtDecode(savedToken);
                return {
                    token: savedToken,
                    id: decoded.sub,
                    email: decoded.email,
                    role: decoded.role,
                    nombre: decoded.nombre,
                    apellido: decoded.apellido
                };
            } catch (error) {
                localStorage.removeItem('token'); // Si el token es inválido, lo borramos
                return null;
            }
        }
        return null;
    });

    const [loading, setLoading] = useState(false) // Para carga inicial de sesión (si validamos token)
    const [error, setError] = useState(null)
    const [sessionExpired, setSessionExpired] = useState(false); // Estado para mostrar el modal

    // Función de Login
    const login = async (email, password) => {
        try {
            // Ajusta la URL si tu backend corre en otro puerto
            const response = await api.post('/auth/login', {
                email,
                password
            });
            const { access_token, refresh_token } = response.data;

            // Decodificamos el token recién llegado para tener la misma estructura siempre
            const decoded = jwtDecode(access_token);

            localStorage.setItem('token', access_token);
            localStorage.setItem('refreshToken', refresh_token); // Guardamos el refresh token
            setUser({
                token: access_token,
                id: decoded.sub,
                ...decoded // Esto incluye email, role, nombre, apellido
            });
            return { success: true };
        } catch (err) {
            // Retornamos el mensaje de error del backend o uno genérico
            return {
                success: false,
                message: err.response?.data?.message || 'Error al iniciar sesión'
            };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        setUser(null);
        setSessionExpired(false);
    };

    // Configuración de Interceptores de Axios
    useEffect(() => {
        // Interceptor de Respuesta
        // Lo adjuntamos a nuestra instancia 'api'
        const responseInterceptor = api.interceptors.response.use(
            (response) => response,
            async (error) => {
                const originalRequest = error.config;

                // Excluimos las rutas de autenticación de la lógica de refresco.
                // Si el login o el refresh fallan con 401, no debemos intentar refrescar el token.
                if (originalRequest.url.includes('/auth/login') || originalRequest.url.includes('/auth/refresh')) {
                    return Promise.reject(error);
                }

                // Si el error es 401 (No autorizado) y no hemos reintentado aún
                if (error.response?.status === 401 && !originalRequest._retry) {
                    originalRequest._retry = true;

                    try {
                        const refreshToken = localStorage.getItem('refreshToken');
                        if (!refreshToken) throw new Error('No hay refresh token');

                        // Intentamos obtener un nuevo access token
                        const { data } = await api.post('/auth/refresh', {
                            refresh_token: refreshToken
                        });

                        // Guardamos el nuevo token
                        localStorage.setItem('token', data.access_token);

                        // Actualizamos el usuario en el estado (opcional, para mantener sync)
                        const decoded = jwtDecode(data.access_token);
                        setUser(prev => ({ ...prev, token: data.access_token, ...decoded }));

                        // Actualizamos el header de la petición original y reintentamos
                        originalRequest.headers['Authorization'] = `Bearer ${data.access_token}`;
                        return api(originalRequest);

                    } catch (refreshError) {
                        // Si falla el refresh (token vencido o inválido), cerramos sesión
                        // y mostramos el modal de sesión expirada.
                        setSessionExpired(true);
                        // localStorage.removeItem('token');
                        // localStorage.removeItem('refreshToken');
                        // setUser(null);
                        return Promise.reject(refreshError);
                    }
                }
                return Promise.reject(error);
            }
        );

        // Limpieza al desmontar
        return () => {
            api.interceptors.response.eject(responseInterceptor);
        };
    }, []);

    return (
        <AuthContext.Provider value={{ user, login, logout, loading, setLoading }}>
            {loading ? (
                <div>Cargando...</div>
            ) : (
                <>
                    {children}
                    {/* Modal de Sesión Expirada */}
                    <ModalMessage
                        isOpen={sessionExpired}
                        title="Sesión Caducada"
                        message="Tu sesión ha expirado por seguridad. Por favor, inicia sesión nuevamente."
                        type="warning"
                        actionLabel="Ir al Login"
                        onAction={() => logout()} // Al cerrar, el usuario ya es null, así que el router lo mandará al login
                    />
                </>
            )}
        </AuthContext.Provider>
    )
}
export const useAuth = () => useContext(AuthContext)