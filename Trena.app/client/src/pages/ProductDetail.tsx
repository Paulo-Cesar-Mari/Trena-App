import { useProduct } from "@/hooks/use-products";
import { useRoute, Link } from "wouter";
import { ArrowLeft, Share2, MapPin, Store, Heart, MessageCircle, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ProductDetail() {
  const [match, params] = useRoute("/produto/:id");
  const id = parseInt(params?.id || "0");
  const { data: product, isLoading, error } = useProduct(id);

  if (isLoading) return <div className="h-screen flex items-center justify-center text-primary font-medium">Carregando...</div>;
  if (error || !product) return <div className="h-screen flex items-center justify-center text-red-500">Produto não encontrado</div>;

  const price = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(Number(product.price));

  return (
    <div className="bg-white min-h-screen pb-24 md:pb-12">
      {/* Header Mobile */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100 px-4 py-3 flex justify-between items-center md:hidden">
        <Link href="/buscar">
          <button className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>
        </Link>
        <div className="flex gap-2">
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <Share2 className="w-5 h-5 text-gray-700" />
          </button>
          <button className="p-2 -mr-2 hover:bg-gray-100 rounded-full transition-colors">
            <Heart className="w-5 h-5 text-gray-700" />
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto md:py-8 md:px-4">
        <div className="md:grid md:grid-cols-2 md:gap-8 lg:gap-12">
          {/* Image Gallery Section */}
          <div className="relative bg-gray-100 aspect-square md:rounded-3xl overflow-hidden">
            {product.image ? (
              <img src={product.image} alt={product.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-100">
                <Store className="w-24 h-24 text-gray-300" />
              </div>
            )}
            <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur text-white text-xs px-2 py-1 rounded-md">
              1/1 Foto
            </div>
          </div>

          {/* Details Section */}
          <div className="p-5 md:p-0">
            {/* Breadcrumb Desktop */}
            <div className="hidden md:flex items-center text-sm text-gray-500 mb-6">
              <Link href="/buscar" className="hover:text-primary transition-colors">Produtos</Link>
              <span className="mx-2">/</span>
              <span className="text-gray-900">{product.category}</span>
            </div>

            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded uppercase tracking-wide">
                {product.category}
              </span>
              <div className="flex items-center text-green-700 text-xs font-medium bg-green-50 px-2 py-1 rounded border border-green-100">
                <ShieldCheck className="w-3.5 h-3.5 mr-1" />
                Vendedor Verificado
              </div>
            </div>

            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 leading-tight">
              {product.title}
            </h1>
            
            <div className="mt-6 flex items-baseline">
              <span className="text-4xl font-extrabold text-secondary">{price}</span>
              <span className="ml-2 text-sm text-gray-500">à vista</span>
            </div>

            <div className="mt-8 space-y-4">
              <div className="flex items-center p-3 rounded-xl bg-gray-50 border border-gray-100">
                <div className="w-10 h-10 rounded-full bg-secondary text-white flex items-center justify-center font-bold text-lg mr-3">
                  {product.storeName.charAt(0)}
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-sm">{product.storeName}</p>
                  <p className="text-xs text-gray-500 flex items-center mt-0.5">
                    <MapPin className="w-3 h-3 mr-1" /> {product.location}
                  </p>
                </div>
                <button className="ml-auto text-xs font-bold text-primary hover:underline">
                  Ver perfil
                </button>
              </div>

              <div className="prose prose-sm text-gray-600 mt-4">
                <h3 className="text-gray-900 font-bold mb-2">Descrição</h3>
                <p>{product.description}</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 md:static md:border-0 md:p-0 md:bg-transparent md:mt-8 z-30">
              <div className="flex gap-3 max-w-6xl mx-auto">
                <a
                  href={`https://wa.me/55${product.contactPhone || '11999999999'}?text=Tenho interesse no produto ${product.title}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-green-500 text-white font-bold py-3.5 rounded-xl hover:bg-green-600 transition-colors flex items-center justify-center shadow-lg shadow-green-500/20"
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  WhatsApp
                </a>
                <button className="flex-1 bg-primary text-secondary font-bold py-3.5 rounded-xl hover:brightness-105 transition-all shadow-lg shadow-primary/20">
                  Comprar Agora
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
