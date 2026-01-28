import { useQuery } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";

export function useReviews(targetId: number) {
  return useQuery({
    queryKey: [api.reviews.list.path, targetId],
    queryFn: async () => {
      const url = buildUrl(api.reviews.list.path, { targetId });
      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error("Falha ao carregar avaliações");
      return api.reviews.list.responses[200].parse(await res.json());
    },
    enabled: !!targetId, // Only run the query if targetId is a valid number
  });
}
