import { NextResponse } from 'next/server';
import { getEmails } from '@/lib/gmail';
import prisma from '@/lib/prisma';

async function insertEmailsToDatabase(emails: any[], clientId: number) {
  const emailPromises = emails.map(async (email) => {
    try {
      return await prisma.email.create({
        data: {
          subject: email.subject,
          from: email.from,
          to: email.to,
          body: email.body,
          receivedAt: new Date(email.date),
          clientId: clientId,
        },
      });
    } catch (error) {
      console.error('Error inserting email:', error);
      throw error;
    }
  });

  return Promise.all(emailPromises);
}

export async function GET() {
  try {
    const { emails } = await getEmails();
    
    // Note: Replace this with actual client ID logic based on your requirements
    const clientId = 1; // Example client ID
    
    // Insert emails into the database
    await insertEmailsToDatabase(emails, clientId);

    return NextResponse.json({ 
      success: true,
      message: `Successfully fetched and stored ${emails.length} emails`,
      emails 
    });
  } catch (error) {
    console.error('Error in API route:', error);
    return NextResponse.json(
      { error: 'Failed to fetch or store emails' }, 
      { status: 500 }
    );
  }
}


