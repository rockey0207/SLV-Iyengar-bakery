import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Cake, Upload } from "lucide-react";

export default function BirthdayCake() {
  const { user } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({
    cake_type: "Chocolate", cake_size: "1kg", flavor: "Chocolate", quantity: 1,
    message: "", delivery_date: "", delivery_time: "10:00", reference_image: "",
    phone: user?.phone || "", address: user?.address || "",
  });
  const [imgErr, setImgErr] = useState("");

  const upd = (k, v) => setForm({ ...form, [k]: v });

  const onFile = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!f.type.startsWith("image/")) { setImgErr("Only image files allowed"); return; }
    if (f.size > 600 * 1024) { setImgErr("File must be under 600KB"); return; }
    setImgErr("");
    const r = new FileReader();
    r.onloadend = () => upd("reference_image", r.result);
    r.readAsDataURL(f);
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!user) { toast.error("Please login to submit a custom cake request"); nav("/login"); return; }
    try {
      await api.post("/custom-cakes", form);
      toast.success("Cake request submitted! Our team will review and confirm shortly.");
      nav("/my-orders");
    } catch (err) { toast.error("Failed to submit"); }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10" data-testid="birthday-cake-page">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 uppercase-tracked text-xs text-[#06d2d9] mb-2">
          <Cake className="w-4 h-4" /> Custom Cakes
        </div>
        <h1 className="font-display text-3xl md:text-5xl font-bold">Design Your Dream Birthday Cake</h1>
        <p className="text-[#5C4A3D] mt-3 max-w-2xl mx-auto">Tell us what you're imagining. Our chefs will craft a one-of-a-kind cake made just for your celebration.</p>
      </div>

      <form onSubmit={submit} className="bg-white border border-[#E6DFD5] rounded-2xl p-6 md:p-8 card-shadow space-y-5">
        <div className="grid md:grid-cols-2 gap-5">
          <div>
            <Label>Cake Type</Label>
            <Select value={form.cake_type} onValueChange={(v) => upd("cake_type", v)}>
              <SelectTrigger data-testid="cake-type"><SelectValue /></SelectTrigger>
              <SelectContent>
                {["Chocolate", "Vanilla", "Red Velvet", "Fruit", "Cheesecake", "Photo Cake", "Fondant"].map((x) => <SelectItem key={x} value={x}>{x}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Cake Size</Label>
            <Select value={form.cake_size} onValueChange={(v) => upd("cake_size", v)}>
              <SelectTrigger data-testid="cake-size"><SelectValue /></SelectTrigger>
              <SelectContent>
                {["500g", "1kg", "1.5kg", "2kg", "3kg", "5kg"].map((x) => <SelectItem key={x} value={x}>{x}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Flavor</Label>
            <Select value={form.flavor} onValueChange={(v) => upd("flavor", v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {["Chocolate", "Vanilla", "Strawberry", "Butterscotch", "Blackforest", "Pineapple", "Coffee"].map((x) => <SelectItem key={x} value={x}>{x}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Quantity</Label>
            <Input type="number" min="1" value={form.quantity} onChange={(e) => upd("quantity", parseInt(e.target.value))} />
          </div>
          <div>
            <Label>Delivery Date</Label>
            <Input type="date" value={form.delivery_date} onChange={(e) => upd("delivery_date", e.target.value)} required data-testid="delivery-date" />
          </div>
          <div>
            <Label>Delivery Time</Label>
            <Input type="time" value={form.delivery_time} onChange={(e) => upd("delivery_time", e.target.value)} required />
          </div>
        </div>
        <div>
          <Label>Message on Cake</Label>
          <Input value={form.message} onChange={(e) => upd("message", e.target.value)} placeholder="e.g., Happy Birthday Riya!" />
        </div>
        <div>
          <Label>Delivery Address</Label>
          <Textarea value={form.address} onChange={(e) => upd("address", e.target.value)} required />
        </div>
        <div>
          <Label>Contact Phone</Label>
          <Input value={form.phone} onChange={(e) => upd("phone", e.target.value)} required />
        </div>
        <div>
          <Label>Reference Image (optional, max 600KB)</Label>
          <label className="mt-2 flex flex-col items-center justify-center border-2 border-dashed border-[#E6DFD5] rounded-xl p-6 cursor-pointer hover:border-[#06d2d9]">
            <Upload className="w-6 h-6 text-[#5C4A3D]" />
            <span className="text-sm text-[#5C4A3D] mt-2">Click to upload reference image</span>
            <input type="file" accept="image/*" onChange={onFile} className="hidden" data-testid="upload-ref-image" />
          </label>
          {imgErr && <div className="text-xs text-[#BE123C] mt-2">{imgErr}</div>}
          {form.reference_image && <img src={form.reference_image} alt="ref" className="mt-3 h-24 rounded-lg object-cover" />}
        </div>
        <Button type="submit" className="btn-primary w-full rounded-full" data-testid="submit-cake">Submit Cake Request</Button>
      </form>
    </div>
  );
}
