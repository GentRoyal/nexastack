import { useState, useRef, useEffect } from "react";
import { getDashboard } from "../api";

const SUGGESTED = [
  "Who is the top performing sales rep?",
  "Which segment has the highest LTV?",
  "How many at-risk accounts do we have?",
  "Which channel performs best?",
  "Summarise the pipeline",
];

function TypingIndicator() {
  return (
    <div style={{ display:"flex", gap:5, padding:"10px 14px", background:"#fff",
      border:"1px solid var(--grey-200)", borderRadius:"16px 16px 16px 4px",
      width:"fit-content", marginBottom:12 }}>
      {[0,1,2].map(i => (
        <div key={i} style={{ width:6, height:6, borderRadius:"50%", background:"var(--grey-400)",
          animation:"bounce 1.2s infinite", animationDelay:`${i*0.2}s` }} />
      ))}
    </div>
  );
}

export default function ChatWidget() {
  const [open, setOpen]       = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput]     = useState("");
  const [loading, setLoading] = useState(false);
  const [ready, setReady]     = useState(false);
  const bottomRef = useRef(null);
  const inputRef  = useRef(null);

  useEffect(() => {
    if (open && messages.length === 0) {
      getDashboard().then(d => {
        setReady(true);
        setMessages([{
          role:"assistant",
          content:`Hi! 👋 I'm your MarTech AI assistant.\n\nI can see ${d.total_customers.toLocaleString()} customers and $${(d.active_pipeline_value/1000000).toFixed(1)}M in active pipeline. What would you like to know?`
        }]);
      });
    }
    if (open) setTimeout(() => inputRef.current?.focus(), 100);
  }, [open]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior:"smooth" });
  }, [messages, loading]);

  async function send(text) {
    const userMsg = text || input.trim();
    if (!userMsg || loading) return;
    setInput("");

    const newMessages = [...messages, { role:"user", content:userMsg }];
    setMessages(newMessages);
    setLoading(true);

    try {
      const res = await fetch("http://127.0.0.1:8000/chat", {
        method:"POST",
        headers:{ "Content-Type":"application/json" },
        body:JSON.stringify({
          messages: newMessages
            .filter(m => m.role !== "system")
            .map(m => ({ role:m.role, content:m.content }))
        })
      });
      const data = await res.json();
      setMessages(prev => [...prev, {
        role:"assistant",
        content: data.reply || data.error || "Something went wrong."
      }]);
    } catch {
      setMessages(prev => [...prev, {
        role:"assistant", content:"Connection error. Is the backend running?"
      }]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  }

  const showSuggested = messages.length <= 1 && ready;

  return (
    <>
      <style>{`
        @keyframes bounce {
          0%,80%,100%{transform:translateY(0)}
          40%{transform:translateY(-5px)}
        }
        @keyframes slideUp {
          from{opacity:0;transform:translateY(20px)}
          to{opacity:1;transform:translateY(0)}
        }
      `}</style>

      {/* Floating Button */}
      <button onClick={() => setOpen(o => !o)}
        style={{ position:"fixed", bottom:28, right:28, width:52, height:52,
          borderRadius:"50%", background:"var(--primary)", color:"#fff",
          border:"none", fontSize:22, cursor:"pointer", zIndex:1000,
          boxShadow:"0 4px 20px rgba(0,0,0,0.2)", display:"flex",
          alignItems:"center", justifyContent:"center", transition:"transform 0.2s" }}
        onMouseEnter={e => e.currentTarget.style.transform="scale(1.1)"}
        onMouseLeave={e => e.currentTarget.style.transform="scale(1)"}>
        {open ? "✕" : "🤖"}
      </button>

      {/* Chat Window */}
      {open && (
        <div style={{ position:"fixed", bottom:92, right:28, width:380,
          height:520, background:"var(--grey-50)", borderRadius:16,
          boxShadow:"0 8px 40px rgba(0,0,0,0.15)", zIndex:999, display:"flex",
          flexDirection:"column", overflow:"hidden", animation:"slideUp 0.2s ease",
          border:"1px solid var(--grey-200)" }}>

          {/* Header */}
          <div style={{ background:"var(--primary)", padding:"14px 18px",
            display:"flex", alignItems:"center", gap:10 }}>
            <div style={{ width:36, height:36, borderRadius:"50%", background:"rgba(255,255,255,0.15)",
              display:"flex", alignItems:"center", justifyContent:"center", fontSize:18 }}>
              🤖
            </div>
            <div>
              <div style={{ color:"#fff", fontWeight:700, fontSize:14 }}>MarTech AI</div>
              <div style={{ color:"rgba(255,255,255,0.6)", fontSize:11 }}>
                {ready ? "● Online" : "Loading data…"}
              </div>
            </div>
            <button onClick={() => setMessages([])}
              style={{ marginLeft:"auto", background:"rgba(255,255,255,0.1)", border:"none",
                color:"rgba(255,255,255,0.7)", padding:"4px 10px", borderRadius:6,
                fontSize:11, cursor:"pointer", fontWeight:600 }}>
              Clear
            </button>
          </div>

          {/* Messages */}
          <div style={{ flex:1, overflowY:"auto", padding:"14px 14px 0" }}>
            {!ready && (
              <div style={{ textAlign:"center", padding:20, color:"var(--grey-400)", fontSize:13 }}>
                Loading platform data…
              </div>
            )}

            {messages.map((m, i) => {
              const isUser = m.role === "user";
              return (
                <div key={i} style={{ display:"flex", justifyContent: isUser?"flex-end":"flex-start",
                  marginBottom:10 }}>
                  <div style={{ maxWidth:"85%", padding:"10px 14px",
                    borderRadius: isUser?"16px 16px 4px 16px":"16px 16px 16px 4px",
                    background: isUser ? "var(--accent)" : "#fff",
                    color: isUser ? "#fff" : "var(--grey-800)",
                    border: isUser ? "none" : "1px solid var(--grey-200)",
                    fontSize:13, lineHeight:1.6,
                    boxShadow:"0 1px 3px rgba(0,0,0,0.06)" }}>
                    {m.content.split("\n").map((line, j) => (
                      <span key={j}>{line}{j < m.content.split("\n").length-1 && <br/>}</span>
                    ))}
                  </div>
                </div>
              );
            })}

            {loading && <TypingIndicator />}
            <div ref={bottomRef} />
          </div>

          {/* Suggested Questions */}
          {showSuggested && (
            <div style={{ padding:"10px 14px", borderTop:"1px solid var(--grey-200)" }}>
              <div style={{ fontSize:10, fontWeight:600, color:"var(--grey-400)",
                textTransform:"uppercase", letterSpacing:"0.5px", marginBottom:8 }}>
                Try asking
              </div>
              <div style={{ display:"flex", flexDirection:"column", gap:5 }}>
                {SUGGESTED.slice(0,3).map(q => (
                  <button key={q} onClick={() => send(q)}
                    style={{ padding:"6px 10px", border:"1px solid var(--grey-200)",
                      borderRadius:8, fontSize:11, fontWeight:500, cursor:"pointer",
                      background:"#fff", color:"var(--grey-700)", textAlign:"left",
                      transition:"all 0.15s" }}
                    onMouseEnter={e => { e.target.style.borderColor="var(--accent)"; e.target.style.color="var(--accent)"; }}
                    onMouseLeave={e => { e.target.style.borderColor="var(--grey-200)"; e.target.style.color="var(--grey-700)"; }}>
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div style={{ padding:"10px 14px", borderTop:"1px solid var(--grey-200)",
            background:"#fff", display:"flex", gap:8 }}>
            <input
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key==="Enter" && !e.shiftKey && send()}
              placeholder="Ask about your data…"
              disabled={loading || !ready}
              style={{ flex:1, padding:"9px 12px", border:"1px solid var(--grey-200)",
                borderRadius:8, fontSize:13, outline:"none",
                background: !ready ? "var(--grey-50)" : "#fff" }}
            />
            <button onClick={() => send()}
              disabled={loading || !input.trim() || !ready}
              style={{ padding:"9px 14px", background: !input.trim()||loading ? "var(--grey-200)" : "var(--accent)",
                color: !input.trim()||loading ? "var(--grey-400)" : "#fff",
                border:"none", borderRadius:8, fontSize:13, fontWeight:600,
                cursor: !input.trim()||loading ? "default":"pointer" }}>
              {loading ? "…" : "→"}
            </button>
          </div>
        </div>
      )}
    </>
  );
}