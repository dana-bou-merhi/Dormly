import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Bot, Send, Home, ChevronRight, Sparkles,
  Zap, MapPin, Star, ArrowLeft, Shield, AlertCircle
} from 'lucide-react';

const PROMPTS = [
  { icon: Zap,      label: 'Utility costs in Hamra?' },
  { icon: MapPin,   label: 'Best dorms near AUB?' },
  { icon: Sparkles, label: 'Find a dorm under $800/mo' },
];

/* ── Typing indicator ── */
const Typing = () => (
  <div className="flex gap-3 justify-start" style={{ animation: 'bubbleIn 0.2s ease-out both' }}>
    <div className="w-8 h-8 rounded-full bg-linear-to-br from-teal-400 to-teal-600 flex items-center justify-center shrink-0 shadow">
      <Bot size={15} className="text-white" />
    </div>
    <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-sm px-5 py-3.5 shadow-sm flex gap-1.5 items-center">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-bounce"
          style={{ animationDelay: `${i * 160}ms` }}
        />
      ))}
    </div>
  </div>
);

/* ── Single message bubble ── */
const MessageBubble = ({ msg, isLast }) => {
  const isUser = msg.type === 'user';
  const isError = msg.type === 'error';

  return (
    <div
      className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
      style={{ animation: isLast ? 'bubbleIn 0.25s ease-out both' : 'none' }}
    >
      {/* Bot / Error avatar */}
      {!isUser && (
        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-1 shadow
          ${isError ? 'bg-red-100' : 'bg-linear-to-br from-teal-400 to-teal-600'}`}>
          {isError
            ? <AlertCircle size={15} className="text-red-500" />
            : <Bot size={15} className="text-white" />}
        </div>
      )}

      <div className={`flex flex-col gap-1 max-w-[72%] sm:max-w-[65%] ${isUser ? 'items-end' : 'items-start'}`}>
        <div
          className={`rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap
            ${isUser
              ? 'bg-teal-500 text-white rounded-br-sm shadow-md shadow-teal-200'
              : isError
                ? 'bg-red-50 text-red-600 border border-red-200 rounded-bl-sm'
                : 'bg-white text-gray-700 border border-gray-100 rounded-bl-sm shadow-sm'
            }`}
        >
          {msg.text}
        </div>
      </div>

      {/* User avatar */}
      {isUser && (
        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center shrink-0 mt-1 text-[11px] font-bold text-gray-500">
          You
        </div>
      )}
    </div>
  );
};



export default function DormlyAi() {
  const [messages, setMessages] = useState([
    {
      type: 'bot',
      text: "Hey there! 👋 I'm Dormly AI. Tell me your university, budget, and power preferences — I'll rank the best dorms for you across 14 variables.",
    },
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef(null);
  const inputRef  = useRef(null);
   const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

  /* Auto-scroll on new messages */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  /* ── Send handler — calls real backend ── */
  const send = async (text) => {
    const t = (text ?? input).trim();
    if (!t || typing) return;

    setMessages((prev) => [...prev, { type: 'user', text: t }]);
    setInput('');
    setTyping(true);
    inputRef.current?.focus();

    try {
      const res = await fetch(`${API_URL}/api/aichat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: t }),
      });

      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        {
          type: res.ok ? 'bot' : 'error',
          text: data.message ?? 'Something went wrong. Please try again.',
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { type: 'error', text: "Couldn't reach Dormly AI. Check your connection and try again." },
      ]);
    } finally {
      setTyping(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <>
      <style>{`
        @keyframes bubbleIn {
          from { opacity: 0; transform: translateY(6px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0)   scale(1);    }
        }
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <div
        className="h-screen w-screen flex flex-col overflow-hidden"
        style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}
      >
        {/* ── HEADER ── */}
        <header
          className="shrink-0 relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #0f172a 0%, #134e4a 100%)' }}
        >
          {/* Grid texture */}
          <div
            className="absolute inset-0 opacity-[0.04] pointer-events-none"
            style={{
              backgroundImage:
                'linear-gradient(rgba(255,255,255,.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.6) 1px, transparent 1px)',
              backgroundSize: '32px 32px',
            }}
          />

          <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-8 py-4 flex items-center justify-between gap-4">

            {/* LEFT */}
            <div className="flex items-center gap-3 sm:gap-4 min-w-0">
              <Link
                to="/"
                className="shrink-0 flex items-center gap-1.5 text-xs font-semibold text-slate-400
                           hover:text-white bg-white/5 hover:bg-teal-500/30 border border-white/10
                           hover:border-teal-400/50 rounded-full px-3 py-1.5 transition-all duration-200 group"
                aria-label="Back to Home"
              >
                <ArrowLeft size={13} className="group-hover:-translate-x-0.5 transition-transform" />
                Back
              </Link>

              <div className="hidden sm:block w-px h-6 bg-white/10 shrink-0" />

              <nav className="hidden sm:flex items-center gap-1.5 text-xs" aria-label="Breadcrumb">
                <Link to="/" className="flex items-center gap-1 text-slate-500 hover:text-slate-300 transition font-medium">
                  <Home size={12} />
                  <span>Home</span>
                </Link>
                <ChevronRight size={12} className="text-slate-600" />
                <span className="text-teal-400 font-semibold">Dormly AI</span>
              </nav>

              <div className="hidden sm:block w-px h-6 bg-white/10 shrink-0" />

              {/* Bot identity */}
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="relative shrink-0 w-9 h-9 rounded-xl bg-linear-to-br from-teal-400 to-teal-600
                                flex items-center justify-center shadow-lg shadow-teal-900/50">
                  <Bot size={18} className="text-white" />
                  <span
                    className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-teal-400 rounded-full border-2"
                    style={{ borderColor: '#0f172a' }}
                  />
                </div>
                <div className="min-w-0">
                  <p className="text-white font-bold text-sm leading-none">Dormly AI</p>
                  <p className="text-slate-400 text-[11px] mt-0.5">Verified Assistant</p>
                </div>
              </div>
            </div>

            {/* RIGHT */}
            <div className="flex items-center gap-2 shrink-0">
              <div className="hidden sm:flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-full px-3 py-1.5">
                <Shield size={11} className="text-teal-400" />
                <span className="text-[11px] text-slate-400 font-medium">14 variables</span>
              </div>
              <div className="flex items-center gap-1.5 bg-teal-500/15 border border-teal-500/30 rounded-full px-3 py-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
                <span className="text-[11px] text-teal-300 font-semibold">Online</span>
              </div>
            </div>
          </div>
        </header>

        {/* ── MESSAGES ── */}
        <main
          className="flex-1 overflow-y-auto hide-scrollbar relative"
          style={{ background: 'linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%)' }}
        >
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.025]"
            style={{
              backgroundImage: 'radial-gradient(#0f172a 1px, transparent 1px)',
              backgroundSize: '24px 24px',
            }}
          />
          <div className="relative max-w-3xl mx-auto px-4 sm:px-6 py-6 space-y-4">
            {messages.map((msg, idx) => (
              <MessageBubble key={idx} msg={msg} isLast={idx === messages.length - 1} />
            ))}
            {typing && <Typing />}
            <div ref={bottomRef} className="h-1" />
          </div>
        </main>

        {/* ── FOOTER ── */}
        <footer className="shrink-0 bg-white border-t border-gray-100 shadow-[0_-4px_24px_rgba(0,0,0,0.05)]">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-3 pb-4">

            {/* Prompt chips */}
            <div className="flex gap-2 overflow-x-auto hide-scrollbar mb-3 pb-0.5">
              {PROMPTS.map(({ icon: Icon, label }) => (
                <button
                  key={label}
                  onClick={() => send(label)}
                  disabled={typing}
                  className="flex items-center gap-1.5 shrink-0 px-3 py-1.5 rounded-full
                             bg-gray-50 border border-gray-200 text-xs text-gray-500 font-medium
                             hover:bg-teal-50 hover:border-teal-300 hover:text-teal-700
                             disabled:opacity-40 disabled:cursor-not-allowed
                             transition-all duration-150"
                >
                  <Icon size={12} className="shrink-0" />
                  {label}
                </button>
              ))}
            </div>

            {/* Input row */}
            <div className="flex gap-2.5 items-center">
              <div
                className="flex-1 flex items-center gap-2.5 bg-gray-50 border border-gray-200
                           rounded-2xl px-4 py-3 focus-within:bg-white focus-within:border-teal-400
                           focus-within:ring-2 focus-within:ring-teal-100 transition-all duration-200 shadow-sm"
              >
                <Bot size={16} className="text-teal-400 shrink-0" />
                <input
                  ref={inputRef}
                  autoFocus
                  type="text"
                  placeholder="Ask about dorms, power, neighborhoods, price…"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={typing}
                  className="flex-1 bg-transparent text-sm text-gray-800 placeholder-gray-400
                             focus:outline-none disabled:opacity-50 min-w-0"
                />
              </div>

              <button
                onClick={() => send()}
                disabled={!input.trim() || typing}
                className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0
                           bg-teal-500 hover:bg-teal-600 active:scale-95
                           disabled:opacity-35 disabled:cursor-not-allowed
                           shadow-md shadow-teal-200 transition-all duration-150"
                aria-label="Send message"
              >
                <Send size={16} className="text-white" />
              </button>
            </div>

            {/* Disclaimer */}
            <p className="text-center text-[11px] text-gray-400 mt-2.5 leading-relaxed">
              Dormly AI may make mistakes · Always verify listings before signing a lease
            </p>
          </div>
        </footer>
      </div>
    </>
  );
}