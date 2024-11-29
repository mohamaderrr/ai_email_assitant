import { PrismaClient } from '@prisma/client';
import { nanoid } from 'nanoid';

const prisma = new PrismaClient();

export async function insertEmailsToDatabase(emails: any[], clientId: number) {
  let actualClientId: number;

  // Check if the client exists
  const client = await prisma.clients.findUnique({
    where: { id: clientId },
  });

  if (client) {
    actualClientId = clientId;
  } else {
    // If client doesn't exist, create a new one with a unique ID and email from the first email
    const firstEmail = emails[0];
    const newClient = await prisma.clients.create({
      data: {
        name: `Unknown Client ${nanoid(6)}`,
        email: firstEmail.from, // Use the 'from' email address
        phoneNumber: 'unknown',
        city: 'Unknown',
        country: 'Unknown',
        ownerId: 0,
        status: 'New',
        createdAt: new Date(),
        createdBy: 0,
      },
    });
    actualClientId = newClient.id;
  }

  const emailPromises = emails.map(async (email) => {
    try {
      return await prisma.email.create({
        data: {
          subject: email.subject,
          from: email.from,
          to: email.to,
          body: email.body,
          receivedAt: new Date(email.date),
          clientId: actualClientId,
        },
      });
    } catch (error) {
      console.error('Error inserting email:', error);
      throw error;
    }
  });

  return Promise.all(emailPromises);
}

