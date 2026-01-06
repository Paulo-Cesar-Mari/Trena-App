import { useState } from "react";
import { Search, Hammer, PaintBucket, Wrench, Lightbulb, Droplets, HardHat, ArrowRight } from "lucide-react";
import { useProducts } from "@/hooks/use-products";
import { useServices } from "@/hooks/use-services";
import { ProductCard } from "@/components/ProductCard";
import { ServiceCard } from "@/components/ServiceCard";
import { Link } from "wouter";

const CATEGORIES = [
  { id: "cimento", name: "Cimento", icon: Hammer },
  { id: "tinta", name: "Pintura", icon: PaintBucket },
  { id: "ferramentas", name: "Ferramentas", icon: Wrench },
  { id: "eletrica", name: "Elétrica", icon: Lightbulb },
  { id: "hidraulica", name: "Hidráulica", icon: Droplets },
  { id: "servicos", name: "Mão de Obra", icon: HardHat },
];

export default function Home() {
  const { data: products, isLoading: loadingProducts } = useProducts();
  const { data: services, isLoading: loadingServices } = useServices();
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="pb-24 md:pb-12 space-y-8 bg-gray-50/50">
      {/* Hero Section */}
      <section className="bg-secondary pt-6 pb-12 px-4 rounded-b-[2.5rem] shadow-lg relative overflow-hidden">
        {/* Abstract background shapes */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary/5 rounded-full blur-2xl translate-y-1/3 -translate-x-1/4 pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              Construa seu sonho <span className="text-primary">aqui</span>
            </h1>
            <p className="text-gray-300 text-sm md:text-base">
              Encontre materiais e profissionais qualificados para sua obra.
            </p>
          </div>

          {/* Search Bar */}
          <div className="bg-white/95 backdrop-blur-sm rounded-xl p-2 shadow-md max-w-2xl mx-auto flex items-center">
            <Search className="w-5 h-5 text-gray-400 ml-3" />
            <input 
              type="text"
              placeholder="O que você precisa hoje?"
              className="flex-1 p-2 bg-transparent outline-none text-gray-700 placeholder:text-gray-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Link href={`/buscar?search=${searchTerm}`}>
              <button className="bg-primary hover:bg-primary/90 text-secondary font-bold py-2.5 px-6 rounded-lg transition-colors">
                Buscar
              </button>
            </Link>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 space-y-10">
        {/* Categories */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-800">Categorias</h2>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 sm:gap-4">
            {CATEGORIES.map((cat) => (
              <Link key={cat.id} href={cat.id === 'servicos' ? '/servicos' : `/buscar?category=${cat.name}`}>
                <div className="flex flex-col items-center gap-2 cursor-pointer group text-center">
                  <div className="w-full aspect-square rounded-2xl bg-white border border-gray-100 shadow-sm flex items-center justify-center group-hover:border-primary group-hover:shadow-md transition-all">
                    <cat.icon className="w-6 h-6 sm:w-7 sm:h-7 text-gray-600 group-hover:text-primary transition-colors" />
                  </div>
                  <span className="text-xs font-medium text-gray-600 group-hover:text-secondary">{cat.name}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Featured Products */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-800">Destaques em Produtos</h2>
            <Link href="/buscar">
              <span className="text-sm font-semibold text-primary hover:underline flex items-center cursor-pointer">
                Ver tudo <ArrowRight className="w-4 h-4 ml-1" />
              </span>
            </Link>
          </div>
          
          {loadingProducts ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl h-56 sm:h-64 animate-pulse border border-gray-100" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {products?.slice(0, 4).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </section>

        {/* Top Services */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-800">Profissionais Recomendados</h2>
            <Link href="/servicos">
              <span className="text-sm font-semibold text-primary hover:underline flex items-center cursor-pointer">
                Ver todos <ArrowRight className="w-4 h-4 ml-1" />
              </span>
            </Link>
          </div>

          {loadingServices ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl h-32 animate-pulse border border-gray-100" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {services?.slice(0, 3).map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>
          )}
        </section>

        {/* Banner Ad */}
        <div className="bg-gradient-to-r from-gray-900 to-secondary rounded-2xl p-8 text-white relative overflow-hidden">
          <div className="relative z-10 max-w-md">
            <h3 className="text-2xl font-bold mb-2">É prestador de serviço?</h3>
            <p className="text-gray-300 mb-6">Cadastre-se gratuitamente e encontre mais clientes na sua região.</p>
            <Link href="/anunciar">
              <button className="bg-primary text-secondary font-bold py-3 px-6 rounded-xl hover:brightness-110 transition-all">
                Começar agora
              </button>
            </Link>
          </div>
          <div className="absolute right-0 top-0 h-full w-1/2 opacity-20 bg-[url('https://images.unsplash.com/photo-1581092448348-7d57b2839b86')] bg-cover bg-center" />
        </div>
      </div>
    </div>
  );
}
