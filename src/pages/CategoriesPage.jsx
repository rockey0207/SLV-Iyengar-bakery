import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "@/components/ProductCard";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Search } from "lucide-react";
import { useProducts } from "@/context/ProductContext";

export default function CategoriesPage() {
  const [params, setParams] = useSearchParams();
  const { products: catalogProducts, categories: catalogCategories } = useProducts();
  const [q, setQ] = useState(params.get("q") || "");
  const [selected, setSelected] = useState(params.get("category") ? [params.get("category")] : []);
  const [price, setPrice] = useState([0, 3000]);
  const [minRating, setMinRating] = useState(0);
  const [sort, setSort] = useState("newest");
  const [inStockOnly, setInStockOnly] = useState(false);

  const products = useMemo(() => {
    const query = q.toLowerCase().trim();
    return [...catalogProducts]
      .filter((p) => {
        const matchesQuery = !query || [p.name, p.description, p.category].some((value) => (value || "").toLowerCase().includes(query));
        const matchesCategory = selected.length === 0 || (selected.length === 1 ? p.category === selected[0] : selected.includes(p.category));
        const priceValue = p.discount_price ?? p.original_price ?? 0;
        const matchesPrice = priceValue >= price[0] && priceValue <= price[1];
        const matchesRating = (p.rating ?? 0) >= minRating;
        const matchesStock = !inStockOnly || ((p.in_stock ?? true) && (p.stock ?? 0) > 0);
        return matchesQuery && matchesCategory && matchesPrice && matchesRating && matchesStock;
      })
      .sort((a, b) => {
        if (sort === "price_low") return (a.discount_price ?? a.original_price ?? 0) - (b.discount_price ?? b.original_price ?? 0);
        if (sort === "price_high") return (b.discount_price ?? b.original_price ?? 0) - (a.discount_price ?? a.original_price ?? 0);
        if (sort === "rating") return (b.rating ?? 0) - (a.rating ?? 0);
        return 0;
      });
  }, [catalogProducts, q, selected, price, minRating, sort, inStockOnly]);

  const toggle = (name) => {
    setSelected((prev) => prev.includes(name) ? prev.filter((x) => x !== name) : [...prev, name]);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" data-testid="categories-page">
      <div className="mb-6">
        <div className="uppercase-tracked text-xs text-[#06d2d9]">Categories</div>
        <h1 className="font-display text-3xl md:text-4xl font-bold mt-1">Everything Freshly Baked</h1>
      </div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex-1 flex items-center bg-white border border-[#E6DFD5] rounded-full px-4 h-11">
          <Search className="w-4 h-4 text-[#5C4A3D]" />
          <input value={q} onChange={(e) => { setQ(e.target.value); setParams({ q: e.target.value }); }}
            placeholder="Search products..." className="bg-transparent outline-none focus:outline-none focus:ring-0 text-sm w-full ml-2" data-testid="search-cat-input" />
        </div>
        <Select value={sort} onValueChange={setSort}>
          <SelectTrigger className="w-40 rounded-full" data-testid="sort-select"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest</SelectItem>
            <SelectItem value="price_low">Price: Low → High</SelectItem>
            <SelectItem value="price_high">Price: High → Low</SelectItem>
            <SelectItem value="rating">Top Rated</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid lg:grid-cols-[280px_1fr] gap-8">
        <aside className="bg-white border border-[#E6DFD5] rounded-2xl p-5 h-fit lg:sticky lg:top-24" data-testid="filters-sidebar">
          <h3 className="font-semibold mb-3 uppercase-tracked text-xs">Categories</h3>
          <div className="thin-scrollbar space-y-2 max-h-64 overflow-y-auto">
            {catalogCategories.map((c) => (
              <label key={c.id} className="flex items-center gap-2 text-sm cursor-pointer">
                <Checkbox checked={selected.includes(c.name)} onCheckedChange={() => toggle(c.name)} data-testid={`filter-${c.name.toLowerCase().replaceAll(" ", "-")}`} />
                {c.name}
              </label>
            ))}
          </div>
          <h3 className="font-semibold mt-6 mb-3 uppercase-tracked text-xs">Price Range</h3>
          <div className="px-1">
            <Slider min={0} max={1000} step={10} value={price} onValueChange={setPrice} />
            <div className="flex justify-between text-xs text-[#5C4A3D] mt-2">
              <span>₹{price[0]}</span><span>₹{price[1]}</span>
            </div>
          </div>
          <h3 className="font-semibold mt-6 mb-3 uppercase-tracked text-xs">Rating</h3>
          <div className="space-y-1.5">
            {[0, 3, 4, 4.5].map((r) => (
              <label key={r} className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="radio" checked={minRating === r} onChange={() => setMinRating(r)} />
                {r === 0 ? "All" : `${r}+ Stars`}
              </label>
            ))}
          </div>
          <h3 className="font-semibold mt-6 mb-3 uppercase-tracked text-xs">Availability</h3>
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <Checkbox checked={inStockOnly} onCheckedChange={setInStockOnly} />
            In Stock Only
          </label>
        </aside>

        <div>
          <div className="text-sm text-[#5C4A3D] mb-4">{products.length} products</div>
          {products.length === 0 ? (
            <div className="text-center py-20 text-[#5C4A3D]">No products found. Try adjusting filters.</div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
              {products.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
