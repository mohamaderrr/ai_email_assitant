import { NextRequest, NextResponse } from 'next/server';
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatOllama } from "@langchain/ollama";
import { PromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  const encoder = new TextEncoder();

  try {
    const { selectedEmailBody, model, fromEmail } = await req.json();

    // Find the client based on the email address
    const client = await prisma.clients.findFirst({
      where: {
        email: fromEmail
      },
      include: {
        Documents: true,
        Events: true,
        History: true,
        Notes: true
      }
    });

    if (!client) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 });
    }

    let chatModel;
    if (model === 'gemini') {
      chatModel = new ChatGoogleGenerativeAI({
        modelName: "gemini-pro",
        maxOutputTokens: 2048,
        apiKey: process.env.GOOGLE_API_KEY,
        streaming: true,
      });
    } else if (model === 'llama') {
      chatModel = new ChatOllama({
        baseUrl: "http://localhost:11434", //  Ollama server url
        model: "llama3.1",
        streaming: true,
      });
    } else {
      throw new Error('Invalid model selected');
    }

    const prompt = PromptTemplate.fromTemplate(`
      You are an AI assistant helping to draft an email response. Use the following information to generate a professional and contextually appropriate response:

      Original Email Body:
      {selectedEmailBody}

      Client Information:
      Name: {clientName}
      Email: {clientEmail}
      Phone: {clientPhone}
      City: {clientCity}
      Country: {clientCountry}
      Status: {clientStatus}

      Recent Documents:
      {recentDocuments}

      Upcoming Events:
      {upcomingEvents}

      Recent Notes:
      {recentNotes}

      Please draft a response to this email. The response should be professional, empathetic, and tailored to the specific content of the original email and the client's information provided above. Use the client's information to personalize the response and address any relevant recent activities or upcoming events if applicable.
    `);

    const recentDocuments = client.Documents.slice(0, 3).map(doc => 
      `Type: ${doc.type}, Amount: ${doc.amount}, Status: ${doc.status}`
    ).join('\n');

    const upcomingEvents = client.Events.filter(event => new Date(event.startingAt) > new Date())
      .slice(0, 3).map(event => 
        `Name: ${event.name}, Date: ${event.startingAt.toLocaleDateString()}`
      ).join('\n');

    const recentNotes = client.Notes.slice(0, 3).map(note => 
      `${note.description} (${note.createdAt.toLocaleDateString()})`
    ).join('\n');

    const chain = prompt.pipe(chatModel).pipe(new StringOutputParser());

    const stream = await chain.stream({
      selectedEmailBody: selectedEmailBody,
      clientName: client.name,
      clientEmail: client.email,
      clientPhone: client.phoneNumber,
      clientCity: client.city,
      clientCountry: client.country,
      clientStatus: client.status,
      recentDocuments: recentDocuments || 'No recent documents',
      upcomingEvents: upcomingEvents || 'No upcoming events',
      recentNotes: recentNotes || 'No recent notes'
    });

    return new Response(
      new ReadableStream({
        async start(controller) {
          for await (const chunk of stream) {
            controller.enqueue(encoder.encode(chunk));
          }
          controller.close();
        },
      }),
      {
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'Transfer-Encoding': 'chunked',
        },
      }
    );
  } catch (error) {
    console.error('Error generating response:', error);
    return NextResponse.json({ error: 'Failed to generate response' }, { status: 500 });
  }
}

