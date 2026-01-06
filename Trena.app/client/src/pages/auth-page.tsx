import { useState } from "react";
import { useAuth } from "@/hooks/use-auth"; // ou "../hooks/use-auth" se der erro
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertUserSchema } from "@shared/schema";
import { z } from "zod";
import { Loader2, Store, User, HardHat } from "lucide-react";

export default function AuthPage() {
  const { user, loginMutation, registerMutation } = useAuth();
  const [, setLocation] = useLocation();
  const [isLogin, setIsLogin] = useState(true);

  // Se já estiver logado, manda para o início
  if (user) {
    setLocation("/");
    return null;
  }

  return (
    <div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
      <div className="hidden bg-muted lg:block">
        <img
          src="https://images.unsplash.com/photo-1581092448348-7d57b2839b86"
          alt="Image"
          width="1920"
          height="1080"
          className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold">
              {isLogin ? "Bem-vindo de volta" : "Crie sua conta no Trena"}
            </h1>
            <p className="text-balance text-muted-foreground">
              {isLogin 
                ? "Entre com suas credenciais para acessar" 
                : "Junte-se ao marketplace da construção civil"}
            </p>
          </div>

          <AuthForm isLogin={isLogin} />

          <div className="mt-4 text-center text-sm">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="underline"
            >
              {isLogin
                ? "Não tem uma conta? Cadastre-se"
                : "Já tem uma conta? Fazer login"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function AuthForm({ isLogin }: { isLogin: boolean }) {
  const { loginMutation, registerMutation } = useAuth();
  
  const form = useForm({
    resolver: zodResolver(insertUserSchema),
    defaultValues: {
      username: "",
      password: "",
      name: "",
      role: "consumer" // Valor padrão: Consumidor (Cliente)
    },
  });

  const onSubmit = (data: any) => {
    if (isLogin) {
      loginMutation.mutate(data);
    } else {
      registerMutation.mutate(data);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      
      {/* Nome (Só aparece no cadastro) */}
      {!isLogin && (
        <div className="space-y-2">
          <label className="text-sm font-medium leading-none">Nome Completo</label>
          <input
            {...form.register("name")}
            className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="Ex: João da Silva"
          />
        </div>
      )}

      {/* Usuário */}
      <div className="space-y-2">
        <label className="text-sm font-medium leading-none">Nome de Usuário</label>
        <input
          {...form.register("username")}
          className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          placeholder="seu_usuario"
        />
      </div>

      {/* Senha */}
      <div className="space-y-2">
        <label className="text-sm font-medium leading-none">Senha</label>
        <input
          {...form.register("password")}
          type="password"
          className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          placeholder="••••••••"
        />
      </div>

      {/* Seleção de Tipo de Conta (Só no cadastro) */}
      {!isLogin && (
        <div className="space-y-3 pt-2">
          <label className="text-sm font-medium leading-none">Eu quero:</label>
          <div className="grid grid-cols-3 gap-2">
            <label className="cursor-pointer">
              <input type="radio" value="consumer" {...form.register("role")} className="peer sr-only" />
              <div className="rounded-md border-2 border-gray-200 p-2 text-center hover:bg-gray-50 peer-checked:border-primary peer-checked:bg-primary/5 transition-all">
                <span className="text-xs font-bold block">Comprar</span>
                <span className="text-[10px] text-gray-500">Sou Cliente</span>
              </div>
            </label>
            <label className="cursor-pointer">
              <input type="radio" value="professional" {...form.register("role")} className="peer sr-only" />
              <div className="rounded-md border-2 border-gray-200 p-2 text-center hover:bg-gray-50 peer-checked:border-primary peer-checked:bg-primary/5 transition-all">
                <span className="text-xs font-bold block">Trabalhar</span>
                <span className="text-[10px] text-gray-500">Sou Prestador</span>
              </div>
            </label>
            <label className="cursor-pointer">
              <input type="radio" value="store" {...form.register("role")} className="peer sr-only" />
              <div className="rounded-md border-2 border-gray-200 p-2 text-center hover:bg-gray-50 peer-checked:border-primary peer-checked:bg-primary/5 transition-all">
                <span className="text-xs font-bold block">Vender</span>
                <span className="text-[10px] text-gray-500">Sou Lojista</span>
              </div>
            </label>
          </div>
        </div>
      )}

      <button
        type="submit"
        disabled={loginMutation.isPending || registerMutation.isPending}
        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-secondary bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors disabled:opacity-50"
      >
        {(loginMutation.isPending || registerMutation.isPending) && (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        )}
        {isLogin ? "Entrar" : "Criar Conta"}
      </button>
    </form>
  );
}