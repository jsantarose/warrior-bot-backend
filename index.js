const express = require('express');
const cors = require('cors');
const OpenAI = require('openai');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.get('/api/health', (req, res) => {
  res.json({ success: true, status: 'Warrior Bot ready for battle' });
});

app.post('/api/ask', async (req, res) => {
  try {
    const { message } = req.body;
    
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: 'You are a brutally honest mindset coach. Be direct, confrontational, and action-focused. Maximum 2-3 sentences.' },
        { role: 'user', content: message }
      ],
      max_tokens: 150,
      temperature: 0.8,
    });

    res.json({
      success: true,
      response: completion.choices[0]?.message?.content || 'No response generated',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Warrior Bot temporarily unavailable'
    });
  }
});

app.listen(PORT, () => {
  console.log(`Warrior Bot API running on port ${PORT}`);
});
