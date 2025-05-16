import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    // Log the incoming request
    console.log('Received evaluation request');

    if (!process.env.OPENAI_API_KEY) {
      console.error('OpenAI API key is missing');
      return NextResponse.json(
        { error: 'OpenAI API key is not configured' },
        { status: 500 }
      );
    }

    // Parse and validate request body
    let body;
    try {
      body = await request.json();
      console.log('Request body:', body);
    } catch (e) {
      console.error('Failed to parse request body:', e);
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      );
    }

    const { transcript } = body;

    if (!transcript) {
      console.error('No transcript provided');
      return NextResponse.json(
        { error: 'Transcript is required' },
        { status: 400 }
      );
    }

    console.log('Processing transcript:', transcript.substring(0, 100) + '...');

    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are an expert interviewer evaluating a candidate's response. Provide specific feedback on clarity, relevance, and professionalism. Structure your response with 'strengths', 'areas_for_improvement', and 'overall_score' (1-10)."
          },
          {
            role: "user",
            content: `Please evaluate this interview response: ${transcript}`
          }
        ],
        temperature: 0.7,
        max_tokens: 500
      });

      console.log('OpenAI response received');
      const feedback = completion.choices[0].message.content;
      
      return NextResponse.json({ feedback });
    } catch (openaiError: any) {
      console.error('OpenAI API error:', {
        message: openaiError.message,
        code: openaiError.code,
        type: openaiError.type
      });
      return NextResponse.json(
        { error: 'Failed to get evaluation from OpenAI' },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('Unexpected error in evaluation:', {
      message: error.message,
      stack: error.stack
    });
    return NextResponse.json(
      { error: 'Internal server error during evaluation' },
      { status: 500 }
    );
  }
} 