import { X } from "lucide-react";

export default function Modal({ show, title, onClose, children, size = "" }) {
  if (!show) return null;

  return (
    <div
      className="modal d-block"
      tabIndex="-1"
      style={{ background: "rgba(26,23,48,0.6)", backdropFilter: "blur(2px)" }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className={`modal-dialog modal-dialog-centered ${size}`}>
        <div className="modal-content modal-content-lumen">
          <div className="modal-header" style={{ borderBottom: "1px solid var(--border)", padding: "20px 24px" }}>
            <h5 className="modal-title font-display m-0" style={{ fontSize: "1.15rem" }}>{title}</h5>
            <button type="button" className="btn-close" onClick={onClose} aria-label="Close"></button>
          </div>
          <div className="modal-body" style={{ padding: "24px" }}>{children}</div>
        </div>
      </div>
    </div>
  );
}