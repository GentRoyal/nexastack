import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Topbar from "../components/Topbar";
import Badge from "../components/Badge";
import { getDashboard, getInsights } from "../api";

const fmt = n => {
  if (n >= 1000000) return "$" + (n/1000000).toFixed(1) + "M";
  if (n >= 1000)    return "$" + (n/1000).toFixed(0) + "K";
  return "$" + n;
};

const STAGE_COLORS = {
  "Prospect":"#94a3b8","Qualified":"#3b82f6",
  "Demo Scheduled":"#8b5cf6","Proposal Sent":"#f59e0b","Closed Won":"#16a34a"
};
const SEG_COLORS = {
  "Champion":"#f59e0b","High Intent":"#3b82f6","At Risk":"#ef4444","New User":"#22c55e"
};

function SectionTitle({ title, sub }) {
  return (
    <div style={{ marginBottom:16 }}>
      <div style={{ fontSize:15, fontWeight:700, color:"var(--grey-800)" }}>{title}</div>
      {sub && <div style={{ fontSize:12, color:"var(--grey-400)", marginTop:2 }}>{sub}</div>}
    </div>
  );
}

export default function Dashboard() {
  const [data, setData]         = useState(null);
  const [insights, setInsights] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    getDashboard().then(setData);
    getInsights().then(setInsights);
  }, []);

  if (!data || !insights) return <><Topbar title="Dashboard" /><div className="loading">Loading…</div></>;

  const segTotal   = data.segment_breakdown.reduce((a, s) => a + s.count, 0);
  const maxPipeline = Math.max(...data.pipeline_by_stage.map(s => s.value), 1);
  const maxChannel  = Math.max(...insights.channel_perf.map(c => c.avg_ltv), 1);
  const maxRep      = Math.max(...insights.leaderboard.map(r => r.value), 1);
  const initials    = name => name.split(" ").map(n => n[0]).join("").slice(0,2);

  return (
    <>
      <Topbar title="Dashboard" />
      <div className="content">

        {/* Alert Banner */}
        {data.at_risk_accounts > 0 && (
          <div className="alert-banner">
            <div style={{ display:"flex", alignItems:"center", gap:12 }}>
              <span style={{ fontSize:20 }}>⚠️</span>
              <div>
                <div style={{ fontSize:14, fontWeight:700, color:"#991b1b" }}>
                  {data.at_risk_accounts.toLocaleString()} at-risk accounts detected
                </div>
                <div style={{ fontSize:12, color:"#b91c1c", marginTop:2 }}>
                  These customers have been inactive 30+ days and are at churn risk
                </div>
              </div>
            </div>
            <span className="alert-btn" style={{ cursor:"pointer" }}
              onClick={() => navigate("/campaigns", { state:{ segment:"At Risk" } })}>
              Trigger Win-Back →
            </span>
          </div>
        )}

        {/* KPIs */}
        <div className="kpi-grid">
          {[
            { label:"Total Customers",  value:data.total_customers.toLocaleString(), sub:"↑ All segments",   cls:"up"   },
            { label:"Active Pipeline",  value:fmt(data.active_pipeline_value),       sub:"↑ Open deals",     cls:"up"   },
            { label:"Closed Revenue",   value:fmt(data.closed_revenue),              sub:"↑ Closed Won",     cls:"up"   },
            { label:"At-Risk Accounts", value:data.at_risk_accounts.toLocaleString(),sub:"↓ Needs attention",cls:"down" },
          ].map(k => (
            <div className="kpi-card" key={k.label}>
              <div className="kpi-label">{k.label}</div>
              <div className="kpi-value">{k.value}</div>
              <div className={`kpi-sub ${k.cls}`}>{k.sub}</div>
            </div>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid-2" style={{ marginBottom:20 }}>
          <div className="card">
            <div className="card-title">Pipeline by Stage</div>
            <div style={{ display:"flex", alignItems:"flex-end", gap:6, height:160, padding:"0 4px" }}>
              {data.pipeline_by_stage.map(s => (
                <div key={s.stage} style={{ flex:1, display:"flex", flexDirection:"column",
                  alignItems:"center", gap:4, height:"100%", justifyContent:"flex-end" }}>
                  <div style={{ fontSize:11, fontWeight:700 }}>{fmt(s.value)}</div>
                  <div style={{ width:"100%", borderRadius:"6px 6px 0 0",
                    background:STAGE_COLORS[s.stage]||"#3b82f6",
                    height:Math.max(10,(s.value/maxPipeline)*120), transition:"height 0.4s ease" }} />
                  <div style={{ fontSize:10, color:"var(--grey-600)", textAlign:"center", lineHeight:1.3 }}>
                    {s.stage.replace(" ","\n")}
                  </div>
                </div>
              ))}
            </div>
            <div style={{ display:"flex", flexWrap:"wrap", gap:10, marginTop:16 }}>
              {data.pipeline_by_stage.map(s => (
                <div key={s.stage} style={{ display:"flex", alignItems:"center", gap:5, fontSize:11, color:"var(--grey-600)" }}>
                  <div style={{ width:8, height:8, borderRadius:2, background:STAGE_COLORS[s.stage]||"#3b82f6" }} />
                  {s.stage}
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <div className="card-title">Segment Breakdown</div>
            {data.segment_breakdown.map(s => (
              <div key={s.name} style={{ marginBottom:16 }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:6 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                    <div style={{ width:10, height:10, borderRadius:"50%", background:SEG_COLORS[s.name]||"#94a3b8" }} />
                    <span style={{ fontSize:13, fontWeight:600 }}>{s.name}</span>
                  </div>
                  <span style={{ fontSize:12, fontWeight:700, color:"var(--grey-600)" }}>
                    {s.count.toLocaleString()} <span style={{ fontWeight:400, color:"var(--grey-400)" }}>
                      ({segTotal ? Math.round(s.count/segTotal*100) : 0}%)
                    </span>
                  </span>
                </div>
                <div style={{ height:8, background:"var(--grey-100)", borderRadius:4, overflow:"hidden" }}>
                  <div style={{ height:"100%", width:`${segTotal?(s.count/segTotal*100):0}%`,
                    background:SEG_COLORS[s.name]||"#94a3b8", borderRadius:4, transition:"width 0.6s ease" }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Insights Row 1 — Top Customers + Worst At Risk */}
        <div className="grid-2" style={{ marginBottom:20 }}>

          {/* Top Customers by LTV */}
          <div className="card">
            <SectionTitle title="🏆 Top Customers by LTV" sub="Highest lifetime value accounts" />
            {insights.top_customers.map((c, i) => (
              <div key={c.id}
                onClick={() => navigate(`/customers?id=${c.id}`)}
                style={{ display:"flex", alignItems:"center", gap:12, padding:"10px 0",
                  borderBottom: i < 4 ? "1px solid var(--grey-100)" : "none", cursor:"pointer" }}>
                <div style={{ width:24, height:24, borderRadius:"50%", background:i===0?"#f59e0b":i===1?"#94a3b8":i===2?"#cd7f32":"var(--grey-200)",
                  color: i < 3 ? "#fff" : "var(--grey-600)", display:"flex", alignItems:"center",
                  justifyContent:"center", fontSize:11, fontWeight:700, flexShrink:0 }}>
                  {i+1}
                </div>
                <div style={{ width:32, height:32, borderRadius:"50%", background:"var(--primary)",
                  color:"#fff", display:"flex", alignItems:"center", justifyContent:"center",
                  fontSize:12, fontWeight:700, flexShrink:0 }}>
                  {initials(c.name)}
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:13, fontWeight:600, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>
                    {c.name}
                  </div>
                  <div style={{ fontSize:11, color:"var(--grey-400)" }}>{c.company}</div>
                </div>
                <div style={{ textAlign:"right", flexShrink:0 }}>
                  <div style={{ fontSize:13, fontWeight:700, color:"var(--success)" }}>
                    ${c.ltv.toLocaleString()}
                  </div>
                  <Badge value={c.segment} />
                </div>
              </div>
            ))}
          </div>

          {/* Worst At-Risk */}
          <div className="card">
            <SectionTitle title="🚨 High-Value At-Risk Accounts" sub="Highest LTV customers going inactive" />
            {insights.worst_at_risk.map((c, i) => (
              <div key={c.id}
                onClick={() => navigate(`/customers?id=${c.id}`)}
                style={{ display:"flex", alignItems:"center", gap:12, padding:"10px 0",
                  borderBottom: i < 4 ? "1px solid var(--grey-100)" : "none", cursor:"pointer" }}>
                <div style={{ width:32, height:32, borderRadius:"50%", background:"#fee2e2",
                  color:"#991b1b", display:"flex", alignItems:"center",
                  justifyContent:"center", fontSize:12, fontWeight:700, flexShrink:0 }}>
                  {initials(c.name)}
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:13, fontWeight:600, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>
                    {c.name}
                  </div>
                  <div style={{ fontSize:11, color:"var(--grey-400)" }}>
                    Last active: {c.last_active}
                  </div>
                </div>
                <div style={{ textAlign:"right", flexShrink:0 }}>
                  <div style={{ fontSize:13, fontWeight:700, color:"#dc2626" }}>
                    ${c.ltv.toLocaleString()}
                  </div>
                  <div style={{ fontSize:11, color:"var(--grey-400)" }}>{c.company}</div>
                </div>
              </div>
            ))}
            <div style={{ marginTop:14 }}>
              <button onClick={() => navigate("/campaigns", { state:{ segment:"At Risk" } })}
                style={{ width:"100%", padding:"8px", background:"#fee2e2", color:"#dc2626",
                  border:"none", borderRadius:6, fontSize:12, fontWeight:600, cursor:"pointer" }}>
                ⚡ Trigger Win-Back Campaign →
              </button>
            </div>
          </div>
        </div>

        {/* Insights Row 2 — Channel Performance + Rep Leaderboard */}
        <div className="grid-2">

          {/* Channel Performance */}
          <div className="card">
            <SectionTitle title="📡 Channel Performance" sub="Average customer LTV by acquisition source" />
            {insights.channel_perf.slice(0,6).map((c, i) => (
              <div key={c.channel} style={{ marginBottom:14 }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5, fontSize:13 }}>
                  <span style={{ fontWeight:500 }}>{c.channel}</span>
                  <div style={{ display:"flex", gap:12 }}>
                    <span style={{ color:"var(--grey-400)", fontSize:11 }}>{c.count} customers</span>
                    <span style={{ fontWeight:700 }}>${c.avg_ltv.toLocaleString()}</span>
                  </div>
                </div>
                <div style={{ height:6, background:"var(--grey-100)", borderRadius:3, overflow:"hidden" }}>
                  <div style={{ height:"100%", width:`${(c.avg_ltv/maxChannel)*100}%`,
                    background:`hsl(${210 - i*20},70%,50%)`, borderRadius:3, transition:"width 0.6s ease" }} />
                </div>
              </div>
            ))}
          </div>

          {/* Sales Rep Leaderboard */}
          <div className="card">
            <SectionTitle title="🥇 Sales Rep Leaderboard" sub="Closed Won revenue by rep" />
            {insights.leaderboard.map((r, i) => (
              <div key={r.rep} style={{ display:"flex", alignItems:"center", gap:12, padding:"10px 0",
                borderBottom: i < insights.leaderboard.length-1 ? "1px solid var(--grey-100)" : "none" }}>
                <div style={{ width:28, height:28, borderRadius:"50%",
                  background: i===0?"#f59e0b":i===1?"#94a3b8":i===2?"#cd7f32":"var(--grey-100)",
                  color: i<3?"#fff":"var(--grey-600)", display:"flex", alignItems:"center",
                  justifyContent:"center", fontSize:12, fontWeight:700, flexShrink:0 }}>
                  {i+1}
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:13, fontWeight:600, marginBottom:4 }}>{r.rep}</div>
                  <div style={{ height:4, background:"var(--grey-100)", borderRadius:2, overflow:"hidden" }}>
                    <div style={{ height:"100%", width:`${(r.value/maxRep)*100}%`,
                      background: i===0?"#f59e0b":i===1?"#94a3b8":i===2?"#cd7f32":"var(--accent)",
                      borderRadius:2, transition:"width 0.6s ease" }} />
                  </div>
                </div>
                <div style={{ textAlign:"right", flexShrink:0 }}>
                  <div style={{ fontSize:13, fontWeight:700 }}>{fmt(r.value)}</div>
                  <div style={{ fontSize:11, color:"var(--grey-400)" }}>{r.deals} deals</div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </>
  );
}