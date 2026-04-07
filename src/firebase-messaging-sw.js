/* eslint-disable no-undef */
// src/firebase-messaging-sw.js
import { initializeApp } from 'firebase/app';
import { getMessaging, onBackgroundMessage } from 'firebase/messaging/sw';
import { cleanupOutdatedCaches, precacheAndRoute } from 'workbox-precaching';
import { getAccessTokenForServiceWorker } from './utils/swAuthStorage';

// Limpia las cachés de versiones anteriores de la PWA
cleanupOutdatedCaches();

// Pre-cachea los archivos generados por el build (JS, CSS, HTML)
// eslint-disable-next-line no-restricted-globals
precacheAndRoute(self.__WB_MANIFEST);

// Ahora Vite inyectará estas variables automáticamente durante el build
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

console.log('[DEBUG SW] Service Worker FCM inicializado y listo con variables de entorno.');

// Manejo de notificaciones en segundo plano
onBackgroundMessage(messaging, (payload) => {
    console.log('[SW] Notificación recibida en background:', payload);

    const notificationTitle = payload.data?.title || "Nueva Notificación";
    const notificationOptions = {
        body: payload.data?.body || "Tienes una actualización en tu asistente.",
        icon: '/pwa-192x192.png',
        badge: '/pwa-192x192.png',
        data: payload.data,
        tag: `${payload.data?.recordatorioId}-${payload.data?.timestamp}`,
        actions: [
            { action: 'snooze', title: 'Posponer 10 min' },
            { action: 'done', title: 'Listo' }
        ]
    };

    return self.registration.showNotification(notificationTitle, notificationOptions);
});

function apiBaseUrl() {
    const base = import.meta.env.VITE_API_URL || '';
    return base.replace(/\/$/, '');
}

async function patchRecordatorioDesdeNotificacion(recordatorioId, accion) {
    const token = await getAccessTokenForServiceWorker();
    const base = apiBaseUrl();
    if (!token) {
        console.warn(
            '[SW] No hay JWT en IndexedDB; inicia sesión en la app para usar Posponer/Listo desde la notificación.',
        );
        const ventanas = await self.clients.matchAll({
            type: 'window',
            includeUncontrolled: true,
        });
        if (ventanas.length > 0) {
            return ventanas[0].focus();
        }
        return self.clients.openWindow('/');
    }
    const url = `${base}/recordatorios/${recordatorioId}/${accion}`;
    const res = await fetch(url, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: '{}',
    });
    if (!res.ok) {
        const text = await res.text().catch(() => '');
        console.error('[SW] Error al ejecutar acción de notificación:', res.status, text);
    }
}

// Manejo de clics en las acciones de la notificación
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    const data = event.notification.data || {};
    const recordatorioId = data.recordatorioId;

    if (event.action === 'snooze' && recordatorioId) {
        event.waitUntil(patchRecordatorioDesdeNotificacion(recordatorioId, 'posponer'));
    } else if (event.action === 'done' && recordatorioId) {
        event.waitUntil(patchRecordatorioDesdeNotificacion(recordatorioId, 'realizado'));
    } else {
        event.waitUntil(self.clients.openWindow('/'));
    }
});
