import { MapPin, Star, User } from "lucide-react";
import { Link } from "wouter";
import { type Service } from "@shared/schema";

export function ServiceCard({ service }: { service: Service }) {
  return (
    <Link href={`/servico/${service.id}`}>
      <div className="group bg-white rounded-2xl p-5 shadow-sm border border-gray-100 card-hover cursor-pointer flex items-start space-x-4">
        {/* Avatar */}
        <div className="w-16 h-16 rounded-full bg-gray-100 flex-shrink-0 overflow-hidden border-2 border-primary/20">
          {service.image ? (
            <img src={service.image} alt={service.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-secondary text-white">
              <span className="text-xl font-bold">{service.name.charAt(0)}</span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-bold text-secondary truncate group-hover:text-primary transition-colors">
                {service.name}
              </h3>
              <p className="text-sm text-gray-500 font-medium">{service.serviceType}</p>
            </div>
            <div className="flex items-center bg-yellow-50 px-2 py-1 rounded-full border border-yellow-100">
              <Star className="w-3 h-3 text-yellow-500 fill-current mr-1" />
              <span className="text-xs font-bold text-yellow-700">{service.rating}</span>
            </div>
          </div>

          <div className="mt-3 flex items-center text-xs text-gray-500">
            <MapPin className="w-3.5 h-3.5 mr-1 flex-shrink-0" />
            <span className="truncate">{service.location}</span>
          </div>

          <div className="mt-3 flex gap-2">
             <span className="inline-block px-2 py-1 bg-gray-100 rounded text-[10px] font-medium text-gray-600">
               Orçamento Grátis
             </span>
             {service.hourlyRate && (
               <span className="inline-block px-2 py-1 bg-green-50 rounded text-[10px] font-medium text-green-700">
                 A partir de R$ {service.hourlyRate}/h
               </span>
             )}
          </div>
        </div>
      </div>
    </Link>
  );
}
