import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Check if the API key is defined
const apiKey = process.env.GOOGLE_API_KEY;
const validToken = process.env.JWT_SECRET; // Token set in environment variables

if (!apiKey || !validToken) {
  throw new Error('Environment variables GOOGLE_API_KEY or JWT_SECRET are not defined');
}

// Initialize the Google AI client with the API key
const genAI = new GoogleGenerativeAI(apiKey);

export async function GET() {
  return NextResponse.json({ message: "Sentiment analysis API is running" });
}

export async function POST(request: NextRequest) {
  try {
    // Check the Authorization header
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized: Missing or invalid token' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    if (token !== validToken) {
      return NextResponse.json({ error: 'Unauthorized: Invalid token' }, { status: 401 });
    }

    // Parse the request body
    const { text } = await request.json();

    if (!text) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }

    // Prepare the prompt
    const prompt = `Analyze the sentiment of the following text and respond with only one word: 'positive', 'negative', or 'neutral'. Do not include any other text in your response.

Text: "${text}"

Sentiment:`;

    // Generate content using the generative model
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const sentiment = response.text().trim().toLowerCase();

    // Validate the response
    if (!['positive', 'negative', 'neutral'].includes(sentiment)) {
      throw new Error('Invalid sentiment response from model');
    }

    return NextResponse.json({ sentiment });
  } catch (error) {
    console.error('Error in sentiment analysis:', error);
    return NextResponse.json({ error: 'Error processing sentiment analysis' }, { status: 500 });
  }
}

