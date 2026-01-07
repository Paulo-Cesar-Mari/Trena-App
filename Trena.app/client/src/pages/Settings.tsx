import { User, ArrowLeft, Camera, CheckCircle, AlertTriangle } from "lucide-react";
import { useAuth } from "../hooks/use-auth";
import { useLocation } from "wouter";
import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { User as UserType } from "@shared/schema";
import { apiRequest } from "../lib/queryClient";

const updateUser = async (data: Partial<Pick<UserType, "name" | "location" | "bio" | "avatar">>) => {
    const response = await apiRequest('PATCH', api.users.updateMe.path, data);

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Falha ao atualizar o perfil.');
    }

    return response.json() as Promise<UserType>;
}

export default function Settings() {
  const { user, isLoading: isAuthLoading, refetchUser } = useAuth();
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();

  const [name, setName] = useState("");
  const [location, setLocationValue] = useState("");
  const [bio, setBio] = useState("");
  const [avatar, setAvatar] = useState("");
  const [phone, setPhone] = useState("");

  const mutation = useMutation({
    mutationFn: updateUser,
    onSuccess: (updatedUser) => {
        // Invalida a query de perfil para refetch
        queryClient.invalidateQueries({ queryKey: ['profile'] });
        // Atualiza o usuário no hook de autenticação
        refetchUser();
    },
  });

  useEffect(() => {
    if (!isAuthLoading && !user) {
      setLocation("/auth");
    } else if (user) {
        setName(user.name || "");
        setLocationValue(user.location || "");
        setBio(user.bio || "");
        setAvatar(user.avatar || "");
        setPhone(user.phone || "");
    }
  }, [user, isAuthLoading, setLocation]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const changedData: Parameters<typeof updateUser>[0] = {};
    if (name !== user?.name) changedData.name = name;
    if (location !== user?.location) changedData.location = location;
    if (bio !== user?.bio) changedData.bio = bio;
    if (avatar !== user?.avatar) changedData.avatar = avatar;
    if (phone !== user?.phone) changedData.phone = phone;

    if (Object.keys(changedData).length > 0) {
        mutation.mutate(changedData);
    }
  };

  return (
    <div className="pb-24 min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white pt-12 pb-6 px-4 sm:px-6 shadow-sm sticky top-0 z-30">
        <div className="flex items-center gap-4 max-w-4xl mx-auto relative">
            <button onClick={() => window.history.back()} className="absolute left-0">
                <ArrowLeft className="w-6 h-6 text-gray-600" />
            </button>
            <h1 className="text-xl font-bold text-center flex-1">
                Configurações
            </h1>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 pt-8 space-y-6 max-w-4xl mx-auto">
        <form onSubmit={handleSubmit}>
            {/* Form Fields */}
            <div className="space-y-4">
                <InputField label="Seu nome" id="name" value={name} onChange={(e) => setName(e.target.value)} />
                <InputField label="Sua localização" id="location" value={location} onChange={(e) => setLocationValue(e.target.value)} placeholder="Ex: Belo Horizonte, MG" />
                <InputField label="Telefone (WhatsApp)" id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Ex: (31) 99999-9999" />
                <TextareaField label="Sua bio" id="bio" value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Fale um pouco sobre você..." />
            </div>

            {/* Submit Button */}
            <div className="mt-8">
                <button
                  type="submit"
                  disabled={mutation.isPending}
                  className="w-full bg-primary text-white font-bold py-3 px-4 rounded-xl shadow-lg hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                    {mutation.isPending ? "Salvando..." : "Salvar alterações"}
                </button>
            </div>
             {/* Feedback Messages */}
             {mutation.isSuccess && (
                <div className="mt-4 p-3 bg-green-100 border border-green-200 text-green-700 rounded-lg flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    <p>Perfil atualizado com sucesso!</p>
                </div>
            )}
            {mutation.isError && (
                 <div className="mt-4 p-3 bg-red-100 border border-red-200 text-red-700 rounded-lg flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5" />
                    <p>{(mutation.error as Error)?.message || "Ocorreu um erro."}</p>
                </div>
            )}
        </form>
      </div>
    </div>
  );
}

const InputField = ({ label, id, ...props }: { label: string, id: string, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, placeholder?: string }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-bold text-gray-700 mb-1">{label}</label>
        <input id={id} {...props} className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow" />
    </div>
);

const TextareaField = ({ label, id, ...props }: { label: string, id: string, value: string, onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void, placeholder?: string }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-bold text-gray-700 mb-1">{label}</label>
        <textarea id={id} {...props} rows={4} className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow"></textarea>
    </div>
);