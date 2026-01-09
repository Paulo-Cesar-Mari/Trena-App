import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";

export function useServices(filters?: {
  search?: string;
  category?: string;
  ratingMin?: number;
  hourlyRateMin?: number;
  hourlyRateMax?: number;
  location?: string;
}) {
  const queryKey = [api.services.list.path, filters];
  
  return useQuery({
    queryKey,
    queryFn: async () => {
      const url = new URL(api.services.list.path, window.location.origin);
      if (filters?.search) url.searchParams.append("search", filters.search);
      if (filters?.category) url.searchParams.append("category", filters.category);
      if (filters?.ratingMin) url.searchParams.append("ratingMin", filters.ratingMin.toString());
      if (filters?.hourlyRateMin) url.searchParams.append("hourlyRateMin", filters.hourlyRateMin.toString());
      if (filters?.hourlyRateMax) url.searchParams.append("hourlyRateMax", filters.hourlyRateMax.toString());
      if (filters?.location) url.searchParams.append("location", filters.location);
      
      const res = await fetch(url.toString(), { credentials: "include" });
      if (!res.ok) throw new Error("Falha ao carregar serviços");
      return api.services.list.responses[200].parse(await res.json());
    },
  });
}

export function useService(id: number) {
  return useQuery({
    queryKey: [api.services.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.services.get.path, { id });
      const res = await fetch(url, { credentials: "include" });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Falha ao carregar detalhe do serviço");
      return api.services.get.responses[200].parse(await res.json());
    },
  });
}

export function useCreateService() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: z.infer<typeof api.services.create.input>) => {
      const res = await fetch(api.services.create.path, {
        method: api.services.create.method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        credentials: "include",
      });
      
      if (!res.ok) {
        if (res.status === 400) {
          const error = api.services.create.responses[400].parse(await res.json());
          throw new Error(error.message);
        }
        throw new Error("Erro ao criar serviço");
      }
      return api.services.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.services.list.path] });
      toast({
        title: "Sucesso!",
        description: "Serviço anunciado com sucesso.",
        variant: "default",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
    }
  });
}
