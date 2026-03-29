import { useState, useEffect } from 'react';
import { ESTADOS_TAREA } from '../../utils/constants';
import { Info, CheckCircle2, Clock, XCircle } from 'lucide-react';

const StatusUpdateForm = ({ initialData, onSubmit, onCancel, isSubmitting }) => {
    const [estado, setEstado] = useState(initialData?.estado || 'PENDIENTE');
    const [activo, setActivo] = useState(initialData?.activo || true);

    // Lógica para actualizar 'activo' cuando 'estado' cambia
    useEffect(() => {
        const newActivo = estado !== 'COMPLETADA' && estado !== 'CANCELADA';
        setActivo(newActivo);
    }, [estado]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ estado });
    };

    const getStatusIcon = () => {
        if (estado === 'COMPLETADA') return <CheckCircle2 className="w-5 h-5 text-green-600" />;
        if (estado === 'CANCELADA') return <XCircle className="w-5 h-5 text-red-600" />;
        return <Clock className="w-5 h-5 text-yellow-600" />;
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                <label htmlFor="estado" className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1">
                    Nuevo Estado
                </label>
                <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2">
                        {getStatusIcon()}
                    </div>
                    <select
                        id="estado"
                        name="estado"
                        value={estado}
                        onChange={(e) => setEstado(e.target.value)}
                        className="block w-full pl-10 pr-4 py-3 rounded-xl border-gray-200 shadow-sm focus:border-primary-500 focus:ring-primary-500 text-sm font-medium transition-all"
                    >
                        {ESTADOS_TAREA.map(e => (
                            <option key={e.value} value={e.value}>{e.label}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className={`p-4 rounded-xl border flex gap-3 ${activo ? 'bg-emerald-50 border-emerald-100' : 'bg-slate-50 border-slate-200'}`}>
                <Info className={`w-5 h-5 flex-shrink-0 ${activo ? 'text-emerald-600' : 'text-slate-500'}`} />
                <div>
                    <h4 className={`text-sm font-bold ${activo ? 'text-emerald-900' : 'text-slate-900'}`}>
                        Disponibilidad: {activo ? 'Abierto' : 'Finalizado'}
                    </h4>
                    <p className={`text-xs mt-0.5 ${activo ? 'text-emerald-700/80' : 'text-slate-500'}`}>
                        {activo 
                            ? 'Este registro seguirá apareciendo como una actividad pendiente.' 
                            : 'Este registro se marcará como cerrado y no requerirá más acciones.'}
                    </p>
                </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={onCancel} className="px-5 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-xl transition-colors">
                    Cancelar
                </button>
                <button type="submit" disabled={isSubmitting} className="px-5 py-2.5 text-sm font-bold text-white bg-primary-600 rounded-xl hover:bg-primary-700 shadow-lg shadow-primary/20 transition-all active:scale-95 disabled:opacity-50">
                    {isSubmitting ? 'Guardando...' : 'Confirmar Cambio'}
                </button>
            </div>
        </form>
    );
};

export default StatusUpdateForm;
