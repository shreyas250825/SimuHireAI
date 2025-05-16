import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function POST(req: Request) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      console.error('OpenAI API key is missing');
      return NextResponse.json(
        { error: 'OpenAI API key is not configured' },
        { status: 500 }
      );
    }

    const { transcript } = await req.json();

    if (!transcript) {
      return NextResponse.json(
        { error: 'Transcript is required' },
        { status: 400 }
      );
    }

    console.log('Sending request to OpenAI with transcript:', transcript.substring(0, 100) + '...');

    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are an expert interviewer. Evaluate the candidate's response and provide constructive feedback focusing on clarity, technical accuracy, and communication skills."
        },
        {
          role: "user",
          content: `Please evaluate this interview response: "${transcript}"`
        }
      ],
      model: "gpt-3.5-turbo",
      temperature: 0.7,
      max_tokens: 500
    });

    const feedback = completion.choices[0]?.message?.content || 'No feedback available';
    console.log('Received feedback from OpenAI');

    return NextResponse.json({ feedback });
  } catch (error: any) {
    console.error('Evaluation error:', {
      message: error.message,
      code: error.code,
      type: error.type,
      stack: error.stack
    });
    
    return NextResponse.json(
      { error: error.message || 'Failed to evaluate response' },
      { status: 500 }
    );
  }
} 