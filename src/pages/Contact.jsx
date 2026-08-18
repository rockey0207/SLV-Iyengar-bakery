import { useState } from "react";
import api from "@/lib/api";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

export default function Contact() {
  const [form, setForm] = useState({ name: "", phone: "", email: "", message: "" });
  const submit = async (e) => {
    e.preventDefault();
    try { await api.post("/contact", form); toast.success("Message sent! We'll reply soon."); setForm({ name: "", phone: "", email: "", message: "" }); }
    catch { toast.error("Failed to send"); }
  };
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10" data-testid="contact-page">
      <div className="text-center mb-10">
        <div className="uppercase-tracked text-xs text-[#06d2d9]">Say Hello</div>
        <h1 className="font-display text-3xl md:text-5xl font-bold mt-1">Get in Touch</h1>
      </div>
      <div className="grid lg:grid-cols-2 gap-8">
        <form onSubmit={submit} className="bg-white border border-[#E6DFD5] rounded-2xl p-6 md:p-8 card-shadow space-y-4">
          <div><Label>Full Name</Label><Input value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} required data-testid="contact-name" /></div>
          <div><Label>Phone Number</Label><Input value={form.phone} onChange={(e) => setForm({...form, phone: e.target.value})} required /></div>
          <div><Label>Email (optional)</Label><Input type="email" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} /></div>
          <div><Label>Message</Label><Textarea rows={5} value={form.message} onChange={(e) => setForm({...form, message: e.target.value})} required /></div>
          <Button type="submit" className="btn-primary rounded-full w-full" data-testid="contact-submit">Send Message</Button>
        </form>
        <div className="space-y-6">
          <div className="bg-white border border-[#E6DFD5] rounded-2xl p-6 card-shadow space-y-4">
            <div className="flex items-start gap-3"><MapPin className="w-5 h-5 text-[#06d2d9] flex-shrink-0" /><div><div className="uppercase-tracked text-xs text-[#5C4A3D]">Address</div><div>1st Block, Koramangala, Bangalore 560095</div></div></div>
            <div className="flex items-start gap-3"><Clock className="w-5 h-5 text-[#06d2d9] flex-shrink-0" /><div><div className="uppercase-tracked text-xs text-[#5C4A3D]">Hours</div><div>Every day · 11:00 AM – 11:00 PM</div></div></div>
            <div className="flex items-start gap-3"><Phone className="w-5 h-5 text-[#06d2d9] flex-shrink-0" /><div><div className="uppercase-tracked text-xs text-[#5C4A3D]">Phone</div><div>+91 98987 69879</div></div></div>
            <div className="flex items-start gap-3"><Mail className="w-5 h-5 text-[#06d2d9] flex-shrink-0" /><div><div className="uppercase-tracked text-xs text-[#5C4A3D]">Email</div><div>slvbakery@gmail.com</div></div></div>
          </div>
          <div className="rounded-2xl overflow-hidden border border-[#E6DFD5] card-shadow">
            <iframe
              title="SLV Bakery Location"
              src="https://maps.google.com/maps?q=12.9352,77.6245&z=15&output=embed"
              className="w-full h-64" style={{ border: 0 }} loading="lazy" data-testid="map-embed" />
          </div>
        </div>
      </div>
    </div>
  );
}
