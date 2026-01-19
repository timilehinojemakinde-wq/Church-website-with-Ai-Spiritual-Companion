import { DevotionalResponse } from "../types";

const apiKey = (process.env.VITE_OPENAI_API_KEY as string) || (process.env.OPENAI_API_KEY as string) || "";

// Expose a function that works both in Node (server) and in the browser (client).
// In Node we dynamically import the `openai` package at runtime. In the browser
// we fall back to fetching a local sample JSON (for development) to avoid bundling
// the Node-only SDK into the client.
export default async function getSpiritualGuidance(userInput: string): Promise<DevotionalResponse> {
    // Browser environment: fetch sample JSON from `public/` for local dev
    if (typeof window !== "undefined") {
        // In browser, call local API proxy to keep the API key server-side.
        try {
            const res = await fetch('/api/spiritual', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ input: userInput }),
            });
            if (!res.ok) {
                // fallback to sample JSON when server not running
                const sample = await fetch('/spiritual-sample.json').then((r) => r.json()).catch(() => null);
                if (sample) return sample as DevotionalResponse;
                throw new Error('API request failed');
            }
            const data = await res.json();
            return data as DevotionalResponse;
        } catch (err) {
            console.error('Client API call failed, using sample:', err);
            const sample = await fetch('/spiritual-sample.json').then((r) => r.json()).catch(() => null);
            if (sample) return sample as DevotionalResponse;
            return {
                title: 'A Word',
                empathy: "I hear you and I'm here for you.",
                scripture: "Philippians 4:6 - Do not be anxious about anything.",
                wisdom: "Lean into prayer and practical steps to care for your heart.",
                action: "Take five minutes to sit quietly and write down one small step.",
                prayer: "Lord, grant us peace and clarity. Amen.",
            };
        }
    }

    // Server/Node environment: dynamically import `openai` to avoid bundling it.
    try {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const OpenAI = (await import('openai')).default;
        const client = new OpenAI({ apiKey });
        const response = await client.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                {
                    role: 'system',
                    content: `You are an AI spiritual companion that responds exactly as Pastor [Pastor Ebata] would when giving counseling or spiritual guidance.
Rules for responding:
1. Begin by acknowledging the user's feelings or situation with empathy.
2. Provide guidance or advice as the pastor would, using wisdom, love, and Scripture references where appropriate.
3. Include practical, actionable steps the user can take.
4. Close with a positive encouragement or blessing.
5. Maintain the pastor's tone: compassionate, understanding, and authoritative when needed.
6. Avoid generic responses; always tailor the advice to the user's input.
7. Keep responses concise and focused, ideally between 150-300 words and end with GOD BLESS YOU.`,
                },
                { role: 'user', content: userInput },
            ],
            max_tokens: 500,
            temperature: 0.7,
        });

        const choice = response.choices?.[0];
        let text = '';
        if (choice) {
            const msg = (choice as any).message;
            const content = msg?.content;
            if (typeof content === 'string') text = content;
            else if (Array.isArray(content)) {
                const out = content.find((c: any) => c.type === 'output_text') || content[0];
                text = out?.text ?? '';
            } else if (content?.[0]?.text) text = content[0].text;
        }

        try {
            return JSON.parse(text) as DevotionalResponse;
        } catch (err) {
            console.warn('Failed to parse AI response as JSON, returning fallback object.', err);
            return {
                title: 'A Word',
                empathy: text || "I hear you and I'm here for you.",
                scripture: 'Philippians 4:6 - Do not be anxious about anything.',
                wisdom: 'Lean into prayer and practical steps to care for your heart.',
                action: 'Take five minutes to sit quietly and write down one small step.',
                prayer: 'Lord, grant us peace and clarity. Amen.',
            } as DevotionalResponse;
        }
    } catch (error) {
        console.error('OpenAI chat error:', error);
        throw error;
    }
}