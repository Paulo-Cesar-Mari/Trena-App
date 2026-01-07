import { useQuery } from "@tanstack/react-query";
import { Product } from "@shared/schema";
import { ProductCard } from "@/components/ProductCard";
import { api } from "@shared/routes";
import { Heart } from "lucide-react";
import { useLocation } from "wouter";

const getMyFavorites = async () => {
  const response = await fetch(api.users.me.favorites.path);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json() as Promise<Product[]>;
};

export default function Favorites() {
  const { data: products, isLoading, error } = useQuery({
    queryKey: ["my-favorites"],
    queryFn: getMyFavorites,
  });
  const [, setLocation] = useLocation();

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  if (error) {
    return <div>Ocorreu um erro ao carregar seus favoritos.</div>;
  }

  if (!products || products.length === 0) {
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
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
