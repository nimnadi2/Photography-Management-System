import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Mail, Phone, MapPin } from "lucide-react";
import client from "../api/client";
import StatusBadge from "../components/StatusBadge";

export default function ClientDetail() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    client.get(`/api/clients.php?id=${id}`).then((res) => setData(res.data.data)).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="text-muted">Loading…</div>;
  if (!data) return <div className="empty-state">Client not found.</div>;

  return (
    <div>
      <Link to="/clients" className="d-inline-flex align-items-center gap-1 mb-3 text-muted" style={{ fontSize: "0.86rem" }}>
        <ArrowLeft size={15} /> Back to clients
      </Link>

      <div className="row g-3">
        <div className="col-lg-4">
          <div className="card-lumen p-4">
            <div
              style={{
                width: 56, height: 56, borderRadius: "50%",
                background: "var(--ink)", color: "var(--gold)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: "var(--font-display)", fontSize: "1.4rem", fontWeight: 600, marginBottom: 14,
              }}
            >
              {data.name.charAt(0).toUpperCase()}
            </div>
            <h3 className="font-display mb-3">{data.name}</h3>

            <div className="d-flex align-items-center gap-2 mb-2" style={{ fontSize: "0.88rem" }}>
              <Mail size={15} color="#857f74" /> {data.email || "—"}
            </div>
            <div className="d-flex align-items-center gap-2 mb-2" style={{ fontSize: "0.88rem" }}>
              <Phone size={15} color="#857f74" /> {data.phone || "—"}
            </div>
            <div className="d-flex align-items-center gap-2 mb-3" style={{ fontSize: "0.88rem" }}>
              <MapPin size={15} color="#857f74" /> {data.address || "—"}
            </div>

            {data.notes && (
              <>
                <div className="eyebrow mb-1">Notes</div>
                <p style={{ fontSize: "0.88rem", color: "var(--text-muted)" }}>{data.notes}</p>
              </>
            )}
          </div>
        </div>

        <div className="col-lg-8">
          <div className="card-lumen">
            <div className="p-4 pb-0">
              <div className="eyebrow mb-1">History</div>
              <h3 className="font-display" style={{ fontSize: "1.15rem" }}>Bookings</h3>
            </div>
            <table className="table table-lumen m-0">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {data.bookings.length === 0 && (
                  <tr><td colSpan={4} className="empty-state">No bookings yet for this client.</td></tr>
                )}
                {data.bookings.map((b) => (
                  <tr key={b.id}>
                    <td>{b.title}</td>
                    <td className="font-mono" style={{ fontSize: "0.82rem" }}>{new Date(b.event_date).toLocaleDateString()}</td>
                    <td>Rs {Number(b.amount).toLocaleString()}</td>
                    <td><StatusBadge status={b.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}