import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

export default class InstagramFunctions {
  constructor() {
    this.AUTHORIZATION_URL = "https://api.instagram.com/oauth/authorize";
    this.TOKEN_URL = "https://api.instagram.com/oauth/access_token";
    this.CLIENT_ID = process.env.INSTAGRAM_APP_ID;
    this.CLIENT_SECRET = process.env.INSTAGRAM_APP_SECRET_KEY;
    this.REDIRECT_URI = "https://socialsuite.site/instagram?action=callback";
    this.INSTAGRAM_GRAPH_API = "https://graph.instagram.com";
  }

  getAuthorizationUrl() {
    return `${this.AUTHORIZATION_URL}?client_id=${this.CLIENT_ID}&redirect_uri=${this.REDIRECT_URI}&scope=user_profile,user_media&response_type=code`;
  }

  async handleCallback(code) {
    try {
      const tokenResponse = await axios.post(this.TOKEN_URL, null, {
        params: {
          client_id: this.CLIENT_ID,
          client_secret: this.CLIENT_SECRET,
          grant_type: "authorization_code",
          redirect_uri: this.REDIRECT_URI,
          code: code,
        },
      });

      const tokenData = tokenResponse.data;
      if (!tokenData.access_token || !tokenData.user_id) {
        throw new Error("Invalid token data received from Instagram");
      }

      return { access_token: tokenData.access_token, user_id: tokenData.user_id };
    } catch (error) {
      throw new Error(`Failed to retrieve access token: ${error.message}`);
    }
  }

  async handleDeauthorization(data) {
    // Logica specifica per la deautorizzazione
    return { status: "deauthorization received" };
  }

  async handleDataDeletion(data) {
    // Logica specifica per la cancellazione dei dati
    return { status: "data deletion request received" };
  }

  async handleWebhook(query) {
    const verifyToken = query["hub.verify_token"];
    const challenge = query["hub.challenge"];

    if (verifyToken === process.env.VERIFY_TOKEN_INSTAGRAM_WEBHOOKS) {
      return { success: true, challenge: challenge };
    } else {
      return { success: false };
    }
  }

  async postOnInstagram(data) {
    const { access_token, ig_id, media_url, media_type, is_carousel_item } = data;

    if (!access_token || !ig_id || !media_url || !media_type) {
      throw new Error("Access token, IG ID, media URL, and media type are required");
    }

    try {
      const mediaContainerResponse = await axios.post(
        `${this.INSTAGRAM_GRAPH_API}/${ig_id}/media`,
        null,
        {
          params: {
            media_type: media_type,
            [media_type === "IMAGE" ? "image_url" : "video_url"]: media_url,
            is_carousel_item: is_carousel_item || false,
            access_token: access_token,
          },
        }
      );

      const containerId = mediaContainerResponse.data.id;
      if (!containerId) {
        throw new Error("Failed to retrieve container ID");
      }

      const publishResponse = await axios.post(
        `${this.INSTAGRAM_GRAPH_API}/${ig_id}/media_publish`,
        null,
        {
          params: {
            creation_id: containerId,
            access_token: access_token,
          },
        }
      );

      return {
        message: "Post published successfully",
        media_id: publishResponse.data.id,
      };
    } catch (error) {
      throw new Error(`An error occurred while posting to Instagram: ${error.message}`);
    }
  }
}
