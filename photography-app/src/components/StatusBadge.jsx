export default function StatusBadge({ status }) {
  return <span className={`badge-status badge-${status}`}>{status}</span>;
}