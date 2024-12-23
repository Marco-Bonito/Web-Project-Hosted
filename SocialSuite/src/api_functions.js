export default class ApiFunctions {

    async login_user(userData = {}){
        this.validate_data(userData , ['email' , 'password']);
        return userData
    }

    async register_user(userData = {}){
        this.validate_data(userData , ['email' , 'password']);
        return userData
    }

    async get_user_data(userData = {}){
        this.validate_data(userData , [] , ['ID' , 'email']);
        return userData
    }

    async create_user(userData = {}){
        this.validate_data(userData , ['email']);
        return userData
    }

    async update_user(userData = {}){
        this.validate_data(userData , [] ,['ID' , 'email']);
        return userData
    }

    async delete_user(userData = {}){
        this.validate_data(userData , [] , ['ID' , 'email']);
        return userData
    }

    async create_document(data = {}){
        this.validate_data(data , ['mainCollectionName'] , ['mainDocID' , 'subCollectionName' , 'subCollectionName']);
        return data
    }

    async update_document(data = {}){
        this.validate_data(data , ['mainCollectionName'] , ['mainDocID' , 'subCollectionName' , 'subCollectionName']);
        return data
    }

    async get_document(data = {}){
        this.validate_data(data , ['mainCollectionName'] , ['mainDocID' , 'subCollectionName' , 'subCollectionName']);
        return data
    }

    async delete_document(data = {}){
        this.validate_data(data , ['mainCollectionName'] , ['mainDocID' , 'subCollectionName' , 'subCollectionName']);
        return data
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