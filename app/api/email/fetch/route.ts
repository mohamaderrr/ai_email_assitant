import { NextResponse } from 'next/server';
import { getEmails } from '@/lib/gmail';
import { insertEmailsToDatabase } from '@/lib/insertEmailsToDatabase';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const clientId = parseInt(searchParams.get('clientId') || '0', 10);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);

    const { emails } = await getEmails(page, limit);
    
    // Insert emails into the database
    const insertedEmails = await insertEmailsToDatabase(emails, clientId);

    return NextResponse.json({ 
      success: true,
      message: `Successfully fetched and stored ${insertedEmails.length} emails`,
      emails: insertedEmails,
      nextPage: page + 1
    });
  } catch (error) {
    console.error('Error in API route:', error);
    return NextResponse.json(
      { error: 'Failed to fetch or store emails' }, 
      { status: 500 }
    );
  }
}

