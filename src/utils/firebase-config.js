// src/firebase-config.js
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

const APIKEY = import.meta.env.VITE_FIREBASE_APIKEY
const AUTHDOMAIN = import.meta.env.VITE_FIREBASE_AUTHDOMAIN
const PROJECTID = import.meta.env.VITE_FIREBASE_PROJECTID
const STORAGEBUCKET = import.meta.env.VITE_FIREBASE_STORAGEBUCKET
const MESSAGINGSENDERID = import.meta.env.VITE_FIREBASE_MESSAGINGSENDERID
const APPID = import.meta.env.VITE_FIREBASE_APPID
const MEASUREMENTID = import.meta.env.VITE_FIREBASE_MEASUREMENTID


const firebaseConfig = {
  apiKey: APIKEY,
  authDomain: AUTHDOMAIN,
  projectId: PROJECTID,
  storageBucket: STORAGEBUCKET,
  messagingSenderId: MESSAGINGSENDERID,
  appId: APPID,
  measurementId: MEASUREMENTID
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
