import { useService } from "@/hooks/use-services";
import { useRoute, Link } from "wouter";
import { ArrowLeft, Share2, MapPin, Star, Phone, MessageSquare, Award, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ServiceDetail() {
  const [match, params] = useRoute("/servico/:id");
  const id = parseInt(params?.id || "0");
  const { data: service, isLoading, error } = useService(id);

  if (isLoading) return <div className="h-screen flex items-center justify-center text-primary font-medium">Carregando...</div>;
  if (error || !service) return <div className="h-screen flex items-center justify-center text-red-500">Serviço não encontrado</div>;

  return (
    <div className="bg-white min-h-screen pb-24 md:pb-12">
      {/* Header Image with Overlay */}
      <div className="relative h-64 md:h-80 bg-secondary">
        {/* Placeholder banner */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/60 z-10" />
        <div className="absolute inset-0 opacity-30 bg-[url('https://images.unsplash.com/photo-1503387762-592deb58ef4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80')] bg-cover bg-center" />
        
        {/* Nav */}
        <div className="absolute top-0 left-0 right-0 z-20 px-4 py-3 flex justify-between items-center text-white">
          <Link href="/servicos">
            <button className="p-2 -ml-2 hover:bg-white/10 rounded-full transition-colors backdrop-blur-sm">
              <ArrowLeft className="w-6 h-6" />
            </button>
          </Link>
          <button className="p-2 -mr-2 hover:bg-white/10 rounded-full transition-colors backdrop-blur-sm">
            <Share2 className="w-6 h-6" />
          </button>
        </div>

        {/* Profile Info in Header */}
        <div className="absolute -bottom-12 left-4 right-4 z-20 flex items-end">
          <div className="w-24 h-24 rounded-2xl bg-white p-1 shadow-lg">
            {service.image ? (
              <img src={service.image} alt={service.name} className="w-full h-full object-cover rounded-xl" />
            ) : (
              <div className="w-full h-full bg-secondary rounded-xl flex items-center justify-center text-white text-3xl font-bold">
                {service.name.charAt(0)}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="px-5 pt-16 md:max-w-4xl md:mx-auto md:pt-20">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{service.name}</h1>
            <p className="text-primary font-semibold text-lg">{service.serviceType}</p>
          </div>
          <div className="flex flex-col items-end">
            <div className="flex items-center bg-yellow-50 px-3 py-1 rounded-full border border-yellow-100">
              <Star className="w-4 h-4 text-yellow-500 fill-current mr-1.5" />
              <span className="text-sm font-bold text-yellow-700">{service.rating}</span>
            </div>
            <span className="text-xs text-gray-400 mt-1">12 avaliações</span>
          </div>
        </div>

        <div className="flex items-center text-gray-500 mt-3 text-sm">
          <MapPin className="w-4 h-4 mr-1.5" />
          {service.location}
        </div>

        <div className="grid grid-cols-2 gap-3 mt-6">
          <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 flex flex-col items-center justify-center text-center">
            <Award className="w-5 h-5 text-primary mb-1" />
            <span className="text-xs font-medium text-gray-500">Experiência</span>
            <span className="text-sm font-bold text-gray-900">5+ Anos</span>
          </div>
          <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 flex flex-col items-center justify-center text-center">
            <Clock className="w-5 h-5 text-primary mb-1" />
            <span className="text-xs font-medium text-gray-500">Disponibilidade</span>
            <span className="text-sm font-bold text-gray-900">Imediata</span>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-lg font-bold text-gray-900 mb-3">Sobre o Profissional</h2>
          <p className="text-gray-600 leading-relaxed text-sm">
            {service.description}
          </p>
        </div>

        {service.hourlyRate && (
          <div className="mt-6 p-4 bg-green-50 rounded-xl border border-green-100 flex justify-between items-center">
            <span className="text-sm font-medium text-green-800">Taxa de Visita / Hora</span>
            <span className="text-lg font-bold text-green-700">R$ {service.hourlyRate}</span>
          </div>
        )}

        <div className="mt-8 mb-4">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Avaliações Recentes</h2>
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="border-b border-gray-100 pb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-sm text-gray-800">Cliente Satisfeito</span>
                  <div className="flex text-yellow-400">
                    {[1,2,3,4,5].map(s => <Star key={s} className="w-3 h-3 fill-current" />)}
                  </div>
                </div>
                <p className="text-xs text-gray-500">
                  "Excelente profissional, chegou no horário e fez o serviço com muita qualidade. Recomendo!"
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Sticky Contact Bar */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 md:static md:border-0 md:p-0 md:bg-transparent md:mt-8 z-30">
          <div className="flex gap-3 max-w-4xl mx-auto">
            <button className="flex-1 bg-white border-2 border-primary text-primary font-bold py-3.5 rounded-xl hover:bg-primary/5 transition-colors flex items-center justify-center">
              <Phone className="w-5 h-5 mr-2" />
              Ligar
            </button>
            <button className="flex-[2] bg-primary text-secondary font-bold py-3.5 rounded-xl hover:brightness-105 transition-all shadow-lg shadow-primary/20 flex items-center justify-center">
              <MessageSquare className="w-5 h-5 mr-2" />
              WhatsApp
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
