import { useEffect, useState } from "react";
import api, { formatErr } from "@/lib/api";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Eye, CheckCircle } from "lucide-react";

export default function AdminCustomCakes() {
  const [cakes, setCakes] = useState([]);
  const [selected, setSelected] = useState(null);
  const [customPrice, setCustomPrice] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");
  const [search, setSearch] = useState("");

  const load = () => api.get("/admin/custom-cakes").then((r) => setCakes(r.data));
  useEffect(() => { load(); }, []);

  const update = async (id, payload) => {
    try {
      if (payload.status === "rejected" && !(payload.rejection_reason || "").trim()) {
        toast.error("Please enter a rejection reason.");
        return;
      }

      await api.put(`/admin/custom-cakes/${id}`, payload);
      toast.success("Updated");
      load();
      setSelected(null);
      setCustomPrice("");
      setRejectionReason("");
    } catch (e) { toast.error(formatErr(e)); }
  };

  const filteredCakes = cakes.filter((c) => {
    const searchText = search.trim().toLowerCase();

    if (!searchText) return true;

    return (
      String(c.id || "").toLowerCase().includes(searchText) ||
      String(c.user_name || "").toLowerCase().includes(searchText) ||
      String(c.user_email || "").toLowerCase().includes(searchText) ||
      String(c.phone || "").toLowerCase().includes(searchText)
    );
  });

  const statusVariant = { pending: "warning", approved: "success", rejected: "destructive", delivered: "success" };

  return (
    <div>
      <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
        <h1 className="font-display text-3xl font-bold">
          Custom Cake Requests
        </h1>

        <Input
          type="text"
          placeholder="Search Request ID or Customer..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-72"
        />
      </div>
      <div className="bg-white border border-[#E6DFD5] rounded-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Request ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Type / Size</TableHead>
              <TableHead>Delivery</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Delivered</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCakes.map((c) => (
              <TableRow key={c.id}>
                <TableCell className="text-xs text-[#5C4A3D]">{c.id}</TableCell>
                <TableCell><div>{c.user_name}</div><div className="text-xs text-[#5C4A3D]">{c.phone}</div></TableCell>
                <TableCell>{c.cake_type} / {c.cake_size}<br /><span className="text-xs">{c.flavor}</span></TableCell>
                <TableCell className="text-xs">{c.delivery_date}<br />{c.delivery_time}</TableCell>
                <TableCell>{c.custom_price ? `₹${c.custom_price}` : "—"}</TableCell>
                <TableCell><Badge variant={statusVariant[c.status] || "outline"}>{c.status.replace("_", " ")}</Badge></TableCell>
                <TableCell className="text-xs">{c.delivered_at ? new Date(c.delivered_at).toLocaleString() : "—"}</TableCell>
                <TableCell>
                  <Button size="sm" variant="outline" onClick={() => {
                    setSelected(c);
                    setCustomPrice(c.custom_price || "");
                    setRejectionReason(c.rejection_reason || "");
                  }}>
                    <Eye className="w-3 h-3" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!selected} onOpenChange={(open) => {
        if (!open) {
          setSelected(null);
          setCustomPrice("");
          setRejectionReason("");
        }
      }}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Custom Cake Request</DialogTitle></DialogHeader>
          {selected && (
            <div className="space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-2">
                <div><b>Customer:</b> {selected.user_name}</div>
                <div><b>Email:</b> {selected.user_email}</div>
                <div><b>Phone:</b> {selected.phone}</div>
                <div><b>Quantity:</b> {selected.quantity}</div>
                <div><b>Type:</b> {selected.cake_type}</div>
                <div><b>Size:</b> {selected.cake_size}</div>
                <div><b>Flavor:</b> {selected.flavor}</div>
                <div><b>Delivery:</b> {selected.delivery_date} {selected.delivery_time}</div>
                <div className="col-span-2"><b>Address:</b> {selected.address}</div>
                {selected.message && <div className="col-span-2"><b>Message:</b> {selected.message}</div>}
              </div>
              {selected.reference_image && (
                <div className="space-y-2">
                  <img src={selected.reference_image} alt="Reference" className="w-full h-40 object-cover rounded-lg" />
                  <a
                    href={selected.reference_image}
                    download={`custom-cake-${selected.id}-reference`}
                    className="inline-flex items-center text-sm text-[#06d2d9] hover:underline"
                  >
                    Download reference image
                  </a>
                </div>
              )}
              <div className="flex gap-2 items-end">
                <div className="flex-1">
                  <label className="text-xs font-medium">Custom Price (₹)</label>
                  <Input
                    type="number"
                    value={customPrice}
                    onChange={(e) => setCustomPrice(e.target.value)}
                    placeholder="Set custom pricing"
                    disabled={selected.status === "delivered" || selected.status === "rejected" || (selected.status === "approved" && selected.custom_price != null)}
                  />
                  {selected.status === "approved" && selected.custom_price != null && (
                    <div className="text-xs text-slate-500 mt-1">Price locked after approval.</div>
                  )}
                  {selected.status === "delivered" && (
                    <div className="text-xs text-slate-500 mt-1">Request delivered. No further actions allowed.</div>
                  )}
                </div>
              </div>
              {selected.status === "rejected" && selected.rejection_reason && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-red-700">
                  <div className="font-semibold">Rejection Reason</div>
                  <div>{selected.rejection_reason}</div>
                </div>
              )}
              {!["delivered", "rejected"].includes(selected.status) && (
                <Textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Reason for rejection"
                />
              )}
              <div className="flex flex-wrap gap-2">
                <Button
                  className="btn-primary flex-1"
                  onClick={() => update(selected.id, { custom_price: +customPrice, status: "approved" })}
                  disabled={selected.status === "delivered" || selected.status === "rejected" || (selected.status === "approved" && selected.custom_price != null)}
                >
                  <CheckCircle className="w-4 h-4 mr-1" /> Approve with Price
                </Button>
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => update(selected.id, { status: "delivered" })}
                  disabled={selected.status === "delivered" || selected.status === "rejected"}
                >
                  Deliver
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => update(selected.id, { status: "rejected", rejection_reason: rejectionReason.trim() })}
                  disabled={selected.status === "delivered" || selected.status === "rejected"}
                >
                  Reject
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
