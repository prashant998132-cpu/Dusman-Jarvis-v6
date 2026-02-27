import { NextRequest, NextResponse } from 'next/server'

// Model name aur URL ko update kiya gaya hai
const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent'

const SYSTEM_PROMPT = `You are JARVIS. Respond ONLY with valid JSON:
{
  "intent": "chat",
  "category": "chat",
  "confidence": 1.0,
  "mode": "chat",
  "response": "Your reply in Hinglish",
  "tools": [],
  "emotion": "neutral",
  "tonyStarkComment": "witty remark"
}
Rules: Respond in Hinglish like JARVIS. No extra text outside JSON.`

// Safe JSON Parser: Jo har haal mein response nikalega
function parseJSON(text: string) {
  try {
    const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleanText);
  } catch (e) {
    // Agar Gemini text bhej raha hai to use manual JSON mein convert karo
    return {
      intent: "chat",
      response: text.substring(0, 500),
      tonyStarkComment: "System recalibrated."
    };
  }
}

export async function POST(req: NextRequest) {
  try {
    const { input, context = [] } = await req.json();
    const key = process.env.GEMINI_API_KEY;

    if (!key) {
      return NextResponse.json({ response: "Sir, API Key missing hai. Vercel settings check kijiye." });
    }

    // Gemini API Call
    const res = await fetch(`${GEMINI_URL}?key=${key}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `${SYSTEM_PROMPT}\n\nUser: ${input}` }] }]
      }),
    });

    if (!res.ok) {
      const errorDetail = await res.json();
      console.error("Gemini Error:", errorDetail);
      throw new Error("Gemini Failed");
    }

    const data = await res.json();
    const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
    const finalResponse = parseJSON(aiText);

    return NextResponse.json(finalResponse);

  } catch (err: any) {
    console.error("Critical Error:", err.message);
    return NextResponse.json({ 
      response: "Sir, connections abhi bhi unstable hain. Key check karein ya thoda intezar.",
      model: "error" 
    });
  }
      }
