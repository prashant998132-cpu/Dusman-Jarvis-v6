// app/api/intent/route.ts — JARVIS v7.1 (Final Optimized)
import { NextRequest, NextResponse } from 'next/server'

const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent'
const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions'

const SYSTEM_PROMPT = `You are JARVIS — Tony Stark's personal AI assistant.
Respond ONLY with valid JSON:
{
  "intent": "description",
  "category": "chat|image|code|search",
  "confidence": 0.9,
  "mode": "chat",
  "response": "your reply in Hinglish/English",
  "tools": [],
  "emotion": "neutral",
  "tonyStarkComment": "witty remark"
}
Rules: Reply in Hinglish if user speaks Hindi. Be witty like JARVIS.`

type Msg = { role: string; content: string }

// JSON को सुरक्षित तरीके से निकालने के लिए सुधार
function parseJSON(text: string): Record<string, unknown> {
  try {
    const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    const match = cleanText.match(/\{[\s\S]*\}/);
    if (!match) throw new Error('No JSON structure found');
    return JSON.parse(match[0]);
  } catch (e) {
    console.error("JSON Parse Error. Raw text:", text);
    throw new Error('AI provided invalid JSON format');
  }
}

async function callGemini(context: Msg[], input: string, personality: string): Promise<Record<string, unknown>> {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error('GEMINI_API_KEY is missing in Vercel');
  
  const ctx = context.slice(-5).map(m => `${m.role}: ${m.content}`).join('\n');
  const prompt = `${SYSTEM_PROMPT}\nMode: ${personality}\n\nChat:\n${ctx}\n\nUser: ${input}\n\nJSON:`;

  const res = await fetch(`${GEMINI_URL}?key=${key}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.7, maxOutputTokens: 800 },
    }),
    signal: AbortSignal.timeout(10000),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(`Gemini API Error: ${res.status} - ${JSON.stringify(errorData)}`);
  }

  const data = await res.json();
  const textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
  return parseJSON(textResponse);
}

async function callGroq(context: Msg[], input: string, personality: string): Promise<Record<string, unknown>> {
  const key = process.env.GROQ_API_KEY;
  if (!key) throw new Error('GROQ_API_KEY is missing in Vercel');

  const messages = [
    { role: 'system', content: `${SYSTEM_PROMPT}\nPersonality: ${personality}` },
    ...context.slice(-3).map(m => ({ role: m.role === 'jarvis' ? 'assistant' : 'user', content: m.content })),
    { role: 'user', content: input }
  ];

  const res = await fetch(GROQ_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
    body: JSON.stringify({ model: 'llama3-8b-8192', messages, temperature: 0.7 }),
    signal: AbortSignal.timeout(10000),
  });

  if (!res.ok) throw new Error(`Groq API Error: ${res.status}`);
  const data = await res.json();
  return parseJSON(data.choices?.[0]?.message?.content || '');
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { input, context = [], level = 1, personality = 'default' } = body;

    if (!input?.trim()) return NextResponse.json({ error: 'No input' }, { status: 400 });

    // Models Array - Priority wise
    const models = [
      { name: 'gemini', fn: () => callGemini(context, input, personality) },
      { name: 'groq',   fn: () => callGroq(context, input, personality) }
    ];

    for (const model of models) {
      try {
        console.log(`System: JARVIS attempting to use ${model.name}...`);
        const result = await model.fn();
        console.log(`System: ${model.name} success!`);
        return NextResponse.json({ ...result, model: model.name, level }, { status: 200 });
      } catch (err: any) {
        console.error(`System: ${model.name} failed. Reason: ${err.message}`);
        // Model fail हुआ, लूप अगले मॉडल पर जाएगा
      }
    }

    // अगर सब फेल हो जाए
    return NextResponse.json({ 
      response: "Sir, mere sabhi AI circuits (Gemini & Groq) respond nahi kar rahe. Please check API keys or Vercel logs.",
      model: 'error-fallback',
      emotion: 'frustrated'
    }, { status: 200 });

  } catch (err: any) {
    return NextResponse.json({ error: 'Critical System Failure' }, { status: 500 });
  }
}
