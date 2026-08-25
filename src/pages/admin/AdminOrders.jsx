import { useEffect, useRef, useState } from "react";
import api, { formatErr } from "@/lib/api";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, Eye } from "lucide-react";

const STATUS = ["placed", "confirmed", "rider_assigned", "delivered", "cancelled"];
const statusVariant = { placed: "warning", confirmed: "secondary", rider_assigned: "secondary", delivered: "success", cancelled: "destructive" };

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [selected, setSelected] = useState(null);
  const [rider, setRider] = useState("");
  const [riderPhone, setRiderPhone] = useState("");
  const [cancellationReason, setCancellationReason] = useState("");
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const seenOrderIdsRef = useRef(new Set());
  const hasLoadedRef = useRef(false);

  const playNewOrderSound = () => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;

      const ctx = new AudioCtx();

      const playBeep = (time, freq) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, time);

        gain.gain.setValueAtTime(0.4, time);
        gain.gain.exponentialRampToValueAtTime(0.001, time + 0.25);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(time);
        osc.stop(time + 0.25);
      };

      playBeep(ctx.currentTime, 900);
      playBeep(ctx.currentTime + 0.3, 1200);

      setTimeout(() => ctx.close(), 1000);
    } catch { }
  };

  const load = async () => {
    try {
      const { data } = await api.get("/admin/orders");
      const incomingIds = new Set(data.map((o) => o.id));
      const newOrders = data.filter((o) => !seenOrderIdsRef.current.has(o.id));

      if (hasLoadedRef.current && newOrders.length) {
        playNewOrderSound();
      }

      seenOrderIdsRef.current = incomingIds;
      hasLoadedRef.current = true;
      setOrders(data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    load();
    const interval = window.setInterval(() => load(), 5000);
    return () => window.clearInterval(interval);
  }, []);

  const updateStatus = async (oid, status) => {
    try {
      if (status === "cancelled" && !cancellationReason.trim()) {
        toast.error("Please enter a cancellation reason.");
        return;
      }

      if (status === "rider_assigned") {
        if (!rider.trim() || !riderPhone.trim()) {
          toast.error("Please enter both rider name and rider phone number.");
          return;
        }
      }

      const payload = { status };
      if (status === "rider_assigned") {
        payload.rider_name = rider.trim();
        payload.rider_phone = riderPhone.trim();
      }
      if (status === "cancelled") payload.cancellation_reason = cancellationReason.trim();
      await api.put(`/admin/orders/${oid}/status`, payload);
      toast.success(`Order ${status}`);
      load();
      setSelected(null);
      setRider("");
      setRiderPhone("");
      setCancellationReason("");
    } catch (e) { toast.error(formatErr(e)); }
  };

  const downloadInvoice = async (oid) => {
    try {
      const { data } = await api.get(`/admin/orders/${oid}/invoice`, { responseType: "text" });
      const w = window.open("", "_blank");
      w.document.write(data);
      w.document.close();
    } catch (e) { toast.error(formatErr(e)); }
  };

  const filtered = orders.filter((o) => {
    const matchesStatus =
      filter === "all" || o.status === filter;

    const searchText = search.trim().toLowerCase();

    const matchesSearch =
      !searchText ||
      String(o.order_no || "").toLowerCase().includes(searchText) ||
      String(o.user_name || "").toLowerCase().includes(searchText) ||
      String(o.user_email || "").toLowerCase().includes(searchText) ||
      String(o.phone || "").toLowerCase().includes(searchText);

    return matchesStatus && matchesSearch;
  });
  const formatDateTime = (value) => {
    if (!value) return "—";
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? "—" : date.toLocaleString();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
        <h1 className="font-display text-3xl font-bold">
          Order Management
        </h1>

        <div className="flex items-center gap-3 flex-wrap">
          <Input
            type="text"
            placeholder="Search Order or Customer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-72"
          />

          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="all">All Orders</SelectItem>

              {STATUS.map((s) => (
                <SelectItem key={s} value={s}>
                  {s.replace("_", " ")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="bg-white border border-[#E6DFD5] rounded-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order #</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Rider Phone</TableHead> 
              <TableHead>Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((o) => (
              <TableRow key={o.id}>
                <TableCell className="font-medium">{o.order_no}</TableCell>
                <TableCell><div>{o.user_name}</div><div className="text-xs text-[#5C4A3D]">{o.user_email}</div></TableCell>
                <TableCell>₹{o.total}</TableCell>
                <TableCell><Badge variant={statusVariant[o.status]}>{o.status}</Badge></TableCell>
                <TableCell className="text-xs">{o.rider_phone || "—"}</TableCell>
                <TableCell className="text-xs">{new Date(o.created_at).toLocaleDateString()}</TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button size="sm" variant="outline" onClick={() => { setSelected(o); setRider(o.rider_name || ""); setRiderPhone(o.rider_phone || ""); setCancellationReason(o.cancellation_reason || ""); }}><Eye className="w-3 h-3" /></Button>
                    <Button size="sm" variant="outline" onClick={() => downloadInvoice(o.id)}><Download className="w-3 h-3" /></Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!selected} onOpenChange={(open) => {
        if (!open) {
          setSelected(null);
          setRider("");
          setRiderPhone("");
          setCancellationReason("");
        }
      }}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Order {selected?.order_no}</DialogTitle></DialogHeader>
          {selected && (
            <div className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-2">
                <div><b>Status:</b> <Badge variant={statusVariant[selected.status]}>{selected.status}</Badge></div>
                <div><b>Payment:</b> {selected.payment_method}</div>
                <div><b>Customer:</b> {selected.user_name}</div>
                <div><b>Phone:</b> {selected.phone}</div>
                <div className="col-span-2"><b>Address:</b> {selected.address}</div>
                <div><b>Order Date:</b> {formatDateTime(selected.created_at)}</div>
                <div><b>Delivered Date:</b> {formatDateTime(selected.delivered_at)}</div>
              </div>
              {selected.cancellation_reason && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-red-700">
                  <div className="font-semibold">Cancellation Reason</div>
                  <div>{selected.cancellation_reason}</div>
                </div>
              )}
              <div><b>Items:</b>
                {selected.items?.map((i, k) => (
                  <div key={k} className="flex justify-between py-1 border-b border-[#F3EEE4]">
                    <span>{i.name} x{i.quantity}</span><span>₹{(i.price * i.quantity).toFixed(0)}</span>
                  </div>
                ))}
              </div>
              {selected.status === "placed" && (
                <Button className="btn-primary w-full" onClick={() => updateStatus(selected.id, "confirmed")}>Confirm Order</Button>
              )}
              {["confirmed", "placed"].includes(selected.status) && (
                <div className="space-y-2">
                  <Input placeholder="Rider name" value={rider} onChange={(e) => setRider(e.target.value)} />
                  <Input placeholder="Rider phone number" value={riderPhone} onChange={(e) => setRiderPhone(e.target.value)} />
                  <Button className="w-full bg-red-50 text-red-700" onClick={() => updateStatus(selected.id, "rider_assigned")}>Assign Rider</Button>
                </div>
              )}
              {selected.status === "rider_assigned" && (
                <Button className="btn-primary w-full" onClick={() => updateStatus(selected.id, "delivered")}>Mark Delivered</Button>
              )}
              {!['delivered', 'cancelled'].includes(selected.status) && (
                <div className="space-y-2">
                  <Textarea
                    placeholder="Reason for cancellation"
                    value={cancellationReason}
                    onChange={(e) => setCancellationReason(e.target.value)}
                  />
                  <Button variant="destructive" className="w-full" onClick={() => updateStatus(selected.id, "cancelled")}>Cancel Order</Button>
                </div>
              )}
              <Button variant="outline" className="w-full" onClick={() => downloadInvoice(selected.id)}>
                <Download className="w-4 h-4 mr-1" /> Download Invoice
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
