import { google } from 'googleapis';
import nodemailer from 'nodemailer';

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

