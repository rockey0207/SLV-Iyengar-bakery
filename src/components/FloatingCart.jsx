import { Link } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import {
  ShoppingBag,
  ArrowRight,
  Sparkles,
} from "lucide-react";

export default function FloatingCart() {
  const { items, count, subtotal } = useCart();

  if (!items?.length) return null;

  return (
    <Link
      to="/cart"
      data-testid="floating-cart"
      className="
        group
        fixed
        bottom-4
        left-1/2
        -translate-x-1/2
        z-40
        w-[calc(100%-24px)]
        max-w-[430px]

        overflow-hidden
        rounded-[22px]

        border
        border-white/10

        bg-[#2D1E16]/95
        backdrop-blur-xl

        text-white

        shadow-[0_12px_40px_rgba(45,30,22,0.28)]

        transition-all
        duration-300
        ease-out

        hover:-translate-x-1/2
        hover:-translate-y-1
        hover:shadow-[0_18px_50px_rgba(45,30,22,0.35)]

        active:scale-[0.98]

        animate-[slideUpCart_0.45s_ease-out]
      "
    >
      {/* Decorative glow */}
      <div
        className="
          pointer-events-none
          absolute
          -right-12
          -top-12
          h-32
          w-32
          rounded-full
          bg-[#06D2D9]/15
          blur-2xl
          transition-all
          duration-500
          group-hover:bg-[#06D2D9]/25
        "
      />

      <div className="relative flex items-center justify-between gap-3 p-3 sm:p-3.5">

        {/* LEFT SIDE */}
        <div className="flex min-w-0 items-center gap-3">

          {/* Cart icon */}
          <div
            className="
              relative
              flex
              h-11
              w-11
              shrink-0
              items-center
              justify-center
              rounded-2xl
              bg-[#06D2D9]
              text-white

              shadow-[0_5px_18px_rgba(6,210,217,0.28)]

              transition-all
              duration-300

              group-hover:scale-105
              group-hover:rotate-[-3deg]
            "
          >
            <ShoppingBag
              className="
                h-5 w-5
                transition-transform
                duration-300
                group-hover:scale-110
              "
              strokeWidth={2}
            />

            {/* Item badge */}
            <span
              className="
                absolute
                -right-1.5
                -top-1.5
                flex
                h-5
                min-w-5
                items-center
                justify-center
                rounded-full
                border-2
                border-[#2D1E16]
                bg-white
                px-1
                text-[9px]
                font-extrabold
                text-[#2D1E16]

                transition-transform
                duration-300

                group-hover:scale-110
              "
            >
              {count > 99 ? "99+" : count}
            </span>
          </div>

          {/* Cart information */}
          <div className="min-w-0">

            <div className="flex items-center gap-1.5">
              <span className="truncate text-sm font-bold sm:text-[15px]">
                {count} item{count !== 1 ? "s" : ""}
              </span>

              <span className="text-white/30">•</span>

              <span className="text-sm font-extrabold text-[#06D2D9] sm:text-[15px]">
                ₹{subtotal.toFixed(0)}
              </span>
            </div>

            <div className="mt-1 flex items-center gap-1.5">
              <Sparkles className="h-3 w-3 shrink-0 text-[#F5B84B]" />

              <span className="truncate text-[10px] font-medium text-[#D4C7BB] sm:text-[11px]">
                Freshly baked · Delivered in 25 min
              </span>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div
          className="
            flex
            shrink-0
            items-center
            gap-1.5
            rounded-xl
            bg-white/10
            px-3
            py-2.5

            text-[10px]
            font-bold
            uppercase
            tracking-[0.08em]
            text-white

            transition-all
            duration-300

            group-hover:bg-[#06D2D9]
            group-hover:text-white
          "
        >
          <span className="hidden xs:inline sm:inline">
            View Cart
          </span>

          <ArrowRight
            className="
              h-4
              w-4

              transition-transform
              duration-300

              group-hover:translate-x-1
            "
          />
        </div>
      </div>
    </Link>
  );
}
