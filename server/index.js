import fs from 'fs';
import path from 'path';
import express from 'express';
import bodyParser from 'body-parser';
import OpenAI from 'openai';

const app = express();
app.use(bodyParser.json());

const PORT = process.env.PORT || 3004;

// Load .env.local if present (simple parser)
const envPath = path.resolve(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  const raw = fs.readFileSync(envPath, 'utf8');
  raw.split(/\r?\n/).forEach((line) => {
    const m = line.match(/^([^=]+)=(.*)$/);
    if (m) {
      const k = m[1].trim();
      const v = m[2].trim();
      if (!process.env[k]) process.env[k] = v;
    }
  });
}

// Helper validators
const containsEmpathy = (text) => /\b(i\s+understand|i\s+hear|i\'m\s+sorry|i\s+can\s+hear|i\s+know|i\s+see)\b/i.test(text);
const containsScripture = (text) => /\b(?:Psalm|Psalms|Proverbs|Philippians|John|Matthew|Mark|Luke|Romans|Ephesians|Hebrews)\b/i.test(text) || /\d+:\d+/i.test(text);
const containsAction = (text) => /\b(do|take|call|schedule|write|pray|walk|contact|reach out|seek|start|begin)\b/i.test(text) || /step/i.test(text);
const containsBlessing = (text) => /GOD BLESS YOU/i.test(text);
const wordCountOk = (text) => {
  const words = (text || '').trim().split(/\s+/).filter(Boolean);
  return words.length >= 150 && words.length <= 300;
};

const validateText = (text) => {
  const reasons = [];
  if (!containsEmpathy(text)) reasons.push('missing empathy');
  if (!containsScripture(text)) reasons.push('missing scripture reference');
  if (!containsAction(text)) reasons.push('missing practical action');
  if (!containsBlessing(text)) reasons.push('missing closing blessing "GOD BLESS YOU"');
  if (!wordCountOk(text)) reasons.push('length outside 150-300 words');
  return { ok: reasons.length === 0, reasons };
};

app.post('/api/spiritual', async (req, res) => {
  const { input } = req.body || {};
  if (!input) return res.status(400).json({ error: 'input is required' });

  try {
    // Safety-first: short-circuit if user expresses self-harm or suicidal intent
    const lowered = (input || '').toLowerCase();
    const dangerKeywords = ['suicide', 'kill myself', 'harm myself', 'dark thoughts', 'i might die', 'i want to die'];
    if (dangerKeywords.some((k) => lowered.includes(k))) {
      return res.json({
        title: 'Immediate Help',
        empathy: "I'm really sorry you're feeling this way — your safety matters most.",
        scripture: '',
        wisdom: 'Please contact local emergency services or a crisis line right now.',
        action: 'Call your local emergency number or a crisis hotline immediately (e.g., 988 in the U.S.).',
        prayer: 'We will pray for your safety and help to come quickly. GOD BLESS YOU',
      });
    }

    const apiKey = process.env.VITE_OPENAI_API_KEY || process.env.OPENAI_API_KEY;
    if (!apiKey) return res.status(500).json({ error: 'OpenAI API key not configured' });

    const client = new OpenAI({ apiKey });

    const maxRetries = 2;
    let attempt = 0;
    let lastText = '';
    let parsed = null;
    let ok = false;

    const callModel = async (messages) => {
      return await client.chat.completions.create({
        model: 'gpt-4o-mini',
        messages,
        max_tokens: 700,
        temperature: 0.7,
      });
    };

    const systemPrompt = `You are an AI spiritual companion that responds exactly as Pastor [Pastor Ebata] would when giving counseling or spiritual guidance.\nRules for responding:\n1. Begin by acknowledging the user's feelings or situation with empathy.\n2. Provide guidance or advice as the pastor would, using wisdom, love, and Scripture references where appropriate.\n3. Include practical, actionable steps the user can take.\n4. Close with a positive encouragement or blessing.\n5. Maintain the pastor's tone: compassionate, understanding, and authoritative when needed.\n6. Avoid generic responses; always tailor the advice to the user's input.\n7. Keep responses concise and focused, ideally between 150-300 words and end with GOD BLESS YOU.`;

    let messages = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: input },
    ];

    while (attempt <= maxRetries && !ok) {
      attempt += 1;
      const response = await callModel(messages);
      const choice = response.choices?.[0];
      let text = '';
      if (choice) {
        const msg = choice.message;
        if (msg && typeof msg.content === 'string') text = msg.content;
        else if (msg && Array.isArray(msg.content)) text = msg.content[0]?.text || '';
        else if (msg?.content?.[0]?.text) text = msg.content[0].text || '';
      }

      lastText = text;

      // Try parse JSON from text first
      try {
        parsed = JSON.parse(text);
        const combined = Object.values(parsed).filter(Boolean).join(' ');
        const v = validateText(combined);
        if (v.ok) { ok = true; break; }
        // Ask model to fix only the missing parts and return JSON
        messages = [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: input },
          { role: 'assistant', content: text },
          { role: 'user', content: `The previous reply missed the following requirements: ${v.reasons.join(', ')}. Please rewrite the reply to satisfy all requirements exactly and return ONLY a JSON object with keys title, empathy, scripture, wisdom, action, prayer. Keep the pastor's tone and ensure the reply ends with GOD BLESS YOU.` },
        ];
        continue;
      } catch (e) {
        // Not JSON — validate free-form text
        const v = validateText(text);
        if (v.ok) { ok = true; break; }
        // Ask model to fix and output JSON for deterministic parsing
        messages = [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: input },
          { role: 'assistant', content: text },
          { role: 'user', content: `The previous reply missed the following requirements: ${v.reasons.join(', ')}. Please rewrite the reply to satisfy all requirements exactly and return ONLY a JSON object with keys title, empathy, scripture, wisdom, action, prayer. Keep the pastor's tone and ensure the reply ends with GOD BLESS YOU.` },
        ];
        continue;
      }
    }

    // If ok and parsed, return parsed; if ok but not parsed, build a parsed object from text
    if (ok && parsed) {
      return res.json(parsed);
    }

    if (ok && !parsed) {
      const parts = lastText.split(/\n\n+/).map(p=>p.trim()).filter(Boolean);
      const [empathy = '', wisdom = '', scriptureLine = '', actionLine = '', prayerLine = ''] = parts;
      return res.json({
        title: 'A Word',
        empathy: empathy,
        scripture: scriptureLine || '',
        wisdom: wisdom || '',
        action: actionLine || '',
        prayer: prayerLine?.endsWith('GOD BLESS YOU') ? prayerLine : (prayerLine + ' GOD BLESS YOU'),
      });
    }

    // Retries exhausted — return fallback with lastText included
    return res.json({
      title: 'A Word',
      empathy: lastText || 'I hear you and I\'m here for you.',
      scripture: 'Philippians 4:6 - Do not be anxious about anything.',
      wisdom: 'Lean into prayer and practical steps to care for your heart.',
      action: 'Take five minutes to sit quietly and write down one small step.',
      prayer: (lastText && lastText.includes('GOD BLESS YOU')) ? lastText.split('GOD BLESS YOU').slice(-2).join('GOD BLESS YOU') : 'Lord, grant us peace and clarity. GOD BLESS YOU',
    });

  } catch (error) {
    console.error('Server OpenAI error:', error);
    return res.status(500).json({ error: String(error) });
  }
});

app.listen(PORT, () => {
  console.log(`Spiritual API server listening on http://localhost:${PORT}`);
});

