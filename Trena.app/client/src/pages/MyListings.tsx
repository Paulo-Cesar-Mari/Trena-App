import { useQuery } from "@tanstack/react-query";
import { Product } from "@shared/schema";
import { ProductCard } from "@/components/ProductCard";
import { api } from "@shared/routes";
import { Package } from "lucide-react";
import { useLocation } from "wouter";

const getMyListings = async () => {
  const response = await fetch(api.users.me.products.path);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json() as Promise<Product[]>;
};

export default function MyListings() {
  const { data: products, isLoading, error } = useQuery({
    queryKey: ["my-listings"],
    queryFn: getMyListings,
  });
  const [, setLocation] = useLocation();

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  if (error) {
    return <div>Ocorreu um erro ao carregar seus anúncios.</div>;
  }

  if (!products || products.length === 0) {
    return (
      <div className="text-center bg-gray-50 rounded-2xl p-6 sm:p-12">
        <div className="w-16 h-16 bg-white border border-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
          <Package className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-bold text-gray-800">
          Você ainda não tem anúncios
        </h3>
        <p className="text-gray-500 text-sm sm:text-base max-w-xs mx-auto mt-2 mb-6">
          Que tal começar a vender? Crie seu primeiro anúncio e alcance
          milhares de compradores.
        </p>
        <button
          onClick={() => setLocation("/anunciar")}
          className="btn-primary"
        >
          Criar meu primeiro anúncio
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
