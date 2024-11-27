import { NextResponse } from 'next/server';
import natural from 'natural';

const analyzer = new natural.SentimentAnalyzer('English', natural.PorterStemmer, 'afinn');

export async function POST(request: Request) {
  const { text } = await request.json();

  if (!text) {
    return NextResponse.json({ error: 'Text is required' }, { status: 400 });
  }

  const sentiment = analyzer.getSentiment(text.split(' '));
  let result;

  if (sentiment > 0.05) {
    result = 'positive';
  } else if (sentiment < -0.05) {
    result = 'negative';
  } else {
    result = 'neutral';
  }

  return NextResponse.json({ sentiment: result });
}

