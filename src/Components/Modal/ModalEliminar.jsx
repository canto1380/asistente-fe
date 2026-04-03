import { AlertTriangle } from 'lucide-react';

const ComponentModalEliminar = ({ onSubmit, data, onCancel, type }) => {
    console.log(data)
    const handleSubmit = () => {
        onSubmit(data.id);
    };

    return (
        <div className="flex flex-col items-center text-center py-2">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
            
            <h3 className="text-xl font-bold text-gray-900 mb-2">¿Confirmar eliminación?</h3>
            
            <p className="text-gray-500 text-sm mb-8 leading-relaxed">
                Estás a punto de eliminar el/la {type}: <br />
                <span className="font-semibold text-gray-800 text-base italic">"{data?.titulo || data?.nombre}"</span>.
                <br />Esta acción no se puede deshacer y borrará los gastos asociados.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 w-full">
                <button onClick={onCancel} className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-all active:scale-95">
                    No, cancelar
                </button>
                <button onClick={handleSubmit} className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-red-600 rounded-xl hover:bg-red-700 transition-all shadow-lg shadow-red-200 active:scale-95">
                    Sí, eliminar
                </button>
            </div>
        </div>
    );
};

export default ComponentModalEliminar;