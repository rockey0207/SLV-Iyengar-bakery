import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Shield } from "lucide-react";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { adminLogin } = useAuth();
  const nav = useNavigate();
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const payload = { password };
    if (email) payload.email = email;
    if (username) payload.username = username;
    const r = await adminLogin(payload);
    setLoading(false);
    if (r.ok) nav("/admin");
  };

  return (
    <div className="min-h-screen bg-[#3E2A1F] flex items-center justify-center px-4 grainy">
      <div className="w-full max-w-md">
        <div className="text-center mb-6 text-white">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-[#06d2d9] flex items-center justify-center">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="font-display text-3xl font-bold mt-4">Admin Portal</h1>
          <p className="text-white/70 text-sm mt-1">SLV Bakery Management System</p>
        </div>
        <form onSubmit={submit} className="bg-white rounded-2xl p-6 card-shadow-lg space-y-4" data-testid="admin-login-form">
          <div><Label>Username</Label><Input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="admin" data-testid="admin-username" /></div>
          <div><Label>Email</Label><Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@slvbakery.com" data-testid="admin-email" /></div>
          <div><Label>Password</Label><Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required data-testid="admin-password" /></div>
          <p className="text-xs text-[#5C4A3D]">Provide username or email (or both) with password.</p>
          <Button type="submit" disabled={loading || (!username && !email)} className="btn-primary rounded-full w-full">
            {loading ? "Signing in..." : "Admin Sign In"}
          </Button>
          <div className="text-center text-sm">
            <Link to="/admin/forgot-password" className="text-[#06d2d9] hover:underline">Forgot Password?</Link>
          </div>
          <div className="text-center text-sm text-[#5C4A3D]">
            <Link to="/" className="text-[#06d2d9]">← Back to Store</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
