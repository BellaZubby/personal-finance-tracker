import {google} from "googleapis";
import {EMAIL_CLIENT_ID, EMAIL_CLIENT_SECRET, EMAIL_REDIRECT_URI, EMAIL_REFRESH_TOKEN} from "./dotenv";

// GMAIL
const oauth2Client = new google.auth.OAuth2(
  EMAIL_CLIENT_ID,
  EMAIL_CLIENT_SECRET,
  EMAIL_REDIRECT_URI,
);

oauth2Client.setCredentials({
  refresh_token: EMAIL_REFRESH_TOKEN!,
});

export const gmail = google.gmail({ version: 'v1', auth: oauth2Client });
