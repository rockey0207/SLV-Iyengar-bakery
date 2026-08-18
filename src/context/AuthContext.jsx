import { createContext, useContext, useEffect, useState, useCallback } from "react";
import api, { formatErr } from "@/lib/api";
import { toast } from "sonner";

const IS_DEV = process.env.NODE_ENV !== "production";

const AuthCtx = createContext(null);
export const useAuth = () => useContext(AuthCtx);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadMe = useCallback(async () => {
    const token = localStorage.getItem("slv_token");
    if (!token) { setLoading(false); return; }
    try {
      const { data } = await api.get("/auth/me");
      setUser(data);
    } catch { localStorage.removeItem("slv_token"); }
    setLoading(false);
  }, []);

  useEffect(() => { loadMe(); }, [loadMe]);

  const login = async (email, password) => {
    try {
      const { data } = await api.post("/auth/login", { email, password });
      localStorage.setItem("slv_token", data.token);
      setUser(data.user);
      toast.success(`Welcome back, ${data.user.name}!`);
      return { ok: true, user: data.user };
    } catch (e) { toast.error(formatErr(e)); return { ok: false, error: formatErr(e) }; }
  };

  const adminLogin = async (payload) => {
    try {
      const { data } = await api.post("/admin/login", payload);
      localStorage.setItem("slv_token", data.token);
      setUser(data.user);
      toast.success("Admin login successful");
      return { ok: true, user: data.user };
    } catch (e) { toast.error(formatErr(e)); return { ok: false }; }
  };

  const register = async (payload) => {
    try {
      const { data } = await api.post("/auth/register", payload);
      toast.success("Account created! Check your email to verify.");
      return { ok: true, verify_token: IS_DEV ? data.verify_token_dev : null };
    } catch (e) { toast.error(formatErr(e)); return { ok: false }; }
  };

  const logout = () => {
    localStorage.removeItem("slv_token");
    setUser(null);
    toast.success("Logged out");
  };

  return (
    <AuthCtx.Provider value={{ user, loading, login, adminLogin, register, logout, refresh: loadMe }}>
      {children}
    </AuthCtx.Provider>
  );
}
