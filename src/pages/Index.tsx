import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { ChevronRight, Bookmark, FileText, Target, Users, Shield, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import logoWebmarcas from '@/assets/logo-webmarcas.png';

const Index: React.FC = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      navigate('/dashboard');
    }
  }, [user, loading, navigate]);

  const features = [
    {
      icon: Bookmark,
      title: 'Registro de Marca',
      description: 'Controle de marcas com premiação automática',
    },
    {
      icon: FileText,
      title: 'Publicações',
      description: 'Gestão de publicações com múltiplos tipos',
    },
    {
      icon: Target,
      title: 'Metas Mensais',
      description: 'Acompanhamento de metas com bônus',
    },
    {
      icon: Users,
      title: 'Gestão de Equipe',
      description: 'Administração completa de funcionários',
    },
  ];

  return (
    <div className="min-h-screen gradient-hero">
      {/* Background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute top-1/2 -left-40 w-80 h-80 rounded-full bg-accent/10 blur-3xl" />
      </div>

      {/* Header */}
      <header className="relative z-10 p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={logoWebmarcas} alt="WebMarcas" className="w-10 h-10 object-contain" />
            <span className="text-xl font-bold text-white">
              Web<span className="text-primary">Marcas</span>
            </span>
          </div>
          <Button onClick={() => navigate('/auth')} className="gradient-primary">
            Área do Cliente
          </Button>
        </div>
      </header>

      {/* Hero */}
      <main className="relative z-10 flex flex-col items-center justify-center px-4 py-16">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-8">
            <Shield className="w-4 h-4" />
            Sistema de Premiação
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Gerencie sua <span className="text-primary">premiação</span> de forma simples
          </h1>

          <p className="text-lg text-white/60 mb-10 max-w-2xl mx-auto">
            Acompanhe seus registros de marca, publicações e veja sua premiação mensal em tempo real.
          </p>

          <Button size="lg" onClick={() => navigate('/auth')} className="gradient-primary text-lg px-8">
            Acessar Sistema
            <ChevronRight className="w-5 h-5 ml-2" />
          </Button>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-16 max-w-5xl mx-auto w-full">
          {features.map((feature, index) => (
            <div key={index} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-5 text-center">
              <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center mx-auto mb-3">
                <feature.icon className="w-5 h-5 text-primary-foreground" />
              </div>
              <h3 className="text-sm font-semibold text-white mb-1">{feature.title}</h3>
              <p className="text-white/50 text-xs">{feature.description}</p>
            </div>
          ))}
        </div>
      </main>

      <footer className="relative z-10 text-center py-6 text-white/40 text-xs">
        © 2025 WebMarcas. Todos os direitos reservados.
      </footer>
    </div>
  );
};

export default Index;
