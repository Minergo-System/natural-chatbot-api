const apiKeyMiddleware = (req, res, next) => {
  const apiKey = req.header("X-API-Key"); // Ambil API key dari header
  const validApiKey = process.env.API_KEY; // Ambil API key dari env

  if (!apiKey || apiKey !== validApiKey) {
    return res.status(403).json({ error: "Unauthorized: Invalid API key" });
  }

  next(); 
};

module.exports = { apiKeyMiddleware }