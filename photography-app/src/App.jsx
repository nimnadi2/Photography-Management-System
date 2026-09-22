import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Clients from "./pages/Clients";
import ClientDetail from "./pages/ClientDetail";
import Bookings from "./pages/Bookings";
import Packages from "./pages/Packages";
import Galleries from "./pages/Galleries";
import GalleryDetail from "./pages/GalleryDetail";
import Invoices from "./pages/Invoices";

export default function App() {
 return (
 <AuthProvider>
 <BrowserRouter>
 <Routes>
 <Route path="/login" element={<Login />} />
 <Route path="/register" element={<Register />} />

 <Route element={<ProtectedRoute />}>
 <Route element={<Layout />}> <Route path="/" element={<Navigate to="/dashboard" replace />} />
 <Route path="/dashboard" element={<Dashboard />} />
 <Route path="/clients" element={<Clients />} />
 <Route path="/clients/:id" element={<ClientDetail />} />
 <Route path="/bookings" element={<Bookings />} />
 <Route path="/packages" element={<Packages />} />
 <Route path="/galleries" element={<Galleries />} />
 <Route path="/galleries/:id" element={<GalleryDetail />} />
 <Route path="/invoices" element={<Invoices />} />
 </Route>
 </Route>

 <Route path="*" element={<Navigate to="/dashboard" replace />} />
 </Routes>
 </BrowserRouter>
 </AuthProvider>
 );
} 