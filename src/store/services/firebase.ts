import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { 
  getAuth, 
  Auth, 
  signInWithPhoneNumber, 
  RecaptchaVerifier,
  User,
  onAuthStateChanged 
} from 'firebase/auth';
import { 
  getFirestore, 
  Firestore, 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  addDoc,
  onSnapshot,
  serverTimestamp 
} from 'firebase/firestore';
import { 
  getMessaging, 
  Messaging, 
  getToken, 
  onMessage,
  deleteToken 
} from 'firebase/messaging';
import { getStorage, FirebaseStorage } from 'firebase/storage';

// Configuration Firebase (à remplacer par vos clés)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'demo-api-key',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'agriconnect-mada.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'agriconnect-mada',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'agriconnect-mada.appspot.com',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '123456789',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:123456789:web:abcdef'
};

// Initialisation Firebase (singleton)
let app: FirebaseApp;
let auth: Auth;
let db: Firestore;
let messaging: Messaging | null = null;
let storage: FirebaseStorage;

export const initializeFirebase = () => {
  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);
    
    // Messaging seulement si supporté (HTTPS ou localhost)
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      try {
        messaging = getMessaging(app);
      } catch (error) {
        console.warn('Firebase Messaging non disponible:', error);
      }
    }
  } else {
    app = getApps()[0];
    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      try {
        messaging = getMessaging(app);
      } catch (error) {
        console.warn('Firebase Messaging non disponible:', error);
      }
    }
  }
  
  return { app, auth, db, messaging, storage };
};

// Export des instances
export const getFirebaseApp = () => app;
export const getFirebaseAuth = () => auth;
export const getFirebaseDb = () => db;
export const getFirebaseMessaging = () => messaging;
export const getFirebaseStorage = () => storage;

// Service d'authentification
export const authService = {
  // Connexion par téléphone avec OTP
  signInWithPhone: async (phoneNumber: string, recaptchaVerifier: RecaptchaVerifier) => {
    try {
      const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
      return confirmationResult;
    } catch (error) {
      console.error('Erreur connexion téléphone:', error);
      throw error;
    }
  },

  // Vérification du code OTP
  verifyOTP: async (confirmationResult: any, code: string) => {
    try {
      const result = await confirmationResult.confirm(code);
      return result.user;
    } catch (error) {
      console.error('Erreur vérification OTP:', error);
      throw error;
    }
  },

  // Observer l'état d'authentification
  onAuthStateChange: (callback: (user: User | null) => void) => {
    return onAuthStateChanged(auth, callback);
  },

  // Déconnexion
  signOut: async () => {
    try {
      await auth.signOut();
    } catch (error) {
      console.error('Erreur déconnexion:', error);
      throw error;
    }
  },

  // Obtenir l'utilisateur courant
  getCurrentUser: () => auth.currentUser,
};

// Service Firestore
export const firestoreService = {
  // Créer un document
  createDocument: async (collectionName: string, data: any, id?: string) => {
    try {
      if (id) {
        await setDoc(doc(db, collectionName, id), {
          ...data,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
        return id;
      } else {
        const docRef = await addDoc(collection(db, collectionName), {
          ...data,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
        return docRef.id;
      }
    } catch (error) {
      console.error('Erreur création document:', error);
      throw error;
    }
  },

  // Lire un document
  getDocument: async (collectionName: string, id: string) => {
    try {
      const docRef = doc(db, collectionName, id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      }
      return null;
    } catch (error) {
      console.error('Erreur lecture document:', error);
      throw error;
    }
  },

  // Mettre à jour un document
  updateDocument: async (collectionName: string, id: string, data: any) => {
    try {
      await updateDoc(doc(db, collectionName, id), {
        ...data,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Erreur mise à jour document:', error);
      throw error;
    }
  },

  // Supprimer un document
  deleteDocument: async (collectionName: string, id: string) => {
    try {
      await deleteDoc(doc(db, collectionName, id));
    } catch (error) {
      console.error('Erreur suppression document:', error);
      throw error;
    }
  },

  // Rechercher des documents
  queryDocuments: async (collectionName: string, constraints: any[]) => {
    try {
      const q = query(collection(db, collectionName), ...constraints);
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Erreur recherche documents:', error);
      throw error;
    }
  },

  // Écouter les changements en temps réel
  onCollectionChange: (collectionName: string, constraints: any[], callback: (docs: any[]) => void) => {
    const q = query(collection(db, collectionName), ...constraints);
    return onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      callback(docs);
    });
  },

  // Écouter un document spécifique
  onDocumentChange: (collectionName: string, id: string, callback: (doc: any | null) => void) => {
    return onSnapshot(doc(db, collectionName, id), (doc) => {
      if (doc.exists()) {
        callback({ id: doc.id, ...doc.data() });
      } else {
        callback(null);
      }
    });
  },
};

// Service Messaging (Notifications push)
export const messagingService = {
  // Demander la permission et obtenir le token
  requestPermissionAndGetToken: async () => {
    if (!messaging) return null;
    
    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        const token = await getToken(messaging, {
          vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY
        });
        return token;
      }
      return null;
    } catch (error) {
      console.error('Erreur demande permission notification:', error);
      return null;
    }
  },

  // Écouter les messages en premier plan
  onMessage: (callback: (payload: any) => void) => {
    if (!messaging) return () => {};
    return onMessage(messaging, callback);
  },

  // Supprimer le token
  deleteToken: async () => {
    if (!messaging) return;
    try {
      await deleteToken(messaging);
    } catch (error) {
      console.error('Erreur suppression token:', error);
    }
  },
};

// Helpers pour les contraintes de requête
export const whereEq = (field: string, value: any) => where(field, '==', value);
export const whereArrayContains = (field: string, value: any) => where(field, 'array-contains', value);
export const orderByField = (field: string, direction: 'asc' | 'desc' = 'asc') => orderBy(field, direction);
export const limitResults = (count: number) => limit(count);