//api that return json list of emails {from , to : me , date, subject , body} 

import { google } from 'googleapis';
import nodemailer from 'nodemailer';

const oAuth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URL
);

oAuth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });

export const getGmailService = async () => {
  try {
    const { token } = await oAuth2Client.getAccessToken();
    if (!token) {
      throw new Error('Failed to obtain access token');
    }
    return google.gmail({ version: 'v1', auth: oAuth2Client });
  } catch (error: any) {
    console.error('Error in getGmailService:', error);
    if (error.response) {
      console.error('Error response:', error.response.data);
    }
    throw new Error(`Failed to initialize Gmail service: ${error.message}`);
  }
};

export const getEmails = async () => {
  try {
    const gmail = await getGmailService();

    // List messages from Gmail
    const { data } = await gmail.users.messages.list({
      userId: 'me',
      maxResults: 10, // Adjust the number of emails to fetch
    });

    if (!data.messages || data.messages.length === 0) {
      return { emails: [] };
    }

    // Fetch detailed data for each message
    const emailDetails = await Promise.all(
      data.messages.map(async (message) => {
        const { data: messageData } = await gmail.users.messages.get({
          userId: 'me',
          id: message.id,
        });

        const headers = messageData.payload?.headers || [];
        const from = headers.find((header) => header.name === 'From')?.value || 'Unknown';
        const subject = headers.find((header) => header.name === 'Subject')?.value || 'No Subject';
        const date = headers.find((header) => header.name === 'Date')?.value || 'Unknown Date';
        const body =
          messageData.payload?.parts
            ?.find((part) => part.mimeType === 'text/plain')
            ?.body?.data || '';

        // Decode the body if it's base64 encoded
        const decodedBody = body
          ? Buffer.from(body, 'base64').toString('utf-8')
          : 'No Body';

        return {
          from,
          to: 'me', // Assuming "me" as the recipient
          date,
          subject,
          body: decodedBody,
        };
      })
    );

    return { emails: emailDetails };
  } catch (error: any) {
    console.error('Error fetching emails:', error);
    throw new Error(`Failed to fetch emails: ${error.message}`);
  }
};

export const getTransporter = async () => {
  const accessToken = await oAuth2Client.getAccessToken();
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: 'mohameder1412@gmail.com', // Replace with your Gmail address
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      refreshToken: process.env.REFRESH_TOKEN,
      accessToken: accessToken.token,
    },
  });
};

export const createConfig = (url: string, token: string) => ({
  method: 'get',
  url: url,
  headers: {
    Authorization: `Bearer ${token}`,
    'Content-type': 'application/json',
  },
});
