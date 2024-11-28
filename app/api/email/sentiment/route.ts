import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Google AI client
const genAI = new GoogleGenerativeAI({ apiKey: process.env.GOOGLE_API_KEY });

export async function POST(request: Request) {
  try {
    const { text } = await request.json();

    if (!text) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }

    // Prepare the prompt
    const prompt = `Analyze the sentiment of the following text and respond with only one word: 'positive', 'negative', or 'neutral'. Do not include any other text in your response.

Text: "${text}"

Sentiment:`;

    // Generate content using the generative model
    const response = await genAI.generateText({
      model: "models/gemini-pro",
      prompt,
    });

    const sentiment = response.text?.trim().toLowerCase();

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
