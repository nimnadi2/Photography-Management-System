import { useEffect, useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, UploadCloud, X } from "lucide-react";
import client, { UPLOADS_BASE_URL, API_BASE_URL } from "../api/client";

export default function GalleryDetail() {
  const { id } = useParams();
  const [gallery, setGallery] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const fileInput = useRef();

  const load = () => {
    client.get(`/api/galleries.php?id=${id}`).then((res) => setGallery(res.data.data)).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [id]);

  const handleFiles = async (files) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("gallery_id", id);
    Array.from(files).forEach((f) => formData.append("photos[]", f));

    try {
      const token = localStorage.getItem("lumen_token");
      await fetch(`${API_BASE_URL}/api/gallery_photos.php`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      load();
    } finally {
      setUploading(false);
    }
  };

  const handleDeletePhoto = async (photoId) => {
    if (!confirm("Remove this photo from the gallery?")) return;
    await client.delete(`/api/gallery_photos.php?id=${photoId}`);
    load();
  };

  if (loading) return <div className="text-muted">Loading…</div>;
  if (!gallery) return <div className="empty-state">Gallery not found.</div>;

  return (
    <div>
      <Link to="/galleries" className="d-inline-flex align-items-center gap-1 mb-3 text-muted" style={{ fontSize: "0.86rem" }}>
        <ArrowLeft size={15} /> Back to galleries
      </Link>

      <div className="d-flex justify-content-between align-items-start mb-4 flex-wrap gap-2">
        <div>
          <div className="eyebrow">{gallery.client_name} · {gallery.booking_title}</div>
          <h2 className="font-display">{gallery.title}</h2>
        </div>
        <div className="text-muted" style={{ fontSize: "0.85rem" }}>{gallery.photos.length} photos</div>
      </div>

      <div
        className="upload-drop mb-4"
        onClick={() => fileInput.current.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => { e.preventDefault(); handleFiles(e.dataTransfer.files); }}
      >
        <input
          type="file"
          ref={fileInput}
          multiple
          accept="image/jpeg,image/png,image/webp"
          style={{ display: "none" }}
          onChange={(e) => handleFiles(e.target.files)}
        />
        <UploadCloud size={28} strokeWidth={1.3} className="mb-2" />
        <div>{uploading ? "Uploading…" : "Click or drag photos here to upload (JPG, PNG, WEBP)"}</div>
      </div>

      {gallery.photos.length === 0 ? (
        <div className="empty-state">No photos in this gallery yet.</div>
      ) : (
        <div className="photo-grid">
          {gallery.photos.map((p) => (
            <div className="photo-tile" key={p.id}>
              <img src={`${UPLOADS_BASE_URL}/${p.filename}`} alt={p.original_name} />
              <button className="remove-btn" onClick={() => handleDeletePhoto(p.id)}>
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}