import ApiFunctions from "./api_functions.js";
import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import path from "path";
import axios from "axios";
import { fileURLToPath } from "url";

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

/*
INSTAGRAM DATA
*/
const AUTHORIZATION_URL = "https://api.instagram.com/oauth/authorize";
const TOKEN_URL = "https://api.instagram.com/oauth/access_token";
const CLIENT_ID = process.env.INSTAGRAM_APP_ID;
const CLIENT_SECRET = process.env.INSTAGRAM_APP_SECRET_KEY;
const REDIRECT_URI = "https://socialsuite.site/instagram?action=callback";
const INSTAGRAM_GRAPH_API = "https://graph.instagram.com";
/*
INSTAGRAM DATA FINE
*/

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

  switch (instagram_action) {
    case "callback":
      const { code } = req.query.code;

      if (!code) {
        return res
          .status(400)
          .json({ error: "Authorization code not provided" });
      }

      try {
        const tokenResponse = await axios.post(TOKEN_URL, null, {
          params: {
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
            grant_type: "authorization_code",
            redirect_uri: REDIRECT_URI,
            code: code,
          },
        });

        const tokenData = tokenResponse.data;

        const accessToken = tokenData.access_token;
        const userId = tokenData.user_id;

        if (!accessToken || !userId) {
          return res
            .status(500)
            .json({ error: "Invalid token data received from Instagram" });
        }

        res.json({ access_token: accessToken, user_id: userId });
      } catch (error) {
        res
          .status(500)
          .json({
            error: "Failed to retrieve access token",
            details: error.response?.data || error.message,
          });
      }
      break;

    case "authorize":
      const authorizationRedirectUrl = `${AUTHORIZATION_URL}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=user_profile,user_media&response_type=code`;
      res.redirect(authorizationRedirectUrl);
      break;

    case "deauthorize":
      res.json({ status: "deauthorization received" });
      break;

    case "dataDelation":
      res.json({ status: "data deletion request received" });
      break;

    case "webhook":
      const verifyToken = req.query["hub.verify_token"];
      const challenge = req.query["hub.challenge"];

      if (verifyToken == process.env.VERIFY_TOKEN_INSTAGRAM_WEBHOOKS) {
        res.send(challenge);
      } else {
        res.status(403).send("Verification failed");
      }
      break;

    case "postOnInstagram":
      const data = req.body;
      const accessToken = data.access_token;
      const igId = data.ig_id;
      const mediaUrl = data.media_url;
      const mediaType = data.media_type;
      const isCarouselItem = data.is_carousel_item || false;

      if (!accessToken || !igId || !mediaUrl || !mediaType) {
        return res.status(400).json({
          error: "Access token, IG ID, media URL, and media type are required",
        });
      }

      try {
        const mediaContainerResponse = await axios.post(
          `${INSTAGRAM_GRAPH_API}/${igId}/media`,
          null,
          {
            params: {
              media_type: mediaType,
              [mediaType === "IMAGE" ? "image_url" : "video_url"]: mediaUrl,
              is_carousel_item: isCarouselItem,
              access_token: accessToken,
            },
          }
        );

        if (mediaContainerResponse.status !== 200) {
          return res.status(mediaContainerResponse.status).json({
            error: "Failed to create media container",
            details: mediaContainerResponse.data,
          });
        }

        const containerId = mediaContainerResponse.data.id;
        if (!containerId) {
          return res
            .status(500)
            .json({ error: "Failed to retrieve container ID" });
        }

        const publishResponse = await axios.post(
          `${INSTAGRAM_GRAPH_API}/${igId}/media_publish`,
          null,
          {
            params: {
              creation_id: containerId,
              access_token: accessToken,
            },
          }
        );

        if (publishResponse.status !== 200) {
          return res.status(publishResponse.status).json({
            error: "Failed to publish post",
            details: publishResponse.data,
          });
        }

        const publishedMediaId = publishResponse.data.id;
        return res.json({
          message: "Post published successfully",
          media_id: publishedMediaId,
        });
      } catch (error) {
        res.status(500).json({
          error: "An error occurred while posting to Instagram",
          details: error.response?.data || error.message,
        });
      }
      break;

    default:
      res.status(400).json({ error: `Invalid Action ${instagram_action}` });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server avviato su http://localhost:${PORT}`);
});
