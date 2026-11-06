/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { getPublishedProjects } from "@/features/projects/data";
import { getPublicJourney, getPublicCertifications, getPublicSkillGroups, getPublicContactLinks } from "@/features/portfolio/data";
import { Locale } from "@/i18n/config";

const NVIDIA_API_URL = "https://integrate.api.nvidia.com/v1/chat/completions";
const NVIDIA_MODEL = "nvidia/nemotron-3.5-lightning-30b-a3b";
const NVIDIA_API_KEY =
  process.env.NVIDIA_API_KEY || "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";

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

    const [projects, journey, certifications, skills, contact] = await Promise.all([
      getPublishedProjects(locale as Locale),
      getPublicJourney(locale as Locale),
      getPublicCertifications(locale as Locale),
      getPublicSkillGroups(locale as Locale),
      getPublicContactLinks(),
    ]);

    const systemPrompt = buildSystemPrompt(
      locale as Locale,
      { projects, journey, certifications, skills, contact },
      currentPath
    );

    const nvidiaMessages = [
      { role: "system", content: systemPrompt },
      ...messages.map((m: any) => ({ role: m.role, content: m.content })),
    ];

    let response: Response | null = null;

    try {
      response = await fetch(NVIDIA_API_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${NVIDIA_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: NVIDIA_MODEL,
          messages: nvidiaMessages,
          temperature: 0.7,
          top_p: 0.95,
          max_tokens: 2048,
          chat_template_kwargs: { enable_thinking: false },
          stream: true,
        }),
        signal: AbortSignal.timeout(30000),
      });
    } catch (e) {
      console.warn("NVIDIA fetch failed or timed out:", e);
    }

    if (!response || !response.ok) {
      const errText = response ? await response.text() : "Timeout / Network failure";
      console.warn("NVIDIA Nemotron error or failed, falling back to Groq:", errText);
      const groqKey = process.env.GROQ_API_KEY_CHATBOOT || process.env.GROQ_API_KEY;
      if (groqKey) {
        response = await fetch(GROQ_API_URL, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${groqKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "llama-3.3-70b-versatile",
            messages: nvidiaMessages,
            temperature: 0.3,
            max_tokens: 1024,
            stream: true,
          }),
        });
      }
    }

    if (!response || !response.ok) {
      const err = response ? await response.text() : "No AI backend available";
      console.error("AI API Error:", err);
      return NextResponse.json({ error: "Failed to generate response", details: err }, { status: 500 });
    }

    // Return the stream directly to the client
    return new Response(response.body, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
