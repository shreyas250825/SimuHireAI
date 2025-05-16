import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  const { answer } = await req.json();

  const prompt = `
You are an AI interview coach. Analyze the following candidate answer and give constructive feedback.
Evaluate tone, clarity, confidence, and content depth.

Candidate's Answer:
"${answer}"

Give concise feedback in 3-5 lines.
`;

  const completion = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [{ role: 'user', content: prompt }],
  });

  const feedback = completion.choices[0].message.content;
  return NextResponse.json({ feedback });
}
