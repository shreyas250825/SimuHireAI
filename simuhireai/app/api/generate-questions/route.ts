import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function POST(req: Request) {
  const { intent } = await req.json();

  const prompt = `Generate 6 concise, professional interview questions for the following scenario:\n"${intent}"`;

  const completion = await openai.chat.completions.create({
    messages: [{ role: 'user', content: prompt }],
    model: 'gpt-3.5-turbo'
  });

  const questionsText = completion.choices[0].message.content;
  const questions = questionsText?.split('\n').filter(q => q.trim() !== '');

  return NextResponse.json({ questions });
}
