import ApiFunctions from "./api_functions.js";
import InstagramFunctions from "./instagram_functions.js";
import TwitterFunctions from "./twitter_functions.js";
import TikTokFunctions from "./tiktok_functions.js";
import FacebookFunctions from "./facebook_functions.js";
import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import path from "path";
import axios from "axios";
import { fileURLToPath } from "url";
import multer from "multer";
import fs from "fs";
import { Buffer } from 'buffer';
import {google} from 'googleapis'
import { Readable } from 'stream';

dotenv.config();
const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "../public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "./views/index.html"));
});

app.use(bodyParser.json());

const functions = new ApiFunctions();
const instagram = new InstagramFunctions();
const twitter = new TwitterFunctions();
const facebook = new FacebookFunctions();
const tiktok = new TikTokFunctions();

app.all("/api", async (req, res) => {
  const { action } = req.query.action;
  const data = req.body;

  switch (action) {
    case "login_user":
      const loginResult = await functions.login_user(data);
      res.json(loginResult);
      break;

    case "register_user":
      const registerResult = await functions.register_user(data);
      res.json(registerResult);
      break;

    case "payment":
      break;

    case "payment_callback":
      break;

    case "get_user":
      const userData = await functions.get_user_data(data);
      res.json(userData);
      break;

    case "create_user":
      const userDataCreated = await functions.create_user(data);
      res.json(userDataCreated);
      break;

    case "update_user":
      const updatedUserData = await functions.update_user(data);
      res.json(updatedUserData);
      break;

    case "delete_user":
      const deletedUserData = await functions.delete_user(data);
      res.json(deletedUserData);
      break;

    case "create_document":
      const documentDataCreated = await functions.create_document(data);
      res.json(documentDataCreated);
      break;

    case "get_document":
      const documentData = await functions.get_document(data);
      res.json(documentData);
      break;

    case "update_document":
      const updatedDocumentData = await functions.update_document(data);
      res.json(updatedDocumentData);
      break;

    case "delete_document":
      const deletedDocumentData = await functions.delete_document(data);
      res.json(deletedDocumentData);
      break;

    default:
      res.status(400).json({ error: `Invalid Action ${action}` });
  }
});

app.all("/instagram", async (req, res) => {
  const instagram_action = req.query.action;
  const data = req.body;

  try {
    switch (instagram_action) {
      case "callback":
        const { code } = req.query;
        if (!code) {
          return res.status(400).json({ error: "Authorization code not provided" });
        }
        const callbackResponse = await instagram.handleCallback(code);
        res.json(callbackResponse);
        break;

      case "authorize":
        const authUrl = instagram.getAuthorizationUrl();
        res.redirect(authUrl);
        break;

      case "deauthorize":
        const deauthResponse = await instagram.handleDeauthorization(data);
        res.json(deauthResponse);
        break;

      case "dataDelation":
        const dataDeletionResponse = await instagram.handleDataDeletion(data);
        res.json(dataDeletionResponse);
        break;

      case "webhook":
        const webhookResponse = await instagram.handleWebhook(req.query);
        if (webhookResponse.success) {
          res.send(webhookResponse.challenge);
        } else {
          res.status(403).send("Verification failed");
        }
        break;

      case "postOnInstagram":
        const postResponse = await instagram.postOnInstagram(data);
        res.json(postResponse);
        break;

      default:
        res.status(400).json({ error: `Invalid Action ${instagram_action}` });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
/*

//TEST FILE UPLOAD

// Configura multer per caricare i file in memoria
const storage = multer.memoryStorage();
const upload = multer({ storage });
// Percorso assoluto del file JSON
const filePath = path.join(__dirname, './social-suite-ll-mb-93433014622e.json');

// Leggi il file JSON

let json;
let drive;
let authGD;

fs.readFile(filePath, 'utf8', (err, data) => {
  if (err) {
    console.error('Errore nel leggere il file JSON:', err);
    return;
  }

  try {
    json = JSON.parse(data);  // Parsea il contenuto del file come JSON
    console.log(json);

    // Usa il JSON come necessario, ad esempio passarlo come configurazione
    authGD = new google.auth.GoogleAuth({
      keyFile: json,  // Il JSON del file
      scopes: ['https://www.googleapis.com/auth/drive.file'],
    });

    drive = google.drive({ version: 'v3', authGD });
  } catch (error) {
    console.error('Errore nel parsing del JSON:', error);
  }
});


// Converte il Buffer in un Readable Stream
function bufferToStream(buffer) {
    const stream = new Readable();
    stream.push(buffer);
    stream.push(null);
    return stream;
  }
  
  // Endpoint per caricare il file su Google Drive
  app.post('/upload', upload.single('file'), async (req, res) => {
    if (!req.file) {
      return res.status(400).send('No file uploaded.');
    }
  
    const fileBuffer = req.file.buffer; // File in memoria come Buffer
    const fileName = req.file.originalname; // Nome originale del file
  
    try {
      // Carica il file su Google Drive
      const fileMetadata = {
        name: fileName,
      };
      const media = {
        mimeType: req.file.mimetype,
        body: bufferToStream(fileBuffer), // Usa un Readable Stream
      };
  
      const response = await drive.files.create({
        resource: fileMetadata,
        media: media,
        fields: 'id',
      });
  
      const fileId = response.data.id;
      const fileLink = `https://drive.google.com/file/d/${fileId}/view`;
  
      res.status(200).send(`File uploaded successfully to Google Drive. Shareable link: ${fileLink}`);
    } catch (error) {
      console.error('Error uploading to Google Drive:', error);
      res.status(500).send('Failed to upload file to Google Drive.');
    }
  });
*/

  
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server avviato su http://localhost:${PORT}`);
});
