import { Link } from "react-router-dom";

export default function StatCard({ label, value, icon: Icon, suffix, tone = "indigo", link }) {
  const content = (
    <div className="stat-card">
      {Icon && (
        <div className={`stat-icon-wrap tone-${tone}`}>
          <Icon size={20} strokeWidth={1.8} color="var(--gold)" />
        </div>
      )}
      <div className="stat-label">{label}</div>
      <div className="stat-value">
        {value}
        {suffix && <span style={{ fontSize: "1rem", color: "var(--text-muted)" }}> {suffix}</span>}
      </div>
    </div>
  );

  if (link) {
    return (
      <Link to={link} style={{ textDecoration: "none", display: "block" }}>
        {content}
      </Link>
    );
  }
  return content;
}