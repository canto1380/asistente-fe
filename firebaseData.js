// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);