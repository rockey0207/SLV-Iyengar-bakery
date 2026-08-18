import { createContext, useContext, useEffect, useState, useCallback } from "react";
import api from "@/lib/api";
import { useAuth } from "./AuthContext";
import { toast } from "sonner";

const CartCtx = createContext(null);
export const useCart = () => useContext(CartCtx);

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [favorites, setFavorites] = useState([]);

  const reload = useCallback(async () => {
    if (!user) { setItems([]); setFavorites([]); return; }
    try {
      const [cart, fav] = await Promise.all([api.get("/cart"), api.get("/favorites")]);
      setItems(cart.data.items || []);
      setFavorites(fav.data.product_ids || []);
    } catch {}
  }, [user]);

  useEffect(() => { reload(); }, [reload]);

  const addToCart = async (product, quantity = 1, weight = null) => {
    if (!user) { toast.error("Please login to add items"); return { needAuth: true }; }
    try {
      const { data } = await api.post("/cart/add", { product_id: product.id, quantity, weight: weight || product.weight });
      setItems(data.items);
      toast.success(`${product.name} added to cart`);
      return { ok: true };
    } catch (e) {
      toast.error(e?.response?.data?.detail || "Unable to add item to cart");
      return { ok: false, error: e };
    }
  };

  const updateQty = async (product_id, quantity) => {
    try {
      const { data } = await api.post("/cart/update", { product_id, quantity });
      setItems(data.items);
      return { ok: true };
    } catch (e) {
      toast.error(e?.response?.data?.detail || "Unable to update quantity");
      return { ok: false, error: e };
    }
  };

  const clearCart = async () => {
    await api.delete("/cart/clear");
    setItems([]);
  };

  const toggleFav = async (product_id) => {
    if (!user) { toast.error("Please login to save favorites"); return; }
    const { data } = await api.post("/favorites/toggle", { product_id });
    setFavorites((prev) => data.favorited ? [...prev, product_id] : prev.filter(x => x !== product_id));
    toast.success(data.favorited ? "Added to favorites" : "Removed from favorites");
  };

  const subtotal = items.reduce((s, i) => s + (i.product?.discount_price || 0) * i.quantity, 0);
  const count = items.reduce((s, i) => s + i.quantity, 0);

  return (
    <CartCtx.Provider value={{ items, favorites, addToCart, updateQty, clearCart, toggleFav, subtotal, count, reload }}>
      {children}
    </CartCtx.Provider>
  );
}
