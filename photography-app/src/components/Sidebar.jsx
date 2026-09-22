import { NavLink } from "react-router-dom";
import {
  LayoutGrid,
  Users,
  CalendarDays,
  Package,
  Images,
  Receipt,
} from "lucide-react";

const navItems = [
  { to: "/dashboard", label: "Dashboard", frame: "F01", icon: LayoutGrid },
  { to: "/clients", label: "Clients", frame: "F02", icon: Users },
  { to: "/bookings", label: "Bookings", frame: "F03", icon: CalendarDays },
  { to: "/packages", label: "Packages", frame: "F04", icon: Package },
  { to: "/galleries", label: "Galleries", frame: "F05", icon: Images },
  { to: "/invoices", label: "Invoices", frame: "F06", icon: Receipt },
];

export default function Sidebar({ className = "" }) {
  return (
    <aside className={`sidebar ${className}`}>
      <div className="sidebar-brand">
        <div className="mark">L</div>
        <div>
          <div className="name">Lumen Studio</div>
          <div className="tag">Photography CMS</div>
        </div>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            <span className="frame-no">{item.frame}</span>
            <item.icon size={17} strokeWidth={1.8} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        Every session, one frame at a time.
      </div>
    </aside>
  );
}