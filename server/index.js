import fs from 'fs';
import path from 'path';
import express from 'express';
import bodyParser from 'body-parser';
import OpenAI from 'openai';
import Ajv from 'ajv';
import Database from 'better-sqlite3';

const app = express();
app.use(bodyParser.json());

const PORT = process.env.PORT || 3004;

// --- Simple RAG retrieval using local scriptures JSON ---
function loadScriptures() {
  const p = path.resolve(process.cwd(), 'rag-data', 'scriptures.json');
  if (!fs.existsSync(p)) return [];
  try {
    return JSON.parse(fs.readFileSync(p, 'utf8'));
  } catch (e) {
    console.error('Failed to load scriptures.json', e);
    return [];
  }
}

function textSimilarity(a = '', b = '') {
  const aWords = new Set((a || '').toLowerCase().split(/\W+/).filter(Boolean));
  const bWords = new Set((b || '').toLowerCase().split(/\W+/).filter(Boolean));
  if (aWords.size === 0 || bWords.size === 0) return 0;
  let inter = 0;
  aWords.forEach((w) => { if (bWords.has(w)) inter += 1; });
  const union = new Set([...aWords, ...bWords]).size;
  return inter / union;
}

function retrieveRelevantScriptures(userQuery, topK = 3) {
  const scriptures = loadScriptures();
  const scored = scriptures.map((v) => {
    const topicScore = (v.topics || []).map(t => textSimilarity(userQuery, t)).reduce((a,b)=>Math.max(a,b), 0);
    const textScore = textSimilarity(userQuery, v.text || '');
    const total = (0.7 * topicScore) + (0.3 * textScore);
    return { score: total, verse: v };
  }).filter(s => s.score > 0).sort((a,b) => b.score - a.score);
  return scored.slice(0, topK).map(s => s.verse);
}

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

// Helper validators (len target adjusted to 30-80 words for concise formal responses)
const containsEmpathy = (text) => /\b(i\s+understand|i\s+hear|i\'m\s+sorry|i\s+can\s+hear|i\s+know|i\s+see|i\s+encourage)\b/i.test(text);
const containsScripture = (text) => /\b(?:Psalm|Psalms|Proverbs|Philippians|John|Matthew|Mark|Luke|Romans|Ephesians|Hebrews)\b/i.test(text) || /\d+:\d+/i.test(text);
const containsAction = (text) => /\b(do|take|call|schedule|write|pray|walk|contact|reach out|seek|start|begin|consider)\b/i.test(text) || /step/i.test(text);
const containsBlessing = (text) => /GOD BLESS YOU|Blessings|Bless you/i.test(text);
const wordCountOk = (text) => {
  const words = (text || '').trim().split(/\s+/).filter(Boolean);
  return words.length >= 30 && words.length <= 80;
};

const validateText = (text) => {
  const reasons = [];
  if (!containsEmpathy(text)) reasons.push('missing empathy');
  if (!containsScripture(text)) reasons.push('missing scripture reference');
  if (!containsAction(text)) reasons.push('missing practical action');
  if (!containsBlessing(text)) reasons.push('missing brief blessing');
  if (!wordCountOk(text)) reasons.push('length outside 30-80 words');
  return { ok: reasons.length === 0, reasons };
};

// Initialize AJV validator and SQLite DB for optional persistence
const ajv = new Ajv();
const dbPath = path.resolve(process.cwd(), 'server', 'data', 'devotionals.sqlite');
let db = null;
try {
  db = new Database(dbPath);
  db.pragma('journal_mode = WAL');
  db.prepare(`CREATE TABLE IF NOT EXISTS devotionals (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_input TEXT,
    response_json TEXT,
    created_at INTEGER
  )`).run();
} catch (e) {
  console.warn('SQLite init failed (persistence disabled):', e.message);
  db = null;
}

const devotionalSchema = {
  type: 'object',
  properties: {
    title: { type: 'string' },
    empathy: { type: 'string' },
    scripture: { type: 'string' },
    wisdom: { type: 'string' },
    action: { type: 'string' },
    prayer: { type: 'string' },
    schemaVersion: { type: 'string' },
    wordCount: { type: 'number' }
  },
  required: ['title','empathy','scripture','wisdom','action','prayer'],
  additionalProperties: false
};
const validateDevotional = ajv.compile(devotionalSchema);

function persistConversation(userInput, responseObj) {
  if (!db) return false;
  try {
    const stmt = db.prepare('INSERT INTO devotionals (user_input, response_json, created_at) VALUES (?, ?, ?)');
    stmt.run(userInput, JSON.stringify(responseObj), Date.now());
    return true;
  } catch (e) {
    console.error('Failed to persist conversation:', e);
    return false;
  }
}

// Cleanup task: remove entries older than retention (7 days)
const RETENTION_MS = 7 * 24 * 60 * 60 * 1000;
function cleanupOldEntries() {
  if (!db) return;
  try {
    const cutoff = Date.now() - RETENTION_MS;
    db.prepare('DELETE FROM devotionals WHERE created_at < ?').run(cutoff);
  } catch (e) { console.warn('Cleanup failed:', e); }
}
setInterval(cleanupOldEntries, 60 * 60 * 1000); // hourly

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
    // If no OpenAI key is configured, return a local RAG-based fallback so the frontend still receives useful replies during development.
    if (!apiKey) {
      const top = retrieveRelevantScriptures(input, 2);
      const scriptureText = top.map(s => `${s.book} ${s.chapter}:${s.verses} — ${s.text}`).join('\n\n');
      return res.json({
        title: 'A Word (Local RAG)',
        empathy: "I hear your concern and I want to encourage you.",
        scripture: scriptureText || 'Jeremiah 29:11',
        wisdom: "Seek God's direction through prayer and small practical steps; He orders our steps.",
        action: "Take one concrete step today toward clarity: write down 3 options and pray over them.",
        prayer: 'Lord, grant clarity and peace. GOD BLESS YOU',
      });
    }

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

    const systemPrompt = `You are an AI spiritual companion speaking in a formal pastoral tone. Ground guidance in the provided local scriptures and return ONLY a JSON object matching the DevotionalResponseV1 schema (title, empathy, scripture, wisdom, action, prayer). Aim for ~50 words total (allow 30-80). Do not invent scripture citations. End with a brief blessing.`;

    // Retrieve top scriptures from local RAG index and include them as context
    const retrieved = retrieveRelevantScriptures(input, 3);
    const retrievedText = retrieved.map(r => `${r.book} ${r.chapter}:${r.verses} — ${r.text}`).join('\n\n');

    let messages = [
      { role: 'system', content: systemPrompt },
      { role: 'system', content: `Relevant scriptures (from local RAG):\n${retrievedText}` },
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

    // If ok and parsed, validate schema and return parsed; if ok but not parsed, build a parsed object from text
    if (ok && parsed) {
      try {
        const combined = Object.values(parsed).filter(Boolean).join(' ');
        parsed.wordCount = (combined || '').trim().split(/\s+/).filter(Boolean).length;
        parsed.schemaVersion = 'DevotionalResponseV1';
      } catch (e) {}

      if (!validateDevotional(parsed)) {
        // Schema validation failed; still return parsed but mark with _schemaValid=false
        parsed._schemaValid = false;
        return res.json(parsed);
      }
      return res.json(parsed);
    }

    if (ok && !parsed) {
      const parts = lastText.split(/\n\n+/).map(p=>p.trim()).filter(Boolean);
      const [empathy = '', wisdom = '', scriptureLine = '', actionLine = '', prayerLine = ''] = parts;
      const built = {
        title: 'A Word',
        empathy: empathy,
        scripture: scriptureLine || '',
        wisdom: wisdom || '',
        action: actionLine || '',
        prayer: prayerLine?.endsWith('GOD BLESS YOU') ? prayerLine : (prayerLine + ' GOD BLESS YOU'),
      };
      try { const combined = Object.values(built).filter(Boolean).join(' '); built.wordCount = (combined || '').trim().split(/\s+/).filter(Boolean).length; built.schemaVersion = 'DevotionalResponseV1'; } catch(e){}
      if (validateDevotional(built)) return res.json(built);
      return res.json(built);
    }

    // Retries exhausted — return fallback with lastText included
    const fallback = {
      title: 'A Word',
      empathy: lastText || 'I hear you and I\'m here for you.',
      scripture: 'Philippians 4:6 - Do not be anxious about anything.',
      wisdom: 'Lean into prayer and practical steps to care for your heart.',
      action: 'Take five minutes to sit quietly and write down one small step.',
      prayer: (lastText && lastText.includes('GOD BLESS YOU')) ? lastText.split('GOD BLESS YOU').slice(-2).join('GOD BLESS YOU') : 'Lord, grant us peace and clarity. GOD BLESS YOU',
    };
    try { const combined = Object.values(fallback).filter(Boolean).join(' '); fallback.wordCount = (combined || '').trim().split(/\s+/).filter(Boolean).length; fallback.schemaVersion = 'DevotionalResponseV1'; } catch(e){}
    return res.json(fallback);

  } catch (error) {
    console.error('Server OpenAI error:', error);
    return res.status(500).json({ error: String(error) });
  }
});

// Optional: persist a validated devotional response (client opt-in)
app.post('/api/spiritual/save', (req, res) => {
  const { input, response } = req.body || {};
  if (!input || !response) return res.status(400).json({ error: 'input and response are required' });
  // Ensure the response matches schema
  if (!validateDevotional(response)) return res.status(400).json({ error: 'response does not match schema', details: validateDevotional.errors });
  if (!db) return res.status(503).json({ error: 'persistence not available on this server' });
  const ok = persistConversation(input, response);
  if (!ok) return res.status(500).json({ error: 'failed to persist' });
  return res.json({ saved: true });
});

app.listen(PORT, () => {
  console.log(`Spiritual API server listening on http://localhost:${PORT}`);
});

