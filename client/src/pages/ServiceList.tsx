import { useState } from "react";
import { Search, MapPin, HardHat } from "lucide-react";
import { useServices } from "@/hooks/use-services";
import { ServiceCard } from "@/components/ServiceCard";

export default function ServiceList() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  
  const { data: services, isLoading } = useServices({ 
    search: search || undefined, 
    category: category || undefined 
  });

  const categories = ["Pedreiro", "Eletricista", "Pintor", "Encanador", "Arquiteto", "Engenheiro"];

  return (
    <div className="pb-24 pt-4 px-4 max-w-4xl mx-auto min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-secondary">Profissionais</h1>
        <div className="flex items-center text-sm text-gray-500 bg-white px-3 py-1.5 rounded-full border border-gray-100 shadow-sm">
          <MapPin className="w-3.5 h-3.5 mr-1 text-primary" />
          <span>São Paulo, SP</span>
        </div>
      </div>

      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-6">
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Buscar profissional (ex: Pedreiro, João...)" 
            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button 
              key={cat}
              onClick={() => setCategory(category === cat ? "" : cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors border ${
                category === cat 
                  ? "bg-primary/10 text-primary-foreground border-primary/20" 
                  : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-white rounded-2xl h-32 animate-pulse" />
          ))}
        </div>
      ) : services?.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <HardHat className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-lg font-bold text-gray-900">Nenhum profissional encontrado</h3>
          <p className="text-gray-500 max-w-xs mt-2">
            Não encontramos prestadores com esses filtros na sua região.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {services?.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      )}
    </div>
  );
}
