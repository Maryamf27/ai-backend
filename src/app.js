import express, { json } from 'express';
import aiRoutes from './routes/ai.routes.js';
import cors from 'cors';

const app = express()

app.use(cors())


app.use(json())

app.get('/', (req, res) => {
    res.send('Hello World')
})
app.get("/check-key", (req, res) => {
  res.send(`OpenRouter Key: ${process.env.OPENROUTER_API_KEY ? "Loaded ✅" : "Missing ❌"}`);
});

app.use('/ai', aiRoutes)

export default app