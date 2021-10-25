import { Credentials } from "google-auth-library";
import { google } from "googleapis";

// generate a url that asks permissions for Blogger and Google Calendar scopes
const scopes = [
  "https://www.googleapis.com/auth/calendar",
  "https://www.googleapis.com/auth/userinfo.email",
  "https://www.googleapis.com/auth/userinfo.profile",
];

const getLoginUrl = () => {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID || "",
    process.env.GOOGLE_CLIENT_SECRET || "",
    process.env.NEXT_APP_REDIRECT_URL || "",
  );
  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: scopes
  });
  return url;
};

const getToken = async (code: string) => {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID || "",
    process.env.GOOGLE_CLIENT_SECRET || "",
    process.env.NEXT_APP_REDIRECT_URL || "",
  );
  const { tokens } = await oauth2Client.getToken(code);
  if (tokens.id_token) {
    const ticket = await oauth2Client.verifyIdToken({
      idToken: tokens.id_token,
      audience: process.env.GOOGLE_CLIENT_ID || "",
    });
    const payload = ticket.getPayload();
    if (payload) {
      return {
        token: tokens,
        payload,
      };
    }
  }
  throw new Error("Getting Access Failed...");
};

const getCalendarList = async (
  access_token: string | null,
  refresh_token: string | null,
  calendarId: string,
  timeMin: string,
  timeMax: string,
  timeZone: string,
) => {
  if (access_token && refresh_token) {
    const credentials: Credentials = {
      refresh_token,
      access_token,
      token_type: "Bearer",
      scope: scopes.join(","),
    };
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID || "",
      process.env.GOOGLE_CLIENT_SECRET || "",
      process.env.NEXT_APP_REDIRECT_URL || "",
    );
    oauth2Client.setCredentials(credentials)
    const calendar = google.calendar({
      version: "v3",
      auth: oauth2Client,
    });
    const calendarList = await calendar.events.list({
      calendarId,
      timeMin,
      timeMax,
      timeZone,
      orderBy: "startTime",
      singleEvents: true,
    });
    return calendarList.data.items;
  }
  throw new Error("Invalid Info...");
};

export {
  getLoginUrl,
  getToken,
  getCalendarList,
};
