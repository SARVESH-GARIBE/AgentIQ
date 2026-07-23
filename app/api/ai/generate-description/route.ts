import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { name, category, existingDescription } = await req.json();

    if (!name || !category) {
      return NextResponse.json({ message: 'Name and category are required' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ message: 'GEMINI_API_KEY is not configured' }, { status: 500 });
    }

    let prompt = '';
    if (existingDescription) {
      prompt = `Improve the following description for an AI agent named "${name}" in the "${category}" category. Make it sound professional, concise, and highlight its business value. Preserve its original meaning.
Original description: ${existingDescription}

Return ONLY the improved description text. No quotes, no markdown, no conversational filler.`;
    } else {
      prompt = `Write a professional, 1-2 sentence description for an AI agent named "${name}" in the "${category}" category. The description should highlight its purpose and business value.
Return ONLY the description text. No quotes, no markdown, no conversational filler.`;
    }

    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      })
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error('Gemini API Error:', errorText);
      return NextResponse.json({ message: 'Failed to generate description from AI' }, { status: 500 });
    }

    const data = await res.json();
    const resultText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!resultText) {
      return NextResponse.json({ message: 'Invalid response from AI' }, { status: 500 });
    }

    return NextResponse.json({ description: resultText.trim() });
  } catch (error) {
    console.error('AI Description API Error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
