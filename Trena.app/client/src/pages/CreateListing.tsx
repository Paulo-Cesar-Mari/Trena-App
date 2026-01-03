import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateProduct } from "@/hooks/use-products";
import { useCreateService } from "@/hooks/use-services";
import { insertProductSchema, insertServiceSchema } from "@shared/schema";
import { z } from "zod";
import { ArrowLeft, Upload, Store, User } from "lucide-react";
import { Link, useLocation } from "wouter";

// Extended schemas for form handling (numeric strings -> numbers handled by backend/schema coercion if setup, 
// but here we manually coerce for safety before sending)
const productFormSchema = insertProductSchema.extend({
  price: z.string().transform(val => val.replace(',', '.')), // Basic handling
});

const serviceFormSchema = insertServiceSchema.extend({
  hourlyRate: z.string().optional().transform(val => val ? val.replace(',', '.') : undefined),
});

export default function CreateListing() {
  const [type, setType] = useState<"product" | "service">("product");
  const [, setLocation] = useLocation();

  const createProduct = useCreateProduct();
  const createService = useCreateService();

  const productForm = useForm({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "",
      price: "",
      location: "",
      storeName: "Minha Loja", // Mock default
      image: "",
    }
  });

  const serviceForm = useForm({
    resolver: zodResolver(serviceFormSchema),
    defaultValues: {
      name: "Meu Nome Profissional", // Mock default
      serviceType: "",
      description: "",
      location: "",
      contactInfo: "",
      hourlyRate: "",
      image: "",
    }
  });

  const onProductSubmit = (data: any) => {
    createProduct.mutate(data, {
      onSuccess: () => setLocation('/buscar')
    });
  };

  const onServiceSubmit = (data: any) => {
    createService.mutate(data, {
      onSuccess: () => setLocation('/servicos')
    });
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-24">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-30 px-4 h-16 flex items-center justify-between">
        <Link href="/">
          <button className="p-2 -ml-2 hover:bg-gray-100 rounded-full text-gray-500">
            <ArrowLeft className="w-6 h-6" />
          </button>
        </Link>
        <h1 className="font-bold text-secondary text-lg">Criar Anúncio</h1>
        <div className="w-10" /> {/* Spacer */}
      </div>

      <div className="max-w-2xl mx-auto p-4 md:py-8">
        {/* Type Toggle */}
        <div className="bg-white p-1 rounded-xl shadow-sm border border-gray-200 flex mb-8">
          <button
            onClick={() => setType("product")}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-bold transition-all ${
              type === "product" 
                ? "bg-primary text-secondary shadow-sm" 
                : "text-gray-500 hover:bg-gray-50"
            }`}
          >
            <Store className="w-4 h-4" /> Vender Produto
          </button>
          <button
            onClick={() => setType("service")}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-bold transition-all ${
              type === "service" 
                ? "bg-primary text-secondary shadow-sm" 
                : "text-gray-500 hover:bg-gray-50"
            }`}
          >
            <User className="w-4 h-4" /> Oferecer Serviço
          </button>
        </div>

        {/* Forms */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          {type === "product" ? (
            <form onSubmit={productForm.handleSubmit(onProductSubmit)} className="space-y-5">
              <div className="space-y-1">
                <label className="text-sm font-bold text-gray-700">Título do Anúncio</label>
                <input
                  {...productForm.register("title")}
                  placeholder="Ex: Cimento Votoran 50kg"
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none text-sm font-medium"
                />
                {productForm.formState.errors.title && <p className="text-red-500 text-xs">{productForm.formState.errors.title.message as string}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-bold text-gray-700">Preço (R$)</label>
                  <input
                    {...productForm.register("price")}
                    placeholder="0,00"
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none text-sm font-medium"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-bold text-gray-700">Categoria</label>
                  <select
                    {...productForm.register("category")}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none text-sm font-medium appearance-none"
                  >
                    <option value="">Selecione</option>
                    <option value="Cimento">Cimento</option>
                    <option value="Pintura">Pintura</option>
                    <option value="Ferramentas">Ferramentas</option>
                    <option value="Elétrica">Elétrica</option>
                    <option value="Hidráulica">Hidráulica</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-bold text-gray-700">Descrição</label>
                <textarea
                  {...productForm.register("description")}
                  rows={4}
                  placeholder="Descreva os detalhes do produto..."
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none text-sm font-medium resize-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-bold text-gray-700">Localização</label>
                <input
                  {...productForm.register("location")}
                  placeholder="Ex: Zona Norte, São Paulo"
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none text-sm font-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-bold text-gray-700">URL da Imagem (Opcional)</label>
                <div className="flex gap-2">
                  <input
                    {...productForm.register("image")}
                    placeholder="https://..."
                    className="flex-1 px-4 py-3 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none text-sm font-medium"
                  />
                  <div className="w-12 flex items-center justify-center bg-gray-100 rounded-xl text-gray-400">
                    <Upload className="w-5 h-5" />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={createProduct.isPending}
                className="w-full bg-primary text-secondary font-bold py-4 rounded-xl hover:brightness-105 transition-all shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed mt-4"
              >
                {createProduct.isPending ? "Publicando..." : "Publicar Anúncio"}
              </button>
            </form>
          ) : (
            <form onSubmit={serviceForm.handleSubmit(onServiceSubmit)} className="space-y-5">
              <div className="space-y-1">
                <label className="text-sm font-bold text-gray-700">Tipo de Serviço</label>
                <input
                  {...serviceForm.register("serviceType")}
                  placeholder="Ex: Pedreiro, Eletricista..."
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none text-sm font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-bold text-gray-700">Valor/Hora (Opcional)</label>
                  <input
                    {...serviceForm.register("hourlyRate")}
                    placeholder="0,00"
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none text-sm font-medium"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-bold text-gray-700">Contato (WhatsApp)</label>
                  <input
                    {...serviceForm.register("contactInfo")}
                    placeholder="(11) 99999-9999"
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none text-sm font-medium"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-bold text-gray-700">Sobre seu serviço</label>
                <textarea
                  {...serviceForm.register("description")}
                  rows={4}
                  placeholder="Descreva sua experiência e especialidades..."
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none text-sm font-medium resize-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-bold text-gray-700">Localização</label>
                <input
                  {...serviceForm.register("location")}
                  placeholder="Ex: Centro, Rio de Janeiro"
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none text-sm font-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-bold text-gray-700">Foto de Perfil (URL)</label>
                <div className="flex gap-2">
                  <input
                    {...serviceForm.register("image")}
                    placeholder="https://..."
                    className="flex-1 px-4 py-3 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none text-sm font-medium"
                  />
                  <div className="w-12 flex items-center justify-center bg-gray-100 rounded-xl text-gray-400">
                    <Upload className="w-5 h-5" />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={createService.isPending}
                className="w-full bg-primary text-secondary font-bold py-4 rounded-xl hover:brightness-105 transition-all shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed mt-4"
              >
                {createService.isPending ? "Cadastrando..." : "Cadastrar Serviço"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
