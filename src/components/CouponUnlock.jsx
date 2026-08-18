import { useCart } from "@/context/CartContext";
import { Sparkles, Gift, PartyPopper } from "lucide-react";

const TIERS = [
  { min: 0, off: 0 },
  { min: 299, off: 30 },
  { min: 399, off: 49 },
  { min: 599, off: 80 },
];

export default function CouponUnlock() {
  const { subtotal } = useCart();
  const next = TIERS.find((t) => subtotal < t.min);
  const maxTier = TIERS[TIERS.length - 1];
  const pct = Math.min(100, (subtotal / maxTier.min) * 100);

  return (
    <div className="bg-gradient-to-br from-[#FBF5EA] to-white border border-[#E6DFD5] rounded-2xl p-5 md:p-6" data-testid="coupon-unlock">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-[#06d2d9] flex items-center justify-center">
          <Gift className="w-5 h-5 text-white" />
        </div>
        <div>
          <div className="uppercase-tracked text-xs text-[#5C4A3D]">Unlock Rewards</div>
          <div className="flex items-center gap-2 font-display text-lg font-bold">
            {next ? (
              <>
                <span>
                  Add ₹{(next.min - subtotal).toFixed(0)} more to unlock ₹{next.off} OFF
                </span>

                <span className="border border-green-500 text-green-600 px-2 py-0.5 rounded-full text-sm font-semibold">
                  SAVE {next.off}
                </span>
              </>
            ) : (
              <>
                <PartyPopper className="w-5 h-5 text-green-500" />
                <span>You've unlocked the max discount ₹80 OFF!</span>
              </>
            )}
          </div>
        </div>
      </div>
      <div className="relative h-2 bg-[#E6DFD5] rounded-full">
        <div className="absolute h-2 bg-[#06d2d9] rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
        {TIERS.map((t) => {
          const p = (t.min / maxTier.min) * 100;
          const reached = subtotal >= t.min;
          return (
            <div key={t.min} className="absolute -top-1" style={{ left: `${p}%`, transform: "translateX(-50%)" }}>
              <div className={`w-4 h-4 rounded-full border-2 ${reached ? "bg-[#06d2d9] border-white" : "bg-white border-[#E6DFD5]"} ${reached ? "animate-pulseDot" : ""}`} />
            </div>
          );
        })}
      </div>
      <div className="flex justify-between mt-6 text-xs">
        {TIERS.map((t) => (
          <div key={t.min} className={`text-center ${subtotal >= t.min ? "text-[#06d2d9] font-semibold" : "text-[#5C4A3D]"}`}>
            <div className="uppercase-tracked flex items-center gap-1 justify-center">
              {subtotal >= t.min && <Sparkles className="w-3 h-3" />} ₹{t.off} OFF
            </div>
            <div>Cart ₹{t.min}+</div>
          </div>
        ))}
      </div>
    </div>
  );
}
