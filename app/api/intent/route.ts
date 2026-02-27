import { NextRequest, NextResponse } from 'next/server'

const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent'
const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions'

const SYSTEM_PROMPT = `You are JARVIS. Respond ONLY with valid JSON:
{
  "intent": "chat",
  "response": "Your reply in Hinglish",
  "tonyStarkComment": "witty remark"
}
Rules: Respond in Hinglish. No extra text outside JSON.`

// --- Safe JSON Parser (पुराना वाला मजबूत फंक्शन) ---
function parseJSON(text: string) {
  try {
    const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleanText);
  } catch (e) {
    // Agar JSON fail ho jaye to plain text ko response mein daal do
    return {
      intent: "chat",
      response: text.substring(0, 1000),
      tonyStarkComment: "System stabilized, Sir."
    };
  }
}

export async function POST(req: NextRequest) {
  try {
    const { input } = await req.json();
    const GEMINI_KEY = process.env.GEMINI_API_KEY;
    const GROQ_KEY = process.env.GROQ_API_KEY;

    // --- Step 1: Try Gemini 2.0 (Primary) ---
    try {
      if (!GEMINI_KEY) throw new Error("Key missing");
      const res = await fetch(`${GEMINI_URL}?key=${GEMINI_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `${SYSTEM_PROMPT}\n\nUser: ${input}` }] }]
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
        return NextResponse.json(parseJSON(aiText));
      }
      throw new Error("Gemini Failed");
    } catch (geminiErr) {
      console.log("Gemini failed, falling back to Groq...");

      // --- Step 2: Try Groq (Backup) ---
      if (!GROQ_KEY) throw new Error("Both Keys Missing");
      const groqRes = await fetch(GROQ_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${GROQ_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [{ role: "system", content: SYSTEM_PROMPT }, { role: "user", content: input }]
        })
      });

      const groqData = await groqRes.json();
      const groqText = groqData.choices[0].message.content;
      return NextResponse.json(parseJSON(groqText));
    }

  } catch (err) {
    return NextResponse.json({ 
      response: "Sir, connections abhi bhi unstable hain. Key check karein.",
      tonyStarkComment: "Rebooting systems..." 
    });
  }
}
