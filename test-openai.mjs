import fs from 'fs';
import path from 'path';
import OpenAI from 'openai';

const envPath = path.resolve(process.cwd(), '.env.local');
let apiKey = process.env.VITE_OPENAI_API_KEY || process.env.OPENAI_API_KEY || '';
console.log('.env.local path:', envPath);
console.log('.env.local exists?', fs.existsSync(envPath));
if (!apiKey && fs.existsSync(envPath)) {
  const raw = fs.readFileSync(envPath, 'utf8');
  console.log('.env.local size:', raw.length);
  const match = raw.match(/VITE_OPENAI_API_KEY=(.+)/);
  console.log('regex match found?', !!match);
  if (match) apiKey = match[1].trim();
}

if (apiKey) console.log('Found API key source: environment or .env.local (key redacted)');
else {
  console.error('No API key found in environment or .env.local. Aborting.');
  process.exit(1);
}

const client = new OpenAI({ apiKey });

const run = async () => {
  try {
    const response = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are a concise assistant that replies in plain text.' },
        { role: 'user', content: 'Provide a 2-sentence encouragement based on: I feel anxious about a new job.' },
      ],
      max_tokens: 200,
      temperature: 0.7,
    });

    const choice = response.choices?.[0];
    let text = '';
    if (choice) {
      const msg = choice.message;
      if (msg && typeof msg.content === 'string') text = msg.content;
      else if (msg && Array.isArray(msg.content)) text = (msg.content[0]?.text) || '';
    }

    console.log('\n=== AI reply ===\n');
    console.log(text || JSON.stringify(response, null, 2));
  } catch (err) {
    console.error('Request failed:', err);
    process.exit(2);
  }
};

run();
