import { Calendar, DollarSign, Tag, FileText, Link2 } from 'lucide-react';
import { formatDate } from '../../utils/dateFormatter';

const GastoDetailView = ({ gasto }) => {
    if (!gasto) return null;

    const infoRows = [
        { icon: <Calendar className="w-5 h-5" />, label: 'Fecha de Registro', value: formatDate(gasto.fecha) },
        { icon: <Tag className="w-5 h-5" />, label: 'Categoría', value: gasto.categoriaGasto?.nombre },
        { icon: <DollarSign className="w-5 h-5" />, label: 'Monto Total', value: `$${Number(gasto.total).toLocaleString()}`, highlight: true },
    ];

    return (
        <div className="space-y-6 py-2">
            <div className="grid grid-cols-1 gap-4">
                {infoRows.map((row, idx) => (
                    <div key={idx} className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl border border-gray-100">
                        <div className="text-primary-500 bg-white p-2 rounded-lg shadow-sm">
                            {row.icon}
                        </div>
                        <div>
                            <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">{row.label}</p>
                            <p className={`text-sm font-semibold ${row.highlight ? 'text-primary-600 text-lg' : 'text-gray-700'}`}>
                                {row.value}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="p-4 bg-primary-50 rounded-xl border border-primary-100">
                <div className="flex items-center gap-2 mb-2 text-primary-700">
                    <FileText className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-tight">Descripción del Gasto</span>
                </div>
                <p className="text-sm text-primary-900 leading-relaxed">
                    {gasto.descripcion || 'Sin descripción adicional proporcionada.'}
                </p>
            </div>

            {gasto.createdAt && (
                <p className="text-[10px] text-center text-gray-400 italic">
                    Gasto registrado el {new Date(gasto.createdAt).toLocaleString()}
                </p>
            )}
        </div>
    );
};

export default GastoDetailView;
