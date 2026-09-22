import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Images } from "lucide-react";
import client, { UPLOADS_BASE_URL } from "../api/client";
import Modal from "../components/Modal";

const emptyForm = { booking_id: "", title: "", is_public: false };

export default function Galleries() {
  const [galleries, setGalleries] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const load = () => {
    setLoading(true);
    client.get("/api/galleries.php").then((res) => setGalleries(res.data.data)).finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
    client.get("/api/bookings.php").then((res) => setBookings(res.data.data));
  }, []);

  const openAdd = () => {
    setForm(emptyForm);
    setError("");
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      await client.post("/api/galleries.php", form);
      setShowModal(false);
      load();
    } catch (err) {
      setError(err.response?.data?.message || "Could not create gallery");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-end mb-3">
        <button className="btn btn-gold d-flex align-items-center gap-2" onClick={openAdd}>
          <Plus size={16} /> New gallery
        </button>
      </div>

      {loading ? (
        <div className="text-muted">Loading…</div>
      ) : galleries.length === 0 ? (
        <div className="empty-state">No galleries yet. Create one for a completed booking.</div>
      ) : (
        <div className="row g-3">
          {galleries.map((g) => (
            <div className="col-md-6 col-lg-4" key={g.id}>
              <Link to={`/galleries/${g.id}`} className="card-lumen d-block text-decoration-none overflow-hidden h-100">
                <div style={{ aspectRatio: "4/3", background: "var(--paper-dim)", position: "relative" }}>
                  {g.cover_photo ? (
                    <img
                      src={`${UPLOADS_BASE_URL}/${g.cover_photo}`}
                      alt={g.title}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  ) : (
                    <div className="d-flex align-items-center justify-content-center h-100 text-muted">
                      <Images size={32} strokeWidth={1.3} />
                    </div>
                  )}
                  <span className="badge-status" style={{ position: "absolute", top: 10, left: 10, background: "rgba(20,22,26,0.75)", color: "#fff" }}>
                    {g.photo_count} photos
                  </span>
                </div>
                <div className="p-3">
                  <div style={{ fontWeight: 500, color: "var(--ink)" }}>{g.title}</div>
                  <div className="text-muted" style={{ fontSize: "0.8rem" }}>{g.client_name} · {g.booking_title}</div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}

      <Modal show={showModal} title="New gallery" onClose={() => setShowModal(false)}>
        <form onSubmit={handleSave}>
          {error && <div className="alert alert-danger py-2" style={{ fontSize: "0.86rem" }}>{error}</div>}
          <div className="mb-3">
            <label className="form-label" style={{ fontSize: "0.85rem" }}>Booking</label>
            <select className="form-select form-select-lumen" value={form.booking_id} onChange={(e) => setForm({ ...form, booking_id: e.target.value })} required>
              <option value="">Select booking…</option>
              {bookings.map((b) => <option key={b.id} value={b.id}>{b.title} — {b.client_name}</option>)}
            </select>
          </div>
          <div className="mb-3">
            <label className="form-label" style={{ fontSize: "0.85rem" }}>Gallery title</label>
            <input className="form-control form-control-lumen" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          </div>
          <div className="form-check mb-4">
            <input type="checkbox" className="form-check-input" id="isPublic" checked={form.is_public} onChange={(e) => setForm({ ...form, is_public: e.target.checked })} />
            <label className="form-check-label" htmlFor="isPublic" style={{ fontSize: "0.86rem" }}>Make shareable with client</label>
          </div>
          <button type="submit" className="btn btn-gold w-100" disabled={saving}>
            {saving ? "Creating…" : "Create gallery"}
          </button>
        </form>
      </Modal>
    </div>
  );
}