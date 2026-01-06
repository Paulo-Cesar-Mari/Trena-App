import { User, Settings, LogOut, Package, HardHat, Heart, Star, ChevronRight, Store, Frown } from "lucide-react";
import { useAuth } from "../hooks/use-auth";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { Product, User as UserType } from "@shared/schema";
import { ProductCard } from "@/components/ProductCard";
import * as Tabs from '@radix-ui/react-tabs';


const getProfileData = async () => {
  const response = await fetch(api.users.me.path);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json() as Promise<{
    user: UserType,
    products: Product[],
    favorites: Product[]
  }>;
};

export default function Profile() {
  const { user, logoutMutation } = useAuth();
  const [, setLocation] = useLocation();

  const { data: profileData, isLoading, error } = useQuery({
    queryKey: ['profile'],
    queryFn: getProfileData,
    enabled: !!user, // Só executa a query se o usuário estiver logado
  });

  const handleLogout = () => {
    logoutMutation.mutate(null, {
      onSuccess: () => {
        setLocation("/auth");
      },
    });
  };

    if (isLoading && !profileData) {
        return <ProfileLoadingSkeleton />;
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center">
                <Frown className="w-16 h-16 text-red-500 mb-4" />
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Oops! Algo deu errado.</h2>
                <p className="text-gray-600">Não foi possível carregar seu perfil. Tente novamente mais tarde.</p>
            </div>
        )
    }

  return (
    <div className="pb-24 min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-secondary pt-12 pb-24 px-4 sm:px-6 rounded-b-[2.5rem] relative overflow-hidden">
        <div className="relative z-10 flex items-center gap-4 max-w-4xl mx-auto">
          <div className="w-20 h-20 rounded-full border-4 border-white/20 bg-white flex items-center justify-center overflow-hidden">
            {user?.avatar ? (
               <img src={user.avatar} alt="Perfil" className="w-full h-full object-cover" />
            ) : (
               <User className="w-10 h-10 text-gray-300" />
            )}
          </div>
          <div className="text-white">
            <h1 className="text-2xl font-bold">
              Olá, {user ? user.name : "Visitante"}
            </h1>
            <p className="text-white/60 text-sm flex items-center gap-2">
              {user?.role === 'store' && <Store className="w-4 h-4" />}
              {user ? (user.role === 'store' ? "Vendedor" : "Comprador") : "Entre para ver seus pedidos"}
            </p>
          </div>
        </div>
        
        {/* Decorative */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-primary/10 rounded-full blur-3xl" />
      </div>

      {/* Menu Cards */}
      <div className="px-4 -mt-16 relative z-20 space-y-4 max-w-4xl mx-auto">
        {/* Stats Card */}
        <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-100 flex justify-around">
          <StatBox label="Anúncios" value={profileData?.products?.length || 0} />
          <StatBox label="Favoritos" value={profileData?.favorites?.length || 0} />
          <StatBox label="Avaliações" value={0} />
        </div>

        <Tabs.Root defaultValue={user?.role === 'store' ? 'listings' : 'favorites'} className="pt-4">
          <Tabs.List className="flex gap-4 border-b border-gray-200">
            {user?.role === 'store' && (
              <Tabs.Trigger value="listings" className="pb-3 px-2 font-semibold text-gray-500 border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary transition-colors">
                Meus Anúncios
              </Tabs.Trigger>
            )}
            <Tabs.Trigger value="favorites" className="pb-3 px-2 font-semibold text-gray-500 border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary transition-colors">
              Favoritos
            </Tabs.Trigger>
          </Tabs.List>
          {user?.role === 'store' && (
            <Tabs.Content value="listings" className="py-6">
              <UserListings products={profileData?.products || []} />
            </Tabs.Content>
          )}
          <Tabs.Content value="favorites" className="py-6">
            <UserFavorites products={profileData?.favorites || []} />
          </Tabs.Content>
        </Tabs.Root>

        <button 
          onClick={handleLogout}
          disabled={logoutMutation.isPending}
          className="w-full bg-white p-4 rounded-2xl shadow-sm border border-gray-100 text-red-500 font-bold flex items-center justify-center gap-2 hover:bg-red-50 transition-colors disabled:opacity-50"
        >
          <LogOut className="w-5 h-5" />
          {logoutMutation.isPending ? "Saindo..." : "Sair da conta"}
        </button>
      </div>
    </div>
  );
}

const UserListings = ({ products }: { products: Product[] }) => {
    const [, setLocation] = useLocation();

    if (products.length === 0) {
        return (
            <div className="text-center bg-gray-50 rounded-2xl p-8 sm:p-12">
                <div className="w-16 h-16 bg-white border border-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Package className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-bold text-gray-800">Você ainda não tem anúncios</h3>
                <p className="text-gray-500 max-w-xs mx-auto mt-2 mb-6">
                    Que tal começar a vender? Crie seu primeiro anúncio e alcance milhares de compradores.
                </p>
                <button
                    onClick={() => setLocation('/create-listing')}
                    className="bg-primary text-primary-foreground font-bold py-3 px-6 rounded-full hover:bg-primary/90 transition-transform transform hover:scale-105"
                >
                    Criar meu primeiro anúncio
                </button>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map(product => (
                <ProductCard key={product.id} product={product} />
            ))}
        </div>
    )
}

const UserFavorites = ({ products }: { products: Product[] }) => {
    const [, setLocation] = useLocation();

    if (products.length === 0) {
        return (
            <div className="text-center bg-gray-50 rounded-2xl p-8 sm:p-12">
                <div className="w-16 h-16 bg-white border border-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Heart className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-bold text-gray-800">Sua lista de favoritos está vazia</h3>
                <p className="text-gray-500 max-w-xs mx-auto mt-2 mb-6">
                    Explore o marketplace e adicione produtos que você amou para vê-los aqui.
                </p>
                <button
                    onClick={() => setLocation('/')}
                    className="bg-primary text-primary-foreground font-bold py-3 px-6 rounded-full hover:bg-primary/90 transition-transform transform hover:scale-105"
                >
                    Explorar o marketplace
                </button>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map(product => (
                <ProductCard key={product.id} product={product} />
            ))}
        </div>
    )
}

const StatBox = ({ label, value }: { label: string; value: number | string }) => (
    <div className="text-center flex-1">
        <span className="block text-2xl font-bold text-primary">{value}</span>
        <span className="text-xs text-gray-500 font-medium">{label}</span>
    </div>
);

const ProfileLoadingSkeleton = () => (
    <div className="pb-24 min-h-screen bg-gray-50 animate-pulse">
      <div className="bg-secondary pt-12 pb-24 px-6 rounded-b-[2.5rem] relative">
        <div className="flex items-center gap-4 max-w-4xl mx-auto">
          <div className="w-20 h-20 rounded-full bg-white/20"></div>
          <div>
            <div className="h-8 w-40 bg-white/20 rounded-md mb-2"></div>
            <div className="h-4 w-32 bg-white/20 rounded-md"></div>
          </div>
        </div>
      </div>
      <div className="px-4 -mt-16 relative z-20 space-y-4 max-w-4xl mx-auto">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-24"></div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-96"></div>
      </div>
    </div>
  );