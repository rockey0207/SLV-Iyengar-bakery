import { useState } from "react";
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

const PLATFORM_FEE = 9;
const DELIVERY = 39;
const PACKAGING = 10;

export default function Cart() {
  const { items, updateQty, subtotal, clearCart, coupon, applyCoupon } =
    useCart();
  const { user } = useAuth();
  const { status } = useLocation();
  const { products: catalogProducts } = useProducts();
  const nav = useNavigate();
  const [couponInput, setCouponInput] = useState("");
  const [payment, setPayment] = useState("COD");
  const [placing, setPlacing] = useState(false);
  const discount = coupon?.discount || 0;
  const applied = coupon?.code || "";
  const total = Math.max(
    0,
    subtotal + PLATFORM_FEE + DELIVERY + PACKAGING - discount
  );
  const now = new Date();
  const currentMinutes =
    now.getHours() * 60 + now.getMinutes();
  const OPEN_TIME = 11 * 60;
  const CLOSE_TIME = 22 * 60;
  const inHours =
    currentMinutes >= OPEN_TIME &&
    currentMinutes < CLOSE_TIME;
  const beforeOpen = currentMinutes < OPEN_TIME;
  const afterClose = currentMinutes >= CLOSE_TIME;
  const resolvedItems = items.map((i) => {
    const productInfo =
      catalogProducts.find((p) => p.id === i.product_id) ||
      i.product;
    return {
      ...i,
      resolvedProduct: productInfo,
    };
  });
  const hasOutOfStock = resolvedItems.some(
    (i) =>
      !i.resolvedProduct?.in_stock ||
      (i.resolvedProduct?.stock ?? 0) <= 0
  );
  const disabledPlaceOrder =
    placing ||
    !inHours ||
    hasOutOfStock;
  const apply = async () => {
    if (!couponInput.trim()) return;

    await applyCoupon(couponInput.trim());

    setCouponInput("");
  };
  const place = async () => {
    if (!user) {
      toast.error("Please login first");
      nav("/login");
      return;
    }
    if (!inHours) {
      toast.error("Orders accepted 11 AM – 10 PM only");
      return;
    }
    if (hasOutOfStock) {
      toast.error(
        "Please remove the out-of-stock item(s) to place your order."
      );
      return;
    }
    if (status && !status.in_range) {
      toast.error(
        "Delivery unavailable at your location"
      );
      return;
    }
    if (!items.length) return;
    setPlacing(true);
    try {
      const payload = {
        items: items.map((i) => ({
          product_id: i.product_id,
          name: i.product?.name,
          price: i.product?.discount_price,
          quantity: i.quantity,
          weight: i.weight,
        })),
        subtotal,
        platform_fee: PLATFORM_FEE,
        delivery_charge: DELIVERY,
        packaging: PACKAGING,
        discount,
        total,
        coupon_code: applied || null,
        address: user.address,
        phone: user.phone,
        payment_method: payment,
        lat: status?.lat,
        lng: status?.lng,
      };
      const { data } = await api.post(
        "/orders",
        payload
      );
      toast.success(
        `Order placed! ${data.order_no}`
      );
      await clearCart();
      nav(`/orders/${data.id}`);
    } catch (e) {
      toast.error("Failed to place order");
    }
    setPlacing(false);
  };
  if (!items.length) {
    return (
      <div
        className="mx-auto max-w-2xl px-4 py-20 text-center"
        data-testid="empty-cart"
      >
        <div className="mb-4 text-6xl">
          <Cake className="mx-auto h-24 w-24 animate-bounce text-[#06d2d9]" />
        </div>
        <h2 className="font-display text-2xl font-bold">
          Your cart is empty
        </h2>
        <p className="mt-2 text-[#5C4A3D]">
          Add some fresh bakery goodness to get started.
        </p>
        <Link
          to="/categories"
          className="btn-primary mt-6 inline-block rounded-full px-6 py-2.5 text-sm uppercase-tracked"
        >
          Shop Now
        </Link>
      </div>
    );
  }
  return (
    <div
      className="
        mx-auto
        w-full
        max-w-6xl
        min-w-0
        overflow-x-hidden
        px-4
        py-8
        sm:px-6
        lg:px-8
      "
      data-testid="cart-page"
    >
      <h1 className="mb-6 font-display text-3xl font-bold md:text-4xl">
        Your Cart
      </h1>
      <div
        className="
          grid
          w-full
          min-w-0
          grid-cols-1
          gap-6
          lg:grid-cols-[minmax(0,1fr)_400px]
        "
      >
        <div className="min-w-0 space-y-3">
          <div className="w-full min-w-0 max-w-full overflow-hidden">
            <CouponUnlock horizontal />
          </div>
          {resolvedItems.map((i) => {
            const itemStock =
              i.resolvedProduct?.stock ?? 0;
            const itemOutOfStock =
              !i.resolvedProduct?.in_stock ||
              itemStock <= 0;
            return (
              <div
                key={
                  i.product_id +
                  (i.weight || "")
                }
                className="
                  flex
                  w-full
                  min-w-0
                  gap-3
                  rounded-2xl
                  border
                  border-[#E6DFD5]
                  bg-white
                  p-3
                  sm:gap-4
                  sm:p-4
                "
                data-testid={`cart-item-${i.product_id}`}
              >
                <img
                  src={
                    i.resolvedProduct
                      ?.images?.[0]
                  }
                  alt={
                    i.resolvedProduct?.name
                  }
                  className="
                    h-16
                    w-16
                    shrink-0
                    rounded-xl
                    object-cover
                    sm:h-20
                    sm:w-20
                  "
                />
                <div className="min-w-0 flex-1">
                  <div className="truncate font-semibold">
                    {i.resolvedProduct?.name}
                  </div>
                  <div className="text-xs text-[#5C4A3D]">
                    {i.weight}
                  </div>
                  {itemOutOfStock && (
                    <div
                      className="
                        mt-1
                        text-xs
                        font-semibold
                        uppercase-tracked
                        text-red-600
                      "
                    >
                      Out of Stock
                    </div>
                  )}
                  <div className="mt-1 font-bold">
                    ₹
                    {(i.resolvedProduct
                      ?.discount_price || 0) *
                      i.quantity}
                  </div>
                </div>
                <div
                  className="
                    flex
                    shrink-0
                    flex-col
                    items-end
                    justify-between
                  "
                >
                  <button
                    onClick={() =>
                      updateQty(
                        i.product_id,
                        0
                      )
                    }
                    data-testid={`remove-${i.product_id}`}
                  >
                    <Trash2 className="h-4 w-4 text-[#BE123C]" />
                  </button>
                  <div
                    className="
                      flex
                      items-center
                      rounded-full
                      border
                      border-[#E6DFD5]
                    "
                  >
                    <button
                      onClick={() =>
                        updateQty(
                          i.product_id,
                          i.quantity - 1
                        )
                      }
                      className="
                        flex
                        h-8
                        w-8
                        items-center
                        justify-center
                      "
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <div className="w-8 text-center text-sm">
                      {i.quantity}
                    </div>
                    <button
                      onClick={() =>
                        updateQty(
                          i.product_id,
                          i.quantity + 1
                        )
                      }
                      disabled={
                        itemOutOfStock ||
                        i.quantity >= itemStock
                      }
                      className="
                        flex
                        h-8
                        w-8
                        items-center
                        justify-center
                        disabled:opacity-50
                      "
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div
          className="
            min-w-0
            h-fit
            space-y-4
            lg:sticky
            lg:top-24
          "
        >
          {hasOutOfStock && (
            <div
              className="
                rounded-2xl
                border
                border-red-200
                bg-red-50
                p-4
                text-sm
                text-red-700
              "
            >
              Please remove the out-of-stock
              item(s) to place your order.
            </div>
          )}
          <div
            className="
              rounded-2xl
              border
              border-[#E6DFD5]
              bg-white
              p-4
              sm:p-5
            "
            data-testid="order-summary"
          >
            <h3 className="mb-4 font-display text-xl font-bold">
              Order Summary
            </h3>
            {/* <div className="mb-4 flex w-full gap-2">
              <div className="relative min-w-0 flex-1">
                <Ticket
                  className="
                    absolute
                    left-3
                    top-1/2
                    h-4
                    w-4
                    -translate-y-1/2
                    text-[#5C4A3D]
                  "
                />
                <Input
                  value={couponInput}
                  onChange={(e) =>
                    setCouponInput(
                      e.target.value.toUpperCase()
                    )
                  }
                  placeholder="Coupon code"
                  className="w-full rounded-full pl-9"
                  data-testid="coupon-input"
                />
              </div>
              <Button
                onClick={apply}
                className="shrink-0 rounded-full btn-primary"
                data-testid="apply-coupon"
              >
                Apply
              </Button>
            </div> */}
            <div className="space-y-2 text-sm">
              <Row
                label="Subtotal"
                val={`₹${subtotal.toFixed(0)}`}
              />
              <Row
                label="Platform Fee"
                val={`₹${PLATFORM_FEE}`}
              />
              <Row
                label="Delivery Charge"
                val={`₹${DELIVERY}`}
              />
              <Row
                label="Packaging"
                val={`₹${PACKAGING}`}
              />
              {discount > 0 && (
                <Row
                  label={`Coupon (${applied})`}
                  val={`- ₹${discount}`}
                  color="text-[#4D7C0F]"
                />
              )}
              <div
                className="
                  mt-2
                  flex
                  justify-between
                  border-t
                  border-[#E6DFD5]
                  pt-2
                  text-lg
                  font-bold
                "
              >
                <span>Grand Total</span>
                <span data-testid="grand-total">
                  ₹{total.toFixed(0)}
                </span>
              </div>
            </div>
            <div
              className="
                mt-4
                flex
                items-center
                gap-2
                text-xs
                text-[#5C4A3D]
              "
            >
              <Clock className="h-3.5 w-3.5 shrink-0" />
              <span>
                Estimated delivery within 25 minutes
              </span>
            </div>
            {!inHours && (
              <div
                className="
                  mt-4
                  rounded-xl
                  border
                  border-amber-300
                  bg-amber-50
                  p-4
                "
              >
                <div className="font-semibold text-amber-700">
                  <div className="flex items-center gap-2 font-semibold text-amber-700">
                    {beforeOpen ? (
                      <>
                        <Sunrise className="h-5 w-5 shrink-0 text-amber-500" />
                        <span>
                          Shop Opens at 11:00 AM
                        </span>
                      </>
                    ) : (
                      <>
                        <MoonStar className="h-5 w-5 shrink-0 text-indigo-600" />
                        <span>
                          Shop Closed
                        </span>
                      </>
                    )}
                  </div>
                </div>
                <p className="mt-2 text-sm leading-6 text-amber-600">
                  {beforeOpen
                    ? "Our bakers are preparing today's fresh breads, cakes, and pastries. A little patience brings the freshest flavors! We'll start accepting orders at 11:00 AM."
                    : "Thank you for choosing SLV Bakery! Our ovens are resting for the night. We'll reopen tomorrow at 11:00 AM with freshly baked delights waiting for you."}
                </p>
              </div>
            )}
          </div>
          <div
            className="
              rounded-2xl
              border
              border-[#E6DFD5]
              bg-white
              p-4
              sm:p-5
            "
          >
            <h3 className="mb-3 font-display text-lg font-bold">
              Payment Method
            </h3>
            <label
              className="
                mb-2
                flex
                cursor-pointer
                items-center
                gap-3
                rounded-xl
                border
                border-[#E6DFD5]
                p-3
              "
            >
              <input
                type="radio"
                checked={payment === "COD"}
                onChange={() =>
                  setPayment("COD")
                }
                data-testid="pay-cod"
              />
              <div>
                <div className="text-sm font-semibold">
                  Cash on Delivery
                </div>
                <div className="text-xs text-[#5C4A3D]">
                  Pay when your order arrives
                </div>
              </div>
            </label>
            <label
              className="
                flex
                cursor-not-allowed
                items-center
                gap-3
                rounded-xl
                border
                border-[#E6DFD5]
                p-3
                opacity-60
              "
            >
              <input
                type="radio"
                disabled
              />
              <div>
                <div className="text-sm font-semibold">
                  Online Payment
                </div>
                <div className="text-xs text-[#5C4A3D]">
                  Coming Soon
                </div>
              </div>
            </label>
          </div>
          <Button
            onClick={place}
            disabled={disabledPlaceOrder}
            className={`
              h-12
              w-full
              rounded-full
              text-base
              ${disabledPlaceOrder
                ? "cursor-not-allowed bg-gray-300 text-gray-600 hover:bg-gray-300"
                : "btn-primary"
              }
            `}
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
const Row = ({
  label,
  val,
  color = "",
}) => (
  <div
    className={`flex justify-between gap-4 ${color}`}
  >
    <span className="min-w-0 truncate">
      {label}
    </span>
    <span className="shrink-0">
      {val}
    </span>
  </div>
);