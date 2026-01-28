import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../../shared/routes";
import { queryClient } from "../lib/queryClient";
import { toast } from "sonner";

async function fetchFavorites() {
  const res = await queryClient.fetchQuery({
    queryKey: ["favorites"],
    queryFn: async () => {
      const res = await fetch(api.favorites.list.path);
      return res.json();
    },
  });
  return res;
}

async function addFavorite(item: { productId?: number; serviceId?: number }) {
  const res = await fetch(api.favorites.add.path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(item),
  });
  if (!res.ok) throw new Error("Failed to add favorite");
  return res.json();
}

async function removeFavorite(item: { productId?: number; serviceId?: number }) {
  const res = await fetch(api.favorites.remove.path, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(item),
  });
  if (!res.ok) throw new Error("Failed to remove favorite");
  return res.json();
}

export function useFavorites() {
  const queryClient = useQueryClient();

  const { data: favorites, ...queryInfo } = useQuery({
    queryKey: ["favorites"],
    queryFn: fetchFavorites,
  });

  const addMutation = useMutation({
    mutationFn: addFavorite,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
      toast.success("Adicionado aos favoritos!");
    },
    onError: () => {
      toast.error("Erro ao adicionar aos favoritos.");
    },
  });

  const removeMutation = useMutation({
    mutationFn: removeFavorite,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favorites"] } );
      toast.success("Removido dos favoritos!");
    },
    onError: () => {
      toast.error("Erro ao remover dos favoritos.");
    },
  });

  const isFavorited = (item: { productId?: number; serviceId?: number }) => {
    if (!favorites) return false;
    return favorites.some((fav: any) =>
      (item.productId && fav.id === item.productId && fav.sellerId) ||
      (item.serviceId && fav.id === item.serviceId && fav.providerId)
    );
  };

  return {
    favorites,
    isFavorited,
    addFavorite: addMutation.mutate,
    removeFavorite: removeMutation.mutate,
    ...queryInfo,
  };
}
