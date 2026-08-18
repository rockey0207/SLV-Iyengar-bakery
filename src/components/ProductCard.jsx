import { useState } from "react";
import { Heart, Star, Plus, Minus } from "lucide-react";
import { toast } from "sonner";
import { useCart } from "@/context/CartContext";
import ProductModal from "./ProductModal";
import SafeImage from "./SafeImage";

export default function ProductCard({ product }) {
  const { items, favorites, toggleFav, addToCart, updateQty } = useCart();
  const [open, setOpen] = useState(false);
  const cartItem = items.find((i) => i.product_id === product.id && (i.weight || product.weight) === product.weight);
  const cartQty = cartItem?.quantity || 0;
  const availableStock = product.stock ?? 0;
  const isOutOfStock = !product.in_stock || availableStock <= 0;
  const isMaxed = cartQty >= availableStock;
  const isFav = favorites.includes(product.id);
  const discount = Math.round(((product.original_price - product.discount_price) / product.original_price) * 100);

  const handleAddOne = (e) => {
    e.stopPropagation();
    if (isOutOfStock || isMaxed) {
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

  return (
    <>
      <div className="product-card bg-white rounded-2xl border border-[#E6DFD5] overflow-hidden cursor-pointer group card-shadow"
        data-testid={`product-card-${product.id}`}
        onClick={() => setOpen(true)}>
        <div className="relative aspect-square bg-[#FBF5EA] overflow-hidden">
          <SafeImage src={product.images?.[0]} alt={product.name}
            className="product-image w-full h-full object-cover" />
          {discount > 0 && (
            <div className="absolute top-2 left-2 bg-[#BE123C] text-white text-xs font-semibold px-2 py-1 rounded-md" data-testid={`discount-badge-${product.id}`}>
              {discount}% OFF
            </div>
          )}
          <button
            onClick={(e) => { e.stopPropagation(); toggleFav(product.id); }}
            className={`absolute top-2 right-2 w-9 h-9 rounded-full flex items-center justify-center transition-colors ${isFav ? "bg-[#BE123C] text-white" : "bg-white/90 text-[#2D1E16] hover:bg-white"}`}
            data-testid={`fav-btn-${product.id}`}>
            <Heart className={`w-4 h-4 ${isFav ? "fill-current" : ""}`} />
          </button>
          {!product.in_stock || product.stock <= 0 ? (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white uppercase-tracked text-xs">Out of Stock</div>
          ) : null}
        </div>
        <div className="p-4">
          <div className="flex items-center gap-1 text-xs text-[#5C4A3D]">
            <Star className="w-3 h-3 fill-[#F59E0B] text-[#F59E0B]" />
            <span>{product.rating}</span>
            <span>·</span>
            <span>{product.weight}</span>
          </div>
          <h3 className="font-semibold text-sm mt-1 line-clamp-1">{product.name}</h3>
          <p className="text-xs text-[#5C4A3D] mt-0.5 line-clamp-2">{product.description}</p>
          <div className="flex items-center justify-between mt-3">
            <div>
              <span className="font-bold text-[#2D1E16]">₹{product.discount_price}</span>
              {product.original_price > product.discount_price && (
                <span className="text-xs text-[#5C4A3D] line-through ml-2">₹{product.original_price}</span>
              )}
            </div>
            {cartQty > 0 ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleDecrease}
                  className="w-7 h-7 rounded-full border border-[#E6DFD5] flex items-center justify-center text-[#2D1E16]"
                  data-testid={`decrease-qty-${product.id}`}>
                  <Minus className="w-4 h-4" />
                </button>
                <span className="text-sm font-semibold">{cartQty}</span>
                <button
                  onClick={handleIncrease}
                  disabled={isOutOfStock || isMaxed}
                  className="w-7 h-7 rounded-full bg-[#BE123C] text-white flex items-center justify-center disabled:opacity-50"
                  data-testid={`increase-qty-${product.id}`}>
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={handleAddOne}
                disabled={isOutOfStock}
                className="btn-primary w-9 h-9 rounded-full flex items-center justify-center disabled:opacity-50"
                data-testid={`add-to-cart-${product.id}`}>
                <Plus className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
      <ProductModal product={product} open={open} onOpenChange={setOpen} />
    </>
  );
}
