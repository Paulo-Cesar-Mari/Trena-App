import { useFavorites } from "@/hooks/use-favorites";
import { Product, Service } from "@shared/schema";
import { ProductCard } from "@/components/ProductCard";
import { ServiceCard } from "@/components/ServiceCard";
import { Heart } from "lucide-react";
import { useLocation } from "wouter";

export default function Favorites() {
  const { data: favorites, isLoading, error } = useFavorites();
  const [, setLocation] = useLocation();

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  if (error) {
    return <div>Ocorreu um erro ao carregar seus favoritos.</div>;
  }

  if (!favorites || favorites.length === 0) {
    return (
      <div className="text-center bg-gray-50 rounded-2xl p-6 sm:p-12">
        <div className="w-16 h-16 bg-white border border-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
          <Heart className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-bold text-gray-800">
          Sua lista de favoritos está vazia
        </h3>
        <p className="text-gray-500 text-sm sm:text-base max-w-xs mx-auto mt-2 mb-6">
          Explore o marketplace e adicione produtos que você amou para vê-los
          aqui.
        </p>
        <button
          onClick={() => setLocation("/buscar")}
          className="btn-primary"
        >
          Explorar o marketplace
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
      {favorites.map((item) => {
        if ("sellerId" in item) {
          return <ProductCard key={`product-${item.id}`} product={item as Product} />;
        } else {
          return <ServiceCard key={`service-${item.id}`} service={item as Service} />;
        }
      })}
    </div>
  );
}
