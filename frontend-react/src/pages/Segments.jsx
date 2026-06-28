import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Topbar from "../components/Topbar";
import { getSegments } from "../api";

const COLORS = { "Champions":"#f59e0b","High Intent":"#3b82f6","At Risk":"#ef4444","New Users":"#22c55e" };

export default function Segments() {
  const [segments, setSegments] = useState([]);
  const navigate = useNavigate();

  useEffect(() => { getSegments().then(setSegments); }, []);

  if (!segments.length) return <><Topbar title="CDP Segments" /><div className="loading">Loading…</div></>;

  return (
    <>
      <Topbar title="CDP Segments" />
      <div className="content">
        <div className="segment-grid">
          {segments.map(s => (
            <div className="segment-card" key={s.id}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:4 }}>
                <div className="seg-name">{s.name}</div>
                <div style={{ width:12, height:12, borderRadius:"50%", background: COLORS[s.name]||"#94a3b8" }} />
              </div>
              <div className="seg-desc">{s.description}</div>
              <div className="seg-stat"><span>Customers</span><span>{s.count.toLocaleString()}</span></div>
              <div className="seg-stat"><span>Avg. LTV</span><span>{s.avg_ltv ? "$"+s.avg_ltv.toLocaleString() : "—"}</span></div>
              <div className="seg-action"
                onClick={() => navigate("/campaigns", { state: { segment: s.name } })}>
                💡 {s.recommended_action} →
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}