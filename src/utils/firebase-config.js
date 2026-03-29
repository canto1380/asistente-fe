// src/firebase-config.js
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: "AIzaSyD_3T7mE6Z_TCSNIjhJlC1GepFN_9u8ClM",
  authDomain: "asistente-nest.firebaseapp.com",
  projectId: "asistente-nest",
  storageBucket: "asistente-nest.firebasestorage.app",
  messagingSenderId: "149732653457",
  appId: "1:149732653457:web:7c53989e9ac1a1b59d4230",
  measurementId: "G-1Z1MCHVDS3"
};

const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);

// Función para pedir permiso y obtener el token
export const requestForToken = async () => {
  try {
    const currentToken = await getToken(messaging, {
      // REEMPLAZA ESTO con la clave que generaste en la pestaña "Cloud Messaging" -> "Web configuration"
      vapidKey: 'BJ4kLozjDI5leRwIibWzu_q07XicRlYZ6IdjRen8QTzJHDnCCkVvNnJL0IHBcTv45VNViF4GbWW0HLwO0bKcgXY' 
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
