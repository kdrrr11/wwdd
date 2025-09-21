import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyACFUT3JF6CuYkqEvUHt3JF_l9hoSEZIHw",
  authDomain: "deneme-ca220.firebaseapp.com",
  databaseURL: "https://deneme-ca220-default-rtdb.firebaseio.com",
  projectId: "deneme-ca220",
  storageBucket: "deneme-ca220.firebasestorage.app",
  messagingSenderId: "315103781728",
  appId: "1:315103781728:web:906be1dfdf3a50633cb405",
  measurementId: "G-FS254NEFYN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Realtime Database and get a reference to the service
export const database = getDatabase(app);

export default app;