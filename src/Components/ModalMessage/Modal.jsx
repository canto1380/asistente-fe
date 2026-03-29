import { X, AlertTriangle, CheckCircle, Info } from 'lucide-react';

const ModalMessage = ({ isOpen, onClose, title, message, type = 'info', actionLabel, onAction }) => {
    if (!isOpen) return null;

    const config = {
        success: { icon: <CheckCircle className="w-12 h-12 text-green-500" />, color: 'bg-green-600 hover:bg-green-700' },
        error: { icon: <AlertTriangle className="w-12 h-12 text-red-500" />, color: 'bg-red-600 hover:bg-red-700' },
        info: { icon: <Info className="w-12 h-12 text-blue-500" />, color: 'bg-primary hover:bg-primary-hover' },
        warning: { icon: <AlertTriangle className="w-12 h-12 text-yellow-500" />, color: 'bg-yellow-600 hover:bg-yellow-700' },
    };

    const currentConfig = config[type] || config.info;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all scale-100">
                
                {/* Header con botón cerrar opcional */}
                <div className="flex justify-end p-2">
                    {onClose && (
                        <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                    )}
                </div>

                {/* Contenido */}
                <div className="px-6 pb-8 text-center">
                    <div className="flex justify-center mb-4">
                        {currentConfig.icon}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
                    <p className="text-gray-600 mb-6">{message}</p>

                    {/* Botón de Acción */}
                    <button
                        onClick={onAction || onClose}
                        className={`w-full py-3 px-4 text-white font-semibold rounded-xl shadow-md transition-all transform active:scale-[0.98] ${currentConfig.color}`}
                    >
                        {actionLabel || 'Aceptar'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ModalMessage;
