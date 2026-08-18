import { Link } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { ShoppingBag, ArrowRight } from "lucide-react";

export default function FloatingCart() {
  const { items, count, subtotal } = useCart();
  if (!items?.length) return null;
  return (
    <Link to="/cart" data-testid="floating-cart"
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-30 w-[92%] max-w-md bg-[#2D1E16] text-white rounded-2xl p-4 flex items-center justify-between card-shadow-lg hover:bg-[#3E2A1F] transition-colors">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-[#06d2d9] flex items-center justify-center">
          <ShoppingBag className="w-5 h-5" />
        </div>
        <div>
          <div className="text-sm font-semibold">{count} item{count > 1 ? "s" : ""} · ₹{subtotal.toFixed(0)}</div>
          <div className="text-xs text-[#D4C7BB]">Delivered in 25 min</div>
        </div>
      </div>
      <div className="flex items-center gap-1.5 uppercase-tracked text-xs">View Cart <ArrowRight className="w-4 h-4" /></div>
    </Link>
  );
}
