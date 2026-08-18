import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const STATUS_STYLE = {
  placed: "bg-amber-100 text-amber-800",
  confirmed: "bg-blue-100 text-blue-800",
  rider_assigned: "bg-indigo-100 text-indigo-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
  pending: "bg-amber-100 text-amber-800",
  approved: "bg-emerald-100 text-emerald-800",
  rejected: "bg-red-100 text-red-800",
};

const formatDateTime = (value) => {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "—" : date.toLocaleString();
};

const formatCurrency = (value) => {
  if (value == null) return "Price pending";
  try {
    return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(value);
  } catch (e) {
    return `₹${Number(value).toFixed(0)}`;
  }
};

export default function MyOrders() {
  const { user, loading } = useAuth();
  const [orders, setOrders] = useState([]);
  const [customCakes, setCustomCakes] = useState([]);

  useEffect(() => {
    if (!user) return;
    api.get("/orders/my").then((r) => setOrders(r.data));
    api.get("/custom-cakes/my").then((r) => setCustomCakes(r.data));
  }, [user]);

  if (loading)
    return (
      <div className="py-20 text-center">
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="h-8 w-1/3 bg-slate-200 rounded-md mx-auto animate-pulse" />
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white border border-[#E6DFD5] rounded-2xl p-5 flex items-center gap-4 animate-pulse">
                <div className="h-12 w-12 bg-slate-200 rounded-md" />
                <div className="flex-1">
                  <div className="h-4 bg-slate-200 rounded w-3/4 mb-2" />
                  <div className="h-3 bg-slate-200 rounded w-1/2" />
                </div>
                <div className="h-8 w-24 bg-slate-200 rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  if (!user) return <Navigate to="/login" />;

  const items = [...orders.map((o) => ({ ...o, itemType: "order" })), ...customCakes.map((c) => ({ ...c, itemType: "custom" }))].sort(
    (a, b) => new Date(b.created_at) - new Date(a.created_at)
  );

  return (
    <div className="max-w-5xl mx-auto px-4 py-10" data-testid="my-orders-page">
      <h1 className="font-display text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-[#5C4A3D] to-[#06d2d9] bg-clip-text text-transparent">My Orders</h1>
      <style>{`
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(8px);} to { opacity: 1; transform: translateY(0);} }
      `}</style>
      {items.length === 0 ? (
        <div className="text-center py-16 text-[#5C4A3D]">No orders yet. <Link to="/categories" className="text-[#06d2d9] font-semibold">Start shopping</Link></div>
      ) : (
        <div className="space-y-3">
          {items.map((o, index) => {
            const isCustom = o.itemType === "custom";
            const detailLink = isCustom ? `/custom-cakes/${o.id}` : `/orders/${o.id}`;
            const subtitle = isCustom
              ? `${o.quantity} qty · ${o.custom_price ? formatCurrency(o.custom_price) : "Price pending"}`
              : `${o.items?.length} items · ${formatCurrency(o.total)} · ${o.payment_method || ""}`;
            const heading = isCustom ? `Custom Cake Request #${String(o.id).slice(-6)}` : o.order_no;

            return (
              <div
                key={o.id}
                className="bg-white border border-[#E6DFD5] rounded-2xl p-5 flex flex-col md:flex-row gap-4 md:items-center transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
                data-testid={isCustom ? `custom-order-${o.id}` : `order-${o.order_no}`}
                style={{ animation: `fadeInUp 320ms ease ${index * 50}ms forwards`, opacity: 0 }}
              >
                <div className="flex items-start gap-3 md:flex-1">
                  <div className="flex-shrink-0">
                    {isCustom ? (
                      <div className="h-14 w-14 rounded-lg bg-gradient-to-br from-pink-50 to-pink-100 flex items-center justify-center">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C10.8954 2 10 2.89543 10 4C10 5.10457 10.8954 6 12 6C13.1046 6 14 5.10457 14 4C14 2.89543 13.1046 2 12 2Z" stroke="#D946EF" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/><path d="M20 8C20 7.44772 19.5523 7 19 7H5C4.44772 7 4 7.44772 4 8V14C4 17 7 19 12 19C17 19 20 17 20 14V8Z" stroke="#FB7185" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </div>
                    ) : (
                      <div className="h-14 w-14 rounded-lg bg-gradient-to-br from-amber-50 to-amber-100 flex items-center justify-center">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M21 16V8C21 6.89543 20.1046 6 19 6H5C3.89543 6 3 6.89543 3 8V16" stroke="#06d2d9" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/><path d="M7 10V6" stroke="#06d2d9" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/><path d="M17 10V6" stroke="#06d2d9" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <div className="font-semibold text-slate-800">{heading}</div>
                      <Badge className={`${STATUS_STYLE[o.status] || "bg-slate-100 text-slate-800"} ${o.status === 'pending' || o.status === 'placed' ? 'animate-pulse' : ''}`}>{o.status.replace("_", " ")}</Badge>
                    </div>
                    <div className="text-xs text-[#5C4A3D] mt-1">
                      <div className="capitalize">{isCustom ? "Custom cake request" : "Order"}</div>
                      <div>Ordered: {formatDateTime(o.created_at)}</div>
                      {o.status === "delivered" && o.delivered_at && <div>Delivered: {formatDateTime(o.delivered_at)}</div>}
                    </div>
                    <div className="text-sm mt-2 text-slate-700">{subtitle}</div>
                    {o.status === "cancelled" && o.cancellation_reason && (
                      <div className="text-sm text-red-600 mt-2">Cancellation reason: {o.cancellation_reason}</div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Link to={detailLink}>
                    <Button variant="outline" className="rounded-full px-4 py-2">View Details</Button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
