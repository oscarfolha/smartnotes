/**
 * AI Service — centralized LLM calls with prompt management and logging.
 * Operates in mock mode when AI_MOCK_MODE=true (default) or OPENAI_API_KEY is not set.
 */

const MOCK_MODE = process.env.AI_MOCK_MODE === 'true' || !process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'your-openai-api-key-here';

interface MeetingMetadata {
  participants: string[];
  decisions: string[];
  action_items: string[];
}

interface SmartTransformResult {
  shouldCreateReminder: boolean;
  priority?: 'low' | 'medium' | 'high';
}

function log(action: string, prompt: string, response: unknown) {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[AI] ${action}`, { promptLength: prompt.length, response });
  }
}

async function callLLM(systemPrompt: string, userPrompt: string): Promise<string> {
  if (MOCK_MODE) return '';

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.3,
      max_tokens: 500,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`OpenAI error: ${err}`);
  }

  const json = await res.json() as any;
  return json.choices?.[0]?.message?.content ?? '';
}

export const aiService = {
  async summarize(content: string): Promise<string | null> {
    const systemPrompt = 'You are a concise summarizer. Summarize the following note content in 1-2 sentences.';
    
    if (MOCK_MODE) {
      const summary = `Summary: ${content.slice(0, 80).trim()}...`;
      log('summarize', content, summary);
      return summary;
    }

    const result = await callLLM(systemPrompt, content);
    log('summarize', content, result);
    return result || null;
  },

  async extractMeetingData(content: string): Promise<MeetingMetadata | null> {
    const systemPrompt = `You are a meeting notes extractor. Given meeting notes, extract:
- participants (array of names)
- decisions (array of decisions made)
- action_items (array of action items)
Return ONLY valid JSON with keys: participants, decisions, action_items.`;

    if (MOCK_MODE) {
      // Basic heuristic mock extraction
      const lines = content.split(/[.\n]/);
      const participantLine = lines.find((l) => /participant|attendee|present/i.test(l)) ?? '';
      const participants = participantLine.match(/[A-Z][a-z]+/g) ?? [];

      const decisions = lines
        .filter((l) => /decided|agreed|will|resolve/i.test(l))
        .map((l) => l.trim())
        .filter(Boolean)
        .slice(0, 3);

      const action_items = lines
        .filter((l) => /action|task|todo|follow.?up/i.test(l))
        .map((l) => l.trim())
        .filter(Boolean)
        .slice(0, 3);

      const result: MeetingMetadata = { participants, decisions, action_items };
      log('extractMeetingData', content, result);
      return result;
    }

    const raw = await callLLM(systemPrompt, content);
    log('extractMeetingData', content, raw);
    try {
      return JSON.parse(raw) as MeetingMetadata;
    } catch {
      return null;
    }
  },

  async smartTransform(content: string): Promise<SmartTransformResult | null> {
    const systemPrompt = `You are an AI that detects if a note contains deadlines or responsibilities requiring a reminder.
Return JSON: { "shouldCreateReminder": boolean, "priority": "low" | "medium" | "high" }`;

    if (MOCK_MODE) {
      const hasDeadline = /deadline|due|by (monday|tuesday|wednesday|thursday|friday|saturday|sunday|tomorrow|next week|\d{1,2}\/\d{1,2})/i.test(content);
      const hasResponsibility = /must|need to|have to|responsible|assigned to/i.test(content);
      const shouldCreateReminder = hasDeadline || hasResponsibility;
      const priority = hasDeadline ? 'high' : hasResponsibility ? 'medium' : 'low';
      const result = { shouldCreateReminder, priority: priority as SmartTransformResult['priority'] };
      log('smartTransform', content, result);
      return result;
    }

    const raw = await callLLM(systemPrompt, content);
    log('smartTransform', content, raw);
    try {
      return JSON.parse(raw) as SmartTransformResult;
    } catch {
      return null;
    }
  },

  async query(question: string, context: string): Promise<string> {
    const systemPrompt = `You are a helpful AI assistant for a note-taking app called Smart Notes AI.
You have access to the user's notes below. Answer their question based on the notes.
Be concise and helpful.

USER NOTES:
${context}`;

    if (MOCK_MODE) {
      const answer = `[Mock AI] You asked: "${question}". Based on your notes, here is a summary of relevant information from the provided context.`;
      log('query', question, answer);
      return answer;
    }

    const result = await callLLM(systemPrompt, question);
    log('query', question, result);
    return result;
  },
};
