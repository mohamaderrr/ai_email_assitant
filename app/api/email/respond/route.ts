import { NextRequest, NextResponse } from 'next/server';
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { PromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";

export const runtime = 'edge';

// Mock function to simulate database query
async function mockClientQuery(email: string) {
  // Simulating a delay
  await new Promise(resolve => setTimeout(resolve, 100));
  
  if (email === 'test@example.com') {
    return {
      name: 'John Doe',
      email: 'test@example.com',
      phoneNumber: '123-456-7890',
      city: 'New York',
      country: 'USA',
      status: 'Active',
      Documents: [{ type: 'Invoice' }, { type: 'Contract' }],
      Events: [{ name: 'Meeting' }, { name: 'Follow-up' }],
      Notes: [{ description: 'Last contact: 2 weeks ago' }],
    };
  }
  return null;
}

export async function POST(req: NextRequest) {
  const encoder = new TextEncoder();
  try {
    const { selectedEmailBody, model, to } = await req.json();
    console.log('Request body:', { selectedEmailBody, model, to });

    if (!selectedEmailBody || !model || !to) {
      throw new Error('Missing required fields');
    }

    if (model !== 'gemini') {
      throw new Error('Only Gemini model is supported in Edge runtime');
    }

    if (!process.env.GOOGLE_API_KEY) {
      throw new Error('GOOGLE_API_KEY is not set');
    }

    const chatModel = new ChatGoogleGenerativeAI({
      modelName: "gemini-pro",
      maxOutputTokens: 2048,
      apiKey: process.env.GOOGLE_API_KEY,
      streaming: true,
    });
    console.log('Chat model created');

    // Fetch mock client information
    const client = await mockClientQuery(to);
    console.log('Client info:', client);

    let clientInfo = '';
    if (client) {
      clientInfo = `
        Client Information:
        Name: ${client.name}
        Email: ${client.email}
        Phone: ${client.phoneNumber}
        City: ${client.city}
        Country: ${client.country}
        Status: ${client.status}
        Recent Documents: ${client.Documents.slice(0, 3).map(doc => doc.type).join(', ')}
        Upcoming Events: ${client.Events.slice(0, 3).map(event => event.name).join(', ')}
        Recent Notes: ${client.Notes.slice(0, 3).map(note => note.description).join(', ')}
      `;
    }

    const prompt = PromptTemplate.fromTemplate(`
      You are an AI assistant helping to draft an email response. Use the following information to generate a professional and contextually appropriate response:

      Original Email Body: {selectedEmailBody}

      ${client ? '{clientInfo}' : ''}

      Please draft a response to this email. The response should be professional, empathetic, and tailored to the specific content of the original email. 
      ${client ? 'Use the client information provided to personalize the response and make relevant references to their recent activities or upcoming events if appropriate.' : ''}
    `);
    console.log('Prompt template:', prompt.template);

    const chain = prompt.pipe(chatModel).pipe(new StringOutputParser());
    console.log('Streaming response started');

    const stream = await chain.stream({
      selectedEmailBody: selectedEmailBody,
      clientInfo: clientInfo,
    });

    return new Response(
      new ReadableStream({
        async start(controller) {
          try {
            for await (const chunk of stream) {
              controller.enqueue(encoder.encode(chunk));
            }
            controller.close();
          } catch (error) {
            console.error('Error in stream processing:', error);
            controller.error(error);
          }
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
    return NextResponse.json({ error: error.message || 'Failed to generate response' }, { status: 500 });
  }
}

