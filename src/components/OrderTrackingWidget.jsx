import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";
import { Truck, CheckCircle2, Package, ChefHat, X, } from "lucide-react";
import { Link } from "react-router-dom";
const STAGES = [
  {
    key: "placed",
    label: "Order Placed",
    icon: Package,
  },
  {
    key: "confirmed",
    label: "Confirmed",
    icon: ChefHat,
  },
  {
    key: "rider_assigned",
    label: "Rider Assigned",
    icon: Truck,
  },
  {
    key: "delivered",
    label: "Delivered",
    icon: CheckCircle2,
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
  const currentIdx = STAGES.findIndex(
    (s) => s.key === order.status
  );
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
        md:w-[650px]
      "
      data-testid="tracking-widget"
    >
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
      <div className="overflow-x-auto px-4 py-3 sm:px-6">
        <div className="flex w-full items-start">
          {STAGES.map((s, i) => {
            const active = i <= currentIdx;
            const current = i === currentIdx;
            const Icon = s.icon;
            return (
              <div
                key={s.key}
                className="flex min-w-0 flex-1 items-start"
              >
                <div className="flex min-w-[120px] flex-col items-center text-center">
                  <div
                    className={`
                      flex
                      h-8
                      w-8
                      items-center
                      justify-center
                      rounded-full
                      transition-all
                      duration-300
                      sm:h-10
                      sm:w-10
                      ${active
                        ? "bg-[#06d2d9] text-white"
                        : "bg-[#FBF5EA] text-[#5C4A3D]"
                      }
                      ${current
                        ? "animate-pulseDot ring-3 ring-[#06d2d9]/20"
                        : ""
                      }
                    `}
                  >
                    <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                  </div>
                  <div
                    className={`
                      mt-2
                      w-full
                      px-0.5
                      text-[9px]
                      leading-3
                      sm:text-xs
                      sm:leading-4
                      ${active
                        ? "font-semibold text-[#2D1E16]"
                        : "text-[#5C4A3D]"
                      }
                    `}
                  >
                    {s.label}
                  </div>
                </div>
                {i < STAGES.length - 1 && (
                  <div
                    className={`
                      mt-4
                      h-[2px]
                      w-full
                      shrink
                      transition-all
                      duration-300
                      sm:mt-5
                      ${i < currentIdx
                        ? "bg-[#06d2d9]"
                        : "bg-[#E6DFD5]"
                      }
                    `}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
      <div className="border-t border-[#E6DFD5] px-3 py-2.5 sm:px-5 sm:py-3">
        <Link
          to={`/orders/${order.id}`}
          className="
            block
            text-center
            text-[10px]
            font-semibold
            uppercase-tracked
            text-[#06d2d9]
            hover:underline
            sm:text-xs
          "
        >
          View Details
        </Link>
      </div>
    </div>
  );
}