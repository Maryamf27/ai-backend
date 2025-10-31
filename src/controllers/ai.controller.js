// const aiService = require("../services/ai.service")


// module.exports.getReview = async (req, res) => {

//     const code = req.body.code;

//     if (!code) {
//         return res.status(400).send("Prompt is required");
//     }

//     const response = await aiService(code);


//     res.send(response);

// }


const aiService = require("../services/ai.service");

module.exports.getReview = async (req, res) => {
  try {
    const code = req.body.code;
    console.log("📩 Request received:", code);

    if (!code) {
      return res.status(400).json({ error: "Code is required" });
    }

    const response = await aiService(code);

    console.log("✅ AI Service responded:", response);
    res.json({ review: response });
  } catch (error) {
    console.error("❌ Error in getReview:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
