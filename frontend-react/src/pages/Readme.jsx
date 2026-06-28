import Topbar from "../components/Topbar";

function Section({ title, children }) {
  return (
    <div style={{ marginBottom:32 }}>
      <div style={{ fontSize:18, fontWeight:700, color:"var(--primary)", marginBottom:12,
        paddingBottom:8, borderBottom:"2px solid var(--grey-200)" }}>
        {title}
      </div>
      {children}
    </div>
  );
}

function Tag({ children, color="#3b82f6" }) {
  return (
    <span style={{ display:"inline-block", padding:"3px 10px", borderRadius:20, fontSize:12,
      fontWeight:600, background:color+"22", color, marginRight:6, marginBottom:6 }}>
      {children}
    </span>
  );
}

function InfoBox({ type="info", children }) {
  const styles = {
    info:    { bg:"#eff6ff", border:"#bfdbfe", color:"#1d4ed8", icon:"ℹ️" },
    warning: { bg:"#fffbeb", border:"#fde68a", color:"#92400e", icon:"⚠️" },
    success: { bg:"#f0fdf4", border:"#bbf7d0", color:"#166534", icon:"✅" },
  };
  const s = styles[type];
  return (
    <div style={{ background:s.bg, border:`1px solid ${s.border}`, borderRadius:8,
      padding:"12px 16px", marginBottom:12, display:"flex", gap:10, fontSize:13 }}>
      <span>{s.icon}</span>
      <span style={{ color:s.color }}>{children}</span>
    </div>
  );
}

function Table({ headers, rows }) {
  return (
    <div className="table-wrap" style={{ marginBottom:16 }}>
      <table>
        <thead>
          <tr>{headers.map(h => <th key={h}>{h}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>{row.map((cell, j) => <td key={j}>{cell}</td>)}</tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function Readme() {
  return (
    <>
      <Topbar title="README — Product Documentation" />
      <div className="content" style={{ maxWidth:860 }}>

        {/* Hero */}
        <div style={{ background:"var(--primary)", borderRadius:12, padding:"32px 36px",
          marginBottom:32, color:"#fff" }}>
          <div style={{ fontSize:28, fontWeight:800, marginBottom:8 }}>NexaStack</div>
          <div style={{ fontSize:16, color:"rgba(255,255,255,0.7)", marginBottom:16 }}>
            A unified Marketing Technology Platform integrating CDP + CRM for B2B SaaS teams
          </div>
          <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
            {["FastAPI","React","Python","Vite","Render","Vercel"].map(t => (
              <span key={t} style={{ background:"rgba(255,255,255,0.15)", padding:"4px 12px",
                borderRadius:20, fontSize:12, fontWeight:600 }}>{t}</span>
            ))}
          </div>
        </div>

        <Section title="📌 What is NexaStack?">
          <p style={{ fontSize:14, lineHeight:1.8, color:"var(--grey-600)", marginBottom:12 }}>
            NexaStack is a high-level MVP of a marketing technology platform that demonstrates
            the integration between a <strong>Customer Data Platform (CDP)</strong> and a
            <strong> Customer Relationship Management (CRM)</strong> system — two tools that are
            typically siloed in most organisations.
          </p>
          <p style={{ fontSize:14, lineHeight:1.8, color:"var(--grey-600)" }}>
            The core idea: <strong>CDP tells you who your customers are and how they behave.
            CRM tells you what to do about it.</strong> NexaStack unifies both into one interface
            so marketing and sales teams are always aligned.
          </p>
        </Section>

        <Section title="🏗️ Architecture">
          <div className="grid-2" style={{ marginBottom:16 }}>
            <div style={{ background:"var(--grey-50)", borderRadius:8, padding:16 }}>
              <div style={{ fontSize:13, fontWeight:700, marginBottom:8, color:"var(--primary)" }}>
                Backend
              </div>
              <div style={{ fontSize:13, color:"var(--grey-600)", lineHeight:1.8 }}>
                <div>⚙️ <strong>FastAPI</strong> — REST API framework</div>
                <div>🐍 <strong>Python 3.10+</strong></div>
                <div>📦 <strong>Uvicorn</strong> — ASGI server</div>
                <div>🔢 <strong>Synthetic data generator</strong> — configurable scale</div>
                <div>☁️ Deployed on <strong>Render.com</strong></div>
              </div>
            </div>
            <div style={{ background:"var(--grey-50)", borderRadius:8, padding:16 }}>
              <div style={{ fontSize:13, fontWeight:700, marginBottom:8, color:"var(--primary)" }}>
                Frontend
              </div>
              <div style={{ fontSize:13, color:"var(--grey-600)", lineHeight:1.8 }}>
                <div>⚛️ <strong>React</strong> + <strong>Vite</strong></div>
                <div>🔀 <strong>React Router</strong> — client-side routing</div>
                <div>🎨 <strong>Vanilla CSS</strong> — no UI library</div>
                <div>🤖 <strong>Groq AI</strong> — LLM assistant (demo)</div>
                <div>☁️ Deployed on <strong>Vercel</strong></div>
              </div>
            </div>
          </div>
        </Section>

        <Section title="📊 Data Model">
          <p style={{ fontSize:14, color:"var(--grey-600)", marginBottom:12, lineHeight:1.8 }}>
            All data is synthetically generated at runtime using <code style={{ background:"var(--grey-100)",
            padding:"1px 6px", borderRadius:4, fontSize:13 }}>data.py</code>. Set{" "}
            <code style={{ background:"var(--grey-100)", padding:"1px 6px", borderRadius:4, fontSize:13 }}>
              NUM_CUSTOMERS
            </code>{" "}
            to any number — 100, 1,000, or 100,000.
          </p>
          <Table
            headers={["Entity", "Key Fields", "Source"]}
            rows={[
              ["Customer", "id, name, company, email, segment, ltv, events, acquisition_channel, last_active", "CDP"],
              ["Deal",     "id, customer_id, company, owner, stage, value, close_date, lead_score",            "CRM"],
              ["Segment",  "id, name, description, count, avg_ltv, recommended_action",                        "CDP"],
              ["Campaign", "id, name, segment, trigger, channel, status, sent, opened, converted",             "Marketing"],
            ]}
          />
          <InfoBox type="info">
            The <strong>customer_id</strong> field is the join key between CDP and CRM data,
            enabling the unified Customer 360 view.
          </InfoBox>
        </Section>

        <Section title="🗂️ Platform Pages">
          <Table
            headers={["Page", "Description", "Data Source"]}
            rows={[
              ["Dashboard",    "KPIs, pipeline chart, segment breakdown, top customers, at-risk accounts, channel performance, rep leaderboard", "CDP + CRM"],
              ["CDP Segments", "4 behavioural segments with avg LTV and recommended actions. Clicking an action links to the relevant campaign", "CDP"],
              ["CRM Pipeline", "Paginated table + compact kanban. Filter by rep and stage. Sortable columns. Stage summary cards", "CRM"],
              ["Customer 360", "Full customer list with segment filter pills, search, and sorting. Click any row to view unified CDP + CRM profile", "CDP + CRM"],
              ["Campaigns",    "Campaign performance with open/conversion funnels, launch/pause controls, and summary KPIs", "Marketing"],
              ["Analytics",    "Avg deal size by rep, conversion rate by channel, pipeline by stage, avg LTV by segment", "CDP + CRM"],
              ["AI Assistant", "Groq-powered LLM that answers natural language questions about your customer data", "CDP + CRM"],
              ["README",       "This page", "—"],
            ]}
          />
        </Section>

        <Section title="🤖 AI Assistant">
          <InfoBox type="warning">
            The AI Assistant is powered by <strong>Groq (LLaMA 3)</strong> and is included as a
            quick demo only. The model is <strong>not fine-tuned</strong> on NexaStack data —
            it receives a structured context summary of your current platform data with each query
            and reasons over it in real time. Responses may not always be perfectly accurate.
            For production use, this would be replaced with a fine-tuned or RAG-based model.
          </InfoBox>
          <p style={{ fontSize:14, color:"var(--grey-600)", lineHeight:1.8 }}>
            The assistant is given a snapshot of your current data (customer counts, segment sizes,
            pipeline totals, campaign performance) and can answer questions like:
          </p>
          <div style={{ background:"var(--grey-50)", borderRadius:8, padding:16, marginTop:12 }}>
            {[
              "Which segment has the highest average LTV?",
              "How many at-risk customers do we have and what's their total LTV exposure?",
              "Which acquisition channel is performing best?",
              "What's the current pipeline value in the Demo Scheduled stage?",
              "Which campaign has the best conversion rate?",
            ].map(q => (
              <div key={q} style={{ display:"flex", gap:8, marginBottom:8, fontSize:13, color:"var(--grey-700)" }}>
                <span style={{ color:"var(--accent)" }}>→</span> {q}
              </div>
            ))}
          </div>
        </Section>

<Section title="🚀 How to Run Locally">
  <div style={{ marginBottom:16 }}>
    <div style={{ fontSize:13, fontWeight:700, marginBottom:8, color:"var(--grey-800)" }}>
      1. Clone the project
    </div>
    <div style={{ background:"#1e293b", borderRadius:8, padding:16, fontFamily:"monospace",
      fontSize:13, color:"#e2e8f0", lineHeight:2 }}>
      <div>cd nexastack</div>
    </div>
  </div>
  <div style={{ marginBottom:16 }}>
    <div style={{ fontSize:13, fontWeight:700, marginBottom:8, color:"var(--grey-800)" }}>
      2. Backend
    </div>
    <div style={{ background:"#1e293b", borderRadius:8, padding:16, fontFamily:"monospace",
      fontSize:13, color:"#e2e8f0", lineHeight:2 }}>
      <div>cd backend</div>
      <div>python -m venv venv</div>
      <div>venv\Scripts\activate</div>
      <div>pip install fastapi uvicorn groq python-dotenv</div>
      <div><span style={{ color:"#64748b" }}># Create backend/.env</span></div>
      <div>echo GROQ_API_KEY=your_key_here &gt; .env</div>
      <div>uvicorn main:app --reload</div>
    </div>
  </div>
  <div style={{ marginBottom:16 }}>
    <div style={{ fontSize:13, fontWeight:700, marginBottom:8, color:"var(--grey-800)" }}>
      3. Frontend
    </div>
    <div style={{ background:"#1e293b", borderRadius:8, padding:16, fontFamily:"monospace",
      fontSize:13, color:"#e2e8f0", lineHeight:2 }}>
      <div>cd frontend-react</div>
      <div>npm install</div>
      <div>npm run dev</div>
      <div><span style={{ color:"#64748b" }}># Open http://localhost:5173</span></div>
    </div>
  </div>
  <InfoBox type="success">
    To change the number of generated customers, edit <strong>NUM_CUSTOMERS</strong> at
    the top of <strong>backend/data.py</strong> and restart the server.
  </InfoBox>
</Section>

<Section title="☁️ Deployment">
  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:16 }}>
    <div style={{ background:"var(--grey-50)", borderRadius:8, padding:16,
      borderLeft:"3px solid var(--accent)" }}>
      <div style={{ fontSize:13, fontWeight:700, marginBottom:6, color:"var(--primary)" }}>
        Backend → Render.com
      </div>
      <div style={{ fontSize:12, color:"var(--grey-600)", lineHeight:1.8 }}>
        Free tier · Python support · Auto-deploy from GitHub
      </div>
    </div>
    <div style={{ background:"var(--grey-50)", borderRadius:8, padding:16,
      borderLeft:"3px solid #16a34a" }}>
      <div style={{ fontSize:13, fontWeight:700, marginBottom:6, color:"var(--primary)" }}>
        Frontend → Vercel
      </div>
      <div style={{ fontSize:12, color:"var(--grey-600)", lineHeight:1.8 }}>
        Free tier · React/Vite native support · Auto-deploy from GitHub
      </div>
    </div>
  </div>
  <InfoBox type="info">
    Both platforms connect to your GitHub repository and auto-deploy on every push to main.
    Set up GitHub first, then connect both services.
  </InfoBox>
</Section>

        <Section title="🔮 What's Next (Roadmap)">
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
            {[
              { title:"ML Forecasting",       desc:"Revenue forecast, churn prediction score, lead conversion probability, segment migration prediction" },
              { title:"Fine-tuned AI",         desc:"Replace demo Groq assistant with a RAG pipeline trained on actual customer interaction data" },
              { title:"Real-time Events",      desc:"WebSocket-based live event stream for CDP behavioural events as they happen" },
              { title:"Auth + Multi-tenancy",  desc:"Role-based access control — marketing, sales, and admin views" },
              { title:"Email Integration",     desc:"Actually trigger campaign emails via SendGrid or Resend when launching a campaign" },
              { title:"Database Layer",        desc:"Replace synthetic data with PostgreSQL + SQLAlchemy for persistent storage" },
            ].map(r => (
              <div key={r.title} style={{ background:"var(--grey-50)", borderRadius:8, padding:16 }}>
                <div style={{ fontSize:13, fontWeight:700, marginBottom:4, color:"var(--primary)" }}>
                  {r.title}
                </div>
                <div style={{ fontSize:12, color:"var(--grey-600)", lineHeight:1.6 }}>{r.desc}</div>
              </div>
            ))}
          </div>
        </Section>

        <div style={{ textAlign:"center", padding:"24px 0", fontSize:12, color:"var(--grey-400)",
          borderTop:"1px solid var(--grey-200)", marginTop:8 }}>
          NexaStack MVP · Built with FastAPI + React · June 2026
        </div>

      </div>
    </>
  );
}