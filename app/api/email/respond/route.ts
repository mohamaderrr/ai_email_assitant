import { NextRequest, NextResponse } from 'next/server';
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { PromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { ChatOpenAI } from "@langchain/openai";
import { BaseChatModel } from "@langchain/core/language_models/chat_models";
import prisma from '@/lib/prisma';
import { getClientInfo } from '@/lib/getClientInfo';
// Define the type for the chat model
let chatModel: BaseChatModel;

export async function POST(req: NextRequest) {
  const encoder = new TextEncoder();
  try {
    const { selectedEmailBody, model, to } = await req.json();
    console.log('Request body:', { selectedEmailBody, model, to });

    if (!selectedEmailBody || !model || !to) {
      throw new Error('Missing required fields');
    }

    // Initialize the chat model based on the selected model
    if (model === 'gemini') {
      if (!process.env.GOOGLE_API_KEY) {
        throw new Error('GOOGLE_API_KEY is not set');
      }
      chatModel = new ChatGoogleGenerativeAI({
        modelName: "gemini-pro",
        maxOutputTokens: 2048,
        apiKey: process.env.GOOGLE_API_KEY,
        streaming: true,
      });
      console.log('Chat model gemini created');
    } else if (model === "openai") {
      if (!process.env.OPENAI_API_KEY) {
        throw new Error('OPENAI_API_KEY is not set');
      }
      chatModel = new ChatOpenAI({
        modelName: "gpt-3.5-turbo",
        openAIApiKey: process.env.OPENAI_API_KEY,
        streaming: true,
      });
      console.log('Chat model openai created');
    } else {
      throw new Error('Invalid model specified');
    }

    // Fetch client information using Prisma
    const client = await getClientInfo(to);
    console.log('Client info:', client);

    let clientInfo = '';
    let emailHistory = '';
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
      console.log("Client info:", clientInfo);

      emailHistory = client.emails.length > 0 ? client.emails.map(email => `
        Date: ${email.receivedAt.toISOString()}
        From: ${email.from}
        To: ${email.to}
        Subject: ${email.subject}
        Body: ${email.body.substring(0, 100)}...
      `).join('\n\n') : 'No recent email history available.';
      console.log("Email history:", emailHistory);
    }

    const promptTemplate = `
      You are an AI assistant helping to draft an email response. Use the following information to generate a professional and contextually appropriate response:

      Original Email Body: {selectedEmailBody}

      ${client ? 'Client Information:\n{clientInfo}' : ''}

      ${client && client.emails.length > 0 ? 'Recent Email History:\n{emailHistory}' : ''}

      Please draft a response to this email. The response should be professional, empathetic, and tailored to the specific content of the original email. 
      ${client ? 'Use the client information provided to personalize the response and make relevant references to their recent activities or upcoming events if appropriate.' : ''}
      ${client && client.emails.length > 0 ? 'Consider the recent email history when crafting your response, ensuring continuity in the conversation.' : ''}
    `;

    const prompt = PromptTemplate.fromTemplate(promptTemplate);
    console.log('Prompt template:', promptTemplate);

    const chain = prompt.pipe(chatModel).pipe(new StringOutputParser());
    console.log('Streaming response started');

    const stream = await chain.stream({
      selectedEmailBody: selectedEmailBody,
      clientInfo: clientInfo,
      emailHistory: emailHistory,
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
    const err = error as Error;
    return NextResponse.json({ error: err.message || 'Failed to generate response' }, { status: 500 });
  }
}

