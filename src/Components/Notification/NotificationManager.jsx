import React, { useEffect } from 'react'
import { requestForToken, onMessageListener } from '../../utils/firebase-config'
import { useAlert } from '../../context/alertContext'
import { useAuth } from '../../context/AuthContext'
import { patchRequest, postRequest } from '../../api/apiRequest';
import { Bell } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

const NotificationManager = () => {
    const { showAlert } = useAlert()
    const { user } = useAuth()

    console.log('[DEBUG React] NotificationManager renderizado/montado');

    useEffect(() => {
        // Solo ejecutamos la lógica si el usuario está autenticado
        if (!user) {
            return
        }

        // 1. Pedir permiso y obtener token
        const initNotifications = async () => {
            const fcmToken = await requestForToken()

            if (fcmToken) {
                // 2. Enviar el token al backend
                try {
                    const data = {
                        token: fcmToken,
                        tipoDispositivo: 'WEB'
                    }
                    await postRequest(`push-tokens`, data)

                    console.log('Token FCM registrado en backend')
                } catch (error) {
                    console.error('Error enviando token al backend:', error)
                }
            }
        }

        initNotifications()

        console.log('[DEBUG React] Suscribiéndose a onMessageListener...');

        // 3. Escuchar notificaciones en primer plano (cuando el usuario usa la app)
        const unsubscribe = onMessageListener((payload) => {
            console.log('[DEBUG React] 🚨 Notificación recibida en foreground:', payload);

            const recordatorioId = payload.data?.recordatorioId;
            console.log(`[DEBUG React] ID: ${recordatorioId}, Timestamp: ${payload.data?.timestamp}`);

            // Mostramos un toast interactivo
            toast.custom((t) => (
                <div
                    className={`${t.visible ? 'animate-enter' : 'animate-leave'
                        } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
                >
                    <div className="flex-1 w-0 p-4">
                        <div className="flex items-start">
                            <div className="flex-shrink-0 pt-0.5">
                                <Bell className="h-6 w-6 text-primary-500" />
                            </div>
                            <div className="ml-3 flex-1">
                                <p className="text-sm font-medium text-gray-900">
                                    {payload.data.title}
                                </p>
                                <p className="mt-1 text-sm text-gray-500">
                                    {payload.data.body}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="flex border-l border-gray-200">
                        {recordatorioId && (
                            <button
                                onClick={async () => {
                                    try {
                                        await patchRequest(`recordatorios/${recordatorioId}/posponer`, {})
                                        toast.dismiss(t.id);
                                        showAlert('Recordatorio pospuesto 10 minutos.', 'success');
                                    } catch (error) {
                                        showAlert('No se pudo posponer el recordatorio.', 'error');
                                    }
                                }}
                                className="w-full border-r border-gray-200 p-4 flex items-center justify-center text-sm font-medium text-primary-600 hover:text-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                            >
                                Posponer
                            </button>
                        )}
                        <button
                            onClick={async () => {
                                if (!recordatorioId) return;
                                try {
                                    await patchRequest(`recordatorios/${recordatorioId}/realizado`, {})
                                    toast.dismiss(t.id)
                                    showAlert('Recordatorio marcado como realizado.', 'success');
                                } catch (error) {
                                    console.error(error);
                                    showAlert('No se pudo marcar el recordatorio como realizado.', 'error')
                                }
                            }}
                            className="w-full p-4 flex items-center justify-center text-sm font-medium text-gray-700 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        >
                            Listo
                        </button>
                    </div>
                </div>
            ), { duration: 20000 }); // El toast dura 20 segundos
        });

        return () => {
            if (unsubscribe) unsubscribe();
        };
    }, [user, showAlert])

    return <Toaster position="top-right" />; // Contenedor para los toasts
}

export default NotificationManager
