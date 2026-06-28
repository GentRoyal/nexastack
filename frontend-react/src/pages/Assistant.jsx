import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Topbar from "../components/Topbar";
import { getDashboard, getInsights, getSegments, getCampaigns } from "../api";

const SUGGESTED = [
  "Which segment has the highest average LTV?",
  "How many at-risk customers do we have?",
  "Which acquisition channel is performing best?",
  "What's the total pipeline value in Demo Scheduled?",
  "Which campaign has the best conversion rate?",
  "Who is the top performing sales rep?",
  "What should we do about our at-risk accounts?",
  "Summarise the current state of our pipeline",
];

function Message({ msg }) {
  const isUser = msg.role === "user";
  return (
    <div style={{
      display:"flex", justifyContent: isUser ? "flex-end" : "flex-start",
      marginBottom:16, gap:10, alignItems:"flex-start"
    }}>
      {!isUser && (
        <div style={{ width:32, height:32, borderRadius:"50%", background:"var(--primary)",
          color:"#fff", display:"flex", alignItems:"center", justifyContent:"center",
          fontSize:13, fontWeight:700, flexShrink:0, marginTop:2 }}>
          NS
        </div>
      )}
      <div style={{
        maxWidth:"70%", padding:"12px 16px", borderRadius: isUser ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
        background: isUser ? "var(--accent)" : "#fff",
        color: isUser ? "#fff" : "var(--grey-800)",
        border: isUser ? "none" : "1px solid var(--grey-200)",
        fontSize:14, lineHeight:1.7, boxShadow:"0 1px 4px rgba(0,0,0,0.06)"
      }}>
        {msg.content.split("\n").map((line, i) => (
          <span key={i}>{line}{i < msg.content.split("\n").length-1 && <br/>}</span>
        ))}
        {msg.timestamp && (
          <div style={{ fontSize:10, marginTop:6, opacity:0.6, textAlign: isUser ? "right" : "left" }}>
            {msg.timestamp}
          </div>
        )}
      </div>
      {isUser && (
        <div style={{ width:32, height:32, borderRadius:"50%", background:"var(--grey-200)",
          color:"var(--grey-600)", display:"flex", alignItems:"center", justifyContent:"center",
          fontSize:13, fontWeight:700, flexShrink:0, marginTop:2 }}>
          You
        </div>
      )}
    </div>
  );
}

function TypingIndicator() {
  return (
    <div style={{ display:"flex", alignItems:"flex-start", gap:10, marginBottom:16 }}>
      <div style={{ width:32, height:32, borderRadius:"50%", background:"var(--primary)",
        color:"#fff", display:"flex", alignItems:"center", justifyContent:"center",
        fontSize:13, fontWeight:700, flexShrink:0 }}>
        NS
      </div>
      <div style={{ background:"#fff", border:"1px solid var(--grey-200)", borderRadius:"16px 16px 16px 4px",
        padding:"14px 18px", display:"flex", gap:6, alignItems:"center" }}>
        {[0,1,2].map(i => (
          <div key={i} style={{
            width:7, height:7, borderRadius:"50%", background:"var(--grey-400)",
            animation:"bounce 1.2s infinite", animationDelay:`${i*0.2}s`
          }} />
        ))}
      </div>
    </div>
  );
}

export default function Assistant() {
  const [messages, setMessages]   = useState([]);
  const [input, setInput]         = useState("");
  const [loading, setLoading]     = useState(false);
  const [context, setContext]     = useState(null);
  const [loadingCtx, setLoadingCtx] = useState(true);
  const bottomRef = useRef(null);
  const inputRef  = useRef(null);
  const navigate  = useNavigate();

  // Load platform data for context
  useEffect(() => {
    Promise.all([getDashboard(), getInsights(), getSegments(), getCampaigns()])
      .then(([dashboard, insights, segments, campaigns]) => {
        setContext({ dashboard, insights, segments, campaigns });
        setLoadingCtx(false);

        // Welcome message
        setMessages([{
          role:"assistant",
          content: `Hi! I'm the NexaStack AI Assistant 👋\n\nI have access to your current platform data — ${dashboard.total_customers.toLocaleString()} customers, ${dashboard.at_risk_accounts} at-risk accounts, and $${(dashboard.active_pipeline_value/1000000).toFixed(1)}M in active pipeline.\n\nAsk me anything about your customers, pipeline, segments, or campaigns.`,
          timestamp: now()
        }]);
      });
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior:"smooth" });
  }, [messages, loading]);

  function now() {
    return new Date().toLocaleTimeString([], { hour:"2-digit", minute:"2-digit" });
  }

  function buildSystemPrompt() {
    const d  = context.dashboard;
    const ins = context.insights;
    const segs = context.segments;
    const camps = context.campaigns;

    return `You are NexaStack AI, an intelligent assistant for a B2B SaaS marketing technology platform that integrates CDP (Customer Data Platform) and CRM (Customer Relationship Management) data.

Here is the current state of the platform data:

DASHBOARD SUMMARY:
- Total Customers: ${d.total_customers.toLocaleString()}
- Active Pipeline Value: $${d.active_pipeline_value.toLocaleString()}
- Closed Revenue: $${d.closed_revenue.toLocaleString()}
- At-Risk Accounts: ${d.at_risk_accounts}
- Active Campaigns: ${d.active_campaigns}

PIPELINE BY STAGE:
${d.pipeline_by_stage.map(s => `- ${s.stage}: $${s.value.toLocaleString()}`).join("\n")}

SEGMENT BREAKDOWN:
${segs.map(s => `- ${s.name}: ${s.count} customers, Avg LTV $${s.avg_ltv.toLocaleString()}, Recommended action: ${s.recommended_action}`).join("\n")}

TOP 5 CUSTOMERS BY LTV:
${ins.top_customers.map((c,i) => `${i+1}. ${c.name} (${c.company}) — $${c.ltv.toLocaleString()} — ${c.segment}`).join("\n")}

HIGH-VALUE AT-RISK ACCOUNTS:
${ins.worst_at_risk.map(c => `- ${c.name} (${c.company}) — LTV $${c.ltv.toLocaleString()} — Last active: ${c.last_active}`).join("\n")}

CHANNEL PERFORMANCE (by Avg LTV):
${ins.channel_perf.map(c => `- ${c.channel}: Avg LTV $${c.avg_ltv.toLocaleString()} (${c.count} customers)`).join("\n")}

SALES REP LEADERBOARD:
${ins.leaderboard.map((r,i) => `${i+1}. ${r.rep} — $${r.value.toLocaleString()} closed (${r.deals} deals)`).join("\n")}

CAMPAIGNS:
${camps.map(c => {
  const openRate = c.sent ? Math.round(c.opened/c.sent*100) : 0;
  const convRate = c.sent ? Math.round(c.converted/c.sent*100) : 0;
  return `- ${c.name} [${c.status}] — Segment: ${c.segment} — Sent: ${c.sent}, Opened: ${openRate}%, Converted: ${convRate}%`;
}).join("\n")}

IMPORTANT NOTES:
- This is a demo platform with synthetic data
- You are NOT fine-tuned on this data — you receive it as context with each query
- Be concise, insightful, and actionable in your responses
- When relevant, suggest actions the user can take in the platform
- Use bullet points and clear formatting for complex answers
- If asked about something not in the data, say so clearly`;
  }

  async function send(text) {
    const userMsg = text || input.trim();
    if (!userMsg || loading || !context) return;

    setInput("");
    setMessages(prev => [...prev, { role:"user", content:userMsg, timestamp:now() }]);
    setLoading(true);

    try {
      const history = messages
        .filter(m => m.role !== "system")
        .map(m => ({ role:m.role, content:m.content }));

      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method:"POST",
        headers:{
          "Content-Type":"application/json",
          "Authorization":`Bearer ${import.meta.env.VITE_GROQ_API_KEY}`
        },
        body:JSON.stringify({
          model:"llama-3.1-8b-instant",
          messages:[
            { role:"system", content:buildSystemPrompt() },
            ...history,
            { role:"user", content:userMsg }
          ],
          temperature:0.7,
          max_tokens:1024,
        })
      });

      const data = await response.json();
      const reply = data.choices?.[0]?.message?.content || "Sorry, I couldn't get a response. Please try again.";

      setMessages(prev => [...prev, { role:"assistant", content:reply, timestamp:now() }]);
    } catch (err) {
      setMessages(prev => [...prev, {
        role:"assistant",
        content:"Something went wrong connecting to the AI. Please check your API key and try again.",
        timestamp:now()
      }]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  }

  return (
    <>
      <style>{`
        @keyframes bounce {
          0%,80%,100% { transform:translateY(0); }
          40% { transform:translateY(-6px); }
        }
      `}</style>
      <Topbar title="AI Assistant" />
      <div style={{ display:"flex", flexDirection:"column", height:"calc(100vh - 60px)" }}>

        {/* Suggested Questions — only show if no conversation yet */}
        {messages.length <= 1 && !loadingCtx && (
          <div style={{ padding:"16px 32px 0", borderBottom:"1px solid var(--grey-200)" }}>
            <div style={{ fontSize:12, fontWeight:600, color:"var(--grey-400)",
              textTransform:"uppercase", letterSpacing:"0.5px", marginBottom:10 }}>
              Suggested questions
            </div>
            <div style={{ display:"flex", flexWrap:"wrap", gap:8, paddingBottom:16 }}>
              {SUGGESTED.map(q => (
                <button key={q} onClick={() => send(q)}
                  style={{ padding:"6px 14px", border:"1px solid var(--grey-200)", borderRadius:20,
                    fontSize:12, fontWeight:500, cursor:"pointer", background:"#fff",
                    color:"var(--grey-700)", transition:"all 0.15s" }}
                  onMouseEnter={e => { e.target.style.borderColor="var(--accent)"; e.target.style.color="var(--accent)"; }}
                  onMouseLeave={e => { e.target.style.borderColor="var(--grey-200)"; e.target.style.color="var(--grey-700)"; }}>
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Messages */}
        <div style={{ flex:1, overflowY:"auto", padding:"24px 32px" }}>
          {loadingCtx ? (
            <div className="loading">Loading platform data…</div>
          ) : (
            <>
              {messages.map((m, i) => <Message key={i} msg={m} />)}
              {loading && <TypingIndicator />}
              <div ref={bottomRef} />
            </>
          )}
        </div>

        {/* Input */}
        <div style={{ padding:"16px 32px", borderTop:"1px solid var(--grey-200)",
          background:"#fff", display:"flex", gap:10 }}>
          <input
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && !e.shiftKey && send()}
            placeholder="Ask anything about your customers, pipeline, or campaigns…"
            disabled={loading || loadingCtx}
            style={{ flex:1, padding:"12px 16px", border:"1px solid var(--grey-200)",
              borderRadius:10, fontSize:14, outline:"none",
              background: loading ? "var(--grey-50)" : "#fff" }}
          />
          <button onClick={() => send()}
            disabled={loading || !input.trim() || loadingCtx}
            style={{ padding:"12px 20px", background: loading || !input.trim() ? "var(--grey-200)" : "var(--accent)",
              color: loading || !input.trim() ? "var(--grey-400)" : "#fff",
              border:"none", borderRadius:10, fontSize:14, fontWeight:600,
              cursor: loading || !input.trim() ? "default" : "pointer", transition:"all 0.15s" }}>
            {loading ? "…" : "Send →"}
          </button>
        </div>
      </div>
    </>
  );
}