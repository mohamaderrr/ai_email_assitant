import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { comparePassword } from '@/lib/auth';
import { sign } from 'jsonwebtoken';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function POST(request: Request) {
  const { email, password } = await request.json();

  try {
    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 400 });
    }

    // Compare hashed password
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 400 });
    }

    // Generate JWT token
    const token = sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' });

    // Create the response
    const response = NextResponse.json({ message: 'User signed in successfully' }, { status: 200 });

    // Clear any existing auth_token
    response.cookies.delete('auth_token');

    // Set the new token as an HTTP-only cookie
    response.cookies.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 3600, // 1 hour
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Error signing in user:', error);
    return NextResponse.json({ error: 'Error signing in user' }, { status: 500 });
  }
}

