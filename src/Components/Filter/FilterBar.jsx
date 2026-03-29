import { Search } from "lucide-react";

const FilterBar = ({ children, search, handleSearch }) => {
    return (
        <div className="bg-white py-2 px-4 mt-6 rounded-lg shadow-sm border border-gray-50">
            <div className='flex flex-col gap-6'>
                <h3 className='text-md font-semibold text-gray-500 pb-2'>Filtros</h3>
            </div>
            <div className="flex flex-wrap md:flex-row items-center justify-between gap-4">
                {/* Filtro base de búsqueda por título/nombre */}
                {handleSearch && (
                    <div className="relative flex-grow min-w-[200px]">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Buscar por nombre..."
                            value={search}
                            onChange={handleSearch}
                            className="w-full pl-10 pr-4 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition text-sm"
                        />
                    </div>

                )}
                {/* Aquí se renderizan los filtros adicionales pasados como children */}
                {children}
            </div>
        </div>
    );
};

export default FilterBar;
