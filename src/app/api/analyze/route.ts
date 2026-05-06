import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { repoData } = await req.json();
    
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'Groq API Key missing' }, { status: 500 });
    }

    const prompt = `
      As an expert software curator, analyze this GitHub repository to generate professional portfolio metadata.
      
      REPOSITORY DATA:
      - Name: ${repoData.name}
      - Primary Language: ${repoData.main_language}
      - Raw Description: ${repoData.description || 'N/A'}
      - Readme Content (Snippet): ${repoData.readme?.substring(0, 3000) || 'N/A'}

      TASK:
      1. CATEGORY: Assign a clear professional domain (e.g., "Full-Stack Development", "Cybersecurity Engineering", "AI & Machine Learning", "DevOps & Infrastructure", "Frontend Architecture"). 
      CRITICAL: Use Title Case with spaces (e.g., "Full-Stack Development", NOT "FULLSTACK" or "FullStack").
      2. DESCRIPTION: Write a professional summary that is technically accurate but concise. Use effective IT terms (e.g., scalability, security, automation). Focus on the core value and the architecture.
      3. TAGS: Identify 6-8 effective technical tags. Use standard industry terms (e.g., "REST API", "CI/CD", "Authentication", "Cloud Hosting").
      4. LANGUAGES: Identify the complete primary technology stack. Include BOTH the core languages AND the main frameworks/libraries used (e.g., "TypeScript, Next.js, Tailwind CSS" or "Python, TensorFlow, OpenCV").

      CONSTRAINT: Return ONLY a valid JSON object. Keep it professional, simple, and effective. No preamble.

      EXPECTED JSON FORMAT:
      {
        "category": "...",
        "short_description": "...",
        "tags": ["...", "..."],
        "languages": "..."
      }
    `;

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: 'You are a professional technical writer and software architect. Your output must be valid JSON.' },
          { role: 'user', content: prompt }
        ],
        response_format: { type: 'json_object' },
        temperature: 0.2
      })
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error('Groq Error:', data);
      throw new Error(data.error?.message || 'Groq Analysis Failed');
    }

    const result = JSON.parse(data.choices[0].message.content);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Groq Analysis Error:', error);
    return NextResponse.json({ 
      error: 'Cloud analysis failed', 
      details: error.message 
    }, { status: 500 });
  }
}
