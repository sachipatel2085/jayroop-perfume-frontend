/**
 * Firebase is used ONLY for "Continue with Google". It is loaded on demand (when the Google button is
 * pressed), so it adds nothing to the first page load. After Google confirms the account, the backend
 * verifies the Firebase ID token and issues the normal Jayrup session – Firebase is then signed out.
 *
 * .env / .env.production:
 *   VITE_FIREBASE_API_KEY=…            Firebase console › Project settings › Your apps › Web app
 *   VITE_FIREBASE_AUTH_DOMAIN=…        e.g. jayrup-xxxx.firebaseapp.com
 *   VITE_FIREBASE_PROJECT_ID=…         must match FIREBASE_PROJECT_ID in the backend .env
 *   VITE_FIREBASE_APP_ID=…
 */
const config = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

export const googleSignInEnabled = Boolean(config.apiKey && config.authDomain && config.projectId);

let loader = null;

/** Loads Firebase Auth once and returns { auth, provider, ...firebase/auth functions }. */
export const loadFirebaseAuth = () => {
  if (!googleSignInEnabled) return Promise.reject(new Error('Google sign-in is not configured'));
  if (!loader) {
    loader = Promise.all([import('firebase/app'), import('firebase/auth')])
      .then(([appMod, authMod]) => {
        const app = appMod.getApps().length ? appMod.getApp() : appMod.initializeApp(config);
        const auth = authMod.getAuth(app);
        auth.useDeviceLanguage();
        const provider = new authMod.GoogleAuthProvider();
        provider.setCustomParameters({ prompt: 'select_account' });
        return { auth, provider, ...authMod };
      })
      .catch((err) => {
        loader = null; // allow a retry after a network error
        throw err;
      });
  }
  return loader;
};
