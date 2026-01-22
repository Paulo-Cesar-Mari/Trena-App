import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerUserSchema } from "@shared/schema";
import { z } from "zod";
import { Loader2, Store, User, HardHat } from "lucide-react";

type RegisterUserInput = z.infer<typeof registerUserSchema>;

export default function AuthPage() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [isLogin, setIsLogin] = useState(true);

  // If already logged in, redirect to home
  if (user) {
    setLocation("/");
    return null;
  }

  return (
    <div className="container relative min-h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">

      {/* Left Column (Form) */}
      <div className="lg:p-8 flex items-center justify-center">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]">

          {/* Header */}
          <div className="flex flex-col space-y-2 text-center items-center">
            <img
              src="/logo-trena.png"
              alt="TRENA Logo"
              className="h-20 w-20 object-contain mb-4"
            />
            <h1 className="text-2xl font-semibold tracking-tight">
              {isLogin ? "Acesse sua conta" : "Crie sua conta no Trena"}
            </h1>
            <p className="text-sm text-muted-foreground">
              {isLogin
                ? "Bem-vindo de volta! Digite suas credenciais."
                : "Preencha os campos para se cadastrar."}
            </p>
          </div>

          {/* Form */}
          <AuthForm isLogin={isLogin} />

          {/* Toggle Link */}
          <p className="px-8 text-center text-sm text-muted-foreground">
            {isLogin ? "Não tem uma conta? " : "Já tem uma conta? "}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="underline underline-offset-4 hover:text-primary"
            >
              {isLogin ? "Cadastre-se" : "Fazer login"}
            </button>
          </p>

          {/* Premium Signup Link */}
          {!isLogin && (
            <p className="px-8 text-center text-sm text-muted-foreground">
              Ou faça seu{" "}
              <a href="/premium-signup" className="underline underline-offset-4 hover:text-primary font-semibold text-primary">
                CADASTRO PREMIUM
              </a>
            </p>
          )}
        </div>
      </div>

      {/* Right Column (Image) */}
      <div data-testid="auth-sidebar" className="relative hidden h-full flex-col bg-primary p-10 text-primary-foreground dark:border-r lg:flex">
        <div className="relative z-20 flex items-center text-lg font-medium">
          <img
              src="/logo-trena-dark.png"
              alt="TRENA Logo"
              className="h-12 w-12 object-contain mr-3"
            />
          Trena
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">
              “A ferramenta certa para a sua obra. O marketplace da construção civil que conecta você aos melhores produtos e serviços.”
            </p>
            <footer className="text-sm">Equipe Trena</footer>
          </blockquote>
        </div>
      </div>
    </div>
  );
}

function AuthForm({ isLogin }: { isLogin: boolean }) {
  const { loginMutation, registerMutation } = useAuth();

  const form = useForm<RegisterUserInput>({
    resolver: zodResolver(registerUserSchema),
    defaultValues: {
      username: "",
      password: "",
      name: "",
      role: "consumer",
      phone: "",
    },
  });

  const onSubmit = (data: RegisterUserInput) => {
    if (isLogin) {
      loginMutation.mutate({ username: data.username, password: data.password });
    } else {
      registerMutation.mutate({
        ...data,
        phone: data.phone || "",
      });
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

      {!isLogin && (
        <div className="grid gap-2">
          <label className="text-sm font-medium leading-none sr-only" htmlFor="name">Nome Completo</label>
          <input
            id="name"
            placeholder="Nome Completo"
            {...form.register("name")}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          />
        </div>
      )}

      <div className="grid gap-2">
        <label className="text-sm font-medium leading-none sr-only" htmlFor="username">Email</label>
        <input
          id="username"
          placeholder="Email"
          {...form.register("username")}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        />
      </div>

      <div className="grid gap-2">
        <label className="text-sm font-medium leading-none sr-only" htmlFor="password">Senha</label>
        <input
          id="password"
          type="password"
          placeholder="Senha"
          {...form.register("password")}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        />
      </div>

      {!isLogin && (
        <>
            <div className="grid gap-2">
                <label className="text-sm font-medium leading-none sr-only" htmlFor="phone">Telefone</label>
                <input
                    id="phone"
                    placeholder="Telefone (Opcional)"
                    {...form.register("phone")}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
            </div>
            <div className="space-y-3 pt-2">
                <label className="text-sm font-medium leading-none text-muted-foreground">Eu quero:</label>
                <div className="grid grid-cols-3 gap-3">
                    <RadioCard value="consumer" icon={User} label="Comprar" form={form} />
                    <RadioCard value="professional" icon={HardHat} label="Trabalhar" form={form} />
                    <RadioCard value="store" icon={Store} label="Vender" form={form} />
                </div>
            </div>
        </>
      )}

      <button
        type="submit"
        disabled={loginMutation.isPending || registerMutation.isPending}
        className="w-full btn-primary flex items-center justify-center disabled:opacity-50"
      >
        {(loginMutation.isPending || registerMutation.isPending) && (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        )}
        {isLogin ? "Entrar" : "Criar Conta"}
      </button>
    </form>
  );
}

const RadioCard = ({ value, icon: Icon, label, form }: { value: "consumer" | "professional" | "store", icon: React.ElementType, label: string, form: any }) => (
    <label className="cursor-pointer">
        <input type="radio" value={value} {...form.register("role")} className="peer sr-only" />
        <div className="rounded-md border-2 border-muted bg-popover p-3 text-center hover:bg-accent hover:text-accent-foreground peer-checked:border-primary peer-checked:bg-primary/10 transition-all">
            <Icon className="w-5 h-5 mx-auto mb-1" />
            <span className="text-xs font-bold block">{label}</span>
        </div>
    </label>
);
