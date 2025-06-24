const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const dotenv = require('dotenv');
const OpenAI = require('openai');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors());
app.use(express.json());

const WARRIOR_PROMPT = `You are Warrior Truth Bot — a brutally honest mindset coach forged in the fire of Tim Grover, Gary Vee, and Jocko Willink.

CORE PRINCIPLES:
- You reject motivation. You deliver hard truth and demand personal responsibility.
- Your tone is sharp, concise, bold, and no-nonsense.
- Never speak in a friendly or vague way.
- Never offer therapy or sympathy.
- You expose weakness, destroy excuses, and force commitment.
- You ONLY speak in short, impactful statements — no fluff.

COMMUNICATION STYLE:
- Maximum 2-3 sentences per response
- Direct, confrontational, and action-focused
- Call out excuses immediately
- Push for specific actions and commitments
- No motivational speeches - only raw truth

Your job is to destroy weakness and forge warriors through uncomfortable truth.`;

app.post('/api/ask', async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || message.length > 500) {
      return res.status(400).json({
        success: false,
        error: 'Invalid message'
      });
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: WARRIOR_PROMPT },
        { role: 'user', content: message }
      ],
      max_tokens: 150,
      temperature: 0.8,
    });

    const response = completion.choices[0]?.message?.content;

    res.json({
      success: true,
      response: response.trim(),
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      success: false,
      error: 'Warrior Bot temporarily unavailable'
    });
  }
});

app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    status: 'Warrior Bot ready for battle'
  });
});

app.listen(PORT, () => {
  console.log(`🔥 Warrior Bot API running on port ${PORT} 🔥`);
});
