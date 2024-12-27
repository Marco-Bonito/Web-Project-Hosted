import { auth, firestore } from '../firebase_config.js';
import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut 
} from 'firebase/auth';
import { 
    doc, setDoc, addDoc, getDoc, updateDoc, deleteDoc, collection, query, getDocs 
} from 'firebase/firestore';

export default class ApiFunctions {

    // Funzione di login
    async login_user(userData = {}) {
        this.validate_data(userData, ['email', 'password']);
        try {
            const userCredential = await signInWithEmailAndPassword(auth, userData.email, userData.password);
            return {
                success: true,
                data: {
                    uid: userCredential.user.uid,
                    email: userCredential.user.email
                }
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    // Funzione di registrazione
    async register_user(userData = {}) {
        this.validate_data(userData, ['email', 'password']);
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, userData.email, userData.password);
            return {
                success: true,
                data: {
                    uid: userCredential.user.uid,
                    email: userCredential.user.email
                }
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    // Funzione di logout
    async logout_user() {
        try {
            await signOut(auth);
            return { success: true, message: 'Logout effettuato con successo' };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // Funzioni per gestire i dati utente su Firestore
    async get_user_data(userData = {}) {
        this.validate_data(userData, ['ID']);
        try {
            const userDoc = doc(firestore, 'users', userData.ID);
            const snapshot = await getDoc(userDoc);
            if (snapshot.exists()) {
                return { success: true, data: snapshot.data() };
            } else {
                return { success: false, error: 'Utente non trovato' };
            }
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async create_user(userData = {}) {
        this.validate_data(userData, ['ID']);
        try {
            const userDoc = doc(firestore, 'users', userData.ID);
            await setDoc(userDoc, userData);
            return { success: true, message: 'Utente creato con successo' };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async update_user(userData = {}) {
        this.validate_data(userData, [], ['ID']);
        try {
            const userDoc = doc(firestore, 'users', userData.ID);
            await updateDoc(userDoc, userData);
            return { success: true, message: 'Utente aggiornato con successo' };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async delete_user(userData = {}) {
        this.validate_data(userData, ['ID']);
        try {
            const userDoc = doc(firestore, 'users', userData.ID);
            await deleteDoc(userDoc);
            return { success: true, message: 'Utente eliminato con successo' };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async create_document(data = {}) {
        this.validate_data(data, ['mainCollectionName'], ['mainDocID', 'subCollectionName', 'subDocID']);
        try {
            let ref;
    
            if (data.mainDocID) {
                ref = doc(firestore, data.mainCollectionName, data.mainDocID);
            } else {
                ref = collection(firestore, data.mainCollectionName);
            }
    
            if (data.subCollectionName) {
                if (data.subDocID) {
                    ref = doc(ref, data.subCollectionName, data.subDocID);
                } else {
                    ref = collection(ref, data.subCollectionName); 
                }
            }
    
            if (ref.type === "document" && ref.id) {
                await setDoc(ref, data);
            } else {
                await addDoc(ref, data);
            }
    
            return { success: true, message: 'Documento creato con successo' };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
    

    async get_document(data = {}) {
        this.validate_data(data, ['mainCollectionName','mainDocID'], ['subCollectionName', 'subDocID']);
        try {
            let ref;

            ref = doc(firestore, data.mainCollectionName, data.mainDocID);
    
            if (data.subCollectionName) {
                if (data.subDocID) {
                    ref = doc(ref, data.subCollectionName, data.subDocID);
                } else {
                    throw new Error("subDocID è obbligatorio per accedere a un documento nella sottocollezione.");
                }
            }
    
            const snapshot = await getDoc(ref);
            if (snapshot.exists()) {
                return { success: true, data: snapshot.data() };
            } else {
                return { success: false, error: 'Documento non trovato' };
            }
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
    

    async update_document(data = {}) {
        this.validate_data(data, ['mainCollectionName', 'mainDocID'], ['subCollectionName', 'subDocID']);
        try {
            let ref = doc(firestore, data.mainCollectionName, data.mainDocID);
            if (data.subCollectionName && data.subDocID) {
                ref = doc(ref, data.subCollectionName, data.subDocID);
            }
            await setDoc(ref, data, { merge: true });
            return { success: true, message: 'Documento aggiornato con successo' };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async delete_document(data = {}) {
        this.validate_data(data, ['mainCollectionName', 'mainDocID'], ['subCollectionName', 'subDocID']);
        try {
            let ref = doc(firestore, data.mainCollectionName, data.mainDocID);
            if (data.subCollectionName && data.subDocID) {
                ref = doc(ref, data.subCollectionName, data.subDocID);
            }

            await deleteDoc(ref);
            return { success: true, message: 'Documento eliminato con successo' };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    validate_data(data = {}, necessaryField = [], optionalField = []) {
        for (const field of necessaryField) {
            if (!data[field]) {
              throw new Error(`Il campo ${field} è necessario.`);
            }
        }
    }
}
