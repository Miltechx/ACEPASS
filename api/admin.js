// AcePass Admin API — code management
// Set ADMIN_PASSWORD in Vercel environment variables

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();

  const { action, password, code } = req.body || {};
  const adminPwd = process.env.ADMIN_PASSWORD || "acepass2026admin";
  
  if (password !== adminPwd) return res.status(401).json({ error: "Unauthorized" });

  // Admin actions are handled client-side via localStorage
  // This endpoint is for future server-side management
  return res.status(200).json({ ok: true, action, code });
}
