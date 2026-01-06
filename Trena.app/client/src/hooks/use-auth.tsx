import { createContext, ReactNode, useContext } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { insertUserSchema, User as SelectUser } from "@shared/schema";
import { apiRequest, queryClient } from "../lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

// Tipos para ajudar o TypeScript
type InsertUser = z.infer<typeof insertUserSchema>;

type AuthContextType = {
  user: SelectUser | null;
  isLoading: boolean;
  error: Error | null;
  loginMutation: any;
  logoutMutation: any;
  registerMutation: any;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();

  // 1. Busca o usuário atual (Sessão)
  const {
    data: user,
    error,
    isLoading,
  } = useQuery<SelectUser | undefined, Error>({
    queryKey: ["/api/user"],
    queryFn: async () => {
      try {
        const res = await apiRequest("GET", "/api/user");
        if (res.status === 401) return undefined; // Não logado
        return await res.json();
      } catch (e) {
        return undefined;
      }
    },
  });

  // 2. Função de Login
  const loginMutation = useMutation({
    mutationFn: async (credentials: Pick<InsertUser, "username" | "password">) => {
      const res = await apiRequest("POST", "/api/login", credentials);
      return await res.json();
    },
    onSuccess: (user: SelectUser) => {
      queryClient.setQueryData(["/api/user"], user);
      toast({ title: "Bem-vindo!", description: "Login realizado com sucesso." });
    },
    onError: (error: Error) => {
      toast({
        title: "Falha no login",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // 3. Função de Registro
  const registerMutation = useMutation({
    mutationFn: async (credentials: InsertUser) => {
      const res = await apiRequest("POST", "/api/register", credentials);
      return await res.json();
    },
    onSuccess: (user: SelectUser) => {
      queryClient.setQueryData(["/api/user"], user);
      toast({ title: "Conta criada!", description: "Bem-vindo ao Trena." });
    },
    onError: (error: Error) => {
      toast({
        title: "Falha no registro",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // 4. Função de Sair (Logout)
  const logoutMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/logout");
    },
    onSuccess: () => {
      queryClient.setQueryData(["/api/user"], null);
      toast({ title: "Até logo!", description: "Você saiu da conta." });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao sair",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return (
    <AuthContext.Provider
      value={{
        user: user ?? null,
        isLoading,
        error,
        loginMutation,
        logoutMutation,
        registerMutation,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}