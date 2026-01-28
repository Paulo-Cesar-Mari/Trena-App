
import { Link } from "wouter";
import { HardHat, MapPin, Star, Heart } from "lucide-react";
import type { Service } from "@shared/schema";
import { useFavorites } from "@/hooks/use-favorites";
import { toast } from "sonner";

export const ServiceCard = ({ service }: { service: Service }) => {
    const { isFavorited, addFavorite, removeFavorite } = useFavorites();
    const isServiceFavorite = isFavorited({ serviceId: service.id });

    const handleFavoriteClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (isServiceFavorite) {
            removeFavorite({ serviceId: service.id });
        } else {
            addFavorite({ serviceId: service.id });
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col hover:shadow-lg transition-shadow duration-300 relative">
            <button
                onClick={handleFavoriteClick}
                className="absolute top-2 right-2 z-10 p-2 rounded-full bg-white/50 backdrop-blur-sm hover:bg-white/75 transition-colors"
            >
                <Heart className={`w-5 h-5 ${isServiceFavorite ? "text-red-500 fill-red-500" : "text-gray-500"}`} />
            </button>
            <Link
                href={`/servico/${service.id}`}
                className="flex flex-col flex-grow"
            >
                <div className="w-full h-40 bg-gray-200 flex items-center justify-center">
                    {service.image ? (
                        <img src={service.image} alt={service.name} className="w-full h-full object-cover" />
                    ) : (
                        <HardHat className="w-16 h-16 text-gray-400" />
                    )}
                </div>
                <div className="p-4 flex flex-col flex-grow">
                    <h3 className="font-bold text-gray-800 text-base leading-tight truncate">
                        {service.name}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1 capitalize">{service.serviceType}</p>
                    <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span className="truncate">{service.location}</span>
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                        <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                            <span className="font-bold text-gray-800">{Number(service.rating).toFixed(1)}</span>
                        </div>
                        {service.hourlyRate && (
                            <div className="text-right">
                                <span className="font-bold text-primary text-lg">
                                    R$ {service.hourlyRate}
                                </span>
                                <span className="text-xs text-gray-500"> /hora</span>
                            </div>
                        )}
                    </div>
                </div>
            </Link>
        </div>
    );
};
