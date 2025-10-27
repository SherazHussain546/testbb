
import { initializeApp, getApp, getApps, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import type { FirebaseOptions } from 'firebase/app';

const SITE_AUTH_APP_NAME = 'site-auth';

function getSiteFirebaseConfig(): FirebaseOptions {
    const siteConfig = {
        apiKey: process.env.NEXT_PUBLIC_SITE_FIREBASE_API_KEY,
        authDomain: process.env.NEXT_PUBLIC_SITE_FIREBASE_AUTH_DOMAIN,
        projectId: process.env.NEXT_PUBLIC_SITE_FIREBASE_PROJECT_ID,
        storageBucket: process.env.NEXT_PUBLIC_SITE_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.NEXT_PUBLIC_SITE_FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.NEXT_PUBLIC_SITE_FIREBASE_APP_ID,
    };

    for (const key in siteConfig) {
        if (siteConfig[key as keyof FirebaseOptions] === undefined) {
            console.warn(`Site Auth Firebase config is missing a value for ${key}.`);
        }
    }
    return siteConfig;
}


// Initializes the NAMED Firebase app for site authentication
export function initializeSiteAuth(): { firebaseApp: FirebaseApp; auth: Auth } {
  const apps = getApps();
  const siteApp = apps.find(app => app.name === SITE_AUTH_APP_NAME);
  
  const firebaseApp = siteApp ? siteApp : initializeApp(getSiteFirebaseConfig(), SITE_AUTH_APP_NAME);
  const auth = getAuth(firebaseApp);

  return { firebaseApp, auth };
}

// Getter for the site auth instance
export function getSiteAuth(): Auth {
    const siteApp = getApp(SITE_AUTH_APP_NAME);
    return getAuth(siteApp);
}
