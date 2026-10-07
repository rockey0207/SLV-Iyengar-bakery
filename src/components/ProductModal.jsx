import { useEffect, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  Heart,
  Star,
  Minus,
  Plus,
  ShoppingCart,
  Sparkles,
  PackageCheck,
} from "lucide-react";

import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

import FoodTypeBadge from "./FoodTypeBadge";
import SafeImage from "./SafeImage";

export default function ProductModal({
  product,
  open,
  onOpenChange,
}) {
  const {
    items,
    favorites,
    toggleFav,
    addToCart,
    updateQty,
  } = useCart();

  const cartItem = items.find(
    (item) =>
      item.product_id === product.id &&
      (item.weight || product.weight) === product.weight
  );

  const cartQty = cartItem?.quantity || 0;

  const [imgIdx, setImgIdx] = useState(0);
  const [qty, setQty] = useState(cartItem?.quantity || 1);
  const [weight, setWeight] = useState(product.weight);
  const [favAnimating, setFavAnimating] = useState(false);

  const isFav = favorites.includes(product.id);

  const images =
    product.images?.length
      ? product.images
      : [product.images?.[0] || ""];

  const maxQty = product.stock ?? 0;

  const outOfStock =
    !product.in_stock || maxQty <= 0;

  const discount =
    product.original_price > 0
      ? Math.round(
          ((product.original_price -
            product.discount_price) /
            product.original_price) *
            100
        )
      : 0;

  const savings =
    product.original_price > product.discount_price
      ? product.original_price - product.discount_price
      : 0;

  useEffect(() => {
    setQty(cartItem?.quantity || 1);
  }, [cartItem]);

  useEffect(() => {
    if (open) {
      setImgIdx(0);
      setWeight(product.weight);
    }
  }, [open, product]);

  const handleFavorite = () => {
    setFavAnimating(true);
    toggleFav(product.id);

    setTimeout(() => {
      setFavAnimating(false);
    }, 350);
  };

  const handleAdd = async () => {
    if (outOfStock) {
      toast.error("This product is currently out of stock.");
      return;
    }

    if (qty > maxQty) {
      toast.error("Maximum available stock reached.");
      return;
    }

    const result = await addToCart(
      product,
      qty,
      weight
    );

    if (result?.ok) {
      onOpenChange(false);
    }
  };

  const handleIncreaseCart = async () => {
    if (cartQty >= maxQty) {
      toast.error("Maximum available stock reached.");
      return;
    }

    await updateQty(
      product.id,
      cartQty + 1
    );
  };

  const handleDecreaseCart = async () => {
    if (cartQty <= 1) {
      await updateQty(product.id, 0);
      return;
    }

    await updateQty(
      product.id,
      cartQty - 1
    );
  };

  const incrementQty = () => {
    if (qty >= maxQty) {
      toast.error("Maximum available stock reached.");
      return;
    }

    setQty((prev) => prev + 1);
  };

  const decrementQty = () => {
    setQty((prev) => Math.max(1, prev - 1));
  };

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent
        className="
          max-w-4xl
          w-[calc(100%-1rem)]
          sm:w-[calc(100%-2rem)]
          p-0
          overflow-hidden
          max-h-[94vh]
          rounded-2xl sm:rounded-3xl
          border border-[#E9E1D7]
          bg-white
          shadow-[0_25px_80px_rgba(45,30,22,0.20)]
        "
        data-testid="product-modal"
      >
        <DialogTitle className="sr-only">
          {product.name}
        </DialogTitle>

        <div className="grid md:grid-cols-2 max-h-[94vh] overflow-y-auto">
          {/* =====================================================
              LEFT - IMAGE SECTION
          ===================================================== */}
          <div
            className="
              relative
              bg-[#FBF5EA]
              p-3 sm:p-5 md:p-6
            "
          >
            {/* Discount Badge */}
            {discount > 0 && (
              <div
                className="
                  absolute
                  top-10 left-10
                  z-10
                  flex items-center gap-1.5
                  bg-[#BE123C]
                  text-white
                  px-3 py-1.5
                  rounded-full
                  text-[11px]
                  font-bold
                  tracking-wide
                  shadow-lg
                "
              >
                <Sparkles className="w-3.5 h-3.5" />
                {discount}% OFF
              </div>
            )}

            {/* Favorite */}
            <button
              type="button"
              onClick={handleFavorite}
              aria-label={
                isFav
                  ? "Remove from favorites"
                  : "Add to favorites"
              }
              className={`
                absolute
                top-10 right-10
                z-10
                w-10 h-10
                rounded-full
                flex items-center justify-center
                border
                shadow-md
                backdrop-blur-md
                transition-all duration-300
                active:scale-90
                ${
                  isFav
                    ? "bg-[#BE123C] border-[#BE123C] text-white"
                    : "bg-white/90 border-white text-[#2D1E16] hover:text-[#BE123C]"
                }
                ${favAnimating ? "scale-125" : ""}
              `}
            >
              <Heart
                className={`
                  w-[18px] h-[18px]
                  transition-transform duration-300
                  ${isFav ? "fill-current scale-110" : ""}
                `}
              />
            </button>

            {/* Main Image */}
            <div
              className="
                aspect-square
                rounded-2xl
                overflow-hidden
                bg-white
                shadow-sm
                border border-[#E9E1D7]
              "
            >
              <SafeImage
                src={images[imgIdx]}
                alt={product.name}
                className="
                  w-full h-full
                  object-cover
                  transition-transform
                  duration-700
                  hover:scale-105
                "
              />
            </div>

            {/* Image Thumbnails */}
            {images.length > 1 && (
              <div
                className="
                  flex gap-2.5
                  mt-3
                  overflow-x-auto
                  pb-1
                  scrollbar-hide
                "
              >
                {images.map((image, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() =>
                      setImgIdx(index)
                    }
                    className={`
                      relative
                      flex-shrink-0
                      w-16 h-16
                      sm:w-[72px] sm:h-[72px]
                      rounded-xl
                      overflow-hidden
                      border-2
                      transition-all duration-200
                      ${
                        index === imgIdx
                          ? "border-[#06C9D0] scale-105 shadow-md"
                          : "border-transparent opacity-70 hover:opacity-100"
                      }
                    `}
                  >
                    <img
                      src={image}
                      alt=""
                      className="
                        w-full h-full
                        object-cover
                      "
                    />

                    {index === imgIdx && (
                      <div
                        className="
                          absolute inset-0
                          ring-2 ring-inset
                          ring-[#06C9D0]
                          rounded-xl
                        "
                      />
                    )}
                  </button>
                ))}
              </div>
            )}

            {/* Freshly Baked Label */}
            <div
              className="
                hidden sm:flex
                items-center justify-center
                gap-2
                mt-4
                text-xs
                font-semibold
                text-[#6B5A4D]
              "
            >
              <span
                className="
                  w-2 h-2
                  rounded-full
                  bg-[#06C9D0]
                  animate-pulse
                "
              />
              Freshly baked with care
            </div>
          </div>

          {/* =====================================================
              RIGHT - PRODUCT DETAILS
          ===================================================== */}
          <div
            className="
              p-4 sm:p-6 md:p-7
              space-y-4
              bg-white
            "
          >
            {/* Category */}
            <div
              className="
                text-[10px] sm:text-xs
                uppercase
                tracking-[0.16em]
                font-bold
                text-[#06AEB5]
              "
            >
              {product.category}
            </div>

            {/* Product Name */}
            <div>
              <h2
                className="
                  text-xl sm:text-2xl md:text-3xl
                  font-extrabold
                  leading-tight
                  text-[#2D1E16]
                "
              >
                {product.name}
              </h2>

              {/* Rating + Stock */}
              <div
                className="
                  flex flex-wrap
                  items-center
                  gap-2.5
                  mt-2.5
                  text-xs sm:text-sm
                  text-[#6B5A4D]
                "
              >
                <div className="flex items-center gap-1">
                  <Star
                    className="
                      w-4 h-4
                      fill-[#F59E0B]
                      text-[#F59E0B]
                    "
                  />

                  <span className="font-bold text-[#2D1E16]">
                    {product.rating || "4.5"}
                  </span>
                </div>

                <span className="text-[#C9BDB2]">
                  •
                </span>

                <span>
                  {product.weight}
                </span>

                <span className="text-[#C9BDB2]">
                  •
                </span>

                <span
                  className={
                    outOfStock
                      ? "text-red-600 font-semibold"
                      : "text-[#0D9488] font-semibold"
                  }
                >
                  {outOfStock
                    ? "Out of Stock"
                    : `${product.stock} available`}
                </span>
              </div>
            </div>

            {/* Food Type */}
            {product.food_type && (
              <div
                className="
                  inline-flex
                  items-center
                  rounded-xl
                  bg-[#FAF7F2]
                  px-3 py-2
                  border border-[#E9E1D7]
                "
              >
                <FoodTypeBadge
                  foodType={product.food_type}
                  size="lg"
                />
              </div>
            )}

            {/* Description */}
            <div
              className="
                rounded-xl
                bg-[#FAF7F2]
                border border-[#EEE6DD]
                p-3.5
              "
            >
              <p
                className="
                  text-xs sm:text-sm
                  text-[#6B5A4D]
                  leading-relaxed
                "
              >
                {product.description}
              </p>
            </div>

            {/* Ingredients */}
            {product.ingredients && (
              <div>
                <div
                  className="
                    text-[10px]
                    uppercase
                    tracking-[0.15em]
                    font-bold
                    text-[#8A786A]
                    mb-1.5
                  "
                >
                  Ingredients
                </div>

                <p
                  className="
                    text-xs sm:text-sm
                    text-[#3E3028]
                    leading-relaxed
                  "
                >
                  {product.ingredients}
                </p>
              </div>
            )}

            {/* Weight Selection */}
            {product.weight_options?.length > 1 && (
              <div>
                <div
                  className="
                    flex items-center justify-between
                    mb-2
                  "
                >
                  <span
                    className="
                      text-[10px]
                      uppercase
                      tracking-[0.15em]
                      font-bold
                      text-[#8A786A]
                    "
                  >
                    Select Weight
                  </span>

                  <span
                    className="
                      text-[10px]
                      text-[#06AEB5]
                      font-semibold
                    "
                  >
                    Choose your size
                  </span>
                </div>

                <div
                  className="
                    flex flex-wrap gap-2
                  "
                >
                  {product.weight_options.map(
                    (option) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() =>
                          setWeight(option)
                        }
                        className={`
                          px-4 py-2
                          rounded-full
                          text-xs sm:text-sm
                          font-semibold
                          border
                          transition-all duration-200
                          active:scale-95
                          ${
                            weight === option
                              ? "bg-[#06C9D0] text-white border-[#06C9D0] shadow-md shadow-[#06C9D0]/20"
                              : "bg-white text-[#4A392F] border-[#E6DFD5] hover:border-[#06C9D0] hover:text-[#06AEB5]"
                          }
                        `}
                      >
                        {option}
                      </button>
                    )
                  )}
                </div>
              </div>
            )}

            {/* Divider */}
            <div className="border-t border-[#EEE6DD]" />

            {/* Price */}
            <div
              className="
                flex items-end
                justify-between
                gap-3
              "
            >
              <div>
                <div
                  className="
                    flex items-baseline
                    gap-2
                    flex-wrap
                  "
                >
                  <span
                    className="
                      text-2xl sm:text-3xl
                      font-extrabold
                      text-[#2D1E16]
                    "
                  >
                    ₹{product.discount_price}
                  </span>

                  {product.original_price >
                    product.discount_price && (
                    <span
                      className="
                        text-xs sm:text-sm
                        text-[#8A786A]
                        line-through
                      "
                    >
                      ₹{product.original_price}
                    </span>
                  )}
                </div>

                {savings > 0 && (
                  <div
                    className="
                      flex items-center gap-1
                      mt-1
                      text-[10px] sm:text-xs
                      font-semibold
                      text-[#0D9488]
                    "
                  >
                    <Sparkles className="w-3 h-3" />
                    You save ₹{savings}
                    {discount > 0 &&
                      ` (${discount}% off)`}
                  </div>
                )}
              </div>

              {/* Stock Indicator */}
              {!outOfStock &&
                maxQty <= 5 && (
                  <div
                    className="
                      flex items-center
                      gap-1.5
                      text-[10px]
                      font-semibold
                      text-[#9A6A00]
                    "
                  >
                    <span
                      className="
                        relative
                        flex w-2 h-2
                      "
                    >
                      <span
                        className="
                          absolute
                          inline-flex
                          w-full h-full
                          rounded-full
                          bg-[#F59E0B]
                          opacity-60
                          animate-ping
                        "
                      />
                      <span
                        className="
                          relative
                          inline-flex
                          w-2 h-2
                          rounded-full
                          bg-[#F59E0B]
                        "
                      />
                    </span>

                    Only {maxQty} left
                  </div>
                )}
            </div>

            {/* =================================================
                CART CONTROLS
            ================================================= */}
            <div
              className="
                flex items-center
                gap-2.5 sm:gap-3
                pt-1
              "
            >
              {cartQty > 0 ? (
                <>
                  {/* Cart Quantity */}
                  <div
                    className="
                      flex items-center
                      bg-[#FAF7F2]
                      border border-[#E6DFD5]
                      rounded-full
                      p-1
                    "
                  >
                    <button
                      type="button"
                      onClick={
                        handleDecreaseCart
                      }
                      aria-label="Decrease quantity"
                      className="
                        w-9 h-9
                        rounded-full
                        flex items-center
                        justify-center
                        text-[#2D1E16]
                        hover:bg-white
                        hover:shadow-sm
                        active:scale-90
                        transition-all
                      "
                    >
                      <Minus className="w-4 h-4" />
                    </button>

                    <span
                      className="
                        min-w-[32px]
                        text-center
                        text-sm
                        font-bold
                        text-[#2D1E16]
                      "
                      data-testid="qty-value"
                    >
                      {cartQty}
                    </span>

                    <button
                      type="button"
                      onClick={
                        handleIncreaseCart
                      }
                      disabled={
                        outOfStock ||
                        cartQty >= maxQty
                      }
                      aria-label="Increase quantity"
                      className="
                        w-9 h-9
                        rounded-full
                        flex items-center
                        justify-center
                        bg-[#06C9D0]
                        text-white
                        hover:bg-[#05B8BE]
                        hover:scale-105
                        active:scale-90
                        transition-all
                        disabled:opacity-40
                        disabled:cursor-not-allowed
                      "
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Increase Button */}
                  <Button
                    type="button"
                    className="
                      flex-1
                      h-11
                      rounded-full
                      bg-[#06C9D0]
                      hover:bg-[#05B8BE]
                      text-white
                      font-bold
                      shadow-md
                      hover:shadow-lg
                      transition-all
                    "
                    onClick={
                      handleIncreaseCart
                    }
                    disabled={
                      outOfStock ||
                      cartQty >= maxQty
                    }
                    data-testid="modal-increase-cart"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Increase Quantity
                  </Button>
                </>
              ) : (
                <>
                  {/* New Quantity */}
                  <div
                    className="
                      flex items-center
                      bg-[#FAF7F2]
                      border border-[#E6DFD5]
                      rounded-full
                      p-1
                    "
                  >
                    <button
                      type="button"
                      onClick={decrementQty}
                      className="
                        w-9 h-9
                        rounded-full
                        flex items-center
                        justify-center
                        text-[#2D1E16]
                        hover:bg-white
                        active:scale-90
                        transition-all
                      "
                    >
                      <Minus className="w-4 h-4" />
                    </button>

                    <span
                      className="
                        min-w-[32px]
                        text-center
                        text-sm
                        font-bold
                      "
                      data-testid="qty-value"
                    >
                      {qty}
                    </span>

                    <button
                      type="button"
                      onClick={incrementQty}
                      disabled={
                        outOfStock ||
                        qty >= maxQty
                      }
                      className="
                        w-9 h-9
                        rounded-full
                        flex items-center
                        justify-center
                        bg-[#06C9D0]
                        text-white
                        hover:bg-[#05B8BE]
                        hover:scale-105
                        active:scale-90
                        transition-all
                        disabled:opacity-40
                        disabled:cursor-not-allowed
                      "
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Add To Cart */}
                  <Button
                    type="button"
                    className="
                      flex-1
                      h-11
                      rounded-full
                      bg-[#06C9D0]
                      hover:bg-[#05B8BE]
                      text-white
                      font-bold
                      shadow-md
                      hover:shadow-lg
                      hover:-translate-y-0.5
                      transition-all
                    "
                    onClick={handleAdd}
                    disabled={
                      outOfStock ||
                      qty > maxQty
                    }
                    data-testid="modal-add-cart"
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />

                    {outOfStock
                      ? "Out of Stock"
                      : `Add ${qty > 1 ? `${qty} ` : ""}to Cart`}
                  </Button>
                </>
              )}
            </div>

            {/* Availability */}
            <div
              className="
                flex items-center
                gap-2
                text-[10px] sm:text-xs
                text-[#6B5A4D]
              "
            >
              <PackageCheck
                className="
                  w-4 h-4
                  text-[#0D9488]
                "
              />

              {outOfStock ? (
                <span className="text-red-600 font-semibold">
                  This product is currently
                  unavailable.
                </span>
              ) : (
                <span>
                  Freshly prepared • {maxQty}{" "}
                  available
                </span>
              )}
            </div>

            {/* Max Quantity Message */}
            {!outOfStock &&
              ((cartQty > 0 &&
                cartQty >= maxQty) ||
                (cartQty === 0 &&
                  qty >= maxQty)) && (
                <div
                  className="
                    rounded-lg
                    bg-[#FFF7E6]
                    border border-[#F4D79A]
                    px-3 py-2
                    text-[10px] sm:text-xs
                    font-medium
                    text-[#8A6500]
                  "
                >
                  Maximum available quantity
                  reached.
                </div>
              )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}