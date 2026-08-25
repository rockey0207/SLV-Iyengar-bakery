import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";
import {Truck,CheckCircle2,Package,ChefHat,X,} from "lucide-react";
import { Link } from "react-router-dom";

const STAGES = [
  {
    key: "placed",
    label: "Order Placed",
    icon: Package,
    desc: "Your order has been received.",
  },
  {
    key: "confirmed",
    label: "Confirmed",
    icon: ChefHat,
    desc: "Bakery is preparing your order.",
  },
  {
    key: "rider_assigned",
    label: "Out for Delivery",
    icon: Truck,
    desc: "Your order is on the way and will be delivered to you soon.",
  },
  {
    key: "delivered",
    label: "Delivered",
    icon: CheckCircle2,
    desc: "Order delivered successfully.",
  },
];

export default function OrderTrackingWidget() {
  const { user } = useAuth();
  const [order, setOrder] = useState(null);
  const [open, setOpen] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchOrder = async () => {
      try {
        const { data } = await api.get("/orders/active");
        setOrder(data && data.id ? data : null);
      } catch { }
    };

    fetchOrder();

    const int = setInterval(fetchOrder, 5000);

    return () => clearInterval(int);
  }, [user]);

  if (!order || !open) return null;

  const currentStage =
    STAGES.find((s) => s.key === order.status) || STAGES[0];

  const Icon = currentStage.icon;

  return (
    <div
      className="
        fixed
        bottom-4
        left-3
        right-3
        z-30
        overflow-hidden
        rounded-2xl
        border
        border-[#E6DFD5]
        bg-white
        shadow-xl
        animate-fadeUp
        sm:left-4
        sm:right-4
        md:bottom-8
        md:left-auto
        md:right-6
        md:w-[420px]
      "
      data-testid="tracking-widget"
    >
      {/* Header */}
      <div className="flex items-center justify-between bg-[#2D1E16] px-3 py-2.5 text-white sm:px-5 sm:py-3">
        <div className="min-w-0">
          <div className="text-[10px] uppercase-tracked text-[#F59E0B] sm:text-xs">
            Live Order
          </div>
          <div className="truncate text-xs font-semibold sm:text-sm">
            {order.order_no}
          </div>
        </div>
        <button
          onClick={() => setOpen(false)}
          className="ml-3 shrink-0 rounded-full p-1 hover:bg-white/10"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      {/* Active Stage */}
      <div className="px-4 py-4 sm:px-5">
        <div className="flex items-center justify-between gap-4">
          {/* Stage Information */}
          <div className="flex items-center gap-3 min-w-0">
            {/* Icon */}
            <div
              className="
              flex
              h-12
              w-12
              shrink-0
              items-center
              justify-center
              rounded-full
              bg-[#06d2d9]
              text-white
              shadow-md
              animate-pulseDot
            "
            >
              <Icon className="h-6 w-6" />
            </div>
            {/* Text */}
            <div className="min-w-0">
              <div className="text-sm font-bold text-[#2D1E16] sm:text-base">
                {currentStage.label}
              </div>
              <div className="mt-1 text-[11px] leading-4 text-[#5C4A3D] sm:text-xs">
                {currentStage.desc}
              </div>
            </div>
          </div>
          {/* View Details */}
          <Link
            to={`/orders/${order.id}`}
            className="
            shrink-0
            rounded-xl
            bg-[#06d2d9]
            px-3
            py-2
            text-[11px]
            font-semibold
            text-white
            transition
            hover:bg-[#05bcc2]
            sm:px-4
            sm:py-2.5
            sm:text-xs
          "
          >
            Track Order
          </Link>
        </div>
      </div>
    </div>
  );
}