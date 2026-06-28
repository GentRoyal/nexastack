import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Topbar from "../components/Topbar";
import Badge from "../components/Badge";
import Toast from "../components/Toast";
import { getCampaigns } from "../api";

export default function Campaigns() {
  const [campaigns, setCampaigns] = useState([]);
  const [toast, setToast]         = useState(null);
  const [filter, setFilter]       = useState("All");
  const location = useLocation();
  const activeSegment = location.state?.segment;

  useEffect(() => {
    getCampaigns().then(data => {
      setCampaigns(data);
      if (activeSegment) setFilter(activeSegment);
    });
  }, []);

  const statuses = ["All", "Active", "Paused"];

  const filtered = campaigns.filter(c =>
    filter === "All" || filter === "Active" || filter === "Paused"
      ? (filter === "All" || c.status === filter)
      : c.segment === filter
  );

  // Summary metrics
  const totalSent      = campaigns.reduce((a, c) => a + c.sent, 0);
  const totalConverted = campaigns.reduce((a, c) => a + c.converted, 0);
  const totalOpened    = campaigns.reduce((a, c) => a + c.opened, 0);
  const avgConv        = totalSent ? Math.round(totalConverted/totalSent*100) : 0;
  const avgOpen        = totalSent ? Math.round(totalOpened/totalSent*100) : 0;

  function handleLaunch(c) {
    setCampaigns(prev => prev.map(x => x.id === c.id ? { ...x, status:"Active" } : x));
    setToast({ msg:`✅ "${c.name}" is now Live`, type:"success" });
  }

  function handlePause(c) {
    setCampaigns(prev => prev.map(x => x.id === c.id ? { ...x, status:"Paused" } : x));
    setToast({ msg:`⏸ "${c.name}" paused`, type:"warning" });
  }

  if (!campaigns.length) return <><Topbar title="Campaigns" /><div className="loading">Loading…</div></>;

  return (
    <>
      <Topbar title="Campaigns" />
      <div className="content">

        {/* Summary Metrics */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:16, marginBottom:24 }}>
          {[
            { label:"Total Campaigns", value: campaigns.length,           sub:"across all segments" },
            { label:"Total Sent",      value: totalSent.toLocaleString(), sub:"cumulative sends"    },
            { label:"Avg Open Rate",   value: avgOpen+"%",                sub:"across campaigns"    },
            { label:"Avg Conv. Rate",  value: avgConv+"%",                sub:"sent → converted"    },
          ].map(s => (
            <div className="kpi-card" key={s.label}>
              <div className="kpi-label">{s.label}</div>
              <div className="kpi-value" style={{ fontSize:24 }}>{s.value}</div>
              <div className="kpi-sub">{s.sub}</div>
            </div>
          ))}
        </div>

        {/* Filter Tabs */}
        <div style={{ display:"flex", gap:8, marginBottom:20, borderBottom:"1px solid var(--grey-200)", paddingBottom:0 }}>
          {statuses.map(s => (
            <button key={s} onClick={() => setFilter(s)}
              style={{ padding:"8px 18px", border:"none", borderBottom: filter===s ? "2px solid var(--accent)" : "2px solid transparent",
                fontSize:13, fontWeight:600, cursor:"pointer", background:"transparent",
                color: filter===s ? "var(--accent)" : "var(--grey-600)",
                marginBottom:-1, transition:"all 0.15s" }}>
              {s}
              <span style={{ marginLeft:6, fontSize:11, padding:"1px 6px", borderRadius:20,
                background: filter===s ? "var(--accent-light)" : "var(--grey-100)",
                color: filter===s ? "var(--accent)" : "var(--grey-400)" }}>
                {s === "All" ? campaigns.length : campaigns.filter(c => c.status === s).length}
              </span>
            </button>
          ))}
        </div>

        {/* Campaign Cards */}
        {filtered.map(c => {
          const openRate = c.sent ? Math.round(c.opened/c.sent*100) : 0;
          const convRate = c.sent ? Math.round(c.converted/c.sent*100) : 0;
          const highlighted = activeSegment && c.segment === activeSegment;

          return (
            <div key={c.id} className="campaign-card"
              style={ highlighted ? { border:"2px solid var(--accent)", boxShadow:"0 0 0 4px var(--accent-light)" } : {} }>

              {/* Header */}
              <div className="campaign-header">
                <div>
                  <div className="campaign-name">{c.name}</div>
                  <div className="campaign-meta" style={{ marginTop:4 }}>
                    <span style={{ background:"var(--grey-100)", padding:"2px 8px", borderRadius:20, fontSize:11, marginRight:6 }}>
                      🎯 {c.segment}
                    </span>
                    <span style={{ background:"var(--grey-100)", padding:"2px 8px", borderRadius:20, fontSize:11, marginRight:6 }}>
                      ⚡ {c.trigger}
                    </span>
                    <span style={{ background:"var(--grey-100)", padding:"2px 8px", borderRadius:20, fontSize:11 }}>
                      📡 {c.channel}
                    </span>
                  </div>
                </div>
                <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:8 }}>
                  <Badge value={c.status} />
                  {c.status === "Paused"
                    ? <button onClick={() => handleLaunch(c)}
                        style={{ padding:"6px 14px", background:"var(--accent)", color:"#fff",
                          border:"none", borderRadius:6, fontSize:12, fontWeight:600, cursor:"pointer" }}>
                        ▶ Launch
                      </button>
                    : <button onClick={() => handlePause(c)}
                        style={{ padding:"6px 14px", background:"var(--grey-100)", color:"var(--grey-600)",
                          border:"none", borderRadius:6, fontSize:12, fontWeight:600, cursor:"pointer" }}>
                        ⏸ Pause
                      </button>
                  }
                </div>
              </div>

              {/* Stats + Funnel */}
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20, marginTop:4 }}>

                {/* Numbers */}
                <div className="campaign-stats">
                  <div className="c-stat">
                    <div className="num">{c.sent.toLocaleString()}</div>
                    <div className="lbl">Sent</div>
                  </div>
                  <div className="c-stat">
                    <div className="num">{c.opened.toLocaleString()}</div>
                    <div className="lbl">Opened ({openRate}%)</div>
                  </div>
                  <div className="c-stat">
                    <div className="num">{c.converted.toLocaleString()}</div>
                    <div className="lbl">Converted ({convRate}%)</div>
                  </div>
                </div>

                {/* Visual Funnel */}
                <div style={{ display:"flex", flexDirection:"column", justifyContent:"center", gap:8 }}>
                  {[
                    { label:"Sent",      val:100,      color:"var(--grey-200)" },
                    { label:`Opened ${openRate}%`, val:openRate, color:"var(--accent)"  },
                    { label:`Converted ${convRate}%`, val:convRate, color:"#16a34a"  },
                  ].map(f => (
                    <div key={f.label} style={{ display:"flex", alignItems:"center", gap:8 }}>
                      <div style={{ fontSize:11, color:"var(--grey-600)", width:90, textAlign:"right" }}>{f.label}</div>
                      <div style={{ flex:1, height:8, background:"var(--grey-100)", borderRadius:4, overflow:"hidden" }}>
                        <div style={{ height:"100%", width:`${f.val}%`, background:f.color, borderRadius:4, transition:"width 0.6s ease" }} />
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            </div>
          );
        })}
      </div>

      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </>
  );
}