// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Personal build: Firebase is optional. Local watchlist works without it.
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FB_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FB_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FB_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FB_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FB_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FB_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FB_MEASUREMENT_ID,
};

const hasFirebase = Boolean(firebaseConfig.apiKey);

// Initialize Firebase only if keys provided, else export nulls
// so `pnpm build` / dev works with local-only mode.
export const app: any = hasFirebase ? initializeApp(firebaseConfig) : null;
export const auth: any = hasFirebase ? getAuth(app) : null;
export const db: any = hasFirebase ? getFirestore(app) : null;
export const provider: any = hasFirebase ? new GoogleAuthProvider() : null;
