import { User, Settings, LogOut, Package, HardHat, Heart, ChevronRight } from "lucide-react";
import { useAuth } from "../hooks/use-auth";
import { useLocation } from "wouter";

export default function Profile() {
  // 1. Conectando com o sistema de autenticação e navegação
  const { user, logoutMutation } = useAuth();
  const [, setLocation] = useLocation();

  // 2. Função que realiza o logout
  const handleLogout = () => {
    logoutMutation.mutate(null, {
      onSuccess: () => {
        // Quando terminar de sair, manda o usuário para a tela de login
        setLocation("/auth");
      },
    });
  };

  return (
    <div className="pb-24 min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-secondary pt-12 pb-24 px-6 rounded-b-[2.5rem] relative overflow-hidden">
        <div className="relative z-10 flex items-center gap-4">
          <div className="w-20 h-20 rounded-full border-4 border-white/20 bg-white flex items-center justify-center overflow-hidden">
            {/* Se o usuário tiver avatar, mostra a foto, senão mostra o ícone */}
            {user?.avatar ? (
               <img src={user.avatar} alt="Perfil" className="w-full h-full object-cover" />
            ) : (
               <User className="w-10 h-10 text-gray-300" />
            )}
          </div>
          <div className="text-white">
            {/* 3. Nome Dinâmico: Se tem usuário, mostra o nome. Se não, 'Visitante' */}
            <h1 className="text-2xl font-bold">
              Olá, {user ? user.name : "Visitante"}
            </h1>
            <p className="text-white/60 text-sm">
              {user ? "Bem-vindo ao seu painel" : "Entre para ver seus pedidos"}
            </p>
          </div>
        </div>
        
        {/* Decorative */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-primary/10 rounded-full blur-3xl" />
      </div>

      {/* Menu Cards */}
      <div className="px-4 -mt-12 relative z-20 space-y-4 max-w-2xl mx-auto">
        {/* Stats Card */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex justify-between">
          <div className="text-center flex-1 border-r border-gray-100">
            <span className="block text-2xl font-bold text-primary">0</span>
            <span className="text-xs text-gray-500 font-medium">Anúncios</span>
          </div>
          <div className="text-center flex-1 border-r border-gray-100">
            <span className="block text-2xl font-bold text-primary">0</span>
            <span className="text-xs text-gray-500 font-medium">Favoritos</span>
          </div>
          <div className="text-center flex-1">
            <span className="block text-2xl font-bold text-primary">0</span>
            <span className="text-xs text-gray-500 font-medium">Vendas</span>
          </div>
        </div>

        {/* Menu Items */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <MenuItem icon={Package} label="Meus Anúncios" />
          <MenuItem icon={Heart} label="Favoritos" />
          <MenuItem icon={HardHat} label="Contratações" />
          <MenuItem icon={Settings} label="Configurações" />
        </div>

        {/* 4. Botão Sair com Funcionalidade */}
        <button 
          onClick={handleLogout}
          disabled={logoutMutation.isPending} // Desabilita enquanto está saindo
          className="w-full bg-white p-4 rounded-2xl shadow-sm border border-gray-100 text-red-500 font-bold flex items-center justify-center gap-2 hover:bg-red-50 transition-colors disabled:opacity-50"
        >
          <LogOut className="w-5 h-5" />
          {logoutMutation.isPending ? "Saindo..." : "Sair da conta"}
        </button>
      </div>
    </div>
  );
}

function MenuItem({ icon: Icon, label }: { icon: any; label: string }) {
  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-50 last:border-0 hover:bg-gray-50 cursor-pointer transition-colors group">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center group-hover:bg-primary/20 group-hover:text-primary-foreground transition-colors text-gray-500">
          <Icon className="w-5 h-5" />
        </div>
        <span className="font-semibold text-gray-700">{label}</span>
      </div>
      <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-primary transition-colors" />
    </div>
  );
}