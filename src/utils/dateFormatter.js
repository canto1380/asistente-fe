export const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-AR', {
        style: 'currency',
        currency: 'ARS',
    }).format(amount || 0);
};

export const formatDate = (dateString) => {
    if (!dateString) {
        return 'N/A';
    }

    // Creamos un objeto Date a partir del string de fecha que viene de la DB
    const date = new Date(dateString);

    // Usamos los métodos getUTC...() para obtener el día, mes y año en base a la hora UTC,
    // ignorando la zona horaria del navegador del usuario.
    const day = String(date.getUTCDate()).padStart(2, '0');
    const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // getUTCMonth() es 0-indexado
    const year = date.getUTCFullYear();

    return `${day}/${month}/${year}`;
};

export const getDateStatus = (dateString) => {
    if (!dateString) return { text: '', color: 'text-gray-500', bg: 'bg-gray-100' };

    const date = new Date(dateString);
    const now = new Date();

    // Normalizamos a inicio del día para comparar fechas sin horas
    const startOfDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const startOfNow = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const diffTime = startOfDate.getTime() - startOfNow.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < -1) return { text: 'Vencida', color: 'text-red-600', bg: 'bg-red-50 border-red-200' };
    if (diffDays === -1) return { text: 'Vence hoy', color: 'text-orange-600', bg: 'bg-orange-50 border-orange-200' };
    if (diffDays === 0) return { text: 'Vence manana', color: 'text-yellow-600', bg: 'bg-yellow-50 border-yellow-200' };
};

export const getRelativeTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    // Reset time part to compare dates only
    const startOfDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const startOfNow = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    const diffInMs = startOfDate.getTime() - startOfNow.getTime();
    const diffInDays = Math.round(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays < -2) {
        return `Venció hace ${Math.abs(diffInDays)} días`;
    }
    if (diffInDays === -2) {
        return 'Venció ayer';
    }
    if (diffInDays === -1) {
        return 'Vence hoy';
    }
    if (diffInDays === 0) {
        return 'Vence mañana';
    }
    return `Vence en ${diffInDays} días`;
};
