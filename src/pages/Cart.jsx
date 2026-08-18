import { useEffect, useState } from "react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useLocation } from "@/context/LocationContext";
import { useProducts } from "@/context/ProductContext";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Minus, Plus, Trash2, Ticket, Clock, Cake, Sunrise, MoonStar, } from "lucide-react";
import CouponUnlock from "@/components/CouponUnlock";
import api from "@/lib/api";
import { toast } from "sonner";

const PLATFORM_FEE = 9, DELIVERY = 39, PACKAGING = 10;

export default function Cart() {
  const { items, updateQty, subtotal, clearCart } = useCart();
  const { user } = useAuth();
  const { status } = useLocation();
  const { products: catalogProducts } = useProducts();
  const nav = useNavigate();
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const [applied, setApplied] = useState("");
  const [payment, setPayment] = useState("COD");
  const [placing, setPlacing] = useState(false);

  const total = Math.max(0, subtotal + PLATFORM_FEE + DELIVERY + PACKAGING - discount);
  const resetCoupon = () => {
    setDiscount(0);
    setApplied("");
    setCoupon("");
  };

  useEffect(() => {
    if (!applied) {
      if (discount > 0) {
        setDiscount(0);
      }
      return;
    }

    if (!items.length) {
      resetCoupon();
      return;
    }

    const revalidateCoupon = async () => {
      try {
        const { data } = await api.post("/coupons/validate", { code: applied, subtotal });
        setDiscount(data.discount);
        setApplied(data.code);
      } catch {
        resetCoupon();
      }
    };

    revalidateCoupon();
  }, [applied, items.length, subtotal]);

  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const OPEN_TIME = 11 * 60; // 11:00 AM
  const CLOSE_TIME = 22 * 60; // 11:00 PM
  const inHours = currentMinutes >= OPEN_TIME && currentMinutes < CLOSE_TIME;
  const beforeOpen = currentMinutes < OPEN_TIME;
  const afterClose = currentMinutes >= CLOSE_TIME;

  const resolvedItems = items.map((i) => {
    const productInfo = catalogProducts.find((p) => p.id === i.product_id) || i.product;
    return { ...i, resolvedProduct: productInfo };
  });
  const hasOutOfStock = resolvedItems.some((i) => !i.resolvedProduct?.in_stock || (i.resolvedProduct?.stock ?? 0) <= 0);
  const disabledPlaceOrder = placing || !inHours || hasOutOfStock;

  const apply = async () => {
    try {
      const { data } = await api.post("/coupons/validate", { code: coupon, subtotal });
      setDiscount(data.discount); setApplied(data.code); toast.success(data.message);
    } catch (e) {
      resetCoupon();
      toast.error(e?.response?.data?.detail || "Invalid coupon");
    }
  };

  const place = async () => {
    if (!user) { toast.error("Please login first"); nav("/login"); return; }
    if (!inHours) { toast.error("Orders accepted 11 AM – 11 PM only"); return; }
    if (hasOutOfStock) { toast.error("Please remove the out-of-stock item(s) to place your order."); return; }
    if (status && !status.in_range) { toast.error("Delivery unavailable at your location"); return; }
    if (!items.length) return;
    setPlacing(true);
    try {
      const payload = {
        items: items.map(i => ({ product_id: i.product_id, name: i.product?.name, price: i.product?.discount_price, quantity: i.quantity, weight: i.weight })),
        subtotal, platform_fee: PLATFORM_FEE, delivery_charge: DELIVERY, packaging: PACKAGING,
        discount, total, coupon_code: applied || null,
        address: user.address, phone: user.phone, payment_method: payment,
        lat: status?.lat, lng: status?.lng,
      };
      const { data } = await api.post("/orders", payload);
      toast.success(`Order placed! ${data.order_no}`);
      await clearCart();
      nav(`/orders/${data.id}`);
    } catch (e) { toast.error("Failed to place order"); }
    setPlacing(false);
  };

  if (!items.length) return (
    <div className="max-w-2xl mx-auto text-center py-20 px-4" data-testid="empty-cart">
      <div className="text-6xl mb-4"><Cake className="w-24 h-24 text-[#06d2d9] animate-bounce mx-auto" /></div>
      <h2 className="font-display text-2xl font-bold">Your cart is empty</h2>
      <p className="text-[#5C4A3D] mt-2">Add some fresh bakery goodness to get started.</p>
      <Link to="/categories" className="btn-primary inline-block mt-6 rounded-full px-6 py-2.5 text-sm uppercase-tracked">Shop Now</Link>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8" data-testid="cart-page">
      <h1 className="font-display text-3xl md:text-4xl font-bold mb-6">Your Cart</h1>
      <div className="grid lg:grid-cols-[1fr_400px] gap-6">
        <div className="space-y-3">
          <CouponUnlock />
          {resolvedItems.map((i) => {
            const itemStock = i.resolvedProduct?.stock ?? 0;
            const itemOutOfStock = !i.resolvedProduct?.in_stock || itemStock <= 0;
            return (
              <div key={i.product_id + (i.weight || "")} className="bg-white border border-[#E6DFD5] rounded-2xl p-4 flex gap-4" data-testid={`cart-item-${i.product_id}`}>
                <img src={i.resolvedProduct?.images?.[0]} alt={i.resolvedProduct?.name} className="w-20 h-20 rounded-xl object-cover" />
                <div className="flex-1 min-w-0">
                  <div className="font-semibold">{i.resolvedProduct?.name}</div>
                  <div className="text-xs text-[#5C4A3D]">{i.weight}</div>
                  {itemOutOfStock && (
                    <div className="mt-1 text-xs text-red-600 font-semibold uppercase-tracked">Out of Stock</div>
                  )}
                  <div className="mt-1 font-bold">₹{(i.resolvedProduct?.discount_price || 0) * i.quantity}</div>
                </div>
                <div className="flex flex-col items-end justify-between">
                  <button onClick={() => updateQty(i.product_id, 0)} data-testid={`remove-${i.product_id}`}>
                    <Trash2 className="w-4 h-4 text-[#BE123C]" />
                  </button>
                  <div className="flex items-center border border-[#E6DFD5] rounded-full">
                    <button onClick={() => updateQty(i.product_id, i.quantity - 1)} className="w-8 h-8 flex items-center justify-center"><Minus className="w-3 h-3" /></button>
                    <div className="w-8 text-center text-sm">{i.quantity}</div>
                    <button
                      onClick={() => updateQty(i.product_id, i.quantity + 1)}
                      disabled={itemOutOfStock || i.quantity >= itemStock}
                      className="w-8 h-8 flex items-center justify-center disabled:opacity-50"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="space-y-4 lg:sticky lg:top-24 h-fit">
          {hasOutOfStock && (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              Please remove the out-of-stock item(s) to place your order.
            </div>
          )}
          <div className="bg-white border border-[#E6DFD5] rounded-2xl p-5" data-testid="order-summary">
            <h3 className="font-display text-xl font-bold mb-4">Order Summary</h3>
            <div className="flex gap-2 mb-4">
              <div className="flex-1 relative">
                <Ticket className="w-4 h-4 text-[#5C4A3D] absolute left-3 top-1/2 -translate-y-1/2" />
                <Input value={coupon} onChange={(e) => setCoupon(e.target.value.toUpperCase())} placeholder="Coupon code" className="pl-9 rounded-full" data-testid="coupon-input" />
              </div>
              <Button onClick={apply} className="btn-primary rounded-full" data-testid="apply-coupon">Apply</Button>
            </div>
            <div className="space-y-2 text-sm">
              <Row label="Subtotal" val={`₹${subtotal.toFixed(0)}`} />
              <Row label="Platform Fee" val={`₹${PLATFORM_FEE}`} />
              <Row label="Delivery Charge" val={`₹${DELIVERY}`} />
              <Row label="Packaging" val={`₹${PACKAGING}`} />
              {discount > 0 && <Row label={`Coupon (${applied})`} val={`- ₹${discount}`} color="text-[#4D7C0F]" />}
              <div className="border-t border-[#E6DFD5] pt-2 mt-2 flex justify-between font-bold text-lg">
                <span>Grand Total</span><span data-testid="grand-total">₹{total.toFixed(0)}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-4 text-xs text-[#5C4A3D]">
              <Clock className="w-3.5 h-3.5" />
              Estimated delivery within 25 minutes
            </div>

            {!inHours && (
              <div className="mt-4 rounded-xl border border-amber-300 bg-amber-50 p-4">
                <div className="font-semibold text-amber-700">
                  <div className="flex items-center gap-2 font-semibold text-amber-700">
                    {beforeOpen ? (
                      <>
                        <Sunrise className="w-5 h-5 text-amber-500" />
                        <span>Shop Opens at 11:00 AM</span>
                      </>
                    ) : (
                      <>
                        <MoonStar className="w-5 h-5 text-indigo-600" />
                        <span>Shop Closed</span>
                      </>
                    )}
                  </div>
                </div>

                <p className="text-sm text-amber-600 mt-2 leading-6">
                  {beforeOpen
                    ? "Our bakers are preparing today's fresh breads, cakes, and pastries. A little patience brings the freshest flavors! We'll start accepting orders at 11:00 AM."
                    : "Thank you for choosing SLV Bakery! Our ovens are resting for the night. We'll reopen tomorrow at 11:00 AM with freshly baked delights waiting for you."}
                </p>
              </div>
            )}
          </div>

          <div className="bg-white border border-[#E6DFD5] rounded-2xl p-5">
            <h3 className="font-display text-lg font-bold mb-3">Payment Method</h3>
            <label className="flex items-center gap-3 p-3 rounded-xl border border-[#E6DFD5] cursor-pointer mb-2">
              <input type="radio" checked={payment === "COD"} onChange={() => setPayment("COD")} data-testid="pay-cod" />
              <div><div className="font-semibold text-sm">Cash on Delivery</div><div className="text-xs text-[#5C4A3D]">Pay when your order arrives</div></div>
            </label>
            <label className="flex items-center gap-3 p-3 rounded-xl border border-[#E6DFD5] cursor-not-allowed opacity-60">
              <input type="radio" disabled />
              <div><div className="font-semibold text-sm">Online Payment</div><div className="text-xs text-[#5C4A3D]">Coming Soon</div></div>
            </label>
          </div>

          <Button
            onClick={place}
            disabled={disabledPlaceOrder}
            className={`rounded-full w-full h-12 text-base ${disabledPlaceOrder
                ? "bg-gray-300 text-gray-600 cursor-not-allowed hover:bg-gray-300"
                : "btn-primary"
              }`}
            data-testid="place-order-btn"
          >
            {placing
              ? "Placing..."
              : inHours
                ? `Place Order · ₹${total.toFixed(0)}`
                : beforeOpen
                  ? "Orders Open at 11:00 AM"
                  : "Reopens Tomorrow at 11:00 AM"}
          </Button>
        </div>
      </div>
    </div>
  );
}

const Row = ({ label, val, color = "" }) => (
  <div className={`flex justify-between ${color}`}><span>{label}</span><span>{val}</span></div>
);
