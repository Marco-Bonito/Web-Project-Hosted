import { auth , firestore } from '../firebase_config.js'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';


export default class ApiFunctions {

    async login_user(userData = {}){
        this.validate_data(userData , ['email' , 'password']);
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

    async register_user(userData = {}){
        this.validate_data(userData , ['email' , 'password']);
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

    async get_user_data(userData = {}){
        this.validate_data(userData , [] , ['ID' , 'email']);
        return { success: true, data: userData }
    }

    async create_user(userData = {}){
        this.validate_data(userData , ['email']);
        return { success: true, data: userData }
    }

    async update_user(userData = {}){
        this.validate_data(userData , [] ,['ID' , 'email']);
        return { success: true, data: userData }
    }

    async delete_user(userData = {}){
        this.validate_data(userData , [] , ['ID' , 'email']);
        return { success: true, data: userData }
    }

    async create_document(data = {}){
        this.validate_data(data , ['mainCollectionName'] , ['mainDocID' , 'subCollectionName' , 'subCollectionName']);
        return { success: true, data: data }
    }

    async update_document(data = {}){
        this.validate_data(data , ['mainCollectionName'] , ['mainDocID' , 'subCollectionName' , 'subCollectionName']);
        return { success: true, data: data }
    }

    async get_document(data = {}){
        this.validate_data(data , ['mainCollectionName'] , ['mainDocID' , 'subCollectionName' , 'subCollectionName']);
        return { success: true, data: data }
    }

    async delete_document(data = {}){
        this.validate_data(data , ['mainCollectionName'] , ['mainDocID' , 'subCollectionName' , 'subCollectionName']);
        return { success: true, data: data }
    }
    
    validate_data(data = {} , necessaryField = [] , optionalField = []){
        for (const key of Object.keys(data)){
            console.log(key)
        }
        necessaryField.forEach((field)=>{
            console.log(field)
        })

        optionalField.forEach((optField)=>{
            console.log(optField)
        })
    }
}