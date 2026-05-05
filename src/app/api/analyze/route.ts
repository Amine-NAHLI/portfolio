import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { repoData } = await req.json();

    // On prépare le prompt pour Ollama
    const prompt = `
      You are an expert technical portfolio curator. Analyze the following GitHub repository data and return a JSON object.
      
      DATA:
      - Name: ${repoData.name}
      - Description: ${repoData.description || 'No description provided'}
      - Languages: ${repoData.languages?.join(', ') || 'Unknown'}
      - Topics: ${repoData.topics?.join(', ') || 'None'}
      - Readme Snippet: ${repoData.readme?.substring(0, 2000) || 'No readme content'}

      INSTRUCTIONS:
      1. Category must be exactly one of: "Security", "Full-Stack", "AI", "Experiments".
      2. short_description should be a compelling 2-line technical summary.
      3. tags should be a list of 3 to 5 relevant technical keywords.
      4. Return ONLY the JSON object.

      RETURN FORMAT:
      {
        "category": "...",
        "short_description": "...",
        "tags": ["...", "..."]
      }
    `;

    // Appel à Ollama (assure-toi qu'Ollama tourne sur le port 11434)
    const response = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      body: JSON.stringify({
        model: 'mistral', // Change par 'llama3' si besoin
        prompt: prompt,
        stream: false,
        format: 'json'
      }),
    });

    const data = await response.json();
    const result = JSON.parse(data.response);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Ollama Error:', error);
    return NextResponse.json({ error: 'Failed to analyze with Ollama' }, { status: 500 });
  }
}
