import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getFunctions } from 'firebase/functions';

// TODO: Replace with your Firebase project configuration
// You can find this in the Firebase Console -> Project Settings -> General -> Your Apps -> SDK Setup and Configuration
export const firebaseConfig = {
    apiKey: "AIzaSyCIrPrW-SL3W3ui7XTsQUgMeKRT4NfNuz0",
    authDomain: "mobile-sous-chef.firebaseapp.com",
    projectId: "mobile-sous-chef",
    storageBucket: "mobile-sous-chef.firebasestorage.app",
    messagingSenderId: "716025309184",
    appId: "1:716025309184:web:6164369ebd2b3d877490e5",
    measurementId: "G-S3QVYKVWX7"
};

const app = initializeApp(firebaseConfig);

export const functions = getFunctions(app);
export const db = getFirestore(app);
