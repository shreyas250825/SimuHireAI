// lib/firebase.ts
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyB7Nt1uZbtDmLd2awIsA9nubaWWa4sdX3A",
  authDomain: "simuhireai-b3afe.firebaseapp.com",
  projectId: "simuhireai-b3afe",
  storageBucket: "simuhireai-b3afe.firebasestorage.app",
  messagingSenderId: "435337221068",
  appId: "1:435337221068:web:050c2ecd647c0ae65dc369",
  measurementId: "G-0PCKCJ2W77"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

export { app, auth, analytics };
