import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";

export function useProducts(filters?: {
  search?: string;
  category?: string;
  priceMin?: number;
  priceMax?: number;
  location?: string;
}) {
  const queryKey = [api.products.list.path, filters];
  
  return useQuery({
    queryKey,
    queryFn: async () => {
      // Build URL with query params
      const url = new URL(api.products.list.path, window.location.origin);
      if (filters?.search) url.searchParams.append("search", filters.search);
      if (filters?.category) url.searchParams.append("category", filters.category);
      if (filters?.priceMin) url.searchParams.append("priceMin", filters.priceMin.toString());
      if (filters?.priceMax) url.searchParams.append("priceMax", filters.priceMax.toString());
      if (filters?.location) url.searchParams.append("location", filters.location);
      
      const res = await fetch(url.toString(), { credentials: "include" });
      if (!res.ok) throw new Error("Falha ao carregar produtos");
      return api.products.list.responses[200].parse(await res.json());
    },
  });
}

export function useProduct(id: number) {
  return useQuery({
    queryKey: [api.products.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.products.get.path, { id });
      const res = await fetch(url, { credentials: "include" });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Falha ao carregar detalhe do produto");
      return api.products.get.responses[200].parse(await res.json());
    },
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: z.infer<typeof api.products.create.input>) => {
      const res = await fetch(api.products.create.path, {
        method: api.products.create.method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        credentials: "include",
      });
      
      if (!res.ok) {
        if (res.status === 400) {
          const error = api.products.create.responses[400].parse(await res.json());
          throw new Error(error.message);
        }
        throw new Error("Erro ao criar produto");
      }
      return api.products.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.products.list.path] });
      toast({
        title: "Sucesso!",
        description: "Produto anunciado com sucesso.",
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
