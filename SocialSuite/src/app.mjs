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
            res.status(400).json({ error: `Invalid Action ${action}`});
    }
});

app.all('/instagram', async (req, res) => {
    const instagram_action = req.query.action;
    const data = req.body;

    switch (instagram_action) {
        case 'callback':
            res.status(200).json({ action: `Action ${instagram_action}`});
            break;

        case 'webhook':
            res.status(200).json({ action: `Action ${instagram_action}`});
            break;

        default:
            res.status(400).json({ error: `Invalid Action ${instagram_action}`});
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server avviato su http://localhost:${PORT}`);
});


/*
from flask import Flask, request, jsonify, redirect ,render_template
import requests

app = Flask(__name__)

# Configura le variabili di ambiente o le impostazioni per i tuoi dati
CLIENT_ID = "1099406285519189"
CLIENT_SECRET = "ebec2b460452dfb858790c6e289cc837"
REDIRECT_URI = "https://bonny9901.pythonanywhere.com/callback"
AUTHORIZATION_URL = "https://api.instagram.com/oauth/authorize"
TOKEN_URL = "https://api.instagram.com/oauth/access_token"


@app.route('/')
def home():
    """
    Endpoint principale che restituisce la pagina di login.
    """
    return render_template('login.html')

# Endpoint per i Webhook
@app.route('/webhook', methods=['GET'])
def webhook_verify():
    # Ottieni il token di verifica dalla query string
    verify_token = request.args.get('hub.verify_token')
    challenge = request.args.get('hub.challenge')

    # Controlla se il token di verifica corrisponde
    if verify_token == "123456789":  # Dovrebbe essere lo stesso token configurato nel Developer Dashboard
        return challenge  # Restituisci il challenge per la verifica
    else:
        return "Verification failed", 403  # Rifiuta la verifica se non corrisponde

@app.route('/authorize', methods=['GET'])
def authorize_user():
    authorization_redirect_url = (
        f"{AUTHORIZATION_URL}?client_id={CLIENT_ID}&redirect_uri={REDIRECT_URI}&scope=user_profile,user_media&response_type=code"
    )
    return redirect(authorization_redirect_url)

@app.route('/callback', methods=['GET'])
def callback():
    code = request.args.get('code')
    if not code:
        return jsonify({"error": "Authorization code not provided"}), 400

    # Scambio del codice temporaneo per un access token
    token_response = requests.post(TOKEN_URL, data={
        'client_id': CLIENT_ID,
        'client_secret': CLIENT_SECRET,
        'grant_type': 'authorization_code',
        'redirect_uri': REDIRECT_URI,
        'code': code
    })

    if token_response.status_code != 200:
        return jsonify({"error": "Failed to retrieve access token", "details": token_response.text}), 500

    token_data = token_response.json()

    access_token = token_data.get("access_token")
    user_id = token_data.get("user_id")

    if not access_token or not user_id:
        return jsonify({"error": "Invalid token data received from Instagram"}), 500

    return jsonify({
        "access_token": access_token,
        "user_id": user_id
    })

@app.route('/deauthorize', methods=['POST'])
def deauthorize():
    data = request.get_json()
    # Gestisci la revoca dell'accesso qui, ad esempio, rimuovendo l'utente dal database
    return jsonify({"status": "deauthorization received"})

@app.route('/data-deletion', methods=['DELETE'])
def data_deletion():
    # Gestisci la richiesta di cancellazione dei dati qui
    return jsonify({"status": "data deletion request received"})

INSTAGRAM_GRAPH_API = "https://graph.instagram.com"

@app.route('/post_to_instagram', methods=['POST'])
def post_to_instagram():
    # Ricevi i dati dalla richiesta
    data = request.get_json()
    access_token = data.get('access_token')
    ig_id = data.get('ig_id')
    media_url = data.get('media_url')
    media_type = data.get('media_type')
    is_carousel_item = data.get('is_carousel_item', False)  # Valore predefinito: False

    # Controlla che tutti i campi obbligatori siano presenti
    if not access_token or not ig_id or not media_url or not media_type:
        return jsonify({"error": "Access token, IG ID, media URL, and media type are required"}), 400

    # Step 1: Crea il media container
    media_container_response = requests.post(
        f"{INSTAGRAM_GRAPH_API}/{ig_id}/media",
        params={
            "media_type": media_type,
            "image_url" if media_type == "IMAGE" else "video_url": media_url,
            "is_carousel_item": is_carousel_item,
            "access_token": access_token
        }
    )

    if media_container_response.status_code != 200:
        return jsonify({
            "error": "Failed to create media container",
            "details": media_container_response.json()
        }), media_container_response.status_code

    container_id = media_container_response.json().get("id")
    if not container_id:
        return jsonify({"error": "Failed to retrieve container ID"}), 500

    # Step 2: Pubblica il media container
    publish_response = requests.post(
        f"{INSTAGRAM_GRAPH_API}/{ig_id}/media_publish",
        params={
            "creation_id": container_id,
            "access_token": access_token
        }
    )

    if publish_response.status_code != 200:
        return jsonify({
            "error": "Failed to publish post",
            "details": publish_response.json()
        }), publish_response.status_code

    # Restituisce l'ID del media pubblicato
    published_media_id = publish_response.json().get("id")
    return jsonify({
        "message": "Post published successfully",
        "media_id": published_media_id
    })

#https://www.instagram.com/oauth/authorize?enable_fb_login=0&force_authentication=1&client_id=1099406285519189&redirect_uri=https://bonny9901.pythonanywhere.com/callback&response_type=code&scope=instagram_business_basic%2Cinstagram_business_manage_messages%2Cinstagram_business_manage_comments%2Cinstagram_business_content_publish
if __name__ == '__main__':
    app.run(debug=True)
*/