export default function Topbar({ title }) {
  return (
    <div className="topbar">
      <h2>{title}</h2>
      <div className="topbar-right">
        <span className="badge-live">● Live</span>
        <div className="avatar">NS</div>
      </div>
    </div>
  );
}