// public/firebase-messaging-sw.js

// Scripts de Firebase
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js');

// Configuración de Firebase (la misma que en tu app)
const firebaseConfig = {
    apiKey: "AIzaSyD_3T7mE6Z_TCSNIjhJlC1GepFN_9u8ClM",
    authDomain: "asistente-nest.firebaseapp.com",
    projectId: "asistente-nest",
    storageBucket: "asistente-nest.firebasestorage.app",
    messagingSenderId: "149732653457",
    appId: "1:149732653457:web:7c53989e9ac1a1b59d4230",
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

console.log('[DEBUG SW] Service Worker inicializado y listo.');

// --- MANEJO DE NOTIFICACIONES EN SEGUNDO PLANO ---
messaging.onBackgroundMessage((payload) => {
    console.log('[DEBUG SW] Notificación en background recibida RAW: ', payload);
    
    if (!payload.data) console.error('[DEBUG SW] ALERTA: Payload sin data!');
    else console.log('[DEBUG SW] Data timestamp:', payload.data.timestamp);

    const notificationTitle = payload.data.title;
    const notificationOptions = {
        body: payload.data.body,
        icon: '/vite.svg', // Asegúrate de tener un icono en la carpeta public
        data: payload.data, // Pasamos la data (ej: recordatorioId) a la notificación
        // CAMBIO CLAVE: Hacemos el tag único combinando ID + Timestamp.
        // Esto evita que el navegador oculte la notificación por considerarla duplicada.
        tag: `${payload.data.recordatorioId}-${payload.data.timestamp}`,
        actions: [
            { action: 'snooze', title: 'Posponer 10 min' },
            { action: 'done', title: 'Listo' }
        ]
    };

    return self.registration.showNotification(notificationTitle, notificationOptions);
});

// --- MANEJO DE CLICS EN LA NOTIFICACIÓN ---
self.addEventListener('notificationclick', (event) => {
    console.log('[DEBUG SW] Click en notificación:', event);

    // Cerramos la notificación
    event.notification.close();

    const recordatorioId = event.notification.data?.recordatorioId;

    // Si se hizo clic en "Posponer"
    if (event.action === 'snooze' && recordatorioId) {
        console.log(`[DEBUG SW] Posponiendo recordatorio: ${recordatorioId}`);
        
        // **IMPORTANTE**: La autenticación en un Service Worker es un desafío.
        // Este fetch fallará con 401 si no se provee un token JWT.
        // La solución ideal es que tu app principal, al loguearse, guarde el token
        // en un lugar accesible para el SW, como IndexedDB, y lo leas aquí.
        // Por ahora, para probar, puedes quitar temporalmente el @UseGuards del endpoint.
        
        const snoozePromise = fetch(`http://localhost:3000/recordatorios/${recordatorioId}/posponer`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                // 'Authorization': `Bearer ${tu_token_obtenido_de_indexedDB}`
            },
        });
        event.waitUntil(snoozePromise); // <--- IMPORTANTE: Mantiene vivo el SW hasta que termine el fetch

    } else if (event.action === 'done') {
        console.log(`[DEBUG SW] Marcando recordatorio como realizado: ${recordatorioId}`);
        const donePromise = fetch(`http://localhost:3000/recordatorios/${recordatorioId}/realizado`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                // 'Authorization': `Bearer ${tu_token_obtenido_de_indexedDB}`
            },
        });
        event.waitUntil(donePromise);

    } else {
        // Si se hace clic en el cuerpo de la notificación (no en un botón)
        event.waitUntil(clients.openWindow('/')); // Abre la página principal
    }
});
