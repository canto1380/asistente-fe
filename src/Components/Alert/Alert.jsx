import { useEffect } from 'react';
import { AlertCircle, CheckCircle, XCircle, Info } from 'lucide-react';

const Alert = ({ message, type, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 10000);

        return () => clearTimeout(timer);
    }, [onClose]);

    const alertConfig = {
        success: {
            borderClass: 'border-green-500',
            textClass: 'text-green-500',
            icon: <CheckCircle className="w-5 h-5" />
        },
        error: {
            borderClass: 'border-red-500',
            textClass: 'text-red-500',
            icon: <XCircle className="w-5 h-5" />
        },
        warning: {
            borderClass: 'border-yellow-500',
            textClass: 'text-yellow-500',
            icon: <AlertCircle className="w-5 h-5" />
        },
        info: {
            borderClass: 'border-blue-500',
            textClass: 'text-blue-500',
            icon: <Info className="w-5 h-5" />
        }
    };

    const currentAlert = alertConfig[type] || alertConfig.success;

    return (
        <div
            className={`fixed top-10 right-4 z-50 flex items-center w-full max-w-xs p-4 mb-4 text-gray-500 bg-white rounded-lg shadow-lg border-l-4 ${currentAlert.borderClass} animate-fade-in-down transition-all duration-300`}
            role="alert"
        >
            <div className={`inline-flex items-center justify-center flex-shrink-0 w-8 h-8 ${currentAlert.textClass} rounded-lg`}>
                {currentAlert.icon}
            </div>
            <div className="ml-3 text-sm font-normal">{message}</div>
            <button
                type="button"
                className="ml-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex h-8 w-8"
                onClick={onClose}
            >
                <span className="sr-only">Cerrar</span>
                <XCircle className="w-5 h-5" />
            </button>
        </div>
    );
};

export default Alert;
