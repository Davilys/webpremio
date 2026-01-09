import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { 
  ArrowRight, 
  Bookmark, 
  FileText, 
  Target, 
  Users,
  Award,
  BarChart3,
  CheckCircle2,
  Zap,
  Calendar,
  TrendingUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';

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
      description: 'Controle completo de registros com cálculo automático de premiação',
    },
    {
      icon: FileText,
      title: 'Publicações',
      description: 'Gestão de publicações com múltiplos tipos e formas de pagamento',
    },
    {
      icon: Target,
      title: 'Metas Mensais',
      description: 'Acompanhamento de metas com bônus progressivo',
    },
    {
      icon: Users,
      title: 'Gestão de Equipe',
      description: 'Administração completa de funcionários e rankings',
    },
  ];

  const benefits = [
    'Cálculo automático de bônus',
    'Dashboard em tempo real',
    'Relatórios detalhados',
    'Gestão de metas',
  ];

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Dotted Pattern Background */}
      <div className="fixed inset-0 dotted-pattern opacity-40 pointer-events-none" />
      
      {/* Header - Zionic style */}
      <header className="relative z-20 border-b border-border/50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-foreground flex items-center justify-center">
              <span className="text-background font-bold text-sm">W</span>
            </div>
            <span className="text-lg font-semibold text-foreground tracking-tight">
              WebMarcas
            </span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Recursos
            </a>
            <a href="#benefits" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Benefícios
            </a>
          </nav>
          
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/auth')}
              className="text-sm font-medium"
            >
              Login
            </Button>
            <Button 
              onClick={() => navigate('/auth')}
              className="bg-foreground hover:bg-foreground/90 text-background text-sm font-medium px-5"
            >
              Área do Cliente
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section - Zionic style */}
      <main className="relative z-10">
        <section className="pt-20 pb-32 px-6">
          <div className="max-w-7xl mx-auto">
            {/* Status Badge */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex justify-center mb-8"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-card">
                <span className="w-2 h-2 rounded-full bg-accent animate-pulse-dot" />
                <span className="text-sm font-medium text-muted-foreground">Sistema de Premiação</span>
              </div>
            </motion.div>

            {/* Main Heading - Zionic typography */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-center mb-6"
            >
              <h1 className="text-5xl md:text-7xl font-bold text-foreground tracking-tight leading-[1.1]">
                WEBMARCAS YOUR<br />
                <span className="text-muted-foreground">BONUS SYSTEM_</span>
              </h1>
            </motion.div>

            {/* Subtitle */}
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-center text-lg text-muted-foreground max-w-xl mx-auto mb-10"
            >
              Sistema completo de gestão de premiação para sua equipe em um só lugar.
            </motion.p>

            {/* CTA Buttons - Zionic style */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-wrap justify-center gap-4 mb-20"
            >
              <Button 
                size="lg"
                onClick={() => navigate('/auth')}
                className="bg-foreground hover:bg-foreground/90 text-background font-medium px-8 gap-2 h-12"
              >
                Acessar Sistema
                <ArrowRight className="w-4 h-4" />
              </Button>
              <Button 
                size="lg"
                variant="outline"
                onClick={() => navigate('/auth')}
                className="border-border hover:bg-secondary font-medium px-8 gap-2 h-12"
              >
                <Zap className="w-4 h-4" />
                Começar agora
              </Button>
            </motion.div>

            {/* Hero Visual - Floating cards like Zionic */}
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="relative max-w-5xl mx-auto"
            >
              {/* Center hub */}
              <div className="flex justify-center mb-8">
                <div className="relative">
                  <div className="w-20 h-20 rounded-full bg-card border-2 border-border flex items-center justify-center shadow-elevated">
                    <div className="w-10 h-10 rounded-full bg-foreground" />
                  </div>
                  {/* Connecting lines */}
                  <div className="absolute top-1/2 -left-32 w-32 dashed-line-h" />
                  <div className="absolute top-1/2 -right-32 w-32 dashed-line-h" />
                  <div className="absolute -top-20 left-1/2 -translate-x-1/2 h-20 dashed-line-v" />
                  <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 h-20 dashed-line-v" />
                </div>
              </div>

              {/* Floating Feature Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {features.map((feature, index) => (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                    whileHover={{ y: -4, transition: { duration: 0.2 } }}
                    className="bg-card border border-border rounded-xl p-5 shadow-card hover:shadow-card-hover transition-all duration-300"
                  >
                    <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center mb-3">
                      <feature.icon className="w-5 h-5 text-foreground" />
                    </div>
                    <h3 className="text-sm font-semibold text-foreground mb-1">{feature.title}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">{feature.description}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Benefits Section */}
        <section id="benefits" className="py-20 px-6 bg-secondary/30">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Tudo em um só lugar
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Gerencie registros, publicações e premiações com eficiência
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {/* Left - Benefits list */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="space-y-4"
              >
                {benefits.map((benefit, index) => (
                  <div key={benefit} className="flex items-center gap-3 p-4 bg-card rounded-xl border border-border">
                    <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
                      <CheckCircle2 className="w-4 h-4 text-accent" />
                    </div>
                    <span className="font-medium text-foreground">{benefit}</span>
                  </div>
                ))}
              </motion.div>

              {/* Right - Stats preview */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-foreground rounded-2xl p-6 text-background"
              >
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-3 h-3 rounded-full bg-accent" />
                  <span className="text-sm font-medium opacity-80">Dashboard Preview</span>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-background/10 rounded-xl p-4">
                    <TrendingUp className="w-5 h-5 mb-2 opacity-60" />
                    <p className="text-2xl font-bold">24</p>
                    <p className="text-xs opacity-60">Registros</p>
                  </div>
                  <div className="bg-background/10 rounded-xl p-4">
                    <Award className="w-5 h-5 mb-2 opacity-60" />
                    <p className="text-2xl font-bold">R$ 2.4k</p>
                    <p className="text-xs opacity-60">Bônus</p>
                  </div>
                  <div className="bg-background/10 rounded-xl p-4">
                    <Calendar className="w-5 h-5 mb-2 opacity-60" />
                    <p className="text-2xl font-bold">12</p>
                    <p className="text-xs opacity-60">Publicações</p>
                  </div>
                  <div className="bg-background/10 rounded-xl p-4">
                    <BarChart3 className="w-5 h-5 mb-2 opacity-60" />
                    <p className="text-2xl font-bold">85%</p>
                    <p className="text-xs opacity-60">Meta</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-6">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Pronto para começar?
              </h2>
              <p className="text-muted-foreground mb-8">
                Acesse o sistema e comece a gerenciar sua premiação
              </p>
              <Button 
                size="lg"
                onClick={() => navigate('/auth')}
                className="bg-foreground hover:bg-foreground/90 text-background font-medium px-10 gap-2 h-12"
              >
                Entrar no Sistema
                <ArrowRight className="w-4 h-4" />
              </Button>
            </motion.div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border py-8 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-foreground flex items-center justify-center">
              <span className="text-background font-bold text-xs">W</span>
            </div>
            <span className="text-sm font-medium text-foreground">WebMarcas</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2025 WebMarcas. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
