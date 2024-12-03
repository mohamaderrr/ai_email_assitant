import prisma from '@/lib/prisma';

export async function getClientInfo(email: string) {
  try {
    const client = await prisma.clients.findFirst({
      where: {
        email: email,
      },
      include: {
        Documents: true,
        Events: true,
        Notes: true,
        emails: {
          orderBy: {
            receivedAt: 'desc'
          },
          take: 5 // Limit to the 5 most recent emails
        },
      },
    });

    if (!client) {
      return null;
    }

    return {
      name: client.name,
      email: client.email,
      phoneNumber: client.phoneNumber,
      city: client.city,
      country: client.country,
      status: client.status,
      Documents: client.Documents.map((doc) => ({ type: doc.type })),
      Events: client.Events.map((event) => ({ name: event.name })),
      Notes: client.Notes.map((note) => ({ description: note.description })),
      emails: client.emails.map((email) => ({
        subject: email.subject,
        from: email.from,
        to: email.to,
        body: email.body,
        receivedAt: email.receivedAt,
      })),
    };
  } catch (error) {
    console.error('Error fetching client info:', error);
    throw new Error('Failed to fetch client information');
  }
}

