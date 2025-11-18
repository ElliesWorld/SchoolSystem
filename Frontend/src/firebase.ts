// src/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

//Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAuTnMixu0cnU_tScJdQlS_RKjwFzkewIw",
  authDomain: "schoolsystem-eac50.firebaseapp.com",
  projectId: "schoolsystem-eac50",
  storageBucket: "schoolsystem-eac50.firebasestorage.app",
  messagingSenderId: "156497475754",
  appId: "1:156497475754:web:6228652423495973cf78d3",
};

const app = initializeApp(firebaseConfig);

// Named exports used everywhere
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
