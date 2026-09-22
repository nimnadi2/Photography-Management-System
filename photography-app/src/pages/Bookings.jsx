import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Plus, Pencil, Trash2 } from "lucide-react";
import client from "../api/client";
import Modal from "../components/Modal";
import StatusBadge from "../components/StatusBadge";

const emptyForm = {
  client_id: "", package_id: "", title: "", shoot_type: "",
  event_date: "", location: "", status: "pending", amount: "", notes: "",
};

function toDatetimeLocal(value) {
  if (!value) return "";
  const d = new Date(value.replace(" ", "T"));
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default function Bookings() {
  const [searchParams] = useSearchParams();
  const initialStatus = searchParams.get("status") || "";

  const [bookings, setBookings] = useState([]);
  const [clients, setClients] = useState([]);
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState(initialStatus);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const load = (status = "") => {
    setLoading(true);
    client.get("/api/bookings.php", { params: status ? { status } : {} })
      .then((res) => setBookings(res.data.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load(initialStatus);
    client.get("/api/clients.php").then((res) => setClients(res.data.data));
    client.get("/api/packages.php").then((res) => setPackages(res.data.data));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFilter = (status) => {
    setStatusFilter(status);
    load(status);
  };

  const openAdd = () => {
    setEditingId(null);
    setForm(emptyForm);
    setError("");
    setShowModal(true);
  };

  const openEdit = (b) => {
    setEditingId(b.id);
    setForm({
      client_id: b.client_id, package_id: b.package_id || "", title: b.title,
      shoot_type: b.shoot_type || "", event_date: toDatetimeLocal(b.event_date),
      location: b.location || "", status: b.status, amount: b.amount, notes: b.notes || "",
    });
    setError("");
    setShowModal(true);
  };

  const applyPackage = (packageId) => {
    const pkg = packages.find((p) => String(p.id) === String(packageId));
    setForm((f) => ({ ...f, package_id: packageId, amount: pkg ? pkg.price : f.amount }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const payload = { ...form, event_date: form.event_date.replace("T", " ") + ":00" };
      if (editingId) {
        await client.put(`/api/bookings.php?id=${editingId}`, payload);
      } else {
        await client.post("/api/bookings.php", payload);
      }
      setShowModal(false);
      load(statusFilter);
    } catch (err) {
      setError(err.response?.data?.message || "Could not save booking");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this booking?")) return;
    await client.delete(`/api/bookings.php?id=${id}`);
    load(statusFilter);
  };

  const statuses = ["", "pending", "confirmed", "completed", "cancelled"];

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
        <div className="d-flex gap-2 flex-wrap">
          {statuses.map((s) => (
            <button
              key={s || "all"}
              className={`btn btn-sm ${statusFilter === s ? "btn-ink" : "btn-outline-lumen"}`}
              onClick={() => handleFilter(s)}
              style={{ textTransform: "capitalize" }}
            >
              {s || "All"}
            </button>
          ))}
        </div>
        <button className="btn btn-gold d-flex align-items-center gap-2" onClick={openAdd}>
          <Plus size={16} /> New booking
        </button>
      </div>

      <div className="card-lumen">
        <table className="table table-lumen m-0">
          <thead>
            <tr>
              <th>Session</th>
              <th>Client</th>
              <th>Date</th>
              <th>Amount</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {loading && <tr><td colSpan={6} className="text-center text-muted py-4">Loading…</td></tr>}
            {!loading && bookings.length === 0 && (
              <tr><td colSpan={6} className="empty-state">No bookings found.</td></tr>
            )}
            {bookings.map((b) => (
              <tr key={b.id}>
                <td>
                  <div style={{ fontWeight: 500 }}>{b.title}</div>
                  <div className="text-muted" style={{ fontSize: "0.78rem" }}>{b.shoot_type} {b.location ? `· ${b.location}` : ""}</div>
                </td>
                <td>{b.client_name}</td>
                <td className="font-mono" style={{ fontSize: "0.82rem" }}>
                  {new Date(b.event_date).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" })}
                </td>
                <td>Rs {Number(b.amount).toLocaleString()}</td>
                <td><StatusBadge status={b.status} /></td>
                <td>
                  <div className="d-flex gap-2 justify-content-end">
                    <button className="btn btn-sm btn-outline-lumen" onClick={() => openEdit(b)}><Pencil size={14} /></button>
                    <button className="btn btn-sm btn-outline-lumen" onClick={() => handleDelete(b.id)}><Trash2 size={14} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal show={showModal} title={editingId ? "Edit booking" : "New booking"} onClose={() => setShowModal(false)} size="modal-lg">
        <form onSubmit={handleSave}>
          {error && <div className="alert alert-danger py-2" style={{ fontSize: "0.86rem" }}>{error}</div>}
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label" style={{ fontSize: "0.85rem" }}>Client</label>
              <select className="form-select form-select-lumen" value={form.client_id} onChange={(e) => setForm({ ...form, client_id: e.target.value })} required>
                <option value="">Select client…</option>
                {clients.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label" style={{ fontSize: "0.85rem" }}>Package</label>
              <select className="form-select form-select-lumen" value={form.package_id} onChange={(e) => applyPackage(e.target.value)}>
                <option value="">None</option>
                {packages.map((p) => <option key={p.id} value={p.id}>{p.name} — Rs {Number(p.price).toLocaleString()}</option>)}
              </select>
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label" style={{ fontSize: "0.85rem" }}>Session title</label>
            <input className="form-control form-control-lumen" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          </div>

          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label" style={{ fontSize: "0.85rem" }}>Shoot type</label>
              <input className="form-control form-control-lumen" placeholder="Wedding, Portrait, Event…" value={form.shoot_type} onChange={(e) => setForm({ ...form, shoot_type: e.target.value })} />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label" style={{ fontSize: "0.85rem" }}>Date & time</label>
              <input type="datetime-local" className="form-control form-control-lumen" value={form.event_date} onChange={(e) => setForm({ ...form, event_date: e.target.value })} required />
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label" style={{ fontSize: "0.85rem" }}>Location</label>
            <input className="form-control form-control-lumen" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
          </div>

          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label" style={{ fontSize: "0.85rem" }}>Amount (Rs)</label>
              <input type="number" step="0.01" className="form-control form-control-lumen" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} required />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label" style={{ fontSize: "0.85rem" }}>Status</label>
              <select className="form-select form-select-lumen" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          <div className="mb-4">
            <label className="form-label" style={{ fontSize: "0.85rem" }}>Notes</label>
            <textarea className="form-control form-control-lumen" rows={2} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
          </div>

          <button type="submit" className="btn btn-gold w-100" disabled={saving}>
            {saving ? "Saving…" : "Save booking"}
          </button>
        </form>
      </Modal>
    </div>
  );
}