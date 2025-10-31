const express = require('express');
const aiRoutes = require('./routes/ai.routes')
const cors = require('cors')

const app = express()

app.use(cors())


app.use(express.json())

app.get('/', (req, res) => {
    res.send('Hello World')
})
app.get("/check-key", (req, res) => {
  res.send(`Gemini Key: ${process.env.GOOGLE_GEMINI_KEY ? "Loaded ✅" : "Missing ❌"}`);
});

app.use('/ai', aiRoutes)

module.exports = app