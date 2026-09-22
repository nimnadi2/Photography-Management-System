import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Search, Pencil, Trash2, ChevronRight } from "lucide-react";
import client from "../api/client";
import Modal from "../components/Modal";

const emptyForm = { name: "", email: "", phone: "", address: "", notes: "" };

export default function Clients() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const load = (q = "") => {
    setLoading(true);
    client
      .get("/api/clients.php", { params: q ? { search: q } : {} })
      .then((res) => setClients(res.data.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    load(search);
  };

  const openAdd = () => {
    setEditingId(null);
    setForm(emptyForm);
    setError("");
    setShowModal(true);
  };

  const openEdit = (c) => {
    setEditingId(c.id);
    setForm({ name: c.name, email: c.email || "", phone: c.phone || "", address: c.address || "", notes: c.notes || "" });
    setError("");
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      if (editingId) {
        await client.put(`/api/clients.php?id=${editingId}`, form);
      } else {
        await client.post("/api/clients.php", form);
      }
      setShowModal(false);
      load(search);
    } catch (err) {
      setError(err.response?.data?.message || "Could not save client");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this client? Their bookings will also be removed.")) return;
    await client.delete(`/api/clients.php?id=${id}`);
    load(search);
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
        <form className="d-flex" onSubmit={handleSearch} style={{ maxWidth: 320 }}>
          <div className="input-group">
            <span className="input-group-text bg-white" style={{ borderColor: "var(--border)" }}>
              <Search size={16} color="#857f74" />
            </span>
            <input
              className="form-control form-control-lumen"
              placeholder="Search clients…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </form>
        <button className="btn btn-gold d-flex align-items-center gap-2" onClick={openAdd}>
          <Plus size={16} /> Add client
        </button>
      </div>

      <div className="card-lumen">
        <table className="table table-lumen m-0">
          <thead>
            <tr>
              <th>Name</th>
              <th>Contact</th>
              <th>Bookings</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr><td colSpan={4} className="text-center text-muted py-4">Loading…</td></tr>
            )}
            {!loading && clients.length === 0 && (
              <tr><td colSpan={4} className="empty-state">No clients found. Add your first client to get started.</td></tr>
            )}
            {clients.map((c) => (
              <tr key={c.id}>
                <td>
                  <Link to={`/clients/${c.id}`} style={{ color: "var(--ink)", fontWeight: 500 }}>{c.name}</Link>
                  {c.address && <div className="text-muted" style={{ fontSize: "0.78rem" }}>{c.address}</div>}
                </td>
                <td>
                  <div style={{ fontSize: "0.86rem" }}>{c.email || "—"}</div>
                  <div className="text-muted" style={{ fontSize: "0.78rem" }}>{c.phone || "—"}</div>
                </td>
                <td className="font-mono">{c.booking_count}</td>
                <td>
                  <div className="d-flex gap-2 justify-content-end">
                    <button className="btn btn-sm btn-outline-lumen" onClick={() => openEdit(c)}><Pencil size={14} /></button>
                    <button className="btn btn-sm btn-outline-lumen" onClick={() => handleDelete(c.id)}><Trash2 size={14} /></button>
                    <Link to={`/clients/${c.id}`} className="btn btn-sm btn-outline-lumen"><ChevronRight size={14} /></Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal show={showModal} title={editingId ? "Edit client" : "Add client"} onClose={() => setShowModal(false)}>
        <form onSubmit={handleSave}>
          {error && <div className="alert alert-danger py-2" style={{ fontSize: "0.86rem" }}>{error}</div>}
          <div className="mb-3">
            <label className="form-label" style={{ fontSize: "0.85rem" }}>Full name</label>
            <input className="form-control form-control-lumen" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          </div>
          <div className="row">
            <div className="col-6 mb-3">
              <label className="form-label" style={{ fontSize: "0.85rem" }}>Email</label>
              <input type="email" className="form-control form-control-lumen" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <div className="col-6 mb-3">
              <label className="form-label" style={{ fontSize: "0.85rem" }}>Phone</label>
              <input className="form-control form-control-lumen" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>
          </div>
          <div className="mb-3">
            <label className="form-label" style={{ fontSize: "0.85rem" }}>Address</label>
            <input className="form-control form-control-lumen" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
          </div>
          <div className="mb-4">
            <label className="form-label" style={{ fontSize: "0.85rem" }}>Notes</label>
            <textarea className="form-control form-control-lumen" rows={3} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
          </div>
          <button type="submit" className="btn btn-gold w-100" disabled={saving}>
            {saving ? "Saving…" : "Save client"}
          </button>
        </form>
      </Modal>
    </div>
  );
}