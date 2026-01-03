import { MapPin, Store } from "lucide-react";
import { Link } from "wouter";
import { type Product } from "@shared/schema";

export function ProductCard({ product }: { product: Product }) {
  // Format price to BRL
  const price = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(Number(product.price));

  return (
    <Link href={`/produto/${product.id}`}>
      <div className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 card-hover cursor-pointer h-full flex flex-col">
        {/* Image Container */}
        <div className="aspect-[4/3] bg-gray-100 relative overflow-hidden">
          {product.image ? (
            <img 
              src={product.image} 
              alt={product.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400">
              <Store className="w-12 h-12 opacity-20" />
            </div>
          )}
          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-bold text-secondary shadow-sm">
            {product.category}
          </div>
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col flex-grow">
          <h3 className="font-semibold text-gray-900 line-clamp-1 group-hover:text-primary transition-colors">
            {product.title}
          </h3>
          
          <div className="mt-auto pt-3 space-y-2">
            <p className="text-xl font-bold text-secondary">
              {price}
            </p>
            
            <div className="flex items-center text-xs text-gray-500">
              <Store className="w-3.5 h-3.5 mr-1" />
              <span className="truncate">{product.storeName}</span>
            </div>
            
            <div className="flex items-center text-xs text-gray-500">
              <MapPin className="w-3.5 h-3.5 mr-1" />
              <span className="truncate">{product.location}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
