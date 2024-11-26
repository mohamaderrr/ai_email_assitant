import { NextResponse } from 'next/server';
import { getTransporter } from '@/lib/gmail';

export async function POST(request: Request) {
  try {
    const { to, subject, body } = await request.json();

    // Validate input
    if (!to || !subject || !body) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const transporter = await getTransporter();
    const result = await transporter.sendMail({
      from: 'mohameder1412@gmail.com', // Using the email from getTransporter
      to,
      subject,
      text: body,
    });

    return NextResponse.json({ message: 'Email sent successfully', messageId: result.messageId });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}

