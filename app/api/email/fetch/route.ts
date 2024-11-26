import { NextResponse } from 'next/server';
import { getEmails } from '@/lib/gmail';

export async function GET() {
  try {
    const { emails } = await getEmails();
    return NextResponse.json({ emails });
  } catch (error) {
    console.error('Error in API route:', error);
    return NextResponse.json({ error: 'Failed to fetch emails' }, { status: 500 });
  }
}

