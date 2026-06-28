import { NavLink } from "react-router-dom";

const links = [
  { to: "/",          icon: "📊", label: "Dashboard"   },
  { to: "/segments",  icon: "🎯", label: "CDP Segments" },
  { to: "/pipeline",  icon: "💼", label: "CRM Pipeline" },
  { to: "/customers", icon: "👤", label: "Customer 360" },
  { to: "/campaigns", icon: "📣", label: "Campaigns"    },
  { to: "/analytics", icon: "📈", label: "Analytics"    },
  { to: "/readme", icon: "📖", label: "README" },
  
];

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <h1>MarTech</h1>
        <span>MarTech Platform</span>
      </div>
      <nav>
        {links.map(l => (
          <NavLink
            key={l.to}
            to={l.to}
            end={l.to === "/"}
            className={({ isActive }) => isActive ? "active" : ""}
          >
            <span className="icon">{l.icon}</span> {l.label}
          </NavLink>
        ))}
      </nav>
      <div className="sidebar-footer">MarTech v1.0 MVP</div>
    </aside>
  );
}