import { useState } from "react";
import { Search, SlidersHorizontal, PackageOpen } from "lucide-react";
import { useProducts } from "@/hooks/use-products";
import { ProductCard } from "@/components/ProductCard";
import { useLocation } from "wouter";

export default function ProductList() {
  const [location] = useLocation();
  const searchParams = new URLSearchParams(window.location.search);
  const initialCategory = searchParams.get("category") || "";
  
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(initialCategory);
  
  const { data: products, isLoading } = useProducts({ 
    search: search || undefined, 
    category: category || undefined 
  });

  const categories = ["Cimento", "Pintura", "Ferramentas", "Elétrica", "Hidráulica", "Pisos", "Telhados"];

  return (
    <div className="pb-24 pt-4 px-4 max-w-7xl mx-auto min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-secondary">Produtos</h1>
      </div>

      {/* Filters */}
      <div className="sticky top-20 md:top-24 z-30 bg-background/95 backdrop-blur-sm pb-4 space-y-4">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Buscar materiais..." 
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button className="p-2.5 bg-white border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50">
            <SlidersHorizontal className="w-5 h-5" />
          </button>
        </div>

        {/* Categories Pills */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          <button 
            onClick={() => setCategory("")}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors border ${
              category === "" 
                ? "bg-secondary text-white border-secondary" 
                : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
            }`}
          >
            Todos
          </button>
          {categories.map((cat) => (
            <button 
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors border ${
                category === cat 
                  ? "bg-secondary text-white border-secondary" 
                  : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="bg-white rounded-2xl h-64 animate-pulse" />
          ))}
        </div>
      ) : products?.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <PackageOpen className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-lg font-bold text-gray-900">Nenhum produto encontrado</h3>
          <p className="text-gray-500 max-w-xs mt-2">
            Tente buscar por outro termo ou selecione uma categoria diferente.
          </p>
          <button 
            onClick={() => { setSearch(""); setCategory(""); }}
            className="mt-6 text-primary font-semibold text-sm hover:underline"
          >
            Limpar filtros
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
          {products?.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
