module.exports = function handler(req, res) {
  const key = process.env.GROQ_API_KEY || '';
  res.status(200).json({
    status: 'ok',
    groq_key_set: key.length > 0,
    key_preview: key.length > 8 ? key.slice(0,8)+'...' : 'NOT SET'
  });
};
