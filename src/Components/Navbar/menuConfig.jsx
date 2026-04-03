import { BellRing, Calendar, CircleDollarSign, ClipboardCheck, House, Folder, Shield } from "lucide-react";

export const MENU_ITEMS = [
    {
        label: 'Inicio',
        path: '/',
        allowedRoles: [],
        icon: (<House className="w-5 h-5"/>)
    },
    {
        label: 'Eventos',
        path: '/eventos',
        allowedRoles: ['ADMIN', 'ADMINEMPRESA'],
        icon: (<Calendar className="w-5 h-5"/>)
    },
    {
        label: 'Tareas',
        path: '/tareas',
        allowedRoles: ['ADMIN', 'ADMINEMPRESA'],
        icon: (<ClipboardCheck className="w-5 h-5"/>)
    },
    {
        label: 'Recordatorios',
        path: '/recordatorios',
        allowedRoles: ['ADMIN', 'ADMINEMPRESA'],
        icon: (<BellRing className="w-5 h-5"/>)
    },
    {
        label: 'Gastos',
        path: '/gastos',
        allowedRoles: ['ADMIN', 'ADMINEMPRESA'],
        icon: (<CircleDollarSign className="w-5 h-5"/>)
    },
    {
        label: 'Categorías de Gastos',
        path: '/categorias-gasto',
        allowedRoles: ['ADMIN', 'ADMINEMPRESA'],
        icon: (<Folder className="w-5 h-5"/>)
    },
    {
        label: 'Roles y Permisos',
        path: '/roles-permisos',
        allowedRoles: ['ADMIN', 'ADMINEMPRESA'],
        icon: (<Shield className="w-5 h-5"/>)
    },


]
