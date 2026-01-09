import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { 
  ArrowRight, 
  Play,
  Zap,
  X,
  Smartphone,
  Instagram,
  MessageCircle,
  Check,
  Users,
  Bot,
  Send,
  Plus,
  FileText,
  Target,
  Award,
  TrendingUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import ThemeToggle from '@/components/ThemeToggle';

const Index: React.FC = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      navigate('/dashboard');
    }
  }, [user, loading, navigate]);

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Background effects */}
      <div className="fixed inset-0 bg-gradient-radial opacity-50 pointer-events-none" />
      <div className="fixed inset-0 bg-dots opacity-20 pointer-events-none" />
      
      {/* Header - Zionic style */}
      <header className="relative z-20">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center">
              <div className="w-5 h-5 rounded-full bg-foreground" />
            </div>
            <span className="text-lg font-semibold text-foreground tracking-tight">
              WebMarcas
            </span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Features
            </a>
            <a href="#solutions" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Soluções
            </a>
            <a href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Planos
            </a>
          </nav>
          
          <div className="flex items-center gap-3">
            <ThemeToggle variant="dropdown" />
            <Button 
              variant="ghost" 
              onClick={() => navigate('/auth')}
              className="text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              Login
            </Button>
            <Button 
              onClick={() => navigate('/auth')}
              className="bg-foreground hover:bg-foreground/90 text-background text-sm font-medium px-6 rounded-full"
            >
              Get Started
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section - Zionic style */}
      <main className="relative z-10">
        <section className="pt-16 pb-32 px-6">
          <div className="max-w-7xl mx-auto">
            {/* Status Badge */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex justify-center mb-12"
            >
              <div className="badge-online text-sm font-medium text-muted-foreground">
                SYSTEM ONLINE
              </div>
            </motion.div>

            {/* Main Heading - Zionic typography */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-center mb-8"
            >
              <h1 className="text-display-sm md:text-display text-foreground tracking-tight leading-none font-bold">
                WEBMARCAS YOUR<br />
                <span className="text-gradient">BONUS SYSTEM_</span>
              </h1>
            </motion.div>

            {/* Subtitle */}
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-center text-lg text-muted-foreground max-w-xl mx-auto mb-12"
            >
              WebMarcas seu sistema de premiação em 1 só lugar.
            </motion.p>

            {/* CTA Buttons - Zionic style */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-wrap justify-center gap-4 mb-24"
            >
              <Button 
                size="lg"
                variant="outline"
                onClick={() => navigate('/auth')}
                className="border-border hover:bg-secondary text-foreground font-medium px-8 gap-2 h-14 rounded-full text-base"
              >
                Criar conta
                <ArrowRight className="w-4 h-4" />
              </Button>
              <Button 
                size="lg"
                variant="outline"
                onClick={() => navigate('/auth')}
                className="border-border hover:bg-secondary text-foreground font-medium px-8 gap-2 h-14 rounded-full text-base"
              >
                <Play className="w-4 h-4 fill-current" />
                Testar agora
              </Button>
            </motion.div>

            {/* Floating Cards - Hero Visual */}
            <div className="relative max-w-6xl mx-auto h-[400px]">
              {/* Left floating card - Instagram style */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: 0.5 }}
                className="absolute left-0 top-0 w-72 animate-float"
              >
                <div className="bg-gradient-to-br from-pink-500 via-red-500 to-yellow-500 rounded-3xl p-1">
                  <div className="bg-card rounded-3xl p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-yellow-500 flex items-center justify-center">
                        <Instagram className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground">webmarcas.oficial</p>
                        <p className="text-xs text-muted-foreground">Business • Sistema Ativo</p>
                      </div>
                    </div>
                    <div className="bg-secondary/50 rounded-2xl h-48 flex items-center justify-center">
                      <span className="text-xs text-muted-foreground px-3 py-1.5 bg-card/80 rounded-full">Promoted</span>
                    </div>
                    <div className="flex items-center gap-4 mt-3 text-muted-foreground">
                      <span className="text-lg">♡</span>
                      <span className="text-lg">💬</span>
                      <span className="text-lg">➤</span>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Center - Integration icons */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
              >
                <div className="flex flex-col items-center gap-8">
                  <div className="flex items-center gap-16">
                    {/* Instagram icon */}
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-16 h-16 rounded-2xl bg-card border border-border flex items-center justify-center hover-lift">
                        <Instagram className="w-7 h-7 text-pink-500" />
                      </div>
                      <span className="text-xs text-muted-foreground uppercase tracking-wider">Instagram</span>
                    </div>
                    
                    {/* Processing indicator */}
                    <div className="px-4 py-2 bg-card rounded-full border border-border">
                      <span className="text-xs text-muted-foreground">Processing...</span>
                    </div>
                    
                    {/* WhatsApp icon */}
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-16 h-16 rounded-2xl bg-card border border-border flex items-center justify-center hover-lift">
                        <MessageCircle className="w-7 h-7 text-success" />
                      </div>
                      <span className="text-xs text-muted-foreground uppercase tracking-wider">WhatsApp</span>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Right floating card - Chat style */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: 0.7 }}
                className="absolute right-0 top-10 w-80 animate-float-delayed"
              >
                <div className="bg-card rounded-3xl p-5 border border-border hover-glow">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-success flex items-center justify-center">
                      <span className="text-xl">🎯</span>
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">WebMarcas Business</p>
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-success" />
                        <span className="text-xs text-success">Sistema Online</span>
                      </div>
                    </div>
                    <div className="ml-auto">
                      <span className="text-muted-foreground">⋮</span>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="bg-success/20 text-success rounded-2xl rounded-tr-sm px-4 py-3 ml-auto max-w-[80%]">
                      <p className="text-sm">Gostaria de saber sobre os bônus.</p>
                      <p className="text-xs opacity-60 text-right mt-1">10:00</p>
                    </div>
                    <div className="flex items-center gap-2 text-success text-sm">
                      <span>💬</span>
                      <span>Digitando...</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Comparison Section - Zionic style */}
        <section id="features" className="py-32 px-6">
          <div className="max-w-7xl mx-auto">
            {/* Section header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-8"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-card/50 mb-8">
                <span className="text-sm text-muted-foreground">Como você inova o mercado?</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-center mb-16"
            >
              <h2 className="text-headline md:text-display-sm text-foreground font-bold mb-4">
                Enquanto outros sistemas...<br />
                <span className="text-gradient">Você precisa de várias ferramentas,</span>
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Premiação, gestão de marcas, publicações e metas integradas tudo funcionando junto, no seu ritmo.
              </p>
            </motion.div>

            {/* Comparison cards */}
            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {/* Left - Problems */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="bg-card rounded-3xl p-8 border border-destructive/20"
              >
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-foreground">Outros <span className="text-destructive">Sistemas</span></h3>
                  <p className="text-sm text-muted-foreground mt-1">tem que torcer pra tudo funcionar.</p>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-secondary/50">
                    <div className="w-8 h-8 rounded-lg bg-warning/20 flex items-center justify-center">
                      <Zap className="w-4 h-4 text-warning" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">Integrações</p>
                      <p className="text-xs text-destructive">Limitadas e Instáveis</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-destructive/10 border border-destructive/20">
                    <div className="w-8 h-8 rounded-lg bg-destructive/20 flex items-center justify-center">
                      <X className="w-4 h-4 text-destructive" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">Regras de Negócio</p>
                      <p className="text-xs text-destructive">Quase inexistente</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-secondary/50">
                    <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                      <Smartphone className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">Mobile</p>
                      <p className="text-xs text-destructive">Apps lentos e limitados</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Center - Visual */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="flex flex-col items-center justify-center"
              >
                <div className="relative w-full h-full flex items-center justify-center">
                  {/* Central orb */}
                  <div className="w-48 h-48 rounded-full bg-gradient-to-br from-secondary to-card border border-border flex items-center justify-center animate-breathing">
                    <div className="w-32 h-32 rounded-full bg-card border border-border/50" />
                  </div>
                  
                  {/* Floating badges */}
                  <div className="absolute -top-4 right-0 px-3 py-1.5 bg-card rounded-lg border border-border text-xs">
                    <span className="text-pink-400">◉</span> Registro Marca
                  </div>
                  <div className="absolute top-1/2 -left-8 px-3 py-1.5 bg-card rounded-lg border border-border text-xs">
                    <span className="text-success">◉</span> Publicação
                  </div>
                  <div className="absolute -bottom-4 right-4 px-3 py-1.5 bg-card rounded-lg border border-border text-xs">
                    <span className="text-accent">◉</span> Bônus Auto
                  </div>
                </div>
                
                <div className="text-center mt-8">
                  <h4 className="font-semibold text-foreground">Unificação Total</h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    Gerenciamento de todos os registros,<br />publicações e premiações
                  </p>
                  <div className="flex justify-center gap-1 mt-3">
                    <span className="w-2 h-2 rounded-full bg-success" />
                    <span className="w-2 h-2 rounded-full bg-pink-500" />
                    <span className="w-2 h-2 rounded-full bg-accent" />
                  </div>
                </div>
              </motion.div>

              {/* Right - Solutions */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="bg-card rounded-3xl p-8 border-glow"
              >
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-foreground">WebMarcas</h3>
                  <p className="text-sm text-muted-foreground mt-1">É tudo em um.</p>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-secondary/50">
                    <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center">
                      <Target className="w-4 h-4 text-accent" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">Metas Automáticas</p>
                      <p className="text-xs text-muted-foreground">Calcula bônus automaticamente</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-secondary/50">
                    <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center">
                      <FileText className="w-4 h-4 text-accent" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">Publicações</p>
                      <p className="text-xs text-muted-foreground">Gestão completa de publicações</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-secondary/50">
                    <div className="w-8 h-8 rounded-lg bg-success/20 flex items-center justify-center">
                      <Award className="w-4 h-4 text-success" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">Premiação Total</p>
                      <p className="text-xs text-muted-foreground">Bônus & Rankings</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-secondary/50">
                    <div className="w-8 h-8 rounded-lg bg-success/20 flex items-center justify-center">
                      <TrendingUp className="w-4 h-4 text-success" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">Gerenciamento Total</p>
                      <p className="text-xs text-muted-foreground">Dashboard & Relatórios</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Pricing Section - Zionic style */}
        <section id="pricing" className="py-32 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              {/* Left content */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 text-accent text-xs font-medium mb-6">
                  PLANOS & PREÇOS
                </div>
                
                <h2 className="text-headline md:text-display-sm font-bold text-foreground mb-4">
                  Tudo o que você precisa para<br />
                  <span className="text-gradient-accent">Escalar seu Negócio</span>
                </h2>
                
                <p className="text-muted-foreground mb-8 max-w-md">
                  Comece agora com nosso plano completo e expanda conforme sua necessidade. Sem surpresas, apenas resultados.
                </p>
                
                <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-success" />
                    Setup Instantâneo
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-success" />
                    Suporte Dedicado
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-success" />
                    Atualizações Semanais
                  </div>
                </div>
              </motion.div>

              {/* Right - Pricing card */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                <div className="bg-card rounded-3xl p-8 border-glow relative">
                  {/* Popular badge */}
                  <div className="absolute top-6 right-6">
                    <span className="px-3 py-1.5 bg-accent text-accent-foreground rounded-full text-xs font-semibold">
                      MAIS POPULAR
                    </span>
                  </div>
                  
                  <div className="mb-6">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg font-semibold text-foreground">Premium</span>
                      <span className="text-warning">⚡</span>
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-5xl font-bold text-foreground">Sob</span>
                      <span className="text-muted-foreground">/consulta</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-3">
                      Ideal para empresas que buscam gestão profissional e premiação em escala.
                    </p>
                  </div>
                  
                  <div className="space-y-4 mb-8">
                    <div className="flex items-center gap-3">
                      <Users className="w-5 h-5 text-muted-foreground" />
                      <span className="text-foreground">Usuários ilimitados</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Bot className="w-5 h-5 text-muted-foreground" />
                      <span className="text-foreground">Cálculo automático de bônus</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-muted-foreground" />
                      <span className="text-foreground">Gestão de publicações</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Target className="w-5 h-5 text-muted-foreground" />
                      <span className="text-foreground">Metas e rankings</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <TrendingUp className="w-5 h-5 text-muted-foreground" />
                      <span className="text-foreground">Dashboard completo</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Send className="w-5 h-5 text-muted-foreground" />
                      <span className="text-foreground">Relatórios ilimitados</span>
                    </div>
                  </div>
                  
                  <div className="bg-secondary/50 rounded-xl p-4 mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center">
                        <Plus className="w-4 h-4 text-accent" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">Precisa de mais?</p>
                        <p className="text-xs text-muted-foreground">
                          Adicione funcionalidades extras sob consulta.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full h-14 bg-foreground hover:bg-foreground/90 text-background font-semibold rounded-xl text-base"
                    onClick={() => navigate('/auth')}
                  >
                    Testar 7 Dias
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                  
                  <p className="text-center text-xs text-muted-foreground mt-4">
                    Teste grátis por 7 dias. Sem compromisso.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-32 px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center"
          >
            <h2 className="text-headline md:text-display-sm font-bold text-foreground mb-6">
              Pronto para transformar sua gestão?
            </h2>
            <p className="text-lg text-muted-foreground mb-10 max-w-xl mx-auto">
              Junte-se às empresas que já utilizam o WebMarcas para gerenciar premiações.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button 
                size="lg"
                onClick={() => navigate('/auth')}
                className="bg-foreground hover:bg-foreground/90 text-background font-semibold px-10 h-14 rounded-full text-base gap-2"
              >
                Começar agora
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-card border border-border flex items-center justify-center">
              <div className="w-4 h-4 rounded-full bg-foreground" />
            </div>
            <span className="font-semibold text-foreground">WebMarcas</span>
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
