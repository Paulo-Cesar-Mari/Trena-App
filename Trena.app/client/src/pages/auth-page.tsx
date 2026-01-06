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
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Lado Esquerdo: Formulário */}
      <div className="flex flex-col justify-center px-8 py-12 lg:px-16 bg-white">
        <div className="max-w-md mx-auto w-full space-y-8">
          <div className="text-center lg:text-left">
            <h1 className="text-4xl font-bold text-secondary font-['Poppins'] tracking-tight">
              TRENA
            </h1>
            <h2 className="mt-4 text-2xl font-bold tracking-tight text-gray-900">
              {isLogin ? "Bem-vindo de volta" : "Crie sua conta no Trena"}
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              {isLogin 
                ? "Entre com suas credenciais para acessar" 
                : "Junte-se ao marketplace da construção civil"}
            </p>
          </div>

          <AuthForm isLogin={isLogin} />

          <div className="text-center mt-4">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm font-medium text-primary hover:underline"
            >
              {isLogin
                ? "Não tem uma conta? Cadastre-se"
                : "Já tem uma conta? Fazer login"}
            </button>
          </div>
        </div>
      </div>

      {/* Lado Direito: Capa Visual */}
      <div className="hidden lg:flex flex-col justify-center px-12 bg-secondary text-white relative overflow-hidden">
        <div className="relative z-10 max-w-lg">
          <h3 className="text-3xl font-bold mb-6">
            Construa, reforme e decore com facilidade.
          </h3>
          <p className="text-lg text-green-100 mb-8">
            Conectamos quem precisa construir com quem tem o material e a mão de obra qualificada.
          </p>
          
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/20">
              <Store className="w-8 h-8 mb-3 text-primary" />
              <div className="font-bold text-sm">Lojas</div>
            </div>
            <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/20">
              <HardHat className="w-8 h-8 mb-3 text-primary" />
              <div className="font-bold text-sm">Serviços</div>
            </div>
            <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/20">
              <User className="w-8 h-8 mb-3 text-primary" />
              <div className="font-bold text-sm">Clientes</div>
            </div>
          </div>
        </div>
        
        {/* Círculo Decorativo */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[500px] h-[500px] bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl" />
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