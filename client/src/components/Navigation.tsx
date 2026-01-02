import { Link, useLocation } from "wouter";
import { Home, Search, PlusCircle, User, HardHat } from "lucide-react";
import { cn } from "@/lib/utils";

export function BottomNav() {
  const [location] = useLocation();

  const NavItem = ({ href, icon: Icon, label }: { href: string; icon: any; label: string }) => {
    const isActive = location === href;
    return (
      <Link href={href}>
        <div className={cn(
          "flex flex-col items-center justify-center space-y-1 w-full h-full py-2 px-1 cursor-pointer transition-colors duration-200",
          isActive ? "text-primary" : "text-gray-400 hover:text-gray-600"
        )}>
          <Icon className={cn("w-6 h-6", isActive && "fill-current")} strokeWidth={isActive ? 2.5 : 2} />
          <span className="text-[10px] font-medium">{label}</span>
        </div>
      </Link>
    );
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass-nav pb-safe md:hidden">
      <div className="flex justify-around items-center h-16 max-w-md mx-auto">
        <NavItem href="/" icon={Home} label="Início" />
        <NavItem href="/buscar" icon={Search} label="Buscar" />
        <div className="relative -top-5">
          <Link href="/anunciar">
            <div className="bg-primary text-secondary p-3 rounded-full shadow-lg shadow-primary/30 hover:scale-105 active:scale-95 transition-transform cursor-pointer border-4 border-white">
              <PlusCircle className="w-7 h-7" strokeWidth={2.5} />
            </div>
          </Link>
        </div>
        <NavItem href="/servicos" icon={HardHat} label="Serviços" />
        <NavItem href="/perfil" icon={User} label="Perfil" />
      </div>
    </nav>
  );
}

import logoUrl from "@/assets/logo.png";

export function DesktopHeader() {
  const [location] = useLocation();

  return (
    <header className="hidden md:block sticky top-0 z-50 bg-secondary text-white shadow-md">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/">
          <div className="flex items-center space-x-3 cursor-pointer">
            <img src={logoUrl} alt="TRENA Logo" className="h-10 w-auto" />
            <span className="text-xl font-bold tracking-tight">TRENA</span>
          </div>
        </Link>

        <nav className="flex items-center space-x-8">
          <Link href="/">
            <span className={cn("text-sm font-medium hover:text-primary transition-colors cursor-pointer", location === "/" && "text-primary")}>Início</span>
          </Link>
          <Link href="/buscar">
            <span className={cn("text-sm font-medium hover:text-primary transition-colors cursor-pointer", location === "/buscar" && "text-primary")}>Produtos</span>
          </Link>
          <Link href="/servicos">
            <span className={cn("text-sm font-medium hover:text-primary transition-colors cursor-pointer", location === "/servicos" && "text-primary")}>Serviços</span>
          </Link>
        </nav>

        <div className="flex items-center space-x-4">
          <Link href="/anunciar">
            <button className="bg-primary text-secondary px-5 py-2 rounded-lg text-sm font-bold hover:brightness-110 transition-all shadow-lg shadow-primary/20">
              Anunciar
            </button>
          </Link>
          <Link href="/perfil">
            <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer">
              <User className="w-5 h-5 text-white" />
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
}
