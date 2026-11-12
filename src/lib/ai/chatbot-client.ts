export type ChatbotRole = "system" | "user" | "assistant";

export interface ChatbotMessage {
  role: ChatbotRole;
  content: string;
}

export type ChatbotProvider = "nvidia" | "groq";

export interface ChatbotStreamResult {
  response: Response;
  provider: ChatbotProvider;
}

export interface ChatbotCompletionResult {
  content: string;
  provider: ChatbotProvider;
  model: string;
}

export interface ChatbotCompletionOptions {
  messages: ChatbotMessage[];
  temperature?: number;
  topP?: number;
  maxTokens?: number;
  timeoutMs?: number;
  jsonMode?: boolean;
}

const NVIDIA_API_URL = "https://integrate.api.nvidia.com/v1/chat/completions";
const DEFAULT_NVIDIA_MODEL = "nvidia/nemotron-3.5-lightning-30b-a3b";
const FALLBACK_NVIDIA_API_KEY =
  "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";

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const DEFAULT_GROQ_MODEL = "llama-3.3-70b-versatile";

function getNvidiaConfig() {
  return {
    url: NVIDIA_API_URL,
    model: process.env.NVIDIA_MODEL || DEFAULT_NVIDIA_MODEL,
    apiKey: process.env.NVIDIA_API_KEY || FALLBACK_NVIDIA_API_KEY,
  };
}

function getGroqConfig() {
  return {
    url: GROQ_API_URL,
    model: process.env.GROQ_MODEL || DEFAULT_GROQ_MODEL,
    apiKey: process.env.GROQ_API_KEY_CHATBOOT || process.env.GROQ_API_KEY || "",
  };
}

function buildPayload(
  provider: ChatbotProvider,
  model: string,
  options: ChatbotCompletionOptions,
  stream: boolean,
  includeJsonFormat: boolean
) {
  const payload: Record<string, unknown> = {
    model,
    messages: options.messages,
    temperature: options.temperature ?? (provider === "nvidia" ? 0.3 : 0.2),
    max_tokens: options.maxTokens ?? (stream ? 2048 : 2048),
    stream,
  };

  if (options.topP !== undefined) {
    payload.top_p = options.topP;
  }

  if (provider === "nvidia") {
    payload.chat_template_kwargs = { enable_thinking: false };
  }

  if (!stream && includeJsonFormat) {
    payload.response_format = { type: "json_object" };
  }

  return payload;
}

/**
 * Streams a completion using the same AI stack as /api/chat:
 * Primary: NVIDIA Nemotron Integrate API, Fallback: Groq Chat Completions.
 */
export async function streamChatbotCompletion(
  options: ChatbotCompletionOptions
): Promise<ChatbotStreamResult> {
  const nvidia = getNvidiaConfig();
  const timeoutMs = options.timeoutMs ?? 30_000;
  let response: Response | null = null;

  if (nvidia.apiKey) {
    try {
      response = await fetch(nvidia.url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${nvidia.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(buildPayload("nvidia", nvidia.model, options, true, false)),
        signal: AbortSignal.timeout(timeoutMs),
      });
      if (response.ok) {
        return { response, provider: "nvidia" };
      }
    } catch (error) {
      console.warn("NVIDIA Nemotron stream failed or timed out:", error);
    }
  }

  const errText = response ? await response.text().catch(() => "Unknown NVIDIA error") : "Timeout / Network failure";
  console.warn("NVIDIA Nemotron error or unavailable, falling back to Groq:", errText);

  const groq = getGroqConfig();
  if (!groq.apiKey) {
    throw new Error(`No AI backend available (${errText})`);
  }

  const groqResponse = await fetch(groq.url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${groq.apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(
      buildPayload(
        "groq",
        groq.model,
        {
          ...options,
          temperature: Math.min(options.temperature ?? 0.3, 0.5),
          maxTokens: Math.min(options.maxTokens ?? 1024, 2048),
        },
        true,
        false
      )
    ),
    signal: AbortSignal.timeout(timeoutMs),
  });

  if (!groqResponse.ok) {
    const groqErr = await groqResponse.text().catch(() => `HTTP ${groqResponse.status}`);
    throw new Error(`AI API Error: ${groqErr}`);
  }

  return { response: groqResponse, provider: "groq" };
}

/**
 * Runs a non-streaming completion using the exact same AI stack as the chatbot:
 * Primary: NVIDIA Nemotron Integrate API, Fallback: Groq Chat Completions.
 */
export async function requestChatbotCompletion(
  options: ChatbotCompletionOptions
): Promise<ChatbotCompletionResult> {
  const timeoutMs = options.timeoutMs ?? 40_000;
  const nvidia = getNvidiaConfig();

  if (nvidia.apiKey) {
    const tryNvidia = async (withJsonMode: boolean) => {
      const response = await fetch(nvidia.url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${nvidia.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(buildPayload("nvidia", nvidia.model, options, false, withJsonMode)),
        signal: AbortSignal.timeout(timeoutMs),
      });
      return response;
    };

    try {
      let response = await tryNvidia(Boolean(options.jsonMode));
      // Some NVIDIA NIM endpoints reject response_format=json_object on certain models; retry plain JSON prompting.
      if (!response.ok && options.jsonMode && (response.status === 400 || response.status === 422)) {
        response = await tryNvidia(false);
      }

      if (response.ok) {
        const payload = (await response.json()) as {
          choices?: Array<{ message?: { content?: string | null } }>;
        };
        const content = payload.choices?.[0]?.message?.content?.trim();
        if (content) {
          return { content, provider: "nvidia", model: nvidia.model };
        }
      } else {
        const errBody = await response.text().catch(() => `HTTP ${response.status}`);
        console.warn("NVIDIA Nemotron completion failed, falling back to Groq:", response.status, errBody);
      }
    } catch (error) {
      console.warn("NVIDIA Nemotron completion error, falling back to Groq:", error);
    }
  }

  const groq = getGroqConfig();
  if (!groq.apiKey) {
    throw new Error("Aucun backend IA disponible (clés API manquantes).");
  }

  const groqResponse = await fetch(groq.url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${groq.apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(buildPayload("groq", groq.model, options, false, Boolean(options.jsonMode))),
    signal: AbortSignal.timeout(timeoutMs),
  });

  if (!groqResponse.ok) {
    const groqErr = await groqResponse.text().catch(() => `HTTP ${groqResponse.status}`);
    throw new Error(`Groq fallback error (${groqResponse.status}): ${groqErr}`);
  }

  const payload = (await groqResponse.json()) as {
    choices?: Array<{ message?: { content?: string | null } }>;
  };
  const content = payload.choices?.[0]?.message?.content?.trim();
  if (!content) {
    throw new Error("Réponse IA vide.");
  }

  return { content, provider: "groq", model: groq.model };
}

/**
 * Parses a JSON object or array returned by an LLM, stripping <think> tags or markdown fences if present.
 */
export function parseAiJson<T>(raw: string): T {
  const withoutThink = raw.replace(/<think>[\s\S]*?<\/think>/gi, "").trim();
  const withoutFences = withoutThink
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  try {
    return JSON.parse(withoutFences) as T;
  } catch {
    const firstBrace = withoutFences.indexOf("{");
    const lastBrace = withoutFences.lastIndexOf("}");
    if (firstBrace !== -1 && lastBrace > firstBrace) {
      return JSON.parse(withoutFences.slice(firstBrace, lastBrace + 1)) as T;
    }

    const firstBracket = withoutFences.indexOf("[");
    const lastBracket = withoutFences.lastIndexOf("]");
    if (firstBracket !== -1 && lastBracket > firstBracket) {
      return JSON.parse(withoutFences.slice(firstBracket, lastBracket + 1)) as T;
    }

    throw new Error("Impossible d'analyser le JSON retourné par l'IA.");
  }
}

