import { useQuery } from '@tanstack/react-query';
import { useParams } from 'wouter';
import { api, buildUrl } from '@shared/routes';
import { queryClient } from '@/lib/queryClient';
import { ProductCard } from '@/components/ProductCard';
import { User, PackageOpen } from 'lucide-react';
import type { User as UserType, Product } from '@shared/schema';

const getStoreProfile = async (id: string) => {
  const url = buildUrl(api.users.getProfile.path, { id });
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json() as Promise<{ user: UserType, products: Product[] }>;
};

export default function StoreProfile() {
  const params = useParams();
  const id = params.id as string;

  const { data: profile, isLoading, error } = useQuery({
    queryKey: ['storeProfile', id],
    queryFn: () => getStoreProfile(id),
  });

  if (isLoading) {
    return (
      <div className="pb-24 min-h-screen bg-gray-50 animate-pulse">
        <div className="bg-secondary pt-12 pb-24 px-6 rounded-b-[2.5rem] relative overflow-hidden">
          <div className="relative z-10 flex items-center gap-4">
            <div className="w-20 h-20 rounded-full border-4 border-white/20 bg-white/20"></div>
            <div className="text-white">
              <div className="h-8 w-48 bg-white/20 rounded-md mb-2"></div>
              <div className="h-4 w-64 bg-white/20 rounded-md"></div>
            </div>
          </div>
        </div>
        <div className="px-4 -mt-12 relative z-20 space-y-4 max-w-7xl mx-auto">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-24"></div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="bg-white rounded-2xl h-64" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return <div>Error fetching store profile</div>;
  }

  return (
    <div className="pb-24 min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-secondary pt-12 pb-24 px-6 rounded-b-[2.5rem] relative overflow-hidden">
        <div className="relative z-10 flex items-center gap-4 max-w-7xl mx-auto">
          <div className="w-20 h-20 rounded-full border-4 border-white/20 bg-white flex items-center justify-center overflow-hidden">
            {profile?.user.avatar ? (
               <img src={profile.user.avatar} alt="Perfil" className="w-full h-full object-cover" />
            ) : (
               <User className="w-10 h-10 text-gray-300" />
            )}
          </div>
          <div className="text-white">
            <h1 className="text-2xl font-bold">
              {profile?.user.name}
            </h1>
            <p className="text-white/60 text-sm">
              {profile?.user.bio || "Loja de materiais de construção"}
            </p>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-40 h-40 bg-primary/10 rounded-full blur-3xl" />
      </div>

      <div className="px-4 -mt-12 relative z-20 space-y-4 max-w-7xl mx-auto">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Produtos da Loja</h2>
            {profile?.products?.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <PackageOpen className="w-10 h-10 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">Nenhum produto encontrado</h3>
                    <p className="text-gray-500 max-w-xs mt-2">
                        Esta loja ainda não cadastrou nenhum produto.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
                    {profile?.products?.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            )}
        </div>
      </div>
    </div>
  );
}
