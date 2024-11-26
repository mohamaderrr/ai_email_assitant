//AI-powered response generation
// api that take selected email , prevision emails with client , clients info from database 
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { PromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { selectedEmailId, clientId } = await request.json();

    // Fetch the selected email
    const selectedEmail = await prisma.email.findUnique({
      where: { id: selectedEmailId },
    });

    if (!selectedEmail) {
      return NextResponse.json({ error: 'Selected email not found' }, { status: 404 });
    }

    // Fetch previous emails for the client
    const previousEmails = await prisma.email.findMany({
      where: { clientId: clientId },
      orderBy: { receivedAt: 'desc' },
      take: 5, // Limit to the 5 most recent emails
    });

    // Fetch client information
    const client = await prisma.clients.findUnique({
      where: { id: clientId },
      include: {
        Documents: true,
        Events: true,
        History: true,
        Notes: true,
      },
    });

    if (!client) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 });
    }

    // Prepare the context for AI
    const emailHistory = previousEmails.map(email => `From: ${email.from}\nTo: ${email.to}\nSubject: ${email.subject}\nBody: ${email.body}`).join('\n\n');
    const clientInfo = `Name: ${client.name}\nEmail: ${client.email}\nPhone: ${client.phoneNumber}\nCity: ${client.city}\nCountry: ${client.country}\nStatus: ${client.status}`;
    const clientDocuments = client.Documents.map(doc => `Type: ${doc.type}, Amount: ${doc.amount}, Status: ${doc.status}`).join('\n');
    const clientEvents = client.Events.map(event => `Name: ${event.name}, Description: ${event.description}, Start: ${event.startingAt}, End: ${event.endingAt}`).join('\n');
    const clientNotes = client.Notes.map(note => note.description).join('\n');

    // Initialize Gemini model
    const model = new ChatGoogleGenerativeAI({
      modelName: "gemini-pro",
      maxOutputTokens: 2048,
      apiKey: process.env.GOOGLE_API_KEY,
    });

    // Create a prompt template
    const prompt = PromptTemplate.fromTemplate(`
      You are an AI assistant helping to draft an email response. Use the following information to generate a professional and contextually appropriate response:

      Selected Email:
      From: {selectedEmailFrom}
      To: {selectedEmailTo}
      Subject: {selectedEmailSubject}
      Body: {selectedEmailBody}

      Email History:
      {emailHistory}

      Client Information:
      {clientInfo}

      Client Documents:
      {clientDocuments}

      Client Events:
      {clientEvents}

      Client Notes:
      {clientNotes}

      Please draft a response to the selected email, taking into account the client's history, current status, and any relevant information from previous interactions. The response should be professional, empathetic, and tailored to the client's specific situation.
    `);

    // Create the chain
    const chain = prompt.pipe(model).pipe(new StringOutputParser());

    // Generate the response
    const response = await chain.invoke({
      selectedEmailFrom: selectedEmail.from,
      selectedEmailTo: selectedEmail.to,
      selectedEmailSubject: selectedEmail.subject,
      selectedEmailBody: selectedEmail.body,
      emailHistory,
      clientInfo,
      clientDocuments,
      clientEvents,
      clientNotes,
    });

    return NextResponse.json({ generatedResponse: response });
  } catch (error) {
    console.error('Error generating response:', error);
    return NextResponse.json({ error: 'Failed to generate response' }, { status: 500 });
  }
}

