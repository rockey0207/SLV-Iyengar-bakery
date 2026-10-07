import { useState } from "react";
import {
  Heart,
  Star,
  Plus,
  Minus,
  ShoppingBag,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";

import { useCart } from "@/context/CartContext";
import ProductModal from "./ProductModal";
import SafeImage from "./SafeImage";
import FoodTypeBadge from "./FoodTypeBadge";

export default function ProductCard({ product }) {
  const { items, favorites, toggleFav, addToCart, updateQty } = useCart();

  const [open, setOpen] = useState(false);
  const [isFavAnimating, setIsFavAnimating] = useState(false);

  const cartItem = items.find(
    (i) =>
      i.product_id === product.id &&
      (i.weight || product.weight) === product.weight
  );

  const cartQty = cartItem?.quantity || 0;
  const availableStock = product.stock ?? 0;

  const isOutOfStock = !product.in_stock || availableStock <= 0;
  const isMaxed = cartQty >= availableStock;
  const isFav = favorites.includes(product.id);

  const discount =
    product.original_price > 0
      ? Math.round(
          ((product.original_price - product.discount_price) /
            product.original_price) *
            100
        )
      : 0;

  const handleAddOne = (e) => {
    e.stopPropagation();

    if (isOutOfStock) {
      toast.error("This product is currently out of stock.");
      return;
    }

    if (isMaxed) {
      toast.error("Maximum available stock reached.");
      return;
    }

    addToCart(product, 1);
  };

  const handleDecrease = (e) => {
    e.stopPropagation();

    updateQty(product.id, Math.max(0, cartQty - 1));
  };

  const handleIncrease = (e) => {
    e.stopPropagation();

    if (isOutOfStock || isMaxed) {
      toast.error("Maximum available stock reached.");
      return;
    }

    addToCart(product, 1);
  };

  const handleFavorite = (e) => {
    e.stopPropagation();

    setIsFavAnimating(true);
    toggleFav(product.id);

    setTimeout(() => {
      setIsFavAnimating(false);
    }, 350);
  };

  return (
    <>
      <div
        className="
          group relative
          bg-white
          rounded-2xl
          border border-[#E9E1D7]
          overflow-hidden
          cursor-pointer
          transition-all duration-300 ease-out
          hover:-translate-y-1
          hover:border-[#06C9D0]/40
          hover:shadow-[0_14px_35px_rgba(45,30,22,0.12)]
          active:scale-[0.99]
        "
        data-testid={`product-card-${product.id}`}
        onClick={() => setOpen(true)}
      >
        {/* Product Image */}
        <div className="relative aspect-square bg-[#FBF5EA] overflow-hidden">
          <SafeImage
            src={product.images?.[0]}
            alt={product.name}
            className="
              product-image
              w-full h-full object-cover
              transition-transform duration-700 ease-out
              group-hover:scale-105
            "
          />

          {/* Image Overlay */}
          <div
            className="
              absolute inset-0
              bg-gradient-to-t
              from-black/15 via-transparent to-transparent
              opacity-0 group-hover:opacity-100
              transition-opacity duration-300
              pointer-events-none
            "
          />

          {/* Discount Badge */}
          {discount > 0 && (
            <div
              className="
                absolute top-3 left-3
                flex items-center gap-1
                bg-[#BE123C]
                text-white
                text-[10px] sm:text-xs
                font-bold
                px-2.5 py-1.5
                rounded-lg
                shadow-lg
                tracking-wide
                transition-transform duration-300
                group-hover:scale-105
              "
              data-testid={`discount-badge-${product.id}`}
            >
              <Sparkles className="w-3 h-3" />
              {discount}% OFF
            </div>
          )}

          {/* Favorite Button */}
          <button
            type="button"
            onClick={handleFavorite}
            aria-label={isFav ? "Remove from favorites" : "Add to favorites"}
            className={`
              absolute top-3 right-3
              w-9 h-9 sm:w-10 sm:h-10
              rounded-full
              flex items-center justify-center
              backdrop-blur-md
              border
              transition-all duration-300
              active:scale-90
              ${
                isFav
                  ? "bg-[#BE123C] border-[#BE123C] text-white shadow-lg"
                  : "bg-white/90 border-white/70 text-[#2D1E16] hover:bg-white hover:text-[#BE123C] hover:shadow-md"
              }
              ${isFavAnimating ? "scale-125" : ""}
            `}
            data-testid={`fav-btn-${product.id}`}
          >
            <Heart
              className={`
                w-4 h-4 sm:w-[18px] sm:h-[18px]
                transition-all duration-300
                ${isFav ? "fill-current scale-110" : ""}
              `}
            />
          </button>

          {/* Food Type Badge */}
          {/* {product.food_type && (
            <div className="absolute bottom-3 left-3">
              <div className="bg-white/95 backdrop-blur-sm rounded-lg px-2 py-1 shadow-md">
                <FoodTypeBadge
                  foodType={product.food_type}
                  size="sm"
                  showLabel={false}
                />
              </div>
            </div>
          )} */}

          {/* Out Of Stock */}
          {isOutOfStock && (
            <div
              className="
                absolute inset-0
                bg-[#1C1511]/65
                backdrop-blur-[2px]
                flex items-center justify-center
              "
            >
              <div
                className="
                  bg-white/95
                  text-[#2D1E16]
                  px-4 py-2
                  rounded-full
                  text-[11px]
                  font-bold
                  uppercase
                  tracking-[0.12em]
                  shadow-xl
                "
              >
                Out of Stock
              </div>
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="p-3.5 sm:p-4">
          {/* Rating + Weight + Food Type */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 text-[11px] sm:text-xs text-[#6B5A4D]">
              <div className="flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-[#F59E0B] text-[#F59E0B]" />
                <span className="font-medium">
                  {product.rating || "4.5"}
                </span>
              </div>

              <span className="text-[#C5B9AE]">•</span>

              <span className="truncate max-w-[90px]">
                {product.weight}
              </span>
            </div>

            {/* Food Type */}
            {product.food_type && (
              <FoodTypeBadge
                foodType={product.food_type}
                size="sm"
                showLabel
              />
            )}
          </div>

          {/* Product Name */}
          <h3
            className="
              mt-2
              font-bold
              text-sm sm:text-[15px]
              text-[#2D1E16]
              line-clamp-1
              group-hover:text-[#06AEB5]
              transition-colors duration-300
            "
          >
            {product.name}
          </h3>

          {/* Description */}
          <p
            className="
              text-[11px] sm:text-xs
              text-[#6B5A4D]
              mt-1
              line-clamp-2
              leading-relaxed
              min-h-[30px]
            "
          >
            {product.description}
          </p>

          {/* Bottom Section */}
          <div className="flex items-center justify-between gap-2 mt-3.5">
            {/* Price */}
            <div className="min-w-0">
              <div className="flex items-baseline gap-1.5 flex-wrap">
                <span className="font-extrabold text-base sm:text-lg text-[#2D1E16]">
                  ₹{product.discount_price}
                </span>

                {product.original_price > product.discount_price && (
                  <span className="text-[10px] sm:text-xs text-[#8C7B6E] line-through">
                    ₹{product.original_price}
                  </span>
                )}
              </div>

              {discount > 0 && (
                <span className="text-[9px] sm:text-[10px] text-[#0D9488] font-semibold">
                  You save ₹
                  {product.original_price - product.discount_price}
                </span>
              )}
            </div>

            {/* Cart Controls */}
            {cartQty > 0 ? (
              <div
                className="
                  flex items-center
                  bg-[#F8F3EC]
                  border border-[#E6DFD5]
                  rounded-full
                  p-1
                  shadow-sm
                "
                onClick={(e) => e.stopPropagation()}
              >
                {/* Decrease */}
                <button
                  type="button"
                  onClick={handleDecrease}
                  aria-label="Decrease quantity"
                  className="
                    w-7 h-7
                    rounded-full
                    flex items-center justify-center
                    text-[#2D1E16]
                    hover:bg-white
                    hover:shadow-sm
                    active:scale-90
                    transition-all
                  "
                  data-testid={`decrease-qty-${product.id}`}
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>

                {/* Quantity */}
                <span
                  className="
                    min-w-[25px]
                    text-center
                    text-xs sm:text-sm
                    font-bold
                    text-[#2D1E16]
                  "
                >
                  {cartQty}
                </span>

                {/* Increase */}
                <button
                  type="button"
                  onClick={handleIncrease}
                  disabled={isOutOfStock || isMaxed}
                  aria-label="Increase quantity"
                  className="
                    w-7 h-7
                    rounded-full
                    bg-[#06C9D0]
                    text-white
                    flex items-center justify-center
                    shadow-sm
                    hover:bg-[#05B8BE]
                    hover:scale-105
                    active:scale-90
                    transition-all
                    disabled:opacity-40
                    disabled:cursor-not-allowed
                    disabled:hover:scale-100
                  "
                  data-testid={`increase-qty-${product.id}`}
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleAddOne}
                disabled={isOutOfStock}
                aria-label={`Add ${product.name} to cart`}
                className="
                  group/add
                  w-9 h-9 sm:w-10 sm:h-10
                  rounded-full
                  bg-[#06C9D0]
                  text-white
                  flex items-center justify-center
                  shadow-md
                  hover:bg-[#05B8BE]
                  hover:shadow-lg
                  hover:scale-110
                  active:scale-90
                  transition-all duration-200
                  disabled:opacity-40
                  disabled:cursor-not-allowed
                  disabled:hover:scale-100
                "
                data-testid={`add-to-cart-${product.id}`}
              >
                <ShoppingBag
                  className="
                    w-4 h-4
                    transition-transform duration-200
                    group-hover/add:scale-110
                  "
                />
              </button>
            )}
          </div>

          {/* Stock Hint */}
          {!isOutOfStock && availableStock <= 5 && (
            <div className="mt-2.5 flex items-center gap-1.5">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full rounded-full bg-[#F59E0B] opacity-60 animate-ping" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#F59E0B]" />
              </span>

              <span className="text-[9px] sm:text-[10px] font-medium text-[#9A6A00]">
                Only {availableStock} left
              </span>
            </div>
          )}

          {/* Max Stock Message */}
          {!isOutOfStock && isMaxed && (
            <div className="mt-2.5 text-[9px] sm:text-[10px] font-semibold text-[#BE123C]">
              Maximum available quantity added
            </div>
          )}
        </div>
      </div>

      {/* Product Modal */}
      <ProductModal
        product={product}
        open={open}
        onOpenChange={setOpen}
      />
    </>
  );
}