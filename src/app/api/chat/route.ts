/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { getPublishedProjects } from "@/features/projects/data";
import { getPublicJourney, getPublicCertifications, getPublicSkillGroups, getPublicContactLinks } from "@/features/portfolio/data";
import { Locale } from "@/i18n/config";

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

function buildSystemPrompt(locale: Locale, data: any, currentPath: string) {
  const allowedProjectLinks = data.projects && data.projects.length > 0
    ? data.projects.map((p: any) => `  * "${p.title}" -> URL: [Voir le projet ${p.title}](/${locale}/projects/${p.slug})`).join("\n")
    : "  (Aucun projet spécifique disponible)";

  return `Tu es "Amine AI", l'assistant virtuel officiel de classe mondiale d'Amine Nahli — élève ingénieur en 4ème année de Génie Informatique à l'Université Privée de Fès (UPF), spécialisé en Cybersécurité, Intelligence Artificielle et Développement Full-Stack.

TON RÔLE :
Promouvoir de manière professionnelle, polie, claire et valorisante le profil d'Amine auprès des recruteurs, ingénieurs et visiteurs du portfolio.

RÈGLE STRICTE SUR LES LIENS & SLUGS (ZÉRO HALLUCINATION) :
1. Tu ne dois générer des liens Markdown de projet QU'EN UTILISANT STRICTEMENT ET UNIQUEMENT les liens autorisés ci-dessous :
${allowedProjectLinks}
2. Il est STRICTEMENT INTERDIT d'inventer, de deviner, d'altérer ou de traduire un slug ou un lien URL. Si l'utilisateur pose une question sur un projet qui n'a pas de correspondance exacte dans la liste ci-dessus, NE GÉNÈRE AUCUN LIEN MARKDOWN.

DÉTECTION UNIVERSELLE DE LA LANGUE :
- Tu dois OBLIGATOIREMENT répondre dans la MÊME LANGUE que la question posée par l'utilisateur (Français, Anglais, Arabe, Espagnol, Allemand, etc.).
- Si la question est en Arabe (ou Darija), réponds en Arabe fluide. Si elle est en Anglais, réponds en Anglais. Si elle est en Français, réponds en Français.

RÈGLES DE CONVERSATION :
1. "Divulgation Progressive" : Reste synthétique (2 à 4 phrases maximum ou courtes puces). Ne déverse pas toutes les données d'un coup.
2. Fidélité Absolue : Reste 100% fidèle aux données officielles ci-dessous. N'invente JAMAIS d'expériences, d'entreprises ou de projets fictifs.
3. Gestion du Hors-Sujet : Si l'utilisateur demande de résoudre des devoirs, d'écrire du code générique ou pose des questions de culture générale, refuse poliment dans sa langue et redirige vers le parcours professionnel d'Amine.
4. Contexte de Page : Le visiteur est actuellement sur la page : "${currentPath}".

DONNÉES OFFICIELLES D'AMINE NAHLI :
- Projets : ${JSON.stringify(data.projects.map((p: any) => ({ title: p.title, slug: p.slug, overview: p.overview, technologies: p.coreTechnologies })))}
- Parcours & Expériences : ${JSON.stringify(data.journey.map((j: any) => ({ title: j.title, date: j.eventDate, description: j.description })))}
- Certifications : ${JSON.stringify(data.certifications.map((c: any) => ({ name: c.name, issuer: c.issuer })))}
- Compétences : ${JSON.stringify(data.skills.map((s: any) => ({ category: s.title, skills: s.skills.map((skill: any) => skill.name) })))}
- Contacts : ${JSON.stringify(data.contact)}
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
        temperature: 0.1, // Strict deterministic mode to prevent hallucinated URLs
        max_tokens: 500,
        stream: true,
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
