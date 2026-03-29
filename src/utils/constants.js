/**
 * Estos valores deben coincidir con los enums definidos en el schema.prisma del backend.
 */

export const ESTADOS_TAREA = [
    { value: 'PENDIENTE', label: 'Pendiente' },
    { value: 'COMPLETADA', label: 'Completada' },
    { value: 'CANCELADA', label: 'Cancelada' },
];

export const PRIORIDADES = [
    { value: 'BAJA', label: 'Baja' },
    { value: 'MEDIA', label: 'Media' },
    { value: 'ALTA', label: 'Alta' },
];

export const TIPOPERIODO = [
    { value: 'MENSUAL', label: 'Mensual' },
    { value: 'SEMANAL', label: 'Semanal' },
    { value: 'CUSTOM', label: 'Sin periodo' }
]

export const ESTADO_RECORDATORIO = [
    { value: 'PENDIENTE', label: 'Pendiente' },
    { value: 'ENVIADO', label: 'Enviado' },
    { value: 'CANCELADO', label: 'Cancelado' },
    { value: 'ACTUALIZADO', label: 'Actualizado' },
]

export const TIPO_DISPOSITIVO = [
    { value: 'ANDROID', label: 'Android' },
    { value: 'IOS', label: 'iOS' },
    { value: 'WEB', label: 'Web' },
]