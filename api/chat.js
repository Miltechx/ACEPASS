// AcePass — AI Tutor Chat Proxy
// Routes chat requests through server so API key stays secure
// Set ANTHROPIC_API_KEY in Vercel environment variables

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return res.status(500).json({ error: "ANTHROPIC_API_KEY not configured in Vercel environment variables" });

  const { messages, system } = req.body || {};
  if (!messages || !Array.isArray(messages)) return res.status(400).json({ error: "messages array required" });

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 1500,
        system: system || "You are AcePass AI Tutor, an expert for Nigerian JAMB and Post-UTME exam preparation.",
        messages: messages.slice(-10), // last 10 for context
      }),
    });

    const data = await response.json();
    if (data.error) return res.status(500).json({ error: data.error.message });
    
    const text = (data.content || []).map(c => c.text || "").join("");
    return res.status(200).json({ reply: text });
  } catch (err) {
    console.error("Chat API error:", err);
    return res.status(500).json({ error: "Failed to get response", detail: err.message });
  }
}
// Note: Also handles AI question generation with ?mode=questions
