import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { skillName } = await req.json();
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: "API Key not configured" }, { status: 500 });
    }

    const prompt = `Classify this technology: "${skillName}". 
    1. CATEGORY: Assign a clear professional category (e.g., "Programming Language", "Frontend Framework", "Backend Development", "DevOps Tool", "Database System", "Cybersecurity"). 
    CRITICAL: Always use Title Case with spaces (e.g., "Frontend Framework", NOT "FrontendFramework" or "FRONTEND").
    2. ICON: Best matching lowercase name for a tech icon (e.g., "python", "react", "docker").
    Return JSON: { "category": "...", "name": "${skillName}", "icon": "..." }`;

    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: [
          { role: 'system', content: 'You are an expert technical classifier. Be precise and professional.' },
          { role: 'user', content: prompt }
        ],
        response_format: { type: 'json_object' }
      })
    });

    const data = await res.json();
    return NextResponse.json(JSON.parse(data.choices[0].message.content));
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
