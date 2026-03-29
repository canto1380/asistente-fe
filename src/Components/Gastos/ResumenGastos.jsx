import { ArrowRight, CircleDollarSign } from "lucide-react";
import { Link } from "react-router-dom";
import { formatCurrency } from "../../utils/dateFormatter";

const ResumenGastos = ({ total, mes, anio, btnIrPanel }) => {
    const nombreMes = new Date(anio, mes - 1).toLocaleString('es-AR', { month: 'long' });

    return (
        <div className="bg-white p-6 rounded-lg border border-gray-200 h-full flex flex-col">
            <div className="flex items-start justify-between">
                <h3 className="font-bold text-gray-800 capitalize">Gastos de {nombreMes}</h3>
                <div className="p-2 bg-green-100 rounded-lg">
                    <CircleDollarSign className="w-5 h-5 text-green-600" />
                </div>
            </div>
            <div className="my-4">
                <p className="text-3xl font-bold text-gray-900">{formatCurrency(total)}</p>
                <p className="text-sm text-gray-500">Total del mes actual</p>
            </div>
            {btnIrPanel && (
                <div className="mt-auto">
                    <Link to="/gastos" className="flex items-center gap-2 text-sm font-semibold text-primary-600 hover:text-primary-800 transition-colors">
                        Ir al panel de gastos
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            )}
        </div>
    );
};

export default ResumenGastos;
