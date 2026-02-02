import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles } from 'lucide-react';
import getSpiritualGuidance from '../services/openaiService';
import { DevotionalResponse, LoadingState } from '../types';

type ChatMsg = {
  id: number;
  role: 'user' | 'assistant';
  text: string;
  time: number;
  meta?: Partial<DevotionalResponse>;
};

const MESSAGES_KEY = 'devotional_messages';
const SETTINGS_KEY = 'devotional_settings';

const DEFAULT_SETTINGS = {
  enforceConcise: true,
  conciseMaxWords: 80,
  fontFamily: 'Inter, system-ui, Arial',
  fontSize: 15,
  borderRadius: 14,
  persistToServer: false,
};

const DevotionalAI: React.FC = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [status, setStatus] = useState<LoadingState>(LoadingState.IDLE);
  const [retrying, setRetrying] = useState(false);
  const chatRef = useRef<HTMLDivElement | null>(null);

  // settings
  const [enforceConcise, setEnforceConcise] = useState<boolean>(DEFAULT_SETTINGS.enforceConcise);
  const [conciseMaxWords, setConciseMaxWords] = useState<number>(DEFAULT_SETTINGS.conciseMaxWords);
  const [fontFamily, setFontFamily] = useState<string>(DEFAULT_SETTINGS.fontFamily);
  const [fontSize, setFontSize] = useState<number>(DEFAULT_SETTINGS.fontSize);
  const [borderRadius, setBorderRadius] = useState<number>(DEFAULT_SETTINGS.borderRadius);
  const [persistToServer, setPersistToServer] = useState<boolean>(DEFAULT_SETTINGS.persistToServer);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [copiedMessageId, setCopiedMessageId] = useState<number | null>(null);

  // autoscroll
  useEffect(() => {
    const el = chatRef.current;
    if (!el) return;
    const t = setTimeout(() => { el.scrollTop = el.scrollHeight; }, 40);
    return () => clearTimeout(t);
  }, [messages, status]);

  // load persisted
  useEffect(() => {
    try {
      const raw = localStorage.getItem(MESSAGES_KEY);
      if (raw) setMessages(JSON.parse(raw));
    } catch (e) { /* ignore */ }
    try {
      const s = localStorage.getItem(SETTINGS_KEY);
        if (s) {
        const p = JSON.parse(s);
        if (typeof p.enforceConcise === 'boolean') setEnforceConcise(p.enforceConcise);
        if (typeof p.conciseMaxWords === 'number') setConciseMaxWords(p.conciseMaxWords);
        if (typeof p.fontFamily === 'string') setFontFamily(p.fontFamily);
        if (typeof p.fontSize === 'number') setFontSize(p.fontSize);
        if (typeof p.borderRadius === 'number') setBorderRadius(p.borderRadius);
        if (typeof p.persistToServer === 'boolean') setPersistToServer(p.persistToServer);
      }
    } catch (e) { /* ignore */ }
  }, []);

  // persist
  useEffect(() => { try { localStorage.setItem(MESSAGES_KEY, JSON.stringify(messages)); } catch (e) {} }, [messages]);
  useEffect(() => { try { localStorage.setItem(SETTINGS_KEY, JSON.stringify({ enforceConcise, conciseMaxWords, fontFamily, fontSize, borderRadius, persistToServer })); } catch (e) {} }, [enforceConcise, conciseMaxWords, fontFamily, fontSize, borderRadius, persistToServer]);

  const formatResponse = (d: DevotionalResponse) => {
    const parts: string[] = [];
    if (d.empathy) parts.push(d.empathy.trim());
    if (d.wisdom) parts.push(d.wisdom.trim());
    if (d.scripture) parts.push(`Scripture: ${d.scripture.trim()}`);
    if (d.action) parts.push(`Action: ${d.action.trim()}`);
    if (d.prayer) parts.push(`Prayer: ${d.prayer.trim()}`);
    return parts.join('\n\n');
  };

  const validateResponse = (d?: Partial<DevotionalResponse>) => {
    if (!d) return false;
    const hasScripture = !!(d.scripture && d.scripture.trim().length > 0);
    const combined = [d.empathy, d.wisdom, d.action, d.prayer].filter(Boolean).join(' ');
    const words = combined.trim().length === 0 ? 0 : combined.trim().split(/\s+/).filter(Boolean).length;
    const concise = !enforceConcise ? true : words <= conciseMaxWords;
    return hasScripture && concise;
  };

  const sendMessage = async (textArg?: string, attempt = 0) => {
    const text = (textArg ?? input).trim();
    if (!text) return;

    const userMsg: ChatMsg = { id: Date.now(), role: 'user', text, time: Date.now() };
    setMessages((m) => [...m, userMsg]);
    if (!textArg) setInput('');
    setStatus(LoadingState.LOADING);

    try {
      const resp = await getSpiritualGuidance(text);

      if (!validateResponse(resp) && attempt < 1) {
        setRetrying(true);
        const augmentation = `\n\nPlease respond concisely (<= ${conciseMaxWords} words) and include a scripture reference from the local scriptures. Do not fabricate scripture references.`;
        const retried = await getSpiritualGuidance(text + augmentation);
        setRetrying(false);
        const assistantText = formatResponse(retried as DevotionalResponse);
        const assistantMsg: ChatMsg = { id: Date.now() + 1, role: 'assistant', text: assistantText || 'Short prayer sent.', time: Date.now(), meta: retried };
        setMessages((m) => [...m, assistantMsg]);
        setStatus(LoadingState.SUCCESS);
        return;
      }

      const assistantText = formatResponse(resp as DevotionalResponse);
      const assistantMsg: ChatMsg = { id: Date.now() + 1, role: 'assistant', text: assistantText || 'Short prayer sent.', time: Date.now(), meta: resp };
      setMessages((m) => [...m, assistantMsg]);
      // If user opted in, persist validated response to server
      if (persistToServer && assistantMsg.meta) {
        try {
          fetch('/api/spiritual/save', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ input: text, response: assistantMsg.meta }),
          }).catch(() => {});
        } catch (e) { /* ignore persistence failure */ }
      }
      setStatus(LoadingState.SUCCESS);
    } catch (err) {
      console.error(err);
      const fallback: ChatMsg = { id: Date.now() + 2, role: 'assistant', text: "Sorry — I couldn't get a response right now. Please try again later.", time: Date.now() };
      setMessages((m) => [...m, fallback]);
      setStatus(LoadingState.ERROR);
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); if (status !== LoadingState.LOADING) sendMessage(); } };

  const copyMessage = async (m: ChatMsg) => {
    const text = m.meta ? `Title: ${m.meta.title ?? ''}\n\n${formatResponse(m.meta as DevotionalResponse)}` : m.text;
    try { await navigator.clipboard.writeText(text); setCopiedMessageId(m.id); setTimeout(() => setCopiedMessageId(null), 2000); } catch (e) { /* ignore */ }
  };

  const clearConversation = () => { setMessages([]); localStorage.removeItem(MESSAGES_KEY); };

  const themeStyle: React.CSSProperties = { fontFamily, fontSize: `${fontSize}px` };
  const bubbleStyle = (isUser: boolean): React.CSSProperties => ({ borderRadius: `${borderRadius}px` });

  return (
    <section className="py-12" style={{ background: '#061827' }}>
      <div className="max-w-2xl mx-auto rounded-xl overflow-hidden shadow-lg" style={themeStyle}>

        <div className="flex items-center gap-4 px-5 py-4" style={{ background: 'linear-gradient(90deg,#071022,#0b1830)' }}>
          <div className="w-12 h-12 rounded-full flex items-center justify-center text-white" style={{ background: 'linear-gradient(135deg,#274060,#0ea5a3)' }}>
            <Sparkles size={20} />
          </div>
          <div>
            <div style={{ color: 'white', fontWeight: 600 }}>AI Spiritual Companion</div>
            <div style={{ color: '#9fb4c2', fontSize: Math.max(12, fontSize - 2) }}>Short, scripture-backed guidance (uses local RAG)</div>
          </div>

          <div style={{ marginLeft: 'auto', display: 'flex', gap: 8, alignItems: 'center' }}>
            <div style={{ color: '#9fb4c2', fontSize: 12 }}>{retrying ? 'Enforcing concise responses...' : ''}</div>
            <button onClick={() => setShowSettings((s) => !s)} style={{ color: '#9fb4c2', background: 'transparent', border: '1px solid rgba(255,255,255,0.04)', padding: '6px 8px', borderRadius: 8 }}>Settings</button>
          </div>
        </div>

        {showSettings && (
          <div style={{ padding: 12, background: '#071827', borderBottom: '1px solid #0f1724', display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
            <label style={{ color: '#cfe6ef', fontSize: 13 }}>
              <input type="checkbox" checked={enforceConcise} onChange={(e) => setEnforceConcise(e.target.checked)} style={{ marginRight: 8 }} />
              Enforce concise
            </label>

            <label style={{ color: '#cfe6ef', fontSize: 13 }}>
              <input type="checkbox" checked={persistToServer} onChange={(e) => setPersistToServer(e.target.checked)} style={{ marginRight: 8 }} />
              Persist to server (opt-in)
            </label>

            <label style={{ color: '#cfe6ef', fontSize: 13 }}>
              Max words:
              <input type="number" value={conciseMaxWords} onChange={(e) => setConciseMaxWords(Math.max(20, Number(e.target.value || 80)))} style={{ marginLeft: 8, width: 72, padding: 4, borderRadius: 6, border: '1px solid #123045', background: '#021322', color: '#dfeff6' }} />
            </label>

            <label style={{ color: '#cfe6ef', fontSize: 13 }}>
              Font:
              <select value={fontFamily} onChange={(e) => setFontFamily(e.target.value)} style={{ marginLeft: 8, padding: 4, borderRadius: 6, background: '#021322', color: '#dfeff6', border: '1px solid #123045' }}>
                <option value={'Inter, system-ui, Arial'}>Inter (default)</option>
                <option value={'Georgia, serif'}>Georgia (serif)</option>
                <option value={'ui-sans-serif, system-ui, -apple-system'}>System Sans</option>
              </select>
            </label>

            <label style={{ color: '#cfe6ef', fontSize: 13 }}>
              Font size:
              <input type="range" min={12} max={20} value={fontSize} onChange={(e) => setFontSize(Number(e.target.value))} style={{ marginLeft: 8 }} />
            </label>

            <label style={{ color: '#cfe6ef', fontSize: 13 }}>
              Roundness:
              <input type="range" min={6} max={24} value={borderRadius} onChange={(e) => setBorderRadius(Number(e.target.value))} style={{ marginLeft: 8 }} />
            </label>

            <button onClick={clearConversation} style={{ marginLeft: 'auto', background: '#153a44', color: '#dff6fb', padding: '8px 10px', borderRadius: 8, border: 'none' }}>Clear</button>
          </div>
        )}

        <div ref={chatRef} style={{ padding: 16, height: 380, overflow: 'auto', background: '#071827', display: 'flex', flexDirection: 'column', gap: 12 }}>
          {messages.length === 0 && (
            <div style={{ textAlign: 'center', color: '#9fb4c2', marginTop: 36 }}>Ask briefly; answers will be concise and scripture-centered.</div>
          )}

          {messages.map((m) => (
            <div key={m.id} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
              <div style={{ background: m.role === 'user' ? 'linear-gradient(135deg,#0ea5a3,#2563eb)' : '#0b1220', color: m.role === 'user' ? '#fff' : '#d9eef6', padding: 12, maxWidth: '78%', borderRadius: `${borderRadius}px` }}>
                <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.4 }}>{m.text}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontSize: 12, color: '#9fb4c2' }}>
                  <div>{new Date(m.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                  <button onClick={() => copyMessage(m)} style={{ background: 'transparent', border: 'none', color: '#9fb4c2', cursor: 'pointer' }}>{copiedMessageId === m.id ? 'Copied' : 'Copy'}</button>
                </div>
              </div>
            </div>
          ))}

          {status === LoadingState.LOADING && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: 12, background: '#0b1220', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Sparkles size={14} style={{ color: '#0ea5a3', opacity: 0.9 }} />
              </div>
              <div style={{ background: '#0b1220', padding: 10, borderRadius: 10, color: '#7eaeb8' }}>Thinking briefly…</div>
            </div>
          )}
        </div>

        <div style={{ display: 'flex', gap: 8, padding: 12, background: '#071827', borderTop: '1px solid #0f1724' }}>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            rows={2}
            placeholder="Type a short question..."
            style={{ flex: 1, resize: 'none', borderRadius: 8, background: '#021322', border: '1px solid #123045', color: '#dfeff6', padding: 10 }}
            disabled={status === LoadingState.LOADING}
          />
          <button onClick={() => sendMessage()} disabled={!input.trim() || status === LoadingState.LOADING} style={{ padding: 10, borderRadius: 10, background: 'linear-gradient(135deg,#0ea5a3,#2563eb)', color: '#fff', border: 'none' }}>
            <Send size={18} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default DevotionalAI;
