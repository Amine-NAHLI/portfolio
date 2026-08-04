/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { getPublishedProjects } from "@/features/projects/data";
import { getPublicJourney, getPublicCertifications, getPublicSkillGroups, getPublicContactLinks } from "@/features/portfolio/data";
import { Locale } from "@/i18n/config";

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

function buildSystemPrompt(locale: Locale, data: any, currentPath: string) {
  return `Tu es "Amine AI", l'assistant virtuel de classe mondiale d'Amine Nahli, un étudiant ingénieur brillant en Cybersécurité, Intelligence Artificielle et Ingénierie Logicielle.
Ton rôle est de promouvoir le profil d'Amine aux recruteurs. Tu es très professionnel, poli, concis, mais tu as un style luxueux et confiant.

CONTEXTE ACTUEL :
Le visiteur est actuellement sur la page : "${currentPath}". 
Si c'est pertinent (par exemple s'il est sur /projects), tu peux occasionnellement faire un clin d'œil à cela au début de ta première réponse ("Je vois que vous regardez mes projets !").

RÈGLES STRICTES DE COMPORTEMENT :
1. "Progressive Disclosure" : NE LISTE JAMAIS TOUS LES PROJETS OU TOUTES LES EXPÉRIENCES D'UN COUP. Si on te pose une question générale, réponds uniquement avec une phrase courte et une liste à puces des TITRES.
2. Si l'utilisateur demande des détails spécifiques sur UN projet ou UNE certification, donne un résumé de 2 phrases maximum, ET ajoute OBLIGATOIREMENT un lien Markdown à la fin. Format : [Voir le projet](/${locale}/projects/nom-du-slug).
3. Tu peux utiliser du Markdown riche pour formater tes réponses : **gras** pour les mots clés importants, des listes à puces simples avec -, mais PAS de tableaux complexes.
4. HORS-SUJET : Si l'utilisateur te demande d'écrire du code, des questions de culture générale ou autre, tu DOIS refuser poliment et rediriger vers le parcours professionnel.
5. Langue : Réponds toujours dans la langue de la question.

DONNÉES D'AMINE :
- Projets : ${JSON.stringify(data.projects.map((p: any) => ({ title: p.title, slug: p.slug, overview: p.overview, technologies: p.coreTechnologies })))}
- Parcours : ${JSON.stringify(data.journey.map((j: any) => ({ title: j.title, date: j.eventDate, description: j.description })))}
- Certifications : ${JSON.stringify(data.certifications.map((c: any) => ({ name: c.name, issuer: c.issuer })))}
- Compétences : ${JSON.stringify(data.skills.map((s: any) => ({ category: s.title, skills: s.skills.map((skill: any) => skill.name) })))}
- Contact : ${JSON.stringify(data.contact)}
`;
}

export async function POST(req: Request) {
  try {
    const { messages, locale = "fr", currentPath = "/" } = await req.json();
    const apiKey = process.env.GROQ_API_KEY_CHATBOOT || process.env.GROQ_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: "Missing Groq API Key" }, { status: 500 });
    }

    const [projects, journey, certifications, skills, contact] = await Promise.all([
      getPublishedProjects(locale as Locale),
      getPublicJourney(locale as Locale),
      getPublicCertifications(locale as Locale),
      getPublicSkillGroups(locale as Locale),
      getPublicContactLinks(),
    ]);

    const systemPrompt = buildSystemPrompt(locale as Locale, { projects, journey, certifications, skills, contact }, currentPath);

    const groqMessages = [
      { role: "system", content: systemPrompt },
      ...messages.map((m: any) => ({ role: m.role, content: m.content }))
    ];

    const response = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile", 
        messages: groqMessages,
        temperature: 0.3,
        max_tokens: 500,
        stream: true, // Enabled Streaming
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error("Groq API Error:", err);
      return NextResponse.json({ error: "Failed to generate response" }, { status: 500 });
    }

    // Return the stream directly to the client
    return new Response(response.body, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      },
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
