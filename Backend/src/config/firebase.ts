// src/config/firebase.ts
import * as admin from "firebase-admin";
import { env } from "./env";

let firebaseApp: admin.app.App | null = null;

export function getFirebaseApp() {
  if (firebaseApp) return firebaseApp;

  // If any of these are missing, we run in demo mode (no real Firebase)
  if (
    !env.FIREBASE_PROJECT_ID ||
    !env.FIREBASE_CLIENT_EMAIL ||
    !env.FIREBASE_PRIVATE_KEY
  ) {
    console.warn("Firebase env vars missing – running in demo auth mode");
    return null;
  }

  firebaseApp = admin.initializeApp({
    credential: admin.credential.cert({
      projectId: env.FIREBASE_PROJECT_ID,
      clientEmail: env.FIREBASE_CLIENT_EMAIL,
      privateKey: env.FIREBASE_PRIVATE_KEY, // newlines already fixed in env.ts
    }),
  });

  return firebaseApp;
}
