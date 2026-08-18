import { useEffect, useState } from "react";
import api from "@/lib/api";
import ProductCard from "@/components/ProductCard";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useProducts } from "@/context/ProductContext";
import { Heart } from "lucide-react";
import { Link } from "react-router-dom";

export default function Favorites() {
  const { user } = useAuth();
  const { favorites } = useCart();
  const { products: catalogProducts } = useProducts();
  const [products, setProducts] = useState([]);
  const visibleProducts = products
    .filter((p) => favorites.includes(p.id))
    .map((p) => {
      const latest = catalogProducts.find((item) => item.id === p.id);
      return latest ? { ...p, ...latest } : p;
    });

  useEffect(() => { if (user) api.get("/favorites").then((r) => setProducts(r.data.products || [])); }, [user]);

  if (!user) return (
    <div className="max-w-2xl mx-auto text-center py-20 px-4" data-testid="fav-login-required">
      <Heart className="w-12 h-12 text-[#06d2d9] mx-auto mb-4" />
      <h2 className="font-display text-2xl font-bold">Login to see your favorites</h2>
      <Link to="/login" className="btn-primary inline-block mt-4 rounded-full px-6 py-2.5 text-sm uppercase-tracked">Login</Link>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10" data-testid="favorites-page">
      <div className="mb-6">
        <div className="uppercase-tracked text-xs text-[#06d2d9]">Your Loved List</div>
        <h1 className="font-display text-3xl md:text-4xl font-bold mt-1">Favorites</h1>
      </div>
      {visibleProducts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center mb-5 animate-bounce">
            <Heart className="w-10 h-10 text-red-500 fill-red-500" />
          </div>

          <h3 className="font-display text-2xl font-bold text-[#3D2C1E]">
            No Favorites Yet
          </h3>

          <p className="mt-3 text-[#5C4A3D] max-w-sm leading-6">
            Tap the <Heart className="inline w-4 h-4 text-red-500 fill-red-500 mx-1" />
            icon on any product to save your favorite bakery treats here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {visibleProducts.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  );
}
