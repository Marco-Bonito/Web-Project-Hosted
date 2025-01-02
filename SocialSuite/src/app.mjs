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
import { Buffer } from "buffer";
import { google } from "googleapis";
import { Readable } from "stream";
import * as mega from "megajs";

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
const upload = multer({ storage: multer.memoryStorage() });

app.all("/api", async (req, res) => {
  const { action } = req.query;
  const data = req.body;

  switch (action) {
    case "upload_to_mega":
      try {
        // Usa multer come middleware per il caricamento dei file
        upload.single('file')(req, res, async (err) => {
          if (err) {
            return res.status(400).json({ error: err.message });
          }

          if (!req.file) {
            return res.status(400).json({ error: "No file provided" });
          }

          const fileBuffer = req.file.buffer; // Il file caricato è un buffer in memoria
          const fileName = req.file.originalname;

          // Login a Mega e carica il file
          const storage = new mega.Storage({
            email: process.env.MEGA_EMAIL,  // Usa variabili d'ambiente per proteggere le credenziali
            password: process.env.MEGA_PASSWORD,
          });

          storage.on("ready", () => {
            console.log("Accesso effettuato a Mega.nz!");

            const uploadStream = storage.upload({ name: fileName , allowUploadBuffering: true});

            // Carica il file direttamente dalla memoria (Buffer) a Mega
            const stream = Readable.from(fileBuffer);
            stream.pipe(uploadStream);

            uploadStream.on("complete", function () {
              console.log("Caricamento completato!", this.downloadLink);
              res.json({ success: true, downloadLink: this.downloadLink });
            });

            uploadStream.on("error", (err) => {
              console.error("Errore durante il caricamento:", err);
              res.status(500).json({ error: "Errore durante il caricamento su Mega.nz" });
            });
          });

          storage.on("error", (err) => {
            console.error("Errore durante il login a Mega.nz:", err);
            res.status(500).json({ error: "Errore durante il login a Mega.nz" });
          });
        });
      } catch (error) {
        console.error("Errore:", error);
        res.status(500).json({ error: error.message });
      }
      break;

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
          return res
            .status(400)
            .json({ error: "Authorization code not provided" });
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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server avviato su http://localhost:${PORT}`);
});
