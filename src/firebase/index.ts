import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, initializeFirestore, setLogLevel } from 'firebase/firestore';

// Load from env - ensure these are defined in your .env
// Example keys:
// FIREBASE_API_KEY=...
// FIREBASE_AUTH_DOMAIN=...
// FIREBASE_PROJECT_ID=...
// FIREBASE_STORAGE_BUCKET=...
// FIREBASE_MESSAGING_SENDER_ID=...
// FIREBASE_APP_ID=...
// FIREBASE_MEASUREMENT_ID=...

// If you prefer react-native-dotenv, import from '@env' after configuring babel plugin
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { FIREBASE_API_KEY, FIREBASE_AUTH_DOMAIN, FIREBASE_PROJECT_ID, FIREBASE_STORAGE_BUCKET, FIREBASE_MESSAGING_SENDER_ID, FIREBASE_APP_ID} from '@env';

const firebaseConfig = {
  apiKey: FIREBASE_API_KEY,
  authDomain: FIREBASE_AUTH_DOMAIN,
  projectId: FIREBASE_PROJECT_ID,
  storageBucket: FIREBASE_STORAGE_BUCKET,
  messagingSenderId: FIREBASE_MESSAGING_SENDER_ID,
  appId: FIREBASE_APP_ID,
};

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

export const auth = getAuth(app);
// RN sometimes needs long polling for Firestore Web SDK
export const db = (() => {
  try {
    return initializeFirestore(app, {
      experimentalForceLongPolling: true,
      experimentalAutoDetectLongPolling: true,
    });
  } catch {
    return getFirestore(app);
  }
})();

// Verbose Firestore logs in development to diagnose connectivity/rules issues
if (__DEV__) {
  try { setLogLevel('debug'); } catch {}
}
export default app;


