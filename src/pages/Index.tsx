import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { 
  ArrowRight, 
  CheckCircle2,
  Shield,
  Award,
  TrendingUp,
  Users,
  FileText,
  Target,
  Zap,
  Star,
  Clock,
  Headphones
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import ThemeToggle from '@/components/ThemeToggle';
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
    { icon: Target, title: "Cálculo Automático de Bônus", desc: "Sistema calcula automaticamente a premiação de cada colaborador" },
    { icon: FileText, title: "Gestão de Publicações", desc: "Controle total de exigências, recursos e deferimentos" },
    { icon: Award, title: "Ranking da Equipe", desc: "Acompanhe a performance individual e coletiva em tempo real" },
    { icon: TrendingUp, title: "Dashboard Completo", desc: "Visualize metas, resultados e evolução com gráficos detalhados" },
    { icon: Users, title: "Multi-usuários", desc: "Cada colaborador tem seu próprio acesso e painel" },
    { icon: Shield, title: "Dados Seguros", desc: "Informações protegidas e backup automático na nuvem" },
  ];

  const benefits = [
    "Registros de marca ilimitados",
    "Publicações ilimitadas", 
    "Usuários ilimitados",
    "Cálculo automático de bônus",
    "Dashboard com gráficos",
    "Ranking de equipe",
    "Metas personalizadas",
    "Suporte por WhatsApp",
    "Atualizações gratuitas",
    "Sem mensalidade"
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Background effects */}
      <div className="fixed inset-0 bg-gradient-radial opacity-30 pointer-events-none" />
      <div className="fixed inset-0 bg-dots opacity-10 pointer-events-none" />
      
      {/* Header */}
      <header className="relative z-20 border-b border-border/50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <img src={logoWebmarcas} alt="WebMarcas" className="h-10 w-auto" />
          </Link>
          
          <nav className="hidden md:flex items-center gap-8">
            <a href="#como-funciona" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Como Funciona
            </a>
            <a href="#recursos" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Recursos
            </a>
            <a href="#preco" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Preço
            </a>
          </nav>
          
          <div className="flex items-center gap-3">
            <ThemeToggle variant="icon" />
            <Button 
              variant="ghost" 
              onClick={() => navigate('/auth')}
              className="text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              Entrar
            </Button>
            <Button 
              onClick={() => navigate('/auth')}
              className="bg-accent hover:bg-accent/90 text-accent-foreground text-sm font-medium px-6 rounded-full"
            >
              Começar
            </Button>
          </div>
        </div>
      </header>

      <main className="relative z-10">
        {/* Hero Section */}
        <section className="py-20 md:py-32 px-6">
          <div className="max-w-5xl mx-auto text-center">
            {/* Status Badge */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex justify-center mb-8"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-success/10 border border-success/20">
                <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
                <span className="text-sm font-medium text-success">Sistema Online</span>
              </div>
            </motion.div>

            {/* Main Heading */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mb-6"
            >
              <h1 className="text-4xl md:text-6xl lg:text-7xl text-foreground tracking-tight leading-tight font-bold">
                Sistema de Premiação<br />
                <span className="text-gradient">para Registro de Marcas</span>
              </h1>
            </motion.div>

            {/* Subtitle */}
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10"
            >
              Gerencie registros, publicações e calcule bônus da sua equipe automaticamente. 
              Tudo em um único lugar, sem complicação.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-wrap justify-center gap-4 mb-8"
            >
              <Button 
                size="lg"
                onClick={() => navigate('/auth')}
                className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold px-10 h-14 rounded-full text-base gap-2"
              >
                Começar Agora
                <ArrowRight className="w-5 h-5" />
              </Button>
            </motion.div>

            {/* Price highlight */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex justify-center"
            >
              <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-card border border-border">
                <Zap className="w-5 h-5 text-warning" />
                <span className="text-muted-foreground">Valor único:</span>
                <span className="text-2xl font-bold text-foreground">R$ 1.194,00</span>
                <span className="text-sm text-muted-foreground">(pagamento único)</span>
              </div>
            </motion.div>
          </div>
        </section>

        {/* How it works */}
        <section id="como-funciona" className="py-20 px-6 bg-secondary/30">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Como Funciona?
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Em 3 passos simples você tem controle total da premiação da sua equipe
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                { step: "01", title: "Cadastre os Registros", desc: "Cada colaborador registra as marcas que fechou, com forma de pagamento e valor" },
                { step: "02", title: "Acompanhe em Tempo Real", desc: "Dashboard mostra evolução, metas e comparativo entre todos os membros da equipe" },
                { step: "03", title: "Bônus Calculado Automaticamente", desc: "O sistema calcula a premiação de cada um baseado nas regras definidas" },
              ].map((item, index) => (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-card rounded-2xl p-8 border border-border hover-lift"
                >
                  <div className="text-5xl font-bold text-accent/20 mb-4">{item.step}</div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">{item.title}</h3>
                  <p className="text-muted-foreground">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="recursos" className="py-20 px-6">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Tudo que Você Precisa
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Recursos pensados para facilitar a gestão de premiações
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-card rounded-2xl p-6 border border-border hover-lift group"
                >
                  <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors">
                    <feature.icon className="w-6 h-6 text-accent" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section id="preco" className="py-20 px-6 bg-secondary/30">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Investimento Único
              </h2>
              <p className="text-lg text-muted-foreground">
                Pague uma vez, use para sempre. Sem mensalidades ou taxas escondidas.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-xl mx-auto"
            >
              <div className="bg-card rounded-3xl p-8 md:p-10 border-glow relative overflow-hidden">
                {/* Popular badge */}
                <div className="absolute top-0 right-0">
                  <div className="bg-accent text-accent-foreground text-xs font-bold px-4 py-2 rounded-bl-2xl">
                    RECOMENDADO
                  </div>
                </div>

                <div className="text-center mb-8">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-warning/10 text-warning text-sm font-medium mb-4">
                    <Star className="w-4 h-4" />
                    Licença Vitalícia
                  </div>
                  
                  <div className="flex items-baseline justify-center gap-2 mb-2">
                    <span className="text-lg text-muted-foreground line-through">R$ 2.388,00</span>
                  </div>
                  <div className="flex items-baseline justify-center gap-2 mb-4">
                    <span className="text-5xl md:text-6xl font-bold text-foreground">R$ 1.194</span>
                    <span className="text-2xl text-muted-foreground">,00</span>
                  </div>
                  <p className="text-accent font-semibold">Pagamento Único • Sem Mensalidade</p>
                </div>

                <div className="grid md:grid-cols-2 gap-3 mb-8">
                  {benefits.map((benefit, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0" />
                      <span className="text-sm text-foreground">{benefit}</span>
                    </div>
                  ))}
                </div>

                <Button 
                  className="w-full h-14 bg-accent hover:bg-accent/90 text-accent-foreground font-bold rounded-xl text-lg"
                  onClick={() => navigate('/auth')}
                >
                  Quero Começar Agora
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>

                <div className="flex items-center justify-center gap-6 mt-6 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Acesso Imediato
                  </div>
                  <div className="flex items-center gap-2">
                    <Headphones className="w-4 h-4" />
                    Suporte Incluso
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* CTA Final */}
        <section className="py-20 px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              Pronto para Automatizar a Premiação da Sua Equipe?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Comece agora e tenha controle total sobre registros, publicações e bônus.
            </p>
            <Button 
              size="lg"
              onClick={() => navigate('/auth')}
              className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold px-12 h-14 rounded-full text-base gap-2"
            >
              Começar Agora
              <ArrowRight className="w-5 h-5" />
            </Button>
          </motion.div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <img src={logoWebmarcas} alt="WebMarcas" className="h-8 w-auto" />
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
