import { useEffect, useState } from "react";
import { Plus, CheckCircle2, Trash2 } from "lucide-react";
import client from "../api/client";
import Modal from "../components/Modal";
import StatusBadge from "../components/StatusBadge";

const emptyForm = { booking_id: "", amount: "", status: "unpaid", issued_date: "", due_date: "" };

export default function Invoices() {
  const [invoices, setInvoices] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const load = () => {
    setLoading(true);
    client.get("/api/invoices.php").then((res) => setInvoices(res.data.data)).finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
    client.get("/api/bookings.php").then((res) => setBookings(res.data.data));
  }, []);

  const openAdd = () => {
    setForm({ ...emptyForm, issued_date: new Date().toISOString().slice(0, 10) });
    setError("");
    setShowModal(true);
  };

  const applyBooking = (bookingId) => {
    const b = bookings.find((x) => String(x.id) === String(bookingId));
    setForm((f) => ({ ...f, booking_id: bookingId, amount: b ? b.amount : f.amount }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      await client.post("/api/invoices.php", form);
      setShowModal(false);
      load();
    } catch (err) {
      setError(err.response?.data?.message || "Could not create invoice");
    } finally {
      setSaving(false);
    }
  };

  const markPaid = async (inv) => {
    await client.put(`/api/invoices.php?id=${inv.id}`, {
      amount: inv.amount, status: "paid", due_date: inv.due_date,
    });
    load();
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this invoice?")) return;
    await client.delete(`/api/invoices.php?id=${id}`);
    load();
  };

  return (
    <div>
      <div className="d-flex justify-content-end mb-3">
        <button className="btn btn-gold d-flex align-items-center gap-2" onClick={openAdd}>
          <Plus size={16} /> New invoice
        </button>
      </div>

      <div className="card-lumen">
        <table className="table table-lumen m-0">
          <thead>
            <tr>
              <th>Invoice</th>
              <th>Client</th>
              <th>Amount</th>
              <th>Due</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {loading && <tr><td colSpan={6} className="text-center text-muted py-4">Loading…</td></tr>}
            {!loading && invoices.length === 0 && <tr><td colSpan={6} className="empty-state">No invoices yet.</td></tr>}
            {invoices.map((inv) => (
              <tr key={inv.id}>
                <td className="font-mono" style={{ fontSize: "0.84rem" }}>{inv.invoice_number}</td>
                <td>{inv.client_name}<div className="text-muted" style={{ fontSize: "0.78rem" }}>{inv.booking_title}</div></td>
                <td>Rs {Number(inv.amount).toLocaleString()}</td>
                <td className="font-mono" style={{ fontSize: "0.82rem" }}>{inv.due_date}</td>
                <td><StatusBadge status={inv.status} /></td>
                <td>
                  <div className="d-flex gap-2 justify-content-end">
                    {inv.status !== "paid" && (
                      <button className="btn btn-sm btn-outline-lumen" title="Mark as paid" onClick={() => markPaid(inv)}>
                        <CheckCircle2 size={14} />
                      </button>
                    )}
                    <button className="btn btn-sm btn-outline-lumen" onClick={() => handleDelete(inv.id)}><Trash2 size={14} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal show={showModal} title="New invoice" onClose={() => setShowModal(false)}>
        <form onSubmit={handleSave}>
          {error && <div className="alert alert-danger py-2" style={{ fontSize: "0.86rem" }}>{error}</div>}
          <div className="mb-3">
            <label className="form-label" style={{ fontSize: "0.85rem" }}>Booking</label>
            <select className="form-select form-select-lumen" value={form.booking_id} onChange={(e) => applyBooking(e.target.value)} required>
              <option value="">Select booking…</option>
              {bookings.map((b) => <option key={b.id} value={b.id}>{b.title} — {b.client_name}</option>)}
            </select>
          </div>
          <div className="row">
            <div className="col-6 mb-3">
              <label className="form-label" style={{ fontSize: "0.85rem" }}>Amount (Rs)</label>
              <input type="number" step="0.01" className="form-control form-control-lumen" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} required />
            </div>
            <div className="col-6 mb-3">
              <label className="form-label" style={{ fontSize: "0.85rem" }}>Due date</label>
              <input type="date" className="form-control form-control-lumen" value={form.due_date} onChange={(e) => setForm({ ...form, due_date: e.target.value })} required />
            </div>
          </div>
          <button type="submit" className="btn btn-gold w-100" disabled={saving}>
            {saving ? "Creating…" : "Create invoice"}
          </button>
        </form>
      </Modal>
    </div>
  );
}