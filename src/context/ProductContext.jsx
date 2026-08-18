import { createContext, useContext, useEffect, useState, useCallback } from "react";
import api from "@/lib/api";
import { toast } from "sonner";

const ProductCtx = createContext(null);
export const useProducts = () => useContext(ProductCtx);

export function ProductProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [productsVersion, setProductsVersion] = useState(0);

  const reloadProducts = useCallback(async (silent = false) => {
    setLoading(true);
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        api.get("/products?limit=500"),
        api.get("/categories"),
      ]);
      setProducts(productsRes.data || []);
      setCategories(categoriesRes.data || []);
      setProductsVersion((v) => v + 1);
    } catch (e) {
      if (!silent) toast.error("Unable to refresh products");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { reloadProducts(); }, [reloadProducts]);

  useEffect(() => {
    const handleReload = (event) => {
      const shouldReload = event?.key === "slv_products_updated" || event?.type === "slv_products_updated" || event?.type === "message";
      if (shouldReload) reloadProducts(true);
    };

    const intervalId = window.setInterval(() => {
      reloadProducts(true);
    }, 8000);

    const handleFocus = () => {
      reloadProducts(true);
    };

    const handleVisibility = () => {
      if (document.visibilityState === "visible") reloadProducts(true);
    };

    let channel = null;
    if (typeof BroadcastChannel !== "undefined") {
      channel = new BroadcastChannel("slv_products");
      channel.addEventListener("message", handleReload);
    }

    window.addEventListener("storage", handleReload);
    window.addEventListener("slv_products_updated", handleReload);
    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      window.clearInterval(intervalId);
      window.removeEventListener("storage", handleReload);
      window.removeEventListener("slv_products_updated", handleReload);
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleVisibility);
      channel?.close();
    };
  }, [reloadProducts]);

  return (
    <ProductCtx.Provider value={{ products, categories, loading, productsVersion, reloadProducts }}>
      {children}
    </ProductCtx.Provider>
  );
}
