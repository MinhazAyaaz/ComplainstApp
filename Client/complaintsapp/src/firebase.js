import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
const firebaseConfig = {
    apiKey: "AIzaSyB6adcBm2DpsjtYGW1sDkXPTtnK3NK4zkA",
    authDomain: "nsu-complaints-app.firebaseapp.com",
    projectId: "nsu-complaints-app",
    storageBucket: "nsu-complaints-app.appspot.com",
    messagingSenderId: "559097318170",
    appId: "1:559097318170:web:4614166127a248923e7aa3"
  };
  export const app= initializeApp(firebaseConfig)
  export const storage = getStorage(app)