import { LogOut, Menu } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Topbar({ eyebrow, title, onMenuClick }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <header className="topbar">
      <div className="d-flex align-items-center gap-3">
        <button
          className="btn btn-sm d-md-none border-0"
          onClick={onMenuClick}
          aria-label="Open menu"
        >
          <Menu size={20} />
        </button>
        <div>
          {eyebrow && <div className="page-eyebrow">{eyebrow}</div>}
          <div className="page-title">{title}</div>
        </div>
      </div>

      <div className="d-flex align-items-center gap-3">
        <div className="text-end d-none d-sm-block">
          <div style={{ fontSize: "0.88rem", fontWeight: 500 }}>{user?.name}</div>
          <div style={{ fontSize: "0.74rem", color: "var(--text-muted)" }}>{user?.role}</div>
        </div>
        <div
          style={{
            width: 38, height: 38, borderRadius: "50%",
            background: "var(--ink)", color: "var(--gold)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "var(--font-display)", fontWeight: 600,
          }}
        >
          {user?.name?.charAt(0)?.toUpperCase() || "U"}
        </div>
        <button className="btn btn-sm btn-outline-lumen" onClick={handleLogout} title="Log out">
          <LogOut size={16} />
        </button>
      </div>
    </header>
  );
}