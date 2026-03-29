import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useAlert } from '../context/alertContext';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, LogIn, Eye, EyeOff } from 'lucide-react';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { login } = useAuth();
    const [showPassword, setShowPassword] = useState(false); // Nuevo estado para la visibilidad de la contraseña
    const { showAlert } = useAlert();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const result = await login(email, password);
        if (result.success) {
            showAlert('¡Bienvenido de nuevo!', 'success');
            navigate('/');
        } else {
            showAlert(result.message, 'error');
        }

        setIsSubmitting(false);
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-slate-100 px-4"> {/* Añadido px-4 para padding en pantallas pequeñas */}
            {/* Tarjeta de Login */}
            <div className="w-full max-w-xs bg-secondary-50 rounded-2xl shadow-xl border border-surface-border overflow-hidden pb-2"> {/* Ensanchado a max-w-md */}
                
                {/* Encabezado */}
                <div className="bg-primary p-8 text-center">
                    <div className="mx-auto bg-white/20 w-12 h-12 rounded-full flex items-center justify-center mb-4 backdrop-blur-sm">
                        <LogIn className="w-6 h-6 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-white tracking-wide">Bienvenido</h2>
                    <p className="text-primary-foreground/80 text-sm mt-1">Ingresa a tu asistente personal</p>
                </div>

                {/* Formulario */}
                <div className="p-8 pt-10">
                    <form onSubmit={handleSubmit} className="space-y-6">

                        {/* Input Email */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-text-title ml-1">Correo Electrónico</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 bg-background border border-surface-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-sm text-text-body placeholder:text-text-muted/50"
                                    placeholder="ejemplo@correo.com"
                                />
                            </div>
                        </div>

                        {/* Input Password */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-text-title ml-1">Contraseña</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted pointer-events-none" /> {/* Añadido pointer-events-none */}
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-10 pr-10 py-3 bg-background border border-surface-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-sm text-text-body placeholder:text-text-muted/50"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-primary focus:outline-none"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />} {/* Icono de ojo */}
                                </button>
                            </div>
                        </div>

                        {/* Botón Submit */}
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-primary hover:bg-primary-hover text-white font-bold py-3.5 rounded-xl shadow-lg shadow-primary/30 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed mt-4"
                        >
                            {isSubmitting ? 'Ingresando...' : 'Iniciar Sesión'}
                        </button>
                    </form>
                </div>
                {/* Footer simple */}
                <div>
                    <p className="text-center text-text-muted text-sm mt-8">
                        ¿No tienes cuenta? <span className="text-primary font-semibold cursor-pointer hover:underline" onClick={() => navigate('/register')}>Regístrate aquí</span>
                    </p>
                </div>
            </div>

        </div>
    );
};

export default LoginPage;