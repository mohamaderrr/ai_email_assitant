import { NextResponse } from 'next/server'
import { getGmailService } from '@/lib/gmail'

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
  }
}

