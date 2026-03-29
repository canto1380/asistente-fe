/* eslint-disable no-undef */
// src/firebase-messaging-sw.js
import { initializeApp } from 'firebase/app';
import { getMessaging, onBackgroundMessage } from 'firebase/messaging/sw';
import { cleanupOutdatedCaches, precacheAndRoute } from 'workbox-precaching';

// Limpia las cachés de versiones anteriores de la PWA
cleanupOutdatedCaches();

// Pre-cachea los archivos generados por el build (JS, CSS, HTML)
// eslint-disable-next-line no-restricted-globals
precacheAndRoute(self.__WB_MANIFEST);

// Ahora Vite inyectará estas variables automáticamente durante el build
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTHDOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECTID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGEBUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGINGSENDERID,
    appId: import.meta.env.VITE_FIREBASE_APPID,
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

// Manejo de clics en las acciones de la notificación
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    const recordatorioId = event.notification.data?.recordatorioId;
    
    // Intentar obtener el token desde el cliente o almacenamiento persistente
    // Para entornos profesionales, el token se guarda en IndexedDB durante el login
    
    if (event.action === 'snooze' && recordatorioId) {
        const promise = fetch(`${import.meta.env.VITE_API_URL}/recordatorios/${recordatorioId}/posponer`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' }
        });
        event.waitUntil(promise);
    } else if (event.action === 'done' && recordatorioId) {
        const promise = fetch(`${import.meta.env.VITE_API_URL}/recordatorios/${recordatorioId}/realizado`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' }
        });
        event.waitUntil(promise);
    } else {
        event.waitUntil(clients.openWindow('/'));
    }
});
