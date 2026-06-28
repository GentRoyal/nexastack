const COLORS = ["#3b82f6","#8b5cf6","#f59e0b","#16a34a","#ef4444","#06b6d4","#ec4899","#84cc16"];

export default function HBar({ data, formatter }) {
  const max = Math.max(...data.map(d => d.value), 1);
  return (
    <div>
      {data.map((d, i) => (
        <div key={d.label} style={{ marginBottom: 14 }}>
          <div style={{ display:"flex", justifyContent:"space-between", marginBottom: 5, fontSize: 13 }}>
            <span style={{ fontWeight: 500 }}>{d.label}</span>
            <span style={{ fontWeight: 700 }}>{formatter(d.value)}</span>
          </div>
          <div style={{ height: 8, background:"var(--grey-100)", borderRadius: 4, overflow:"hidden" }}>
            <div style={{ height:"100%", width:`${(d.value/max)*100}%`, background: COLORS[i % COLORS.length], borderRadius: 4, transition:"width 0.6s ease" }} />
          </div>
          {d.sub && <div style={{ fontSize: 11, color:"var(--grey-400)", marginTop: 3 }}>{d.sub}</div>}
        </div>
      ))}
    </div>
  );
}