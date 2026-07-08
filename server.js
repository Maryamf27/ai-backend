import dotenv from "dotenv";
import app from "./src/app.js";
 
dotenv.config();
console.log(
  "OpenRouter key loaded:",
  process.env.OPENROUTER_API_KEY
    ? `${process.env.OPENROUTER_API_KEY.slice(0, 10)}... (length ${process.env.OPENROUTER_API_KEY.length})`
    : "MISSING"
);
 
 
// Only start a server if we're running locally
const PORT = process.env.PORT || 3000;
 
app.listen(PORT, () => {
  console.log(`✅ Server running locally at http://localhost:${PORT}`);
});
 
export default app;
