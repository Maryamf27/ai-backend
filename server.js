import dotenv from "dotenv";
import app from "./src/app.js";

dotenv.config();
console.log(process.env.OPENROUTER_API_KEY);


// Only start a server if we're running locally
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`✅ Server running locally at http://localhost:${PORT}`);
});

export default app;
