import { useState } from "react";
import axios from "axios";

function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("");
  const [isError, setIsError] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost/dental-clinic/backend/contact.php",
        form
      );
      if (res.data.success) {
        setStatus("Message sent successfully! We'll get back to you soon.");
        setIsError(false);
        setForm({ name: "", email: "", message: "" });
      } else {
        setStatus(res.data.message || "Something went wrong");
        setIsError(true);
      }
    } catch (error) {
      setStatus("Error connecting to server");
      setIsError(true);
    }
  };

  return (
    <div className="page" style={{ flexDirection: "column", alignItems: "center" }}>
      <div className="card" style={{ background: "white", padding: "30px", borderRadius: "16px", maxWidth: "460px", margin: "0 auto" }}>
        <h1>Contact Us</h1>
        <p className="subtitle">Have a question? Send us a message.</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Your Name</label>
            <input
              type="text"
              name="name"
              placeholder="e.g. Nimal Perera"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              placeholder="e.g. nimal@email.com"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Message</label>
            <textarea
              name="message"
              placeholder="Write your message here..."
              value={form.message}
              onChange={handleChange}
              required
              rows="5"
            ></textarea>
          </div>

          <button type="submit" className="btn">
            Send Message
          </button>
        </form>

        {status && (
          <div className={`message ${isError ? "error" : "success"}`}>
            {status}
          </div>
        )}
      </div>

      {/* Find Us Map Section */}
      <div style={{
        background: "white",
        padding: "30px",
        borderRadius: "16px",
        maxWidth: "700px",
        width: "100%",
        margin: "24px auto 40px auto",
        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.08)"
      }}>
        <h2 style={{ fontSize: "22px", color: "#0f766e", marginBottom: "6px", textAlign: "center", fontWeight: "700" }}>
          📍 Find Us
        </h2>
        <p style={{ textAlign: "center", color: "#64748b", fontSize: "15px", marginBottom: "20px" }}>
          123 Galle Road, Colombo, Sri Lanka
        </p>
        <div style={{ borderRadius: "12px", overflow: "hidden", border: "1px solid #e2e8f0" }}>
          <iframe
            title="Dental Clinic Location"
            src="https://www.google.com/maps?q=Colombo,Sri+Lanka&output=embed"
            width="100%"
            height="420"
            style={{ border: 0, display: "block" }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
        <div style={{ display: "flex", justifyContent: "center", gap: "24px", marginTop: "20px", flexWrap: "wrap" }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "13px", color: "#94a3b8", fontWeight: "600", marginBottom: "4px" }}>PHONE</div>
            <div style={{ fontSize: "14px", color: "#334155", fontWeight: "600" }}>+94 77 123 4567</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "13px", color: "#94a3b8", fontWeight: "600", marginBottom: "4px" }}>EMAIL</div>
            <div style={{ fontSize: "14px", color: "#334155", fontWeight: "600" }}>info@dentalclinic.lk</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "13px", color: "#94a3b8", fontWeight: "600", marginBottom: "4px" }}>HOURS</div>
            <div style={{ fontSize: "14px", color: "#334155", fontWeight: "600" }}>Mon–Sat, 8AM–6PM</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;