//api that take , to , subject , body 

import { NextResponse } from 'next/server';
import { getTransporter } from '@/lib/gmail';

export async function POST(request: Request) {
  try {
    const { to, subject, text } = await request.json();
    const transporter = await getTransporter();
    const result = await transporter.sendMail({
      from: 'your-email@gmail.com', // Replace with your Gmail address
      to,
      subject,
      text,
    });
    return NextResponse.json(result);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}

