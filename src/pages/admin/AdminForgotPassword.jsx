import { useState } from "react";
import { Link } from "react-router-dom";
import api, { formatErr } from "@/lib/api";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Shield, CheckCircle2 } from "lucide-react";

export default function AdminForgotPassword() {
  const [step, setStep] = useState(1);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (step === 1) {
      if (!username.trim()) { toast.error("Enter your admin username"); return; }
      setStep(2);
      return;
    }
    setLoading(true);
    try {
      const { data } = await api.post("/admin/forgot-password", { username, email });
      toast.success(data.message);
      if (data.reset_token_dev) setToken(data.reset_token_dev);
      setStep(3);
    } catch (err) {
      toast.error(formatErr(err));
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#3E2A1F] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl p-6 card-shadow-lg">
        <div className="text-center mb-6">
          <Shield className="w-10 h-10 mx-auto text-[#06d2d9]" />
          <h1 className="font-display text-2xl font-bold mt-2">Admin Password Reset</h1>
        </div>
        <div className="flex justify-center gap-2 mb-6 text-xs">
          {[1, 2, 3].map((s) => (
            <div key={s} className={`px-3 py-1 rounded-full ${step >= s ? "bg-[#06d2d9] text-white" : "bg-[#FBF5EA] text-[#5C4A3D]"}`}>
              {s === 1 ? "Username" : s === 2 ? "Email" : "Done"}
            </div>
          ))}
        </div>
        {step < 3 ? (
          <form onSubmit={submit} className="space-y-4">
            {step === 1 && (
              <div><Label>Step 1: Verify Username</Label><Input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="admin" required /></div>
            )}
            {step === 2 && (
              <div><Label>Step 2: Verify Registered Email</Label><Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@slvbakery.com" required /></div>
            )}
            <div className="flex gap-2">
              {step === 2 && <Button type="button" variant="outline" onClick={() => setStep(1)} className="flex-1">Back</Button>}
              <Button type="submit" disabled={loading} className="btn-primary flex-1">{loading ? "Sending..." : step === 1 ? "Continue" : "Send Reset Link"}</Button>
            </div>
          </form>
        ) : (
          <div className="text-center space-y-4">
            <CheckCircle2 className="w-12 h-12 mx-auto text-[#4D7C0F]" />
            <p className="text-sm text-[#5C4A3D]">A password reset link has been sent to your registered email.</p>
            {process.env.NODE_ENV !== "production" && token && (
              <Link to={`/admin/reset-password?token=${token}`} className="block text-[#06d2d9] underline text-sm">
                Dev: Continue to reset password
              </Link>
            )}
          </div>
        )}
        <div className="text-center mt-4"><Link to="/admin/login" className="text-sm text-[#06d2d9]">← Back to Admin Login</Link></div>
      </div>
    </div>
  );
}
