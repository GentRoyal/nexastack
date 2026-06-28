import Topbar from "../components/Topbar";

function Section({ title, children }) {
  return (
    <div style={{ marginBottom: 32 }}>
      <div style={{ fontSize: 18, fontWeight: 700, color: "var(--primary)", marginBottom: 12,
        paddingBottom: 8, borderBottom: "2px solid var(--grey-200)" }}>
        {title}
      </div>
      {children}
    </div>
  );
}

function InfoBox({ type = "info", children }) {
  const styles = {
    info:    { bg: "#eff6ff", border: "#bfdbfe", color: "#1d4ed8", icon: "ℹ️" },
    warning: { bg: "#fffbeb", border: "#fde68a", color: "#92400e", icon: "⚠️" },
    success: { bg: "#f0fdf4", border: "#bbf7d0", color: "#166534", icon: "✅" },
  };
  const s = styles[type];
  return (
    <div style={{ background: s.bg, border: `1px solid ${s.border}`, borderRadius: 8,
      padding: "12px 16px", marginBottom: 12, display: "flex", gap: 10, fontSize: 13 }}>
      <span>{s.icon}</span>
      <span style={{ color: s.color }}>{children}</span>
    </div>
  );
}

function Table({ headers, rows }) {
  return (
    <div className="table-wrap" style={{ marginBottom: 16 }}>
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
      <Topbar title="README — Project Documentation" />
      <div className="content" style={{ maxWidth: 860 }}>

        {/* Hero */}
        <div style={{ background: "var(--primary)", borderRadius: 12, padding: "32px 36px",
          marginBottom: 32, color: "#fff" }}>
          <div style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>MarTech</div>
          <div style={{ fontSize: 16, color: "rgba(255,255,255,0.7)", marginBottom: 4 }}>
            CDP–CRM Integration Prototype
          </div>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,0.55)", marginBottom: 16 }}>
            A research prototype exploring unified Customer 360 data architecture for B2B SaaS environments
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {["FastAPI", "React", "Python", "Vite", "Render", "Vercel"].map(t => (
              <span key={t} style={{ background: "rgba(255,255,255,0.15)", padding: "4px 12px",
                borderRadius: 20, fontSize: 12, fontWeight: 600 }}>{t}</span>
            ))}
          </div>
        </div>

        {/* Overview */}
        <Section title="📌 Project Overview">
          <p style={{ fontSize: 14, lineHeight: 1.8, color: "var(--grey-600)", marginBottom: 12 }}>
            MarTech is a prototype marketing technology system designed to explore the integration
            of <strong>Customer Data Platforms (CDP)</strong> and <strong>Customer Relationship
            Management (CRM)</strong> systems through a unified Customer 360 data layer for B2B
            SaaS environments.
          </p>
          <p style={{ fontSize: 14, lineHeight: 1.8, color: "var(--grey-600)" }}>
            The central objective is to address fragmentation between customer behavioral data (CDP)
            and sales pipeline data (CRM) by providing a single consolidated view that supports
            both analytical and operational decision-making.
          </p>
        </Section>

        {/* Core Concept */}
        <Section title="💡 Core Concept">
          <p style={{ fontSize: 14, lineHeight: 1.8, color: "var(--grey-600)", marginBottom: 16 }}>
            In most organisations, CDP and CRM systems operate in isolation:
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
            <div style={{ background: "var(--grey-50)", borderRadius: 8, padding: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 6, color: "var(--primary)" }}>CDP</div>
              <div style={{ fontSize: 13, color: "var(--grey-600)", lineHeight: 1.7 }}>
                Captures customer identity, behavior, and engagement signals
              </div>
            </div>
            <div style={{ background: "var(--grey-50)", borderRadius: 8, padding: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 6, color: "var(--primary)" }}>CRM</div>
              <div style={{ fontSize: 13, color: "var(--grey-600)", lineHeight: 1.7 }}>
                Manages leads, deals, and sales pipeline activities
              </div>
            </div>
          </div>
          <InfoBox type="info">
            MarTech integrates both systems using a shared <strong>customer_id</strong> to create
            a unified Customer 360 model that links behavioral and transactional data.
          </InfoBox>
        </Section>

        {/* Architecture */}
        <Section title="🏗️ System Architecture">
          <p style={{ fontSize: 14, color: "var(--grey-600)", marginBottom: 16, lineHeight: 1.8 }}>
            The system is structured into four conceptual layers:
          </p>
          <div style={{ background: "var(--grey-50)", borderRadius: 8, padding: "16px 20px",
            marginBottom: 16, fontFamily: "monospace", fontSize: 13, lineHeight: 2,
            color: "var(--grey-700)" }}>
            <div>CDP Layer → Customer identity &amp; behavioral events</div>
            <div>Integration Layer → Identity mapping via <code>customer_id</code></div>
            <div>Customer 360 Layer → Unified customer profile (CDP + CRM merge)</div>
            <div>CRM Layer → Deals, pipeline stages, and sales activity</div>
            <div>Analytics/Activation Layer → Segmentation, reporting, and insights</div>
          </div>
        </Section>

        {/* Data Model */}
        <Section title="📊 Data Model">
          <p style={{ fontSize: 14, color: "var(--grey-600)", marginBottom: 12, lineHeight: 1.8 }}>
            All data is synthetically generated at runtime to simulate a B2B SaaS environment.
            Set{" "}
            <code style={{ background: "var(--grey-100)", padding: "1px 6px", borderRadius: 4, fontSize: 13 }}>
              NUM_CUSTOMERS
            </code>{" "}
            in{" "}
            <code style={{ background: "var(--grey-100)", padding: "1px 6px", borderRadius: 4, fontSize: 13 }}>
              data.py
            </code>{" "}
            to any scale for controlled simulation and reproducibility.
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
            The <strong>customer_id</strong> field acts as the primary join key enabling CDP–CRM
            integration and Customer 360 construction.
          </InfoBox>
        </Section>

        {/* Platform Modules */}
        <Section title="🗂️ Platform Modules">
          <p style={{ fontSize: 14, color: "var(--grey-600)", marginBottom: 12, lineHeight: 1.8 }}>
            <strong>Core modules:</strong>
          </p>
          <Table
            headers={["Module", "Description", "Data Source"]}
            rows={[
              ["Customer 360", "Unified CDP + CRM profile view — full customer list with segment filters, search, and drill-down profiles", "CDP + CRM"],
              ["CRM Pipeline", "Deal tracking and stage management — paginated table, compact kanban, rep filters, sortable columns",        "CRM"],
              ["CDP Segments", "Behavior-based customer grouping — 4 segments with avg LTV and recommended actions",                        "CDP"],
            ]}
          />
          <p style={{ fontSize: 14, color: "var(--grey-600)", margin: "16px 0 12px", lineHeight: 1.8 }}>
            <strong>Supporting modules:</strong>
          </p>
          <Table
            headers={["Module", "Description", "Data Source"]}
            rows={[
              ["Dashboard",  "KPIs, pipeline chart, segment breakdown, at-risk accounts, channel performance, rep leaderboard", "CDP + CRM"],
              ["Analytics",  "Conversion rates by channel, avg deal size by rep, pipeline by stage, avg LTV by segment",        "CDP + CRM"],
              ["Campaigns",  "Marketing activation tracking — open/conversion funnels, launch/pause controls, summary KPIs",    "Marketing"],
            ]}
          />
        </Section>

        {/* Experimental AI Layer */}
        <Section title="🤖 Experimental AI Layer">
          <InfoBox type="warning">
            The LLM-based interface is powered by <strong>Groq (LLaMA 3)</strong> and is included
            as an experimental query layer only. The model is <strong>not fine-tuned</strong> on
            platform data — it receives a structured runtime context snapshot with each query and
            reasons over it in real time. Intended for exploratory analysis, not production deployment.
          </InfoBox>
          <p style={{ fontSize: 14, color: "var(--grey-600)", marginBottom: 12, lineHeight: 1.8 }}>
            The assistant is given a snapshot of current data (customer counts, segment sizes,
            pipeline totals, campaign performance) and supports natural language queries such as:
          </p>
          <div style={{ background: "var(--grey-50)", borderRadius: 8, padding: 16 }}>
            {[
              "Which segment has the highest average LTV?",
              "How many at-risk customers do we have and what's their total LTV exposure?",
              "Which acquisition channel is performing best?",
              "What's the current pipeline value in the Demo Scheduled stage?",
              "Which campaign has the best conversion rate?",
            ].map(q => (
              <div key={q} style={{ display: "flex", gap: 8, marginBottom: 8, fontSize: 13, color: "var(--grey-700)" }}>
                <span style={{ color: "var(--accent)" }}>→</span> {q}
              </div>
            ))}
          </div>
        </Section>

        {/* Design Objectives */}
        <Section title="🎯 Design Objectives">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {[
              { icon: "🔗", title: "Unify fragmented data",      desc: "Consolidate CDP and CRM data into a single operational view" },
              { icon: "🤝", title: "Cross-functional alignment", desc: "Enable consistent customer understanding across marketing and sales" },
              { icon: "📐", title: "Segmentation-driven workflows", desc: "Support segmentation-based analysis and decision workflows" },
              { icon: "🧪", title: "Prototype evaluation",       desc: "Provide a controlled environment for evaluating integrated MarTech architectures" },
            ].map(r => (
              <div key={r.title} style={{ background: "var(--grey-50)", borderRadius: 8, padding: 16 }}>
                <div style={{ fontSize: 20, marginBottom: 6 }}>{r.icon}</div>
                <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 4, color: "var(--primary)" }}>{r.title}</div>
                <div style={{ fontSize: 12, color: "var(--grey-600)", lineHeight: 1.6 }}>{r.desc}</div>
              </div>
            ))}
          </div>
        </Section>

        {/* Experimental Extensions */}
        <Section title="🔮 Possible Extensions">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {[
              { title: "Churn Prediction",      desc: "ML model to identify customers at risk of churn based on behavioral signals" },
              { title: "Revenue Forecasting",   desc: "Pipeline-based revenue projections using historical deal velocity" },
              { title: "Lead Scoring",          desc: "Probabilistic lead conversion scoring integrating CDP engagement and CRM stage data" },
              { title: "RAG-based AI Layer",    desc: "Replace the demo LLM with a retrieval-augmented pipeline grounded in actual platform data" },
              { title: "Real-time Event Stream",desc: "WebSocket-based live CDP behavioral event stream" },
              { title: "Database Layer",        desc: "Replace synthetic data with PostgreSQL + SQLAlchemy for persistent storage" },
            ].map(r => (
              <div key={r.title} style={{ background: "var(--grey-50)", borderRadius: 8, padding: 16 }}>
                <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 4, color: "var(--primary)" }}>{r.title}</div>
                <div style={{ fontSize: 12, color: "var(--grey-600)", lineHeight: 1.6 }}>{r.desc}</div>
              </div>
            ))}
          </div>
        </Section>


        <div style={{ textAlign: "center", padding: "24px 0", fontSize: 12, color: "var(--grey-400)",
          borderTop: "1px solid var(--grey-200)", marginTop: 8 }}>
          MarTech — CDP–CRM Integration Prototype · FastAPI + React · June 2026
        </div>

      </div>
    </>
  );
}