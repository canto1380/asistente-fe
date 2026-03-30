const PageHeader = ({ title, subtitle, children }) => {
    return (
        <div className="flex flex-wrap items-center justify-between gap-y-2 mb-0 pt-0 md:mb-4 md:pt-4 ">
            <div className="flex items-center gap-4">
                <h1 className="text-xl font-bold text-gray-800">{title}</h1>
            </div>
            <div className="flex items-center gap-2">
                {subtitle && <p className="text-sm font-medium text-gray-500">{subtitle}</p>}
                {/* 'children' se usará para botones de acción como "Crear Nuevo Evento" */}
                {children}
            </div>
        </div>
    );
};

export default PageHeader;
