import { Link } from "wouter";
import { Service } from "@shared/schema";
import { Star, MapPin } from "lucide-react";

interface ServiceCardProps {
  service: Service;
}

export function ServiceCard({ service }: ServiceCardProps) {
  return (
    <Link
      href={`/servico/${service.id}`}
      className="bg-white border border-gray-100 rounded-2xl overflow-hidden group transition-all hover:shadow-lg hover:border-primary"
    >
      <div className="relative w-full aspect-[4/3] bg-gray-100">
        {service.image ? (
          <img
            src={service.image}
            alt={service.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-secondary text-white text-2xl font-bold">
            {service.name.charAt(0)}
          </div>
        )}
      </div>
      <div className="p-3">
        <p className="text-sm font-bold text-gray-800 truncate group-hover:text-primary transition-colors">
          {service.name}
        </p>
        <p className="text-xs text-primary font-semibold mt-1">
          {service.serviceType}
        </p>
        <div className="flex justify-between items-center mt-2">
          <div className="flex items-center text-xs text-gray-500">
            <MapPin className="w-3 h-3 mr-1" />
            {service.location}
          </div>
          <div className="flex items-center text-xs font-bold text-yellow-600 bg-yellow-50 px-1.5 py-0.5 rounded-md">
            <Star className="w-3 h-3 mr-1 text-yellow-500 fill-current" />
            {service.rating}
          </div>
        </div>
      </div>
    </Link>
  );
}
