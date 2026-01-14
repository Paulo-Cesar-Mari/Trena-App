import { Link } from "wouter";
import { Service } from "@shared/schema";
import { Star, MapPin, Heart } from "lucide-react";
import { useFavorites } from "../hooks/use-favorites";
import { Button } from "./ui/button";
import { cn } from "../lib/utils";
import { useAuth } from "../hooks/use-auth";

interface ServiceCardProps {
  service: Service;
}

export function ServiceCard({ service }: ServiceCardProps) {
  const { user } = useAuth();
  const { addFavorite, removeFavorite, isFavorited } = useFavorites();
  const favorited = isFavorited({ serviceId: service.id });

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (favorited) {
      removeFavorite({ serviceId: service.id });
    } else {
      addFavorite({ serviceId: service.id });
    }
  };

  return (
    <div className="relative bg-white border border-gray-100 rounded-2xl overflow-hidden group transition-all hover:shadow-lg hover:border-primary">
      {user && (
        <Button
          size="icon"
          className={cn(
            "absolute top-3 right-3 z-10 rounded-full w-8 h-8 bg-white/80 backdrop-blur-sm text-gray-600 hover:bg-white",
            favorited && "text-red-500 bg-white hover:bg-red-50"
          )}
          onClick={handleFavoriteClick}
        >
          <Heart className={cn("w-4 h-4", favorited && "fill-current")} />
        </Button>
      )}
      <Link href={`/servico/${service.id}`}>
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
    </div>
  );
}
