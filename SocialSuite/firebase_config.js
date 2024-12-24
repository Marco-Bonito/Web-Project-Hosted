import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore} from 'firebase/firestore'

const firebaseConfig = {
    apiKey: "AIzaSyC5iNTeEcejLMwYiIkB7tItDI9yF8JLDgw",
    authDomain: "social-suite-ll-mb.firebaseapp.com",
    projectId: "social-suite-ll-mb",
    storageBucket: "social-suite-ll-mb.firebasestorage.app",
    messagingSenderId: "1037078476505",
    appId: "1:1037078476505:web:1f5e6237d2f3782b2530c8",
    measurementId: "G-P46QFY1SCR"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);

export { auth , firestore};
