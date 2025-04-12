import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyArmKYbffS7bjb38iKVJJRJgj_qpgk-9bY",
  authDomain: "trackman-landofhoy.firebaseapp.com",
  projectId: "trackman-landofhoy",
  storageBucket: "trackman-landofhoy.firebasestorage.app",
  messagingSenderId: "901582204511",
  appId: "1:901582204511:web:a20fc5f90e7c641cadb5ea",
  measurementId: "G-DC5YHYYQPQ"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const analytics = getAnalytics(app);

export default app; 