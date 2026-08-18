import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Heart, Star, Minus, Plus, ShoppingCart } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function ProductModal({ product, open, onOpenChange }) {
  const { items, favorites, toggleFav, addToCart, updateQty } = useCart();
  const cartItem = items.find(
    (item) => item.product_id === product.id && (item.weight || product.weight) === product.weight
  );
  const cartQty = cartItem?.quantity || 0;
  const [imgIdx, setImgIdx] = useState(0);
  const [qty, setQty] = useState(cartItem?.quantity || 1);
  const [weight, setWeight] = useState(product.weight);
  const isFav = favorites.includes(product.id);
  const discount = Math.round(((product.original_price - product.discount_price) / product.original_price) * 100);
  const images = product.images?.length ? product.images : [product.images?.[0] || ""];
  const maxQty = product.stock ?? 0;
  const outOfStock = !product.in_stock || maxQty <= 0;

  useEffect(() => {
    setQty(cartItem?.quantity || 1);
  }, [cartItem]);

  const handleAdd = async () => {
    const result = await addToCart(product, qty, weight);
    if (result.ok) onOpenChange(false);
  };

  const handleIncrease = async () => {
    if (cartQty >= maxQty) {
      toast.error("Maximum available stock reached.");
      return;
    }
    await updateQty(product.id, cartQty + 1);
  };

  const handleDecrease = async () => {
    if (cartQty <= 1) {
      await updateQty(product.id, 0);
      return;
    }
    await updateQty(product.id, cartQty - 1);
  };

  const incrementQty = () => {
    if (qty >= maxQty) {
      toast.error("Maximum available stock reached.");
      return;
    }
    setQty(qty + 1);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl p-0 overflow-hidden max-h-[90vh] overflow-y-auto" data-testid="product-modal">
        <DialogTitle className="sr-only">{product.name}</DialogTitle>
        <div className="grid md:grid-cols-2">
          <div className="bg-[#FBF5EA] p-6">
            <div className="aspect-square rounded-xl overflow-hidden bg-white">
              <img src={images[imgIdx]} alt={product.name} className="w-full h-full object-cover" />
            </div>
            {images.length > 1 && (
              <div className="flex gap-2 mt-3">
                {images.map((im, i) => (
                  <button key={i} onClick={() => setImgIdx(i)}
                    className={`w-16 h-16 rounded-lg overflow-hidden border-2 ${i === imgIdx ? "border-[#06d2d9]" : "border-transparent"}`}>
                    <img src={im} className="w-full h-full object-cover" alt="" />
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-xs uppercase-tracked text-[#06d2d9]">{product.category}</div>
                <h2 className="font-display text-2xl font-bold mt-1">{product.name}</h2>
                <div className="flex items-center gap-2 mt-1 text-sm text-[#5C4A3D]">
                  <Star className="w-4 h-4 fill-[#F59E0B] text-[#F59E0B]" />
                  <span className="font-semibold text-[#2D1E16]">{product.rating}</span>
                  <span>· In Stock: {product.stock}</span>
                </div>
              </div>
              <button onClick={() => toggleFav(product.id)}
                className={`w-8 h-8 rounded-full flex items-center justify-center ${isFav ? "bg-[#BE123C] text-white" : "bg-[#FBF5EA]"}`}>
                <Heart className={`w-4 h-4 ${isFav ? "fill-current" : ""}`} />
              </button>
            </div>

            <p className="text-sm text-[#5C4A3D] leading-relaxed">{product.description}</p>
            {product.ingredients && (
              <div>
                <div className="text-xs uppercase-tracked text-[#5C4A3D] mb-1">Ingredients</div>
                <div className="text-sm">{product.ingredients}</div>
              </div>
            )}

            {product.weight_options?.length > 1 && (
              <div>
                <div className="text-xs uppercase-tracked text-[#5C4A3D] mb-2">Weight</div>
                <div className="flex gap-2">
                  {product.weight_options.map((w) => (
                    <button key={w} onClick={() => setWeight(w)}
                      className={`px-3 py-1.5 rounded-full text-sm border ${weight === w ? "bg-[#06d2d9] text-white border-[#06d2d9]" : "border-[#E6DFD5]"}`}>
                      {w}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-end gap-3 pt-2">
              <div>
                <div className="text-3xl font-bold">₹ {product.discount_price}</div>
                {product.original_price > product.discount_price && (
                  <div className="text-sm text-[#5C4A3D] line-through">₹{product.original_price} ({discount}% off)</div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              {cartQty > 0 ? (
                <div className="flex items-center border border-[#E6DFD5] rounded-full">
                  <button onClick={handleDecrease} className="w-9 h-9 flex items-center justify-center"><Minus className="w-4 h-4" /></button>
                  <div className="px-3 font-semibold" data-testid="qty-value">{cartQty}</div>
                  <button onClick={handleIncrease} className="w-9 h-9 flex items-center justify-center" disabled={outOfStock || cartQty >= maxQty}><Plus className="w-4 h-4" /></button>
                </div>
              ) : (
                <div className="flex items-center border border-[#E6DFD5] rounded-full">
                  <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-9 h-9 flex items-center justify-center"><Minus className="w-4 h-4" /></button>
                  <div className="px-3 font-semibold" data-testid="qty-value">{qty}</div>
                  <button onClick={incrementQty} className="w-9 h-9 flex items-center justify-center" disabled={outOfStock || qty >= maxQty}><Plus className="w-4 h-4" /></button>
                </div>
              )}
              {cartQty > 0 ? (
                <Button className="btn-primary rounded-full flex-1" onClick={handleIncrease} disabled={outOfStock || cartQty >= maxQty} data-testid="modal-increase-cart">
                  <Plus className="w-4 h-4 mr-2" /> Increase
                </Button>
              ) : (
                <Button className="btn-primary rounded-full flex-1" onClick={handleAdd} disabled={outOfStock || qty > maxQty} data-testid="modal-add-cart">
                  <ShoppingCart className="w-4 h-4 mr-2" /> {outOfStock ? "Out of Stock" : "Add to Cart"}
                </Button>
              )}
            </div>
            {outOfStock ? (
              <div className="text-sm text-red-600">This product is currently out of stock.</div>
            ) : (
              <div className="text-sm text-[#5C4A3D]">Only {maxQty} available</div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
