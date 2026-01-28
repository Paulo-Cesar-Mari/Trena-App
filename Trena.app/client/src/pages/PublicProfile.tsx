import { useQuery } from '@tanstack/react-query';
import { useLocation, useParams } from 'wouter';
import { api, buildUrl } from '@shared/routes';
import { ProductCard } from '@/components/ProductCard';
import { User, PackageOpen, MapPin, MessageCircle } from 'lucide-react';
import type { User as UserType, Product, Service } from '@shared/schema';
import { ServiceCard } from '@/components/ServiceCard';

const getPublicProfile = async (id: string) => {
  const url = buildUrl(api.users.getProfile.path, { id });
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json() as Promise<{ user: UserType, products: Product[], services: Service[] }>;
};

export default function PublicProfile() {
  const params = useParams();
  const [, setLocation] = useLocation();
  const id = params.id as string;

  const { data: profile, isLoading, error } = useQuery({
    queryKey: ['publicProfile', id],
    queryFn: () => getPublicProfile(id),
  });

  if (isLoading) {
    return (
      <div className="pb-24 min-h-screen bg-gray-50 animate-pulse">
        {/* Header Skeleton */}
        <div className="bg-secondary pt-12 pb-24 px-6 rounded-b-[2.5rem] relative overflow-hidden">
          <div className="relative z-10 flex items-center gap-4">
            <div className="w-20 h-20 rounded-full border-4 border-white/20 bg-white/20"></div>
            <div className="text-white">
              <div className="h-8 w-48 bg-white/20 rounded-md mb-2"></div>
              <div className="h-4 w-64 bg-white/20 rounded-md"></div>
            </div>
          </div>
        </div>
        {/* Content Skeleton */}
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
    return <div className="text-center py-20">Error fetching store profile</div>;
  }

  const isStore = profile?.user.role === 'store';
  const isProfessional = profile?.user.role === 'professional';

  const handleContact = () => {
    setLocation(`/inbox/${id}`);
  };

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
            <p className="text-white/60 text-sm mt-1">
              {profile?.user.bio || (isStore ? "Loja de materiais de construção" : "Profissional da construção")}
            </p>
            {profile?.user.location && (
              <div className="flex items-center gap-2 text-xs text-white/60 mt-2">
                <MapPin className="w-3 h-3" />
                <span>{profile.user.location}</span>
              </div>
            )}
          </div>
        </div>
        <div className="absolute top-0 right-0 w-40 h-40 bg-primary/10 rounded-full blur-3xl" />
      </div>

      <div className="px-4 -mt-12 relative z-20 space-y-4 max-w-7xl mx-auto">
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center">
            <div>
                <h2 className="text-lg font-bold text-gray-800">
                  {isStore ? "Produtos da Loja" : "Serviços Oferecidos"}
                </h2>
                <p className="text-sm text-gray-500">
                    {profile?.products?.length || profile?.services?.length || 0} items
                </p>
            </div>
            <button
                onClick={handleContact}
                className="bg-primary text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2"
            >
                <MessageCircle className="w-5 h-5" />
                <span>Contato</span>
            </button>
        </div>
        <div className="pt-2">
            {(isStore && profile?.products?.length === 0) || (isProfessional && profile?.services?.length === 0) ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <PackageOpen className="w-10 h-10 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">Nenhum item encontrado</h3>
                    <p className="text-gray-500 max-w-xs mt-2">
                        {isStore ? "Esta loja ainda não cadastrou nenhum produto." : "Este profissional não cadastrou nenhum serviço."}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {isStore && profile?.products?.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                    {isProfessional && profile?.services?.map((service) => (
                        <ServiceCard key={service.id} service={service} />
                    ))}
                </div>
            )}
        </div>
      </div>
    </div>
  );
}
