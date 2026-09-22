import { createContext, useContext, useState } from "react";
import client from "../api/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("lumen_user");
    return stored ? JSON.parse(stored) : null;
  });
  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await client.post("/api/auth.php?action=login", { email, password });
      const { token, user: loggedInUser } = res.data.data;
      localStorage.setItem("lumen_token", token);
      localStorage.setItem("lumen_user", JSON.stringify(loggedInUser));
      setUser(loggedInUser);
      return { ok: true };
    } catch (err) {
      return { ok: false, message: err.response?.data?.message || "Login failed" };
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password) => {
    setLoading(true);
    try {
      const res = await client.post("/api/auth.php?action=register", { name, email, password });
      const { token, user: newUser } = res.data.data;
      localStorage.setItem("lumen_token", token);
      localStorage.setItem("lumen_user", JSON.stringify(newUser));
      setUser(newUser);
      return { ok: true };
    } catch (err) {
      return { ok: false, message: err.response?.data?.message || "Registration failed" };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await client.post("/api/auth.php?action=logout");
    } catch (e) {
      // ignore
    }
    localStorage.removeItem("lumen_token");
    localStorage.removeItem("lumen_user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}