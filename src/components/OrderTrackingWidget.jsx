import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";
import { Truck, CheckCircle2, Package, ChefHat, X } from "lucide-react";
import { Link } from "react-router-dom";

const STAGES = [
  { key: "placed", label: "Order Placed", icon: Package },
  { key: "confirmed", label: "Confirmed", icon: ChefHat },
  { key: "rider_assigned", label: "Rider Assigned", icon: Truck },
  { key: "delivered", label: "Delivered", icon: CheckCircle2 },
];

export default function OrderTrackingWidget() {
  const { user } = useAuth();
  const [order, setOrder] = useState(null);
  const [open, setOpen] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetch = async () => {
      try {
        const { data } = await api.get("/orders/active");
        setOrder(data && data.id ? data : null);
      } catch {}
    };
    fetch();
    const int = setInterval(fetch, 5000);
    return () => clearInterval(int);
  }, [user]);

  if (!order || !open) return null;
  const currentIdx = STAGES.findIndex((s) => s.key === order.status);

  return (
    <div className="fixed bottom-24 right-4 md:right-6 z-30 w-[300px] bg-white rounded-2xl card-shadow-lg border border-[#E6DFD5] overflow-hidden animate-fadeUp" data-testid="tracking-widget">
      <div className="bg-[#2D1E16] text-white px-4 py-3 flex items-center justify-between">
        <div>
          <div className="text-xs uppercase-tracked text-[#F59E0B]">Live Order</div>
          <div className="text-sm font-semibold">{order.order_no}</div>
        </div>
        <button onClick={() => setOpen(false)}><X className="w-4 h-4" /></button>
      </div>
      <div className="p-4 space-y-3">
        {STAGES.map((s, i) => {
          const active = i <= currentIdx;
          const current = i === currentIdx;
          const Icon = s.icon;
          return (
            <div key={s.key} className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${active ? "bg-[#06d2d9] text-white" : "bg-[#FBF5EA] text-[#5C4A3D]"} ${current ? "animate-pulseDot" : ""}`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className={`text-sm ${active ? "font-semibold text-[#2D1E16]" : "text-[#5C4A3D]"}`}>{s.label}</div>
            </div>
          );
        })}
        <Link to={`/orders/${order.id}`} className="block text-center mt-3 text-xs uppercase-tracked text-[#06d2d9] hover:underline">
          View Details
        </Link>
      </div>
    </div>
  );
}
