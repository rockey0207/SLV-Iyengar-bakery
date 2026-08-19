import { useCart } from "@/context/CartContext";
import { Check, Gift, LockKeyhole, Ticket } from "lucide-react";
import { Button } from "@/components/ui/button";

const TIERS = [
  { min: 299, off: 30, code: "SAVE30" },
  { min: 399, off: 49, code: "SAVE49" },
  { min: 599, off: 80, code: "SAVE80" },
];

export default function CouponUnlock({ horizontal = false }) {
  const { subtotal, coupon, applyCoupon, removeCoupon } = useCart();
  return (
    <div className="w-full max-w-full space-y-3 overflow-hidden" data-testid="coupon-unlock">
      <div className="flex items-center gap-2">
        <Ticket className="h-5 w-5 shrink-0 text-[#0066C8]" />
        <h2 className="font-display text-xl font-bold sm:text-2xl">Offers for you</h2>
      </div>
      <div
        className={`flex w-full max-w-full gap-3 overflow-x-auto overflow-y-hidden pb-2 snap-x snap-mandatory overscroll-x-contain [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:gap-4 md:pb-0 ${horizontal
            ? "md:gap-4 md:overflow-x-auto"
            : "md:grid md:grid-cols-3 md:overflow-visible"
          }`}
      >
        {TIERS.map((tier) => {
          const unlocked = subtotal >= tier.min;
          const isApplied = coupon?.code === tier.code;
          const unavailable = Boolean(coupon && !isApplied);
          return (
            <div
              key={tier.code}
              className={` flex h-auto min-h-[108px] w-[calc(100vw-48px)] min-w-[calc(100vw-48px)] max-w-[360px] shrink-0 snap-start overflow-hidden rounded-2xl text-white shadow-sm sm:w-[340px] sm:min-w-[340px] ${horizontal
                  ? "md:w-[340px] md:min-w-[340px] md:max-w-none"
                  : "md:w-full md:min-w-0 md:max-w-none"
                }
                ${unlocked
                  ? "bg-gradient-to-r from-[#075DB5] to-[#147BD1]"
                  : "bg-slate-400"
                }
              `}
            >
              <div className="flex min-w-0 flex-1 items-center gap-3 px-3 py-4 sm:px-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/15 sm:h-11 sm:w-11">
                  {unlocked ? (
                    <Gift className="h-5 w-5 sm:h-6 sm:w-6" />
                  ) : (
                    <LockKeyhole className="h-5 w-5" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="whitespace-nowrap text-lg font-bold sm:text-xl">
                    Get ₹{tier.off} OFF
                  </div>
                  <div className="text-xs leading-5 text-white/90 sm:text-sm">
                    On orders of ₹{tier.min} or more
                  </div>
                  {!unlocked && (
                    <div className="mt-1 text-[11px] leading-4 text-white/80 sm:text-xs">
                      Add ₹{(tier.min - subtotal).toFixed(0)} more to unlock
                    </div>
                  )}
                </div>
              </div>
              <div className=" flex w-[88px] shrink-0 flex-col items-center justify-center border-l border-white/25 px-2 text-center sm:w-[100px] ">
                {isApplied ? (
                  <>
                    <Check className="h-5 w-5 sm:h-6 sm:w-6" />
                    <span className="text-xs font-semibold sm:text-sm">
                      Applied!
                    </span>
                    <button
                      onClick={removeCoupon}
                      className="mt-1 text-[10px] underline sm:text-[11px]"
                    >
                      Remove
                    </button>
                  </>
                ) : (
                  <Button
                    onClick={() => applyCoupon(tier.code)}
                    disabled={!unlocked || unavailable}
                    className="
                      h-8
                      rounded-full
                      bg-white
                      px-3
                      text-[11px]
                      font-bold
                      text-[#075DB5]
                      hover:bg-white/90
                      disabled:bg-white/40
                      disabled:text-white/80
                      sm:text-xs
                    "
                    data-testid={`apply-${tier.code}`}
                  >
                    {unavailable
                      ? "Unavailable"
                      : unlocked
                        ? "Apply"
                        : "Locked"}
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>
      {/* {coupon && (
        <div className="break-words text-sm font-semibold text-[#4D7C0F]">
          ₹{coupon.discount} discount applied with {coupon.code}
        </div>
      )} */}
    </div>
  );
}