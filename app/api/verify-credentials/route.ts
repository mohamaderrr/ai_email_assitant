import { NextResponse } from 'next/server';
import { verifyCredentials } from '@/lib/gmail';

export async function GET() {
  try {
    const credentialsValid = await verifyCredentials();
    if (credentialsValid) {
      return NextResponse.json({ status: 'Credentials are valid' });
    } else {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }
  } catch (error: any) {
    console.error('Error verifying credentials:', error);
    return NextResponse.json({ 
      error: 'Failed to verify credentials',
      details: error.message
    }, { status: 500 });
  }
}

