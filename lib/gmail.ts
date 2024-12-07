import nodemailer from 'nodemailer';
import { google, gmail_v1 } from 'googleapis';
const oAuth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URI
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

export const getEmails = async (page: number = 1, limit: number = 20, folder: string = 'INBOX') => {
  try {
    const gmail = await getGmailService();
    const pageToken = page === 1 ? undefined : await getPageToken(page, limit, folder);

    // List messages from Gmail
    const { data } = await gmail.users.messages.list({
      userId: 'me',
      maxResults: limit,
      pageToken: pageToken,
      labelIds: [folder],
    });

    if (!data.messages || data.messages.length === 0) {
      return { emails: [], nextPageToken: null };
    }

    // Fetch detailed data for each message
    const emailDetails = await Promise.all(
      data.messages.map(async (message) => {
        try {
          const response = await gmail.users.messages.get({
            userId: 'me',
            id: message.id!,
          });

          const messageData = response.data;
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
            id: message.id,
            from,
            to: 'me', // Assuming "me" as the recipient
            date,
            subject,
            body: decodedBody,
          };
        } catch (error) {
          console.error(`Error fetching message ${message.id}:`, error);
          return null;
        }
      })
    );


    return { emails: emailDetails, nextPageToken: data.nextPageToken || null };
  } catch (error: any) {
    console.error('Error fetching emails:', error);
    throw new Error(`Failed to fetch emails: ${error.message}`);
  }
};

export const getTotalEmailCount = async (folder: string = 'INBOX') => {
  try {
    const gmail = await getGmailService();
    const { data } = await gmail.users.labels.get({
      userId: 'me',
      id: folder,
    });
    return data.messagesTotal || 0;
  } catch (error: any) {
    console.error('Error fetching total email count:', error);
    throw new Error(`Failed to fetch total email count: ${error.message}`);
  }
};

const getPageToken = async (page: number, limit: number, folder: string) => {
  const gmail = await getGmailService();
  let currentPage = 1;
  let pageToken: string | undefined = undefined;

  while (currentPage < page) {
    const { data } = await gmail.users.messages.list({
      userId: 'me',
      maxResults: limit,
      pageToken: pageToken,
      labelIds: [folder],
    });
    pageToken = data.nextPageToken;
    currentPage++;

    if (!pageToken) break;
  }

  return pageToken;
};

export const verifyCredentials = async () => {
  try {
    const { token } = await oAuth2Client.getAccessToken();
    if (!token) {
      throw new Error('Failed to obtain access token');
    }
    console.log('Credentials verified successfully');
    return true;
  } catch (error: any) {
    console.error('Error verifying credentials:', error);
    if (error.response) {
      console.error('Error response:', error.response.data);
    }
    return false;
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

