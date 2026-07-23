import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { industry, problem } = await req.json();

    if (!industry || !problem) {
      return NextResponse.json({ message: 'Industry and problem are required' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ message: 'GEMINI_API_KEY is not configured' }, { status: 500 });
    }

    const prompt = `You are an expert AI Business Advisor. 
Given the following details about a business, provide a structured recommendation for an AI Agent solution.
Industry: ${industry}
Problem: ${problem}

Return your response strictly as a JSON object matching this exact schema:
{
  "name": "A short, catchy name for the AI agent (e.g. Resume Screening AI)",
  "category": "One of: Coding, Writing, Support",
  "pricingModel": "Suggested pricing model string (e.g. $0.01 / 1K tokens)",
  "description": "A 1-2 sentence description of what the agent will do",
  "whySuitable": "Why this solution is a good fit for their problem",
  "expectedBenefits": "The expected business benefits",
  "techStack": "Suggested technology stack (e.g. OpenAI, LangChain, Node.js)",
  "difficulty": "Implementation difficulty (Easy, Medium, Hard)",
  "roi": "Estimated ROI (High, Medium, Low)"
}
Do not include markdown blocks, just return raw JSON string.`;

    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          response_mime_type: "application/json",
        }
      })
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error('Gemini API Error:', errorText);
      return NextResponse.json({ message: 'Failed to generate recommendation from AI' }, { status: 500 });
    }

    const data = await res.json();
    const resultText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!resultText) {
      return NextResponse.json({ message: 'Invalid response from AI' }, { status: 500 });
    }

    const jsonResponse = JSON.parse(resultText);

    return NextResponse.json(jsonResponse);
  } catch (error) {
    console.error('AI Advisor API Error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
