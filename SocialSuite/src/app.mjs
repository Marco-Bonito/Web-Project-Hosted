import ApiFunctions from './api_functions.js';
import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();
const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, '../public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, './views/index.html'));
});

app.use(bodyParser.json());

const functions = new ApiFunctions();

app.all('/api', async (req, res) => {
    const action = req.query.action;
    const data = req.body;

    switch (action) {
        case 'login_user':
            const loginResult = await functions.login_user(data);
            res.json(loginResult);
            break;

        case 'register_user':
            const registerResult = await functions.register_user(data);
            res.json(registerResult);
            break;

        case 'payment' :
            break;
        
        case 'payment_callback':
            break;

        case 'get_user':
            const userData = await functions.get_user_data(data); 
            res.json(userData);
            break;

        case 'create_user':
            const userDataCreated = await functions.create_user(data); 
            res.json(userDataCreated);
            break;
        
        case 'update_user':
            const updatedUserData = await functions.update_user(data);
            res.json(updatedUserData);
            break;

        case 'delete_user':
            const deletedUserData = await functions.delete_user(data);
            res.json(deletedUserData)
            break;
        
        case 'create_document':
            const documentDataCreated = await functions.create_document(data);
            res.json(documentDataCreated)
            break;
        
        case 'get_document':
            const documentData = await functions.get_document(data); 
            res.json(documentData);
            break;

        case 'update_document':
            const updatedDocumentData = await functions.update_document(data);
            res.json(updatedDocumentData);
            break;

        case 'delete_document':
            const deletedDocumentData = await functions.delete_document(data);
            res.json(deletedDocumentData)
            break;

        default:
            res.status(400).json({ error: 'Invalid action' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server avviato su http://localhost:${PORT}`);
});
