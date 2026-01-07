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
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center p-4">
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
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-4 border-white/20 bg-white flex items-center justify-center overflow-hidden">
            {user?.avatar ? (
               <img src={user.avatar} alt="Perfil" className="w-full h-full object-cover" />
            ) : (
               <User className="w-8 h-8 sm:w-10 sm:h-10 text-gray-300" />
            )}
          </div>
          <div className="text-white">
            <h1 className="text-xl sm:text-2xl font-bold">
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

      {/* Content */}
      <div className="px-4 -mt-16 relative z-20 space-y-4 max-w-4xl mx-auto">
        {/* Stats Card */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex justify-around">
          <StatBox label="Anúncios" value={profileData?.products?.length || 0} />
          <StatBox label="Favoritos" value={profileData?.favorites?.length || 0} />
          <StatBox label="Avaliações" value={0} />
        </div>

        <div className="pt-4 space-y-3">
          {user?.role === 'store' && (
            <ProfileButton
              icon={Package}
              label="Meus Anúncios"
              href="/meus-anuncios"
            />
          )}
          <ProfileButton
            icon={Heart}
            label="Favoritos"
            href="/favoritos"
          />
          <ProfileButton
            icon={Settings}
            label="Configurações"
            href="/configuracoes"
          />
        </div>

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

const StatBox = ({ label, value }: { label: string; value: number | string }) => (
    <div className="text-center flex-1 px-1">
        <span className="block text-xl sm:text-2xl font-bold text-primary">{value}</span>
        <span className="text-xs text-gray-500 font-medium">{label}</span>
    </div>
);

const ProfileButton = ({ icon: Icon, label, href }: { icon: React.ElementType, label: string, href:string }) => {
    const [, setLocation] = useLocation();

    return (
        <button
            onClick={() => setLocation(href)}
            className="w-full bg-white p-4 rounded-2xl shadow-sm border border-gray-100 text-gray-800 font-bold flex items-center gap-4 hover:bg-gray-50 transition-colors"
        >
            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                <Icon className="w-5 h-5 text-gray-600" />
            </div>
            <span className="flex-1 text-left">{label}</span>
            <ChevronRight className="w-5 h-5 text-gray-400" />
        </button>
    )
};

const ProfileLoadingSkeleton = () => (
    <div className="pb-24 min-h-screen bg-gray-50 animate-pulse">
      <div className="bg-secondary pt-12 pb-24 px-4 sm:px-6 rounded-b-[2.5rem] relative">
        <div className="flex items-center gap-4 max-w-4xl mx-auto">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/20"></div>
          <div>
            <div className="h-6 sm:h-8 w-40 bg-white/20 rounded-md mb-2"></div>
            <div className="h-4 w-32 bg-white/20 rounded-md"></div>
          </div>
        </div>
      </div>
      <div className="px-4 -mt-16 relative z-20 space-y-4 max-w-4xl mx-auto">
        <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-100 h-20 sm:h-24"></div>
        <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-100 h-96"></div>
      </div>
    </div>
  );