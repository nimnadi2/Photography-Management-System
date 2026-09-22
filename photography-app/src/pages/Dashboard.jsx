import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
} from "recharts";
import { Users, CalendarClock, Wallet, Images } from "lucide-react";
import client from "../api/client";
import StatCard from "../components/StatCard";
import StatusBadge from "../components/StatusBadge";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    client
      .get("/api/dashboard.php")
      .then((res) => setStats(res.data.data))
      .catch(() => setError("Could not load dashboard data. Is the PHP backend running?"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-muted">Loading dashboard…</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  const chartData = stats.revenue_last_6_months.map((r) => ({
    month: r.month,
    revenue: Number(r.total),
  }));

  return (
    <div>
      <div className="row g-3 mb-4">
        <div className="col-6 col-lg-3">
          <StatCard label="Total clients" value={stats.total_clients} icon={Users} tone="indigo" link="/clients" />
        </div>
        <div className="col-6 col-lg-3">
          <StatCard label="Upcoming shoots" value={stats.upcoming_bookings} icon={CalendarClock} tone="amber" link="/bookings" />
        </div>
        <div className="col-6 col-lg-3">
          <StatCard label="Revenue collected" value={`Rs ${Number(stats.total_revenue).toLocaleString()}`} icon={Wallet} tone="teal" link="/invoices" />
        </div>
        <div className="col-6 col-lg-3">
          <StatCard label="Photos delivered" value={stats.total_photos} icon={Images} tone="rose" link="/galleries" />
        </div>
      </div>

      <div className="row g-3">
        <div className="col-lg-8">
          <div className="card-lumen p-4 mb-3">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div>
                <div className="eyebrow">Revenue</div>
                <h3 className="font-display m-0" style={{ fontSize: "1.2rem" }}>Last 6 months (paid invoices)</h3>
              </div>
            </div>
            {chartData.length === 0 ? (
              <div className="empty-state">No paid invoices yet this period.</div>
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="goldFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#c8a250" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#c8a250" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e9e7e1" />
                  <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#6b6b6b" }} />
                  <YAxis tick={{ fontSize: 12, fill: "#6b6b6b" }} />
                  <Tooltip formatter={(v) => `Rs ${Number(v).toLocaleString()}`} />
                  <Area type="monotone" dataKey="revenue" stroke="#a8842f" strokeWidth={2} fill="url(#goldFill)" dot={{ r: 4, fill: "#a8842f" }} />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>

          <div className="card-lumen p-4">
            <div className="eyebrow mb-1">Pipeline</div>
            <h3 className="font-display m-0 mb-3" style={{ fontSize: "1.2rem" }}>Bookings by status</h3>
            <div className="d-flex flex-wrap gap-3">
              {stats.bookings_by_status.map((s) => (
                <Link
                  to={`/bookings?status=${s.status}`}
                  key={s.status}
                  className="d-flex align-items-center gap-2"
                  style={{ color: "inherit" }}
                >
                  <StatusBadge status={s.status} />
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.85rem" }}>{s.total}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card-lumen p-4 mb-3">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h3 className="font-display m-0" style={{ fontSize: "1.1rem" }}>Upcoming shoots</h3>
              <Link to="/bookings" style={{ fontSize: "0.82rem" }}>View all</Link>
            </div>
            {stats.upcoming.length === 0 && <div className="text-muted" style={{ fontSize: "0.88rem" }}>Nothing scheduled.</div>}
            {stats.upcoming.map((b) => (
              <Link
                to="/bookings"
                key={b.id}
                className="d-flex justify-content-between align-items-start py-2"
                style={{ borderBottom: "1px solid var(--border)", color: "inherit" }}
              >
                <div>
                  <div style={{ fontWeight: 500, fontSize: "0.9rem" }}>{b.title}</div>
                  <div className="text-muted" style={{ fontSize: "0.78rem" }}>{b.client_name}</div>
                </div>
                <div className="text-end">
                  <div className="font-mono" style={{ fontSize: "0.76rem" }}>
                    {new Date(b.event_date).toLocaleDateString()}
                  </div>
                  <StatusBadge status={b.status} />
                </div>
              </Link>
            ))}
          </div>

          <div className="card-lumen p-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h3 className="font-display m-0" style={{ fontSize: "1.1rem" }}>Recent invoices</h3>
              <Link to="/invoices" style={{ fontSize: "0.82rem" }}>View all</Link>
            </div>
            {stats.recent_invoices.map((inv) => (
              <Link
                to="/invoices"
                key={inv.id}
                className="d-flex justify-content-between align-items-start py-2"
                style={{ borderBottom: "1px solid var(--border)", color: "inherit" }}
              >
                <div>
                  <div className="font-mono" style={{ fontSize: "0.82rem" }}>{inv.invoice_number}</div>
                  <div className="text-muted" style={{ fontSize: "0.78rem" }}>{inv.client_name}</div>
                </div>
                <div className="text-end">
                  <div style={{ fontSize: "0.85rem" }}>Rs {Number(inv.amount).toLocaleString()}</div>
                  <StatusBadge status={inv.status} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}