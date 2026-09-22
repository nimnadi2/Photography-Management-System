import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Camera, ArrowRight, Eye, EyeOff } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const { register, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const res = await register(form.name, form.email, form.password);
    if (res.ok) navigate("/dashboard");
    else setError(res.message);
  };

  return (
    <div className="auth-shell">
      <div className="auth-visual">
        <div className="d-flex align-items-center gap-2 mb-4">
          <div style={{
            width: 34, height: 34, borderRadius: 8,
            background: "rgba(200, 162, 80, 0.15)",
            display: "flex", alignItems: "center", justifyContent: "center",
            border: "1px solid rgba(232, 217, 174, 0.35)",
          }}>
            <Camera size={17} color="#e8d9ae" />
          </div>
          <span className="eyebrow" style={{ color: "#e8d9ae" }}>Lumen Studio</span>
        </div>
        <h1
          className="font-display"
          style={{
            background: "linear-gradient(135deg, #ffffff 30%, #e8d9ae 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            fontSize: "2.2rem",
            maxWidth: 560,
            lineHeight: 1.2,
          }}
        >
          Set up your studio's control room.
        </h1>
        <p style={{ color: "#a3a3a3", maxWidth: 480, marginTop: 12 }}>
          Create an account to start tracking bookings, clients and deliverables today.
        </p>

        <div className="contact-sheet">
          {Array.from({ length: 8 }).map((_, i) => (
            <div className="frame" data-n={`F${String(i + 1).padStart(2, "0")}`} key={i}>
              <img
                src={`https://picsum.photos/seed/lumen${i + 1}/200/200`}
                alt=""
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="auth-form-side">
        <div className="auth-card">
          <h2 className="font-display mb-1">Create your account</h2>
          <p className="text-muted mb-4" style={{ fontSize: "0.92rem" }}>
            Takes less than a minute.
          </p>

          {error && (
            <div className="alert alert-danger py-2" style={{ fontSize: "0.88rem" }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label" style={{ fontSize: "0.85rem" }}>Full name</label>
              <input
                type="text"
                className="form-control form-control-lumen"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label" style={{ fontSize: "0.85rem" }}>Email</label>
              <input
                type="email"
                className="form-control form-control-lumen"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>
            <div className="mb-4">
              <label className="form-label" style={{ fontSize: "0.85rem" }}>Password</label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  className="form-control form-control-lumen"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  style={{ paddingRight: "42px" }}
                  minLength={6}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)",
                    background: "none", border: "none", padding: 0, cursor: "pointer",
                    color: "var(--text-muted)", display: "flex", alignItems: "center",
                  }}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>
            <button type="submit" className="btn btn-gold w-100 d-flex align-items-center justify-content-center gap-2" disabled={loading}>
              {loading ? "Creating account..." : "Create account"} <ArrowRight size={16} />
            </button>
          </form>

          <p className="text-center mt-4" style={{ fontSize: "0.86rem", color: "var(--text-muted)" }}>
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}