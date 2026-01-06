import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BottomNav, DesktopHeader } from "@/components/Navigation";

// 1. IMPORTAR O CONTEXTO DE AUTENTICAÇÃO
import { AuthProvider } from "./hooks/use-auth"; 

import Home from "@/pages/Home";
import ProductList from "@/pages/ProductList";
import ProductDetail from "@/pages/ProductDetail";
import ServiceList from "@/pages/ServiceList";
import ServiceDetail from "@/pages/ServiceDetail";
import CreateListing from "@/pages/CreateListing";
import Profile from "@/pages/Profile";
import NotFound from "@/pages/not-found";
import AuthPage from "./pages/auth-page";; // 2. IMPORTAR A PÁGINA DE LOGIN

function Router() {
  return (
    <div className="min-h-screen bg-background">
      <DesktopHeader />
      <Switch>
        <Route path="/" component={Home} />
        
        {/* 3. ADICIONAR A ROTA DE LOGIN */}
        <Route path="/auth" component={AuthPage} />
        
        <Route path="/buscar" component={ProductList} />
        <Route path="/produto/:id" component={ProductDetail} />
        <Route path="/servicos" component={ServiceList} />
        <Route path="/servico/:id" component={ServiceDetail} />
        <Route path="/anunciar" component={CreateListing} />
        <Route path="/perfil" component={Profile} />
        <Route component={NotFound} />
      </Switch>
      <BottomNav />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        {/* 4. ENVOLVER TUDO COM O AUTHPROVIDER */}
        <AuthProvider>
          <Toaster />
          <Router />
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;