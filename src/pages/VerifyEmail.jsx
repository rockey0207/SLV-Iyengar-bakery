import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import api from "@/lib/api";
import { CheckCircle2, XCircle } from "lucide-react";

export default function VerifyEmail() {
  const [params] = useSearchParams();
  const [state, setState] = useState("verifying");
  useEffect(() => {
    const t = params.get("token");
    if (!t) { setState("error"); return; }
    api.post("/auth/verify-email", { token: t }).then(() => setState("ok")).catch(() => setState("error"));
  }, [params]);
  return (
    <div className="max-w-md mx-auto px-4 py-20 text-center" data-testid="verify-page">
      {state === "verifying" && <div>Verifying...</div>}
      {state === "ok" && <>
        <CheckCircle2 className="w-14 h-14 text-[#4D7C0F] mx-auto" />
        <h1 className="font-display text-3xl font-bold mt-4">Email Verified!</h1>
        <p className="text-[#5C4A3D] mt-2">Your account is now active.</p>
        <Link to="/login" className="btn-primary inline-block mt-6 rounded-full px-6 py-2.5 text-sm uppercase-tracked" data-testid="verify-login-link">Login Now</Link>
      </>}
      {state === "error" && <>
        <XCircle className="w-14 h-14 text-[#BE123C] mx-auto" />
        <h1 className="font-display text-3xl font-bold mt-4">Invalid Link</h1>
        <p className="text-[#5C4A3D] mt-2">The verification link is invalid or expired.</p>
      </>}
    </div>
  );
}
