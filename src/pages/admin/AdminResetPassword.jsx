import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import api, { formatErr } from "@/lib/api";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function AdminResetPassword() {
  const [params] = useSearchParams();
  const [token, setToken] = useState(params.get("token") || "");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const nav = useNavigate();

  useEffect(() => { if (params.get("token")) setToken(params.get("token")); }, [params]);

  const submit = async (e) => {
    e.preventDefault();
    if (password !== confirm) { toast.error("Passwords do not match"); return; }
    try {
      await api.post("/auth/reset-password", { token, password });
      toast.success("Password reset successful");
      nav("/admin/login");
    } catch (err) {
      toast.error(formatErr(err));
    }
  };

  return (
    <div className="min-h-screen bg-[#3E2A1F] flex items-center justify-center px-4">
      <form onSubmit={submit} className="w-full max-w-md bg-white rounded-2xl p-6 card-shadow-lg space-y-4">
        <h1 className="font-display text-2xl font-bold text-center">Set New Password</h1>
        <div><Label>Reset Token</Label><Input value={token} onChange={(e) => setToken(e.target.value)} required /></div>
        <div><Label>New Password</Label><Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} /></div>
        <div><Label>Confirm Password</Label><Input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required /></div>
        <Button type="submit" className="btn-primary w-full rounded-full">Reset Password</Button>
        <div className="text-center"><Link to="/admin/login" className="text-sm text-[#06d2d9]">← Back to Login</Link></div>
      </form>
    </div>
  );
}
