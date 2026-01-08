
import { useState } from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { Loader2, User, HardHat, Store, ArrowLeft } from "lucide-react";

const premiumRegisterSchema = z.object({
  name: z.string().min(3, "O nome precisa ter pelo menos 3 caracteres."),
  username: z.string().min(3, "O nome de usuário precisa ter pelo menos 3 caracteres."),
  password: z.string().min(6, "A senha precisa ter pelo menos 6 caracteres."),
  role: z.enum(["consumer", "professional", "store"]),
});

type PremiumRegisterInput = z.infer<typeof premiumRegisterSchema>;

export default function PremiumSignupPage() {
  const [step, setStep] = useState(1);
  const { registerMutation } = useAuth();
  const [, setLocation] = useLocation();

  const form = useForm<PremiumRegisterInput>({
    resolver: zodResolver(premiumRegisterSchema),
    defaultValues: {
      name: "",
      username: "",
      password: "",
      role: "consumer",
    },
  });

  const onSubmit = (data: PremiumRegisterInput) => {
    registerMutation.mutate(data, {
      onSuccess: () => {
        setLocation("/");
      },
    });
  };

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  return (
    <div className="container relative min-h-screen flex items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[450px]">
        {/* Botão de Voltar */}
        {step > 1 && (
            <button onClick={prevStep} className="absolute top-8 left-8 text-sm text-muted-foreground hover:text-primary flex items-center">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
            </button>
        )}

        {/* Cabeçalho */}
        <div className="flex flex-col space-y-2 text-center items-center">
            <img
              src="/logo-trena.png"
              alt="TRENA Logo"
              className="h-20 w-20 object-contain mb-4"
            />
          <h1 className="text-2xl font-semibold tracking-tight">
            Crie sua Conta Premium
          </h1>
          <p className="text-sm text-muted-foreground">
            Siga os passos para ter acesso a recursos exclusivos.
          </p>
        </div>

        {/* Barra de Progresso */}
        <div className="w-full px-8">
            <div className="relative h-2 w-full bg-muted rounded-full">
                <div
                    className="absolute top-0 left-0 h-2 bg-primary rounded-full transition-all duration-500"
                    style={{ width: `${(step / 3) * 100}%` }}
                />
            </div>
            <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                <span>Dados</span>
                <span>Senha</span>
                <span>Conta</span>
            </div>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 px-8 py-4">
          {step === 1 && (
            <Step1 form={form} nextStep={nextStep} />
          )}
          {step === 2 && (
            <Step2 form={form} nextStep={nextStep} />
          )}
          {step === 3 && (
            <Step3 form={form} />
          )}
        </form>
      </div>
    </div>
  );
}

interface StepProps {
  form: UseFormReturn<PremiumRegisterInput>;
  nextStep: () => void;
}

function Step1({ form, nextStep }: StepProps) {
    const { register, trigger, formState: { errors } } = form;

    const handleNext = async () => {
        const isValid = await trigger(["name", "username"]);
        if (isValid) {
            nextStep();
        }
    };

    return (
        <div className="space-y-4 animate-in fade-in-50">
            <h2 className="text-lg font-medium text-center">Passo 1: Seus Dados</h2>
            <div className="grid gap-2">
                <label className="text-sm font-medium" htmlFor="name">Nome Completo</label>
                <input
                    id="name"
                    placeholder="Seu nome e sobrenome"
                    {...register("name")}
                    className="input-field" // Estilo genérico para inputs
                />
                {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
            </div>
            <div className="grid gap-2">
                <label className="text-sm font-medium" htmlFor="username">Nome de Usuário</label>
                <input
                    id="username"
                    placeholder="Como você quer ser chamado"
                    {...register("username")}
                    className="input-field"
                />
                {errors.username && <p className="text-xs text-destructive">{errors.username.message}</p>}
            </div>
            <button type="button" onClick={handleNext} className="w-full btn-primary">
                Avançar
            </button>
        </div>
    );
}

function Step2({ form, nextStep }: StepProps) {
    const { register, trigger, formState: { errors } } = form;

    const handleNext = async () => {
        const isValid = await trigger("password");
        if (isValid) {
            nextStep();
        }
    };

    return (
        <div className="space-y-4 animate-in fade-in-50">
             <h2 className="text-lg font-medium text-center">Passo 2: Segurança</h2>
            <div className="grid gap-2">
                <label className="text-sm font-medium" htmlFor="password">Senha</label>
                <input
                    id="password"
                    type="password"
                    placeholder="Crie uma senha forte"
                    {...register("password")}
                    className="input-field"
                />
                {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
            </div>
            <button type="button" onClick={handleNext} className="w-full btn-primary">
                Avançar
            </button>
        </div>
    );
}

function Step3({ form }: { form: UseFormReturn<PremiumRegisterInput> }) {
  const { register, formState: { isSubmitting } } = form;

  return (
    <div className="space-y-4 animate-in fade-in-50">
        <h2 className="text-lg font-medium text-center">Passo 3: Tipo de Conta</h2>
      <div className="space-y-3 pt-2">
          <div className="grid grid-cols-3 gap-3">
              <label className="cursor-pointer">
                <input type="radio" value="consumer" {...register("role")} className="peer sr-only" />
                <div className="card-radio">
                  <User className="w-6 h-6 mx-auto mb-2" />
                  <span className="font-bold block">Comprar</span>
                  <span className="text-xs text-muted-foreground">Para quem busca produtos e serviços.</span>
                </div>
              </label>
              <label className="cursor-pointer">
                <input type="radio" value="professional" {...register("role")} className="peer sr-only" />
                <div className="card-radio">
                  <HardHat className="w-6 h-6 mx-auto mb-2" />
                  <span className="font-bold block">Trabalhar</span>
                   <span className="text-xs text-muted-foreground">Para quem presta serviços na área.</span>
                </div>
              </label>
              <label className="cursor-pointer">
                <input type="radio" value="store" {...register("role")} className="peer sr-only" />
                <div className="card-radio">
                  <Store className="w-6 h-6 mx-auto mb-2" />
                  <span className="font-bold block">Vender</span>
                   <span className="text-xs text-muted-foreground">Para quem tem uma loja de materiais.</span>
                </div>
              </label>
          </div>
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full btn-primary flex items-center justify-center disabled:opacity-50"
      >
        {isSubmitting && (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        )}
        Finalizar Cadastro
      </button>
    </div>
  );
}
