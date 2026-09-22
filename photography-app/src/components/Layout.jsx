import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

const pageMeta = {
  "/dashboard": { eyebrow: "Overview", title: "Dashboard" },
  "/clients": { eyebrow: "Contacts", title: "Clients" },
  "/bookings": { eyebrow: "Schedule", title: "Bookings" },
  "/packages": { eyebrow: "Pricing", title: "Packages" },
  "/galleries": { eyebrow: "Delivery", title: "Galleries" },
  "/invoices": { eyebrow: "Billing", title: "Invoices" },
};

export default function Layout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const matchedKey = Object.keys(pageMeta).find((key) => location.pathname.startsWith(key));
  const meta = pageMeta[matchedKey] || { eyebrow: "Lumen Studio", title: "" };

  return (
    <div className="app-shell">
      <Sidebar className={menuOpen ? "open" : ""} />
      <div className="main-area">
        <Topbar eyebrow={meta.eyebrow} title={meta.title} onMenuClick={() => setMenuOpen((o) => !o)} />
        <div className="content-area">
          <Outlet />
        </div>
      </div>
    </div>
  );
}