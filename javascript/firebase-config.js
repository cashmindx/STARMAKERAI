// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyALAo9E9dqF1WUlx3Aa7M1NDyvN9yY-gEg",
  authDomain: "starmaker-ai.firebaseapp.com",
  projectId: "starmaker-ai",
  storageBucket: "starmaker-ai.firebasestorage.app",
  messagingSenderId: "894371915900",
  appId: "1:894371915900:web:bc580ca1246fd6b24f41f9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;