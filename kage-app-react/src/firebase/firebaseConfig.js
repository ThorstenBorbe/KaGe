import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "DEIN_API_KEY",
  authDomain: "DEIN_AUTH_DOMAIN",
  projectId: "DEIN_PROJECT_ID",
  storageBucket: "DEIN_STORAGE_BUCKET",
  messagingSenderId: "DEIN_MESSAGING_SENDER_ID",
  appId: "DEIN_APP_ID",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
