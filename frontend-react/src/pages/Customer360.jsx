import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Topbar from "../components/Topbar";
import Badge from "../components/Badge";
import { getCustomers, getCustomer } from "../api";

const PAGE_SIZE = 15;
const SEG_COLORS = {
  "Champion":"#f59e0b","High Intent":"#3b82f6","At Risk":"#ef4444","New User":"#22c55e"
};

export default function Customer360() {
  const [allCustomers, setAllCustomers] = useState([]);
  const [query, setQuery]       = useState("");
  const [segFilter, setSegFilter] = useState("");
  const [profile, setProfile]   = useState(null);
  const [page, setPage]         = useState(1);
  const [sortKey, setSortKey]   = useState("ltv");
  const [sortDir, setSortDir]   = useState("desc");
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    getCustomers().then(customers => {
      setAllCustomers(customers);
      const id = searchParams.get("id");
      if (id) loadProfile(id);
    });
  }, []);

  async function loadProfile(id) {
    const data = await getCustomer(id);
    setProfile(data);
    setSearchParams({ id });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function clearProfile() {
    setProfile(null);
    setSearchParams({});
  }

  function toggleSort(key) {
    if (sortKey === key) setSortDir(d => d === "desc" ? "asc" : "desc");
    else { setSortKey(key); setSortDir("desc"); }
    setPage(1);
  }

  function SortIcon({ k }) {
    if (sortKey !== k) return <span style={{ color:"var(--grey-300)", marginLeft:4 }}>↕</span>;
    return <span style={{ color:"var(--accent)", marginLeft:4 }}>{sortDir === "desc" ? "↓" : "↑"}</span>;
  }

  // Filter
  const filtered = allCustomers
    .filter(c => !segFilter || c.segment === segFilter)
    .filter(c => !query ||
      c.name.toLowerCase().includes(query.toLowerCase()) ||
      c.company.toLowerCase().includes(query.toLowerCase()) ||
      c.email.toLowerCase().includes(query.toLowerCase())
    );

  // Sort
  const sorted = [...filtered].sort((a, b) => {
    const av = a[sortKey], bv = b[sortKey];
    if (typeof av === "number") return sortDir === "desc" ? bv - av : av - bv;
    return sortDir === "desc" ? bv?.localeCompare(av) : av?.localeCompare(bv);
  });

  const totalPages = Math.ceil(sorted.length / PAGE_SIZE);
  const paginated  = sorted.slice((page-1)*PAGE_SIZE, page*PAGE_SIZE);

  const initials = name => name.split(" ").map(n => n[0]).join("").slice(0,2);

  const SEGMENTS = ["Champion","High Intent","At Risk","New User"];

  return (
    <>
      <Topbar title="Customer 360" />
      <div className="content">

        {/* Profile View */}
        {profile && (
          <div className="card" style={{ marginBottom:24 }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:16 }}>
              <div className="profile-header" style={{ marginBottom:0 }}>
                <div className="profile-avatar">{initials(profile.profile.name)}</div>
                <div>
                  <div className="profile-name">{profile.profile.name}</div>
                  <div className="profile-meta">{profile.profile.company} · {profile.profile.email}</div>
                  <div style={{ marginTop:6 }}><Badge value={profile.profile.segment} /></div>
                </div>
              </div>
              <button onClick={clearProfile}
                style={{ padding:"6px 14px", border:"1px solid var(--grey-200)", borderRadius:8,
                  fontSize:12, fontWeight:600, cursor:"pointer", background:"#fff", color:"var(--grey-600)" }}>
                ✕ Close
              </button>
            </div>

            <div className="profile-grid">
              {/* CDP Side */}
              <div>
                <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:14 }}>
                  <div style={{ width:8, height:8, borderRadius:"50%", background:"var(--accent)" }} />
                  <div className="card-title" style={{ marginBottom:0 }}>CDP — Behavioural Data</div>
                </div>
                {[
                  ["LTV",         profile.profile.ltv ? "$"+profile.profile.ltv.toLocaleString() : "—"],
                  ["Channel",     profile.profile.acquisition_channel],
                  ["Last Active", profile.profile.last_active],
                ].map(([label, val]) => (
                  <div className="info-row" key={label}>
                    <span className="label">{label}</span>
                    <span className="val">{val}</span>
                  </div>
                ))}
                <div style={{ marginTop:14 }}>
                  <div style={{ fontSize:11, color:"var(--grey-600)", marginBottom:8, fontWeight:600,
                    textTransform:"uppercase", letterSpacing:"0.5px" }}>Event History</div>
                  <div className="event-list">
                    {profile.profile.events.map((e, i) => (
                      <span className="event-tag" key={i}
                        style={{ background: i === profile.profile.events.length-1 ? "#dbeafe" : undefined,
                          color: i === profile.profile.events.length-1 ? "#1d4ed8" : undefined }}>
                        {e.replace(/_/g," ")}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* CRM Side */}
              <div>
                <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:14 }}>
                  <div style={{ width:8, height:8, borderRadius:"50%", background:"#16a34a" }} />
                  <div className="card-title" style={{ marginBottom:0 }}>CRM — Deal Data</div>
                </div>
                {profile.deal ? (
                  <>
                    {[
                      ["Stage",      profile.deal.stage],
                      ["Deal Value", "$"+profile.deal.value.toLocaleString()],
                      ["Owner",      profile.deal.owner],
                      ["Close Date", profile.deal.close_date],
                      ["Lead Score", profile.deal.lead_score+"/100"],
                    ].map(([label, val]) => (
                      <div className="info-row" key={label}>
                        <span className="label">{label}</span>
                        <span className="val">{val}</span>
                      </div>
                    ))}
                    <div className="score-bar" style={{ marginTop:12, height:6 }}>
                      <div className="score-fill" style={{ width:`${profile.deal.lead_score}%` }} />
                    </div>
                    <div style={{ fontSize:11, color:"var(--grey-400)", marginTop:4 }}>
                      Lead score: {profile.deal.lead_score}/100
                    </div>
                  </>
                ) : (
                  <div style={{ background:"var(--grey-50)", borderRadius:8, padding:20, textAlign:"center",
                    fontSize:13, color:"var(--grey-400)" }}>
                    No deal on record
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Segment Filter Pills */}
        <div style={{ display:"flex", gap:8, marginBottom:16, flexWrap:"wrap" }}>
          <button onClick={() => { setSegFilter(""); setPage(1); }}
            style={{ padding:"6px 14px", borderRadius:20, border:"1px solid var(--grey-200)", fontSize:12,
              fontWeight:600, cursor:"pointer", background: !segFilter ? "var(--primary)" : "#fff",
              color: !segFilter ? "#fff" : "var(--grey-600)" }}>
            All ({allCustomers.length})
          </button>
          {SEGMENTS.map(s => (
            <button key={s} onClick={() => { setSegFilter(segFilter === s ? "" : s); setPage(1); }}
              style={{ padding:"6px 14px", borderRadius:20, border:`1px solid ${SEG_COLORS[s]}`,
                fontSize:12, fontWeight:600, cursor:"pointer",
                background: segFilter === s ? SEG_COLORS[s] : "#fff",
                color: segFilter === s ? "#fff" : SEG_COLORS[s] }}>
              {s} ({allCustomers.filter(c => c.segment === s).length})
            </button>
          ))}
        </div>

        {/* Search + Count */}
        <div style={{ display:"flex", gap:10, marginBottom:16, alignItems:"center" }}>
          <input
            value={query}
            onChange={e => { setQuery(e.target.value); setPage(1); }}
            placeholder="Search by name, company or email…"
            style={{ flex:1, padding:"9px 14px", border:"1px solid var(--grey-200)",
              borderRadius:8, fontSize:13, outline:"none" }}
          />
          <span className="filter-pill">{filtered.length.toLocaleString()} customers</span>
        </div>

        {/* Table */}
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th onClick={() => toggleSort("name")} style={{ cursor:"pointer" }}>
                  Name <SortIcon k="name" />
                </th>
                <th onClick={() => toggleSort("company")} style={{ cursor:"pointer" }}>
                  Company <SortIcon k="company" />
                </th>
                <th>Email</th>
                <th onClick={() => toggleSort("segment")} style={{ cursor:"pointer" }}>
                  Segment <SortIcon k="segment" />
                </th>
                <th onClick={() => toggleSort("ltv")} style={{ cursor:"pointer" }}>
                  LTV <SortIcon k="ltv" />
                </th>
                <th onClick={() => toggleSort("last_active")} style={{ cursor:"pointer" }}>
                  Last Active <SortIcon k="last_active" />
                </th>
                <th onClick={() => toggleSort("acquisition_channel")} style={{ cursor:"pointer" }}>
                  Channel <SortIcon k="acquisition_channel" />
                </th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {paginated.map(c => (
                <tr key={c.id} style={{ cursor:"pointer" }} onClick={() => loadProfile(c.id)}>
                  <td>
                    <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                      <div style={{ width:30, height:30, borderRadius:"50%", background:"var(--primary)",
                        color:"#fff", display:"flex", alignItems:"center", justifyContent:"center",
                        fontSize:11, fontWeight:700, flexShrink:0 }}>
                        {initials(c.name)}
                      </div>
                      <span style={{ fontWeight:600 }}>{c.name}</span>
                    </div>
                  </td>
                  <td>{c.company}</td>
                  <td style={{ color:"var(--grey-600)", fontSize:12 }}>{c.email}</td>
                  <td><Badge value={c.segment} /></td>
                  <td style={{ fontWeight:600 }}>{c.ltv ? "$"+c.ltv.toLocaleString() : "—"}</td>
                  <td style={{ color:"var(--grey-600)" }}>{c.last_active}</td>
                  <td style={{ color:"var(--grey-600)" }}>{c.acquisition_channel}</td>
                  <td>
                    <span style={{ color:"var(--accent)", fontSize:12, fontWeight:600 }}>View →</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginTop:16, fontSize:13 }}>
          <span style={{ color:"var(--grey-600)" }}>
            Showing {((page-1)*PAGE_SIZE)+1}–{Math.min(page*PAGE_SIZE, sorted.length)} of {sorted.length.toLocaleString()}
          </span>
          <div style={{ display:"flex", gap:6 }}>
            <button onClick={() => setPage(p => Math.max(1,p-1))} disabled={page===1}
              style={{ padding:"6px 12px", border:"1px solid var(--grey-200)", borderRadius:6,
                fontSize:12, fontWeight:600, cursor: page===1 ? "default":"pointer",
                background: page===1 ? "var(--grey-50)":"#fff",
                color: page===1 ? "var(--grey-400)":"var(--grey-800)" }}>
              ← Prev
            </button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const p = Math.max(1, Math.min(page-2, totalPages-4)) + i;
              return (
                <button key={p} onClick={() => setPage(p)}
                  style={{ padding:"6px 12px", border:"1px solid var(--grey-200)", borderRadius:6,
                    fontSize:12, fontWeight:600, cursor:"pointer",
                    background: page===p ? "var(--accent)":"#fff",
                    color: page===p ? "#fff":"var(--grey-800)" }}>
                  {p}
                </button>
              );
            })}
            <button onClick={() => setPage(p => Math.min(totalPages,p+1))} disabled={page===totalPages}
              style={{ padding:"6px 12px", border:"1px solid var(--grey-200)", borderRadius:6,
                fontSize:12, fontWeight:600, cursor: page===totalPages ? "default":"pointer",
                background: page===totalPages ? "var(--grey-50)":"#fff",
                color: page===totalPages ? "var(--grey-400)":"var(--grey-800)" }}>
              Next →
            </button>
          </div>
        </div>

      </div>
    </>
  );
}