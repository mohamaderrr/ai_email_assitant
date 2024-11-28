import { NextRequest, NextResponse } from 'next/server';
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatOllama } from "@langchain/ollama";
import { PromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
// Must precede any llm module imports


export const runtime = 'edge';

export async function POST(req: NextRequest) {
  const encoder = new TextEncoder();

  try {
    const { selectedEmailBody, model } = await req.json();

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

      Please draft a response to this email. The response should be professional, empathetic, and tailored to the specific content of the original email.
    `);

    const chain = prompt.pipe(chatModel).pipe(new StringOutputParser());

    const stream = await chain.stream({
      selectedEmailBody: selectedEmailBody,
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

