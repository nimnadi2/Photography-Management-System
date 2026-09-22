import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Clock, Images } from "lucide-react";
import client from "../api/client";
import Modal from "../components/Modal";

const emptyForm = { name: "", description: "", price: "", duration_hours: "1", photo_count: "" };

export default function Packages() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const load = () => {
    setLoading(true);
    client.get("/api/packages.php").then((res) => setPackages(res.data.data)).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const openAdd = () => {
    setEditingId(null);
    setForm(emptyForm);
    setError("");
    setShowModal(true);
  };

  const openEdit = (p) => {
    setEditingId(p.id);
    setForm({ name: p.name, description: p.description || "", price: p.price, duration_hours: p.duration_hours, photo_count: p.photo_count || "" });
    setError("");
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      if (editingId) await client.put(`/api/packages.php?id=${editingId}`, form);
      else await client.post("/api/packages.php", form);
      setShowModal(false);
      load();
    } catch (err) {
      setError(err.response?.data?.message || "Could not save package");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this package?")) return;
    await client.delete(`/api/packages.php?id=${id}`);
    load();
  };

  return (
    <div>
      <div className="d-flex justify-content-end mb-3">
        <button className="btn btn-gold d-flex align-items-center gap-2" onClick={openAdd}>
          <Plus size={16} /> Add package
        </button>
      </div>

      {loading ? (
        <div className="text-muted">Loading…</div>
      ) : (
        <div className="row g-3">
          {packages.length === 0 && <div className="empty-state">No packages yet.</div>}
          {packages.map((p) => (
            <div className="col-md-6 col-lg-4" key={p.id}>
              <div className="card-lumen p-4 h-100 d-flex flex-column">
                <div className="d-flex justify-content-between align-items-start">
                  <h3 className="font-display" style={{ fontSize: "1.15rem" }}>{p.name}</h3>
                  <div className="d-flex gap-1">
                    <button className="btn btn-sm btn-outline-lumen" onClick={() => openEdit(p)}><Pencil size={13} /></button>
                    <button className="btn btn-sm btn-outline-lumen" onClick={() => handleDelete(p.id)}><Trash2 size={13} /></button>
                  </div>
                </div>
                <p className="text-muted flex-grow-1" style={{ fontSize: "0.86rem" }}>{p.description}</p>
                <div className="font-display" style={{ fontSize: "1.6rem", color: "var(--gold)" }}>
                  Rs {Number(p.price).toLocaleString()}
                </div>
                <div className="d-flex gap-3 mt-2 text-muted" style={{ fontSize: "0.8rem" }}>
                  <span className="d-flex align-items-center gap-1"><Clock size={13} /> {p.duration_hours}h</span>
                  {p.photo_count && <span className="d-flex align-items-center gap-1"><Images size={13} /> {p.photo_count} photos</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal show={showModal} title={editingId ? "Edit package" : "Add package"} onClose={() => setShowModal(false)}>
        <form onSubmit={handleSave}>
          {error && <div className="alert alert-danger py-2" style={{ fontSize: "0.86rem" }}>{error}</div>}
          <div className="mb-3">
            <label className="form-label" style={{ fontSize: "0.85rem" }}>Package name</label>
            <input className="form-control form-control-lumen" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          </div>
          <div className="mb-3">
            <label className="form-label" style={{ fontSize: "0.85rem" }}>Description</label>
            <textarea className="form-control form-control-lumen" rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          <div className="row">
            <div className="col-4 mb-3">
              <label className="form-label" style={{ fontSize: "0.85rem" }}>Price (Rs)</label>
              <input type="number" step="0.01" className="form-control form-control-lumen" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
            </div>
            <div className="col-4 mb-3">
              <label className="form-label" style={{ fontSize: "0.85rem" }}>Duration (h)</label>
              <input type="number" step="0.5" className="form-control form-control-lumen" value={form.duration_hours} onChange={(e) => setForm({ ...form, duration_hours: e.target.value })} required />
            </div>
            <div className="col-4 mb-3">
              <label className="form-label" style={{ fontSize: "0.85rem" }}>Photos</label>
              <input type="number" className="form-control form-control-lumen" value={form.photo_count} onChange={(e) => setForm({ ...form, photo_count: e.target.value })} />
            </div>
          </div>
          <button type="submit" className="btn btn-gold w-100" disabled={saving}>
            {saving ? "Saving…" : "Save package"}
          </button>
        </form>
      </Modal>
    </div>
  );
}