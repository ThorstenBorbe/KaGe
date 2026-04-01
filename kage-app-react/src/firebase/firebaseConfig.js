import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCcgynR0RrBK0N1B0-PN_ZRHMYBX0RVvvE",
  authDomain: "kage-zell.firebaseapp.com",
  projectId: "kage-zell",
  storageBucket: "kage-zell.firebasestorage.app",
  messagingSenderId: "294505894770",
  appId: "1:294505894770:web:3b427e888c9007bf5c83eb",
  measurementId: "G-NMZL90246W",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
