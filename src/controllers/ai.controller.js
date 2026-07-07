import aiService from "../services/ai.service";

export async function getReview(req, res) {
  try {
    console.log("🧠 Received body:", req.body);

    const code = req.body.code;
    if (!code) {
      return res.status(400).json({ error: "Code is required" });
    }

    const response = await aiService(code);
    console.log("✅ AI Service Response:", response);
    res.send(response);

  } catch (err) {
    console.error("❌ Error in getReview:", err.message, err.stack);
    res.status(500).json({ error: "Internal Server Error", details: err.message });
  }
}
