import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Topbar from "../components/Topbar";
import Badge from "../components/Badge";
import { getPipeline } from "../api";

const STAGES = ["Prospect","Qualified","Demo Scheduled","Proposal Sent","Closed Won","Closed Lost"];
const STAGE_COLORS = {
  "Prospect":"#94a3b8","Qualified":"#3b82f6","Demo Scheduled":"#8b5cf6",
  "Proposal Sent":"#f59e0b","Closed Won":"#16a34a","Closed Lost":"#ef4444"
};
const PAGE_SIZE = 15;

export default function Pipeline() {
  const [allDeals, setAllDeals]   = useState([]);
  const [rep, setRep]             = useState("");
  const [stage, setStage]         = useState("");
  const [search, setSearch]       = useState("");
  const [view, setView]           = useState("table"); // "table" | "kanban"
  const [page, setPage]           = useState(1);
  const [sortKey, setSortKey]     = useState("value");
  const [sortDir, setSortDir]     = useState("desc");
  const navigate = useNavigate();

  useEffect(() => { getPipeline().then(setAllDeals); }, []);

  const reps = [...new Set(allDeals.map(d => d.owner))].sort();

  // Filter
  const filtered = allDeals
    .filter(d => !rep   || d.owner === rep)
    .filter(d => !stage || d.stage === stage)
    .filter(d => !search || d.company.toLowerCase().includes(search.toLowerCase()));

  // Sort
  const sorted = [...filtered].sort((a, b) => {
    const av = a[sortKey], bv = b[sortKey];
    if (typeof av === "number") return sortDir === "desc" ? bv - av : av - bv;
    return sortDir === "desc" ? bv?.localeCompare(av) : av?.localeCompare(bv);
  });

  // Paginate
  const totalPages = Math.ceil(sorted.length / PAGE_SIZE);
  const paginated  = sorted.slice((page-1)*PAGE_SIZE, page*PAGE_SIZE);

  // Stage summary
  const stageSummary = STAGES.map(s => ({
    stage: s,
    count: allDeals.filter(d => d.stage === s).length,
    value: allDeals.filter(d => d.stage === s).reduce((a, d) => a + d.value, 0),
  }));

  const totalVal = filtered.reduce((a, d) => a + d.value, 0);

  function toggleSort(key) {
    if (sortKey === key) setSortDir(d => d === "desc" ? "asc" : "desc");
    else { setSortKey(key); setSortDir("desc"); }
    setPage(1);
  }

  function SortIcon({ k }) {
    if (sortKey !== k) return <span style={{ color:"var(--grey-200)", marginLeft:4 }}>↕</span>;
    return <span style={{ color:"var(--accent)", marginLeft:4 }}>{sortDir === "desc" ? "↓" : "↑"}</span>;
  }

  if (!allDeals.length) return <><Topbar title="CRM Pipeline" /><div className="loading">Loading…</div></>;

  return (
    <>
      <Topbar title="CRM Pipeline" />
      <div className="content">

        {/* Stage Summary Cards */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(6,1fr)", gap:10, marginBottom:20 }}>
          {stageSummary.map(s => (
            <div key={s.stage}
              onClick={() => { setStage(stage === s.stage ? "" : s.stage); setPage(1); }}
              style={{
                background: stage === s.stage ? STAGE_COLORS[s.stage] : "#fff",
                border: `1px solid ${STAGE_COLORS[s.stage]}`,
                borderRadius: 8, padding:"10px 12px", cursor:"pointer", transition:"all 0.15s"
              }}>
              <div style={{ fontSize:11, fontWeight:700, color: stage === s.stage ? "#fff" : STAGE_COLORS[s.stage], marginBottom:4, textTransform:"uppercase", letterSpacing:"0.5px" }}>
                {s.stage}
              </div>
              <div style={{ fontSize:18, fontWeight:700, color: stage === s.stage ? "#fff" : "var(--grey-800)" }}>
                {s.count}
              </div>
              <div style={{ fontSize:11, color: stage === s.stage ? "rgba(255,255,255,0.8)" : "var(--grey-400)" }}>
                ${(s.value/1000).toFixed(0)}K
              </div>
            </div>
          ))}
        </div>

        {/* Filters + View Toggle */}
        <div style={{ display:"flex", gap:10, marginBottom:20, flexWrap:"wrap", alignItems:"center" }}>
          <input
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search company…"
            style={{ padding:"8px 12px", border:"1px solid var(--grey-200)", borderRadius:8, fontSize:13, outline:"none", width:200 }}
          />
          <select value={rep} onChange={e => { setRep(e.target.value); setPage(1); }}
            style={{ padding:"8px 12px", border:"1px solid var(--grey-200)", borderRadius:8, fontSize:13, background:"#fff", outline:"none" }}>
            <option value="">All Reps</option>
            {reps.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
          <select value={stage} onChange={e => { setStage(e.target.value); setPage(1); }}
            style={{ padding:"8px 12px", border:"1px solid var(--grey-200)", borderRadius:8, fontSize:13, background:"#fff", outline:"none" }}>
            <option value="">All Stages</option>
            {STAGES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>

          <span className="filter-pill">{filtered.length} deals · ${totalVal.toLocaleString()}</span>

          {/* View Toggle */}
          <div style={{ marginLeft:"auto", display:"flex", border:"1px solid var(--grey-200)", borderRadius:8, overflow:"hidden" }}>
            {["table","kanban"].map(v => (
              <button key={v} onClick={() => setView(v)}
                style={{ padding:"7px 14px", border:"none", fontSize:12, fontWeight:600, cursor:"pointer",
                  background: view === v ? "var(--accent)" : "#fff",
                  color: view === v ? "#fff" : "var(--grey-600)" }}>
                {v === "table" ? "⊞ Table" : "⋮⋮ Kanban"}
              </button>
            ))}
          </div>
        </div>

        {/* TABLE VIEW */}
        {view === "table" && (
          <>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th onClick={() => toggleSort("company")} style={{ cursor:"pointer" }}>Company <SortIcon k="company"/></th>
                    <th onClick={() => toggleSort("stage")}   style={{ cursor:"pointer" }}>Stage <SortIcon k="stage"/></th>
                    <th onClick={() => toggleSort("value")}   style={{ cursor:"pointer" }}>Value <SortIcon k="value"/></th>
                    <th onClick={() => toggleSort("lead_score")} style={{ cursor:"pointer" }}>Score <SortIcon k="lead_score"/></th>
                    <th>Owner</th>
                    <th onClick={() => toggleSort("close_date")} style={{ cursor:"pointer" }}>Close Date <SortIcon k="close_date"/></th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {paginated.map(d => (
                    <tr key={d.id}>
                      <td style={{ fontWeight:600 }}>{d.company}</td>
                      <td>
                        <span style={{ display:"inline-block", padding:"2px 8px", borderRadius:20, fontSize:11, fontWeight:600,
                          background: STAGE_COLORS[d.stage]+"22", color: STAGE_COLORS[d.stage] }}>
                          {d.stage}
                        </span>
                      </td>
                      <td style={{ fontWeight:600 }}>${d.value.toLocaleString()}</td>
                      <td>
                        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                          <div style={{ width:50, height:4, background:"var(--grey-200)", borderRadius:2, overflow:"hidden" }}>
                            <div style={{ height:"100%", width:`${d.lead_score}%`, background: STAGE_COLORS[d.stage] }} />
                          </div>
                          <span style={{ fontSize:12 }}>{d.lead_score}</span>
                        </div>
                      </td>
                      <td style={{ color:"var(--grey-600)" }}>{d.owner}</td>
                      <td style={{ color:"var(--grey-600)" }}>{d.close_date}</td>
                      <td>
                        <span style={{ color:"var(--accent)", fontSize:12, fontWeight:600, cursor:"pointer" }}
                          onClick={() => navigate(`/customers?id=${d.customer_id}`)}>
                          View →
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginTop:16, fontSize:13 }}>
              <span style={{ color:"var(--grey-600)" }}>
                Showing {((page-1)*PAGE_SIZE)+1}–{Math.min(page*PAGE_SIZE, sorted.length)} of {sorted.length}
              </span>
              <div style={{ display:"flex", gap:6 }}>
                <button onClick={() => setPage(p => Math.max(1,p-1))} disabled={page===1}
                  style={{ padding:"6px 12px", border:"1px solid var(--grey-200)", borderRadius:6, fontSize:12, fontWeight:600,
                    cursor: page===1 ? "default" : "pointer", background: page===1 ? "var(--grey-50)" : "#fff",
                    color: page===1 ? "var(--grey-400)" : "var(--grey-800)" }}>
                  ← Prev
                </button>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const p = Math.max(1, Math.min(page-2, totalPages-4)) + i;
                  return (
                    <button key={p} onClick={() => setPage(p)}
                      style={{ padding:"6px 12px", border:"1px solid var(--grey-200)", borderRadius:6, fontSize:12, fontWeight:600,
                        cursor:"pointer", background: page===p ? "var(--accent)" : "#fff",
                        color: page===p ? "#fff" : "var(--grey-800)" }}>
                      {p}
                    </button>
                  );
                })}
                <button onClick={() => setPage(p => Math.min(totalPages,p+1))} disabled={page===totalPages}
                  style={{ padding:"6px 12px", border:"1px solid var(--grey-200)", borderRadius:6, fontSize:12, fontWeight:600,
                    cursor: page===totalPages ? "default" : "pointer", background: page===totalPages ? "var(--grey-50)" : "#fff",
                    color: page===totalPages ? "var(--grey-400)" : "var(--grey-800)" }}>
                  Next →
                </button>
              </div>
            </div>
          </>
        )}

        {/* KANBAN VIEW — compact, top 5 per stage */}
        {view === "kanban" && (
          <div className="kanban">
            {STAGES.map(s => {
              const cols = filtered.filter(d => d.stage === s);
              const total = cols.reduce((a, d) => a + d.value, 0);
              const top5  = cols.slice(0, 5);
              return (
                <div className="kanban-col" key={s}>
                  <div className="kanban-col-title">
                    <span style={{ color: STAGE_COLORS[s] }}>{s}</span>
                    <span style={{ fontWeight:400, color:"var(--grey-400)" }}>{cols.length}</span>
                  </div>
                  <div style={{ fontSize:12, color:"var(--grey-600)", marginBottom:10, fontWeight:700 }}>
                    {total ? "$"+total.toLocaleString() : "—"}
                  </div>
                  {top5.map(d => (
                    <div className="kanban-card" key={d.id}
                      onClick={() => navigate(`/customers?id=${d.customer_id}`)}>
                      <div className="company">{d.company}</div>
                      <div className="value">${d.value.toLocaleString()}</div>
                      <div className="meta">{d.owner} · {d.close_date}</div>
                      <div className="score-bar">
                        <div className="score-fill" style={{ width:`${d.lead_score}%`, background: STAGE_COLORS[s] }} />
                      </div>
                    </div>
                  ))}
                  {cols.length > 5 && (
                    <div style={{ textAlign:"center", padding:"10px 0", fontSize:12, color:"var(--accent)", fontWeight:600, cursor:"pointer" }}
                      onClick={() => { setStage(s); setView("table"); }}>
                      +{cols.length - 5} more → View in table
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}