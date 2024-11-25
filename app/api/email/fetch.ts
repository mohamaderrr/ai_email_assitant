import { NextResponse } from 'next/server'
import { google } from 'googleapis'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const SCOPES = ['https://www.googleapis.com/auth/gmail.readonly']

const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  },
  scopes: SCOPES,
})

export async function POST() {
  try {
    const gmail = google.gmail({ version: 'v1', auth })

    const response = await gmail.users.messages.list({
      userId: 'me',
      maxResults: 10, // Adjust as needed
    })

    const messages = response.data.messages || []
    let count = 0

    for (const message of messages) {
      const email = await gmail.users.messages.get({
        userId: 'me',
        id: message.id!,
      })

      const headers = email.data.payload?.headers
      const subject = headers?.find(h => h.name === 'Subject')?.value || 'No Subject'
      const from = headers?.find(h => h.name === 'From')?.value || 'Unknown'
      const to = headers?.find(h => h.name === 'To')?.value || 'Unknown'
      const date = headers?.find(h => h.name === 'Date')?.value
      const body = email.data.snippet || 'No body'

      await prisma.email.create({
        data: {
          subject,
          from,
          to,
          body,
          receivedAt: date ? new Date(date) : new Date(),
        },
      })

      count++
    }

    return NextResponse.json({ count })
  } catch (error) {
    console.error('Error fetching emails:', error)
    return NextResponse.json({ error: 'Failed to fetch emails' }, { status: 500 })
  }
}

