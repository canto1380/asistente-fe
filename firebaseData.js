// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD_3T7mE6Z_TCSNIjhJlC1GepFN_9u8ClM",
  authDomain: "asistente-nest.firebaseapp.com",
  projectId: "asistente-nest",
  storageBucket: "asistente-nest.firebasestorage.app",
  messagingSenderId: "149732653457",
  appId: "1:149732653457:web:7c53989e9ac1a1b59d4230",
  measurementId: "G-1Z1MCHVDS3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);