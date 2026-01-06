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
    <div className="pb-24 min-h-screen">

      {/* Header */}
      <div className="bg-white border-b border-gray-200 pt-4 pb-5 px-4">
          <h1 className="text-2xl font-bold text-secondary text-center">Buscar Produtos</h1>
      </div>

      {/* Filters */}
      <div className="sticky top-0 z-30 bg-background/95 backdrop-blur-sm p-4 space-y-4 border-b border-gray-100">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Buscar materiais..." 
              className="w-full pl-10 pr-4 py-3 bg-gray-100 border border-transparent rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button className="p-3 bg-gray-100 border border-transparent rounded-xl text-gray-600 hover:bg-gray-200">
            <SlidersHorizontal className="w-5 h-5" />
          </button>
        </div>

        {/* Categories Pills */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-4 px-4 pb-2">
          <button 
            onClick={() => setCategory("")}
            className={`px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-colors ${
              category === "" 
                ? "bg-secondary text-white"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            Todos
          </button>
          {categories.map((cat) => (
            <button 
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-colors ${
                category === cat 
                  ? "bg-secondary text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="px-4 mt-4">
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl h-56 sm:h-64 animate-pulse border border-gray-100" />
            ))}
          </div>
        ) : products?.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <PackageOpen className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">Nenhum produto encontrado</h3>
            <p className="text-gray-500 max-w-xs mt-2 text-sm sm:text-base">
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
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
            {products?.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
