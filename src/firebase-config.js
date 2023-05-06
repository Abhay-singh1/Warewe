import { initializeApp } from "firebase/app";
import {getStorage} from '@firebase/storage'
const firebaseConfig = {
  apiKey: "AIzaSyB4NOLdY0ojeBVVfK2GuLEjj9V0A2vRGaw",
  authDomain: "secquraise-db.firebaseapp.com",
  projectId: "secquraise-db",
  storageBucket: "secquraise-db.appspot.com",
  messagingSenderId: "1080862964577",
  appId: "1:1080862964577:web:27ba8b7507294cdab72320",
  measurementId: "G-G04CCY6LQ7"
};


const app = initializeApp(firebaseConfig);

export const store  = getStorage(app)