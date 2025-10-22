// src/lib/firebase.ts
import { initializeApp, getApp, getApps } from "firebase/app" 
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"

const firebaseConfig = {
  apiKey: "AIzaSyAAxUkJVj1rXbckxEyLs51sLbiyKsPpXww",
  authDomain: "anotherstoriesintimatesadomin.firebaseapp.com",
  projectId: "anotherstoriesintimatesadomin",
  storageBucket: "anotherstoriesintimatesadomin.firebasestorage.app",
  messagingSenderId: "799838164155",
  appId: "1:799838164155:web:daf613bb0a2ec9167ec59e",
  measurementId: "G-ZC74DSCYZ7"
}


const app = !getApps().length ? initializeApp(firebaseConfig) : getApp()


export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app) 

export default app