// src/firebase-config.js
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

const APIKEY = import.meta.env.VITE_FIREBASE_API_KEY
const AUTHDOMAIN = import.meta.env.VITE_FIREBASE_AUTH_DOMAIN
const PROJECTID = import.meta.env.VITE_FIREBASE_PROJECT_ID
const STORAGEBUCKET = import.meta.env.VITE_FIREBASE_STORAGE_BUCKET
const MESSAGINGSENDERID = import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID
const APPID = import.meta.env.VITE_FIREBASE_APP_ID
const MEASUREMENTID = import.meta.env.VITE_FIREBASE_MEASUREMENT_ID


const firebaseConfig = {
  apiKey: APIKEY,
  authDomain: AUTHDOMAIN,
  projectId: PROJECTID,
  storageBucket: STORAGEBUCKET,
  messagingSenderId: MESSAGINGSENDERID,
  appId: APPID,
  measurementId: MEASUREMENTID
};

// Validación defensiva para desarrollo
if (!firebaseConfig.projectId) {
    console.error("❌ Firebase Error: VITE_FIREBASE_PROJECTID no está definido en el archivo .env o el servidor necesita un reinicio.");
}

const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);

// Función para pedir permiso y obtener el token
export const requestForToken = async () => {
  try {
    const currentToken = await getToken(messaging, {
      vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY 
    });
    
    if (currentToken) {
      return currentToken;
    } else {
      console.log('No registration token available. Request permission to generate one.');
      return null;
    }
  } catch (err) {
    console.log('An error occurred while retrieving token. ', err);
    return null;
  }
};

// Listener para notificaciones cuando la app está abierta (foreground)
export const onMessageListener = (callback) => {
  return onMessage(messaging, (payload) => {
    console.log(payload, messaging)

    // Reproducir sonido si viene especificado en la data
    if (payload.data && payload.data.sound) {
      const audio = new Audio(`/${payload.data.sound}`);
      audio.play().catch(err => {
        if (err.name === 'NotAllowedError') {
          console.warn("Audio bloqueado: El usuario debe interactuar con la página primero (Política de Autoplay del navegador).");
        } else {
          console.error("Error al reproducir el sonido de notificación:", err);
        }
      });
    }

    callback(payload);
  });
};
