import { useEffect, useState } from "react";
import api from "@/lib/api";
import CouponUnlock from "@/components/CouponUnlock";
import ProductSection from "@/components/ProductSection";
import { useProducts } from "@/context/ProductContext";
import { Link } from "react-router-dom";
import { ArrowRight, Clock, Truck, Award } from "lucide-react";

export default function Home() {
  const [banners, setBanners] = useState([]);
  const [bIdx, setBIdx] = useState(0);
  const { products: catalogProducts, categories: catalogCategories } = useProducts();

  useEffect(() => {
    api.get("/banners").then((r) => setBanners(r.data));
  }, []);
  useEffect(() => {
    if (banners.length < 2) return;
    const id = setInterval(() => setBIdx((i) => (i + 1) % banners.length), 5000);
    return () => clearInterval(id);
  }, [banners]);

  const bytag = (t) => catalogProducts.filter((p) => p.tags?.includes(t));

  return (
    <div className="animate-fadeUp">
      {/* Hero */}
      <section className="relative h-[70vh] md:h-[85vh] overflow-hidden" data-testid="hero-section">
        {banners.map((b, i) => (
          <div key={b.id} className={`absolute inset-0 transition-opacity duration-1000 ${i === bIdx ? "opacity-100" : "opacity-0"}`}>
            <img src={b.image} alt={b.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 hero-overlay" />
          </div>
        ))}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <div className="max-w-2xl text-white animate-fadeUp">
            <div className="uppercase-tracked text-xs text-[#F59E0B] mb-3">SLV Bakery · Since 2010</div>
            <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold leading-tight">
              {banners[bIdx]?.title || "Freshly Baked, Delivered in 25 Minutes"}
            </h1>
            <p className="mt-4 text-base md:text-lg text-white/85 max-w-lg">
              {banners[bIdx]?.subtitle || "Artisan breads, cakes & sweets from Koramangala's most-loved bakery."}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/categories" className="btn-primary rounded-full px-6 py-3 text-sm uppercase-tracked flex items-center gap-2" data-testid="shop-now">
                Shop Now <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/birthday-cake" className="bg-white/10 backdrop-blur border border-white/30 rounded-full px-6 py-3 text-sm uppercase-tracked hover:bg-white/20">
                Design a Birthday Cake
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex gap-2">
          {banners.map((_, i) => (
            <button key={i} onClick={() => setBIdx(i)}
              className={`h-1.5 rounded-full transition-all ${i === bIdx ? "w-8 bg-white" : "w-4 bg-white/40"}`} />
          ))}
        </div>
      </section>

      {/* Trust Bar */}
      <div className="border-y border-[#E6DFD5] bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 grid grid-cols-3 gap-4">
          {[
            { icon: Clock, label: "25 Min Delivery" },
            { icon: Truck, label: "5 KM Radius" },
            { icon: Award, label: "Freshly Baked Daily" },
          ].map((f, i) => (
            <div key={i} className="flex items-center gap-2 md:gap-3 justify-center">
              <f.icon className="w-4 h-4 md:w-5 md:h-5 text-[#06d2d9]" />
              <span className="uppercase-tracked text-xs md:text-sm">{f.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Coupon */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <CouponUnlock />
      </section>

      <ProductSection title="Just Arrived" subtitle="Fresh from the oven" products={bytag("just_arrived")} />
      <ProductSection title="Freshly Baked" subtitle="Baked today" products={bytag("freshly_baked")} />
      <ProductSection title="Most Ordered" subtitle="Customer favorites" products={bytag("most_ordered")} />
      <ProductSection title="Recommended For You" subtitle="Picked for you" products={bytag("recommended")} />

      {/* Categories */}
      <section className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <div className="uppercase-tracked text-xs text-[#06d2d9] mb-1">Browse</div>
            <h2 className="font-display text-2xl md:text-3xl font-bold">Shop by Category</h2>
          </div>
          <div className="grid grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 md:gap-4">
            {catalogCategories.map((c) => (
              <Link key={c.id} to={`/categories?category=${encodeURIComponent(c.name)}`}
                className="group text-center" data-testid={`category-${c.name.toLowerCase().replaceAll(" ", "-")}`}>
                <div className="aspect-square rounded-2xl overflow-hidden bg-[#FBF5EA] border border-[#E6DFD5] group-hover:border-[#06d2d9] transition-colors">
                  {c.image ? (
                    <img src={c.image} alt={c.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : <div className="w-full h-full flex items-center justify-center text-2xl">🎂</div>}
                </div>
                <div className="text-xs md:text-sm font-semibold mt-2">{c.name}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
