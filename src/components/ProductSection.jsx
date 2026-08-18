import ProductCard from "./ProductCard";
import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function ProductSection({ title, subtitle, products, viewMoreLink = "/categories" }) {
  if (!products?.length) return null;
  return (
    <section className="py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-6">
          <div>
            <div className="uppercase-tracked text-xs text-[#06d2d9] mb-1">{subtitle}</div>
            <h2 className="font-display text-2xl md:text-3xl font-bold">{title}</h2>
          </div>
          <Link to={viewMoreLink} className="text-sm uppercase-tracked text-[#06d2d9] flex items-center gap-1 hover:gap-2 transition-all">
            View More <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {products.slice(0, 8).map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </div>
    </section>
  );
}
