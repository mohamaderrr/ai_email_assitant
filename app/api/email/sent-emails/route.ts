import { NextResponse } from 'next/server'
import { getGmailService } from '@/lib/gmail'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

type SentEmail = {
  id: string
  from: string
  to: string
  subject: string
  date: string
  snippet: string
}

export async function GET() {
  try {
    const gmail = await getGmailService()

    const response = await gmail.users.messages.list({
      userId: 'me',
      labelIds: ['SENT'],
      maxResults: 20, // Adjust as needed
    })

    const messages = response.data.messages || []

    const sentEmails: SentEmail[] = await Promise.all(
      messages.map(async (message) => {
        const emailData = await gmail.users.messages.get({
          userId: 'me',
          id: message.id!,
        })

        const headers = emailData.data.payload?.headers || []
        const from = headers.find(header => header.name === 'From')?.value || 'Unknown'
        const to = headers.find(header => header.name === 'To')?.value || 'Unknown'
        const subject = headers.find(header => header.name === 'Subject')?.value || 'No Subject'
        const date = headers.find(header => header.name === 'Date')?.value || 'Unknown Date'

        // Extract the body of the email
        const body = emailData.data.payload?.parts?.[0]?.body?.data || ''
        const decodedBody = Buffer.from(body, 'base64').toString('utf-8')

        // Save the email to the database
        try {
          await prisma.email.create({
            data: {
              id: message.id!,
              subject,
              from,
              to,
              body: decodedBody,
              receivedAt: new Date(date),
              clientId: 1, // You might want to adjust this based on your actual client ID logic
            },
          })
        } catch (dbError) {
          console.error('Error saving email to database:', dbError)
          // You might want to handle this error differently, e.g., skip this email or throw an error
        }

        return {
          id: message.id!,
          from,
          to,
          subject,
          date,
          snippet: emailData.data.snippet || 'No preview available',
        }
      })
    )

    return NextResponse.json({ emails: sentEmails })
  } catch (error) {
    console.error('Error fetching sent emails:', error)
    return NextResponse.json({ error: 'Failed to fetch sent emails' }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}

