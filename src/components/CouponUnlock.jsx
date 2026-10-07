import { useCart } from "@/context/CartContext";

import {
  Check,
  Gift,
  LockKeyhole,
  Ticket,
  ArrowRight,
  Sparkles,
} from "lucide-react";

import { Button } from "@/components/ui/button";

const TIERS = [
  { min: 299, off: 30, code: "SAVE30" },
  { min: 399, off: 49, code: "SAVE49" },
  { min: 599, off: 80, code: "SAVE80" },
];

export default function CouponUnlock({ horizontal = false }) {
  const { subtotal, coupon, applyCoupon, removeCoupon } = useCart();

  return (
    <div
      className="w-full max-w-full space-y-4 overflow-hidden"
      data-testid="coupon-unlock"
    >
      {/* SECTION HEADER */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div
            className="
              flex h-9 w-9
              items-center justify-center
              rounded-xl
              bg-[#EAFBFB]
              text-[#06AEB5]
              shadow-sm
            "
          >
            <Ticket className="h-5 w-5" />
          </div>

          <div>
            <h2 className="font-display text-xl font-bold text-[#2D1E16] sm:text-2xl">
              Offers for you
            </h2>

            <p className="mt-0.5 text-[11px] text-[#8A786B] sm:text-xs">
              Unlock extra savings on your order
            </p>
          </div>
        </div>

        <Sparkles className="hidden h-5 w-5 text-[#F0AA32] sm:block" />
      </div>

      {/* COUPON CARDS */}
      <div
        className={`
          flex w-full max-w-full
          gap-3 overflow-x-auto overflow-y-hidden
          pb-2
          snap-x snap-mandatory
          overscroll-x-contain
          [-ms-overflow-style:none]
          [scrollbar-width:none]
          [&::-webkit-scrollbar]:hidden
          sm:gap-4

          ${
            horizontal
              ? "md:gap-4 md:overflow-x-auto"
              : "md:grid md:grid-cols-3 md:overflow-visible"
          }
        `}
      >
        {TIERS.map((tier, index) => {
          const unlocked = subtotal >= tier.min;
          const isApplied = coupon?.code === tier.code;
          const unavailable = Boolean(coupon && !isApplied);

          const remaining = Math.max(tier.min - subtotal, 0);

          const progress = Math.min(
            (subtotal / tier.min) * 100,
            100
          );

          return (
            <div
              key={tier.code}
              className={`
                group
                relative
                flex
                min-h-[132px]
                h-auto

                w-[calc(100vw-48px)]
                min-w-[calc(100vw-48px)]
                max-w-[370px]
                shrink-0

                snap-start
                overflow-hidden
                rounded-[20px]

                border

                shadow-[0_6px_20px_rgba(45,30,22,0.08)]

                transition-all
                duration-300
                ease-out

                hover:-translate-y-1
                hover:shadow-[0_12px_30px_rgba(45,30,22,0.14)]

                sm:w-[340px]
                sm:min-w-[340px]

                ${
                  horizontal
                    ? "md:w-[340px] md:min-w-[340px] md:max-w-none"
                    : "md:w-full md:min-w-0 md:max-w-none"
                }

                ${
                  isApplied
                    ? "border-[#8BDDD9] bg-gradient-to-br from-[#EAFBFB] to-[#F5FFFE] text-[#2D1E16]"
                    : unlocked
                      ? "border-[#D7EAF4] bg-white text-[#2D1E16]"
                      : "border-[#E8E0D8] bg-[#F5F2EF] text-[#6E625A]"
                }
              `}
            >
              {/* Decorative background */}
              <div
                className={`
                  pointer-events-none
                  absolute
                  -right-8
                  -top-8
                  h-24
                  w-24
                  rounded-full
                  blur-2xl
                  transition-all
                  duration-500

                  ${
                    unlocked
                      ? "bg-[#06C9D0]/10 group-hover:bg-[#06C9D0]/20"
                      : "bg-[#B7ADA4]/10"
                  }
                `}
              />

              {/* LEFT CONTENT */}
              <div className="relative flex min-w-0 flex-1 items-center gap-3 px-3.5 py-4 sm:px-4">

                {/* Icon */}
                <div
                  className={`
                    relative
                    flex
                    h-11
                    w-11
                    shrink-0
                    items-center
                    justify-center
                    rounded-2xl

                    transition-all
                    duration-300

                    ${
                      isApplied
                        ? "bg-[#06C9D0] text-white shadow-md"
                        : unlocked
                          ? "bg-[#EAFBFB] text-[#06AEB5]"
                          : "bg-[#E7E2DD] text-[#93867D]"
                    }

                    ${unlocked ? "group-hover:scale-105 group-hover:rotate-2" : ""}
                  `}
                >
                  {unlocked ? (
                    <Gift
                      className={`
                        h-5 w-5
                        sm:h-6 sm:w-6
                        ${unlocked && !isApplied ? "animate-[wiggle_2s_ease-in-out_infinite]" : ""}
                      `}
                    />
                  ) : (
                    <LockKeyhole className="h-5 w-5" />
                  )}
                </div>

                {/* Text */}
                <div className="min-w-0 flex-1">

                  {/* Discount */}
                  <div
                    className={`
                      whitespace-nowrap
                      text-xl
                      font-extrabold
                      tracking-tight
                      sm:text-2xl

                      ${
                        isApplied
                          ? "text-[#069CA2]"
                          : unlocked
                            ? "text-[#075DB5]"
                            : "text-[#74685F]"
                      }
                    `}
                  >
                    Get ₹{tier.off} OFF
                  </div>

                  {/* Minimum */}
                  <div
                    className={`
                      mt-0.5
                      text-[11px]
                      leading-4
                      sm:text-xs

                      ${
                        isApplied
                          ? "text-[#537B77]"
                          : unlocked
                            ? "text-[#6D625A]"
                            : "text-[#8F837A]"
                      }
                    `}
                  >
                    On orders of ₹{tier.min} or more
                  </div>

                  {/* Locked message */}
                  {!unlocked && (
                    <>
                      <div className="mt-2 text-[10px] font-semibold text-[#8A7D73] sm:text-[11px]">
                        Add ₹{remaining.toFixed(0)} more to unlock
                      </div>

                      {/* Progress */}
                      <div className="mt-1.5 h-1 w-full max-w-[130px] overflow-hidden rounded-full bg-[#E1DCD6]">
                        <div
                          className="h-full rounded-full bg-[#B6AAA0] transition-all duration-500"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </>
                  )}

                  {/* Available label */}
                  {unlocked && !isApplied && (
                    <div className="mt-1.5 flex items-center gap-1 text-[10px] font-bold text-[#08A4AB]">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#08B9A8]" />
                      Offer unlocked
                    </div>
                  )}

                  {/* Applied label */}
                  {isApplied && (
                    <div className="mt-1.5 flex items-center gap-1 text-[10px] font-bold text-[#079A8D]">
                      <Check className="h-3 w-3" />
                      Saving ₹{tier.off} on this order
                    </div>
                  )}
                </div>
              </div>

              {/* RIGHT ACTION */}
              <div
                className={`
                  relative
                  flex
                  w-[92px]
                  shrink-0
                  flex-col
                  items-center
                  justify-center
                  border-l
                  border-dashed
                  px-2
                  text-center

                  sm:w-[104px]

                  ${
                    isApplied
                      ? "border-[#A9DDD9]"
                      : "border-[#DDD5CD]"
                  }
                `}
              >
                {/* Ticket perforation circles */}
                <div
                  className="
                    absolute
                    -left-[6px]
                    -top-[7px]
                    h-3
                    w-3
                    rounded-full
                    bg-white
                  "
                />

                <div
                  className="
                    absolute
                    -left-[6px]
                    -bottom-[7px]
                    h-3
                    w-3
                    rounded-full
                    bg-white
                  "
                />

                {isApplied ? (
                  <>
                    <div
                      className="
                        flex
                        h-8
                        w-8
                        items-center
                        justify-center
                        rounded-full
                        bg-[#06C9D0]
                        text-white
                        shadow-sm
                      "
                    >
                      <Check className="h-4 w-4" />
                    </div>

                    <span className="mt-1.5 text-[11px] font-bold text-[#087F83] sm:text-xs">
                      Applied
                    </span>

                    <button
                      onClick={removeCoupon}
                      className="
                        mt-1
                        text-[9px]
                        font-medium
                        text-[#8A7068]
                        underline
                        underline-offset-2
                        transition-colors
                        hover:text-[#D9534F]
                        sm:text-[10px]
                      "
                    >
                      Remove
                    </button>
                  </>
                ) : (
                  <>
                    <Button
                      onClick={() => applyCoupon(tier.code)}
                      disabled={!unlocked || unavailable}
                      className={`
                        h-8
                        rounded-full
                        px-3
                        text-[10px]
                        font-extrabold
                        shadow-sm
                        transition-all
                        duration-300

                        ${
                          unlocked && !unavailable
                            ? "bg-[#075DB5] text-white hover:bg-[#064C94] hover:scale-105 hover:shadow-md"
                            : "bg-[#DDD7D1] text-[#9A8F87]"
                        }

                        sm:text-xs
                      `}
                      data-testid={`apply-${tier.code}`}
                    >
                      {unavailable
                        ? "Unavailable"
                        : unlocked
                          ? "Apply"
                          : "Locked"}
                    </Button>

                    {unlocked && !unavailable && (
                      <span className="mt-1.5 flex items-center gap-0.5 text-[9px] font-medium text-[#7A6D64]">
                        Save ₹{tier.off}
                        <ArrowRight className="h-2.5 w-2.5" />
                      </span>
                    )}
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* MOBILE SWIPE HINT */}
      <div className="flex items-center justify-center gap-1.5 md:hidden">
        <span className="h-1 w-4 rounded-full bg-[#06C9D0]" />
        <span className="h-1 w-1 rounded-full bg-[#D9D0C8]" />
        <span className="h-1 w-1 rounded-full bg-[#D9D0C8]" />
        <span className="ml-1 text-[9px] font-medium text-[#9A8B80]">
          Swipe for more offers
        </span>
      </div>
    </div>
  );
}