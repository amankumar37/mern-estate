// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-estate-bded2.firebaseapp.com",
  projectId: "mern-estate-bded2",
  storageBucket: "mern-estate-bded2.appspot.com",
  messagingSenderId: "614843067430",
  appId: "1:614843067430:web:c1ce0cf6d1896426aa4ae7"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);