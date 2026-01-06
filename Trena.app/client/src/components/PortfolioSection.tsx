import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "wouter";
import { api } from "../../../shared/routes";
import { useState } from "react";
import { useAuth } from "../hooks/use-auth";
import { PortfolioItem } from "../../../shared/schema";
import { Upload, Plus, Image } from "lucide-react";

async function fetchPortfolio(userId: string) {
  const res = await fetch(api.users.getProfile.path.replace(":id", userId));
  if (!res.ok) {
    throw new Error("Failed to fetch portfolio");
  }
  const data = await res.json();
  return data.portfolioItems as PortfolioItem[];
}

async function uploadPortfolioItem(
  userId: string,
  file: File,
  caption: string
) {
  const formData = new FormData();
  formData.append("image", file);
  formData.append("caption", caption);

  const res = await fetch(`/api/users/${userId}/portfolio`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    throw new Error("Failed to upload image");
  }

  return res.json();
}

export function PortfolioSection() {
  const { user } = useAuth();
  const params = useParams();
  const userId = params.id || user?.id.toString();
  const queryClient = useQueryClient();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [caption, setCaption] = useState("");

  const {
    data: portfolioItems,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["portfolio", userId],
    queryFn: () => fetchPortfolio(userId!),
    enabled: !!userId,
  });

  const uploadMutation = useMutation({
    mutationFn: () => {
      if (!selectedFile || !userId) {
        throw new Error("No file selected or user not found");
      }
      return uploadPortfolioItem(userId, selectedFile, caption);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["portfolio", userId] });
      setSelectedFile(null);
      setCaption("");
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    uploadMutation.mutate();
  };

  if (isLoading) return <div>Carregando portfólio...</div>;
  if (error) return <div>Erro ao carregar o portfólio.</div>;

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Portfólio</h2>

      {/* Upload Form */}
      <form onSubmit={handleSubmit} className="mb-6 space-y-4">
        <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center">
          <input
            type="file"
            id="file-upload"
            className="hidden"
            onChange={handleFileChange}
          />
          <label
            htmlFor="file-upload"
            className="cursor-pointer text-primary font-semibold"
          >
            <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
            {selectedFile ? selectedFile.name : "Escolha uma imagem"}
          </label>
          {selectedFile && (
            <div className="mt-2 text-sm text-gray-500">
              <p>Arquivo selecionado!</p>
            </div>
          )}
        </div>
        <input
          type="text"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="Adicione uma legenda (opcional)"
          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-primary focus:border-primary"
        />
        <button
          type="submit"
          disabled={!selectedFile || uploadMutation.isPending}
          className="w-full flex items-center justify-center gap-2 bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-primary/90 disabled:bg-gray-300 transition-colors"
        >
          {uploadMutation.isPending ? "Enviando..." : "Adicionar ao Portfólio"}
          <Plus className="w-5 h-5" />
        </button>
      </form>

      {/* Portfolio Grid */}
      {portfolioItems && portfolioItems.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {portfolioItems.map((item) => (
            <div
              key={item.id}
              className="relative group rounded-lg overflow-hidden"
            >
              <img
                src={item.imageUrl}
                alt={item.caption || "Portfolio image"}
                className="w-full h-40 object-cover"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <p className="text-white text-center p-2 text-sm">
                  {item.caption}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-10 border-2 border-dashed border-gray-200 rounded-lg">
          <Image className="mx-auto h-12 w-12 text-gray-300" />
          <p className="text-gray-500 mt-2">
            Nenhum item no portfólio ainda.
          </p>
          <p className="text-sm text-gray-400">
            Adicione a primeira imagem!
          </p>
        </div>
      )}
    </div>
  );
}
