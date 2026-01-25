import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, useScroll, useTransform, type Variants } from 'framer-motion';
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
  Headphones,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import ThemeToggle from '@/components/ThemeToggle';
import ScrollingText from '@/components/ScrollingText';
import logoWebmarcas from '@/assets/logo-webmarcas.png';

// Animation variants with proper typing
const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 60 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.8 }
  }
};

const fadeInScale: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: 0.6 }
  }
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const staggerItem: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6 }
  }
};

const Index: React.FC = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { scrollYProgress } = useScroll();
  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);

  useEffect(() => {
    if (!loading && user) {
      navigate('/dashboard');
    }
  }, [user, loading, navigate]);

  const features = [
    { icon: Target, title: "Cálculo Automático de Bônus", desc: "Sistema calcula automaticamente a premiação de cada colaborador" },
    { icon: FileText, title: "Gestão de Processos", desc: "Controle total de registros, publicações e pendências" },
    { icon: Award, title: "Ranking da Equipe", desc: "Acompanhe a performance individual e coletiva em tempo real" },
    { icon: TrendingUp, title: "Dashboard Completo", desc: "Visualize metas, resultados e evolução com gráficos detalhados" },
    { icon: Users, title: "Multi-usuários", desc: "Cada colaborador tem seu próprio acesso e painel" },
    { icon: Shield, title: "Dados Seguros", desc: "Informações protegidas e backup automático na nuvem" },
  ];

  const benefits = [
    "Cadastros ilimitados",
    "Processos ilimitados", 
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
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Animated Background */}
      <motion.div 
        className="fixed inset-0 pointer-events-none"
        style={{ y: backgroundY }}
      >
        <div className="absolute inset-0 bg-gradient-radial opacity-40" />
        <div className="absolute inset-0 bg-dots opacity-20" />
        <motion.div 
          className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-accent/10 rounded-full blur-[150px]"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div 
          className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px]"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{ duration: 10, repeat: Infinity }}
        />
      </motion.div>
      
      {/* Header */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-20 border-b border-border/50 backdrop-blur-xl bg-background/80"
      >
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <motion.img 
              src={logoWebmarcas} 
              alt="WebMarcas" 
              className="h-10 w-auto"
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 400, damping: 10 }}
            />
          </Link>
          
          <nav className="hidden md:flex items-center gap-8">
            {['Como Funciona', 'Recursos', 'Preço'].map((item, i) => (
              <motion.a 
                key={item}
                href={`#${item.toLowerCase().replace(' ', '-')}`}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors relative group"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i, duration: 0.5 }}
              >
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent group-hover:w-full transition-all duration-300" />
              </motion.a>
            ))}
          </nav>
          
          <div className="flex items-center gap-3">
            <ThemeToggle variant="icon" />
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <Button 
                variant="ghost" 
                onClick={() => navigate('/auth')}
                className="text-sm font-medium text-muted-foreground hover:text-foreground"
              >
                Entrar
              </Button>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                onClick={() => navigate('/auth')}
                className="bg-accent hover:bg-accent/90 text-accent-foreground text-sm font-medium px-6 rounded-full"
              >
                Começar
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.header>

      <main className="relative z-10">
        {/* Hero Section */}
        <section className="py-20 md:py-32 px-6 relative">
          <div className="max-w-5xl mx-auto text-center">
            {/* Status Badge */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="flex justify-center mb-8"
            >
              <motion.div 
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-success/10 border border-success/30 backdrop-blur-sm"
                animate={{
                  boxShadow: [
                    '0 0 10px rgba(34, 197, 94, 0.2)',
                    '0 0 20px rgba(34, 197, 94, 0.4)',
                    '0 0 10px rgba(34, 197, 94, 0.2)'
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <motion.span 
                  className="w-2 h-2 rounded-full bg-success"
                  animate={{ scale: [1, 1.2, 1], opacity: [1, 0.7, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
                <span className="text-sm font-medium text-success">Sistema Online</span>
              </motion.div>
            </motion.div>

            {/* Main Heading with typewriter effect */}
            <motion.div 
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="mb-6"
            >
              <motion.h1 
                className="text-4xl md:text-6xl lg:text-7xl text-foreground tracking-tight leading-tight font-bold"
                variants={staggerItem}
              >
                Premie sua equipe e
              </motion.h1>
              <motion.div 
                className="text-4xl md:text-6xl lg:text-7xl font-bold mt-2 min-h-[1.3em]"
                variants={staggerItem}
              >
                <ScrollingText 
                  phrases={[
                    'aumente a produtividade',
                    'motive seus colaboradores',
                    'acompanhe resultados',
                    'impulsione vendas',
                  ]}
                  interval={3500}
                  className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"
                />
              </motion.div>
            </motion.div>

            {/* Subtitle */}
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10"
            >
              Sistema de premiação para empresas de marcas e patentes. 
              Calcule bônus automaticamente e acompanhe a performance da sua equipe.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="flex flex-wrap justify-center gap-4 mb-8"
            >
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                animate={{
                  boxShadow: [
                    '0 0 20px rgba(139, 92, 246, 0.3)',
                    '0 0 40px rgba(139, 92, 246, 0.5)',
                    '0 0 20px rgba(139, 92, 246, 0.3)'
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="rounded-full"
              >
                <Button 
                  size="lg"
                  onClick={() => navigate('/auth')}
                  className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold px-10 h-14 rounded-full text-base gap-2 relative overflow-hidden group"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Começar Agora
                    <motion.span
                      animate={{ x: [0, 4, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <ArrowRight className="w-5 h-5" />
                    </motion.span>
                  </span>
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    initial={{ x: '-100%' }}
                    whileHover={{ x: '100%' }}
                    transition={{ duration: 0.5 }}
                  />
                </Button>
              </motion.div>
            </motion.div>

            {/* Price highlight */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="flex justify-center"
            >
              <motion.div 
                className="inline-flex items-center gap-3 px-6 py-4 rounded-2xl bg-card/80 border border-border backdrop-blur-sm"
                whileHover={{ scale: 1.02, borderColor: 'hsl(var(--accent))' }}
                transition={{ type: 'spring', stiffness: 400, damping: 10 }}
              >
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Zap className="w-6 h-6 text-warning" />
                </motion.div>
                <span className="text-muted-foreground">Valor único:</span>
                <motion.span 
                  className="text-2xl md:text-3xl font-bold text-foreground"
                  animate={{ scale: [1, 1.02, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  R$ 1.194,00
                </motion.span>
                <span className="text-sm text-muted-foreground">(pagamento único)</span>
              </motion.div>
            </motion.div>
          </div>

          {/* Floating decorative elements */}
          <motion.div
            className="absolute top-20 left-10 w-20 h-20 border border-accent/20 rounded-2xl hidden md:block"
            animate={{ y: [-10, 10, -10] }}
            transition={{ duration: 6, repeat: Infinity }}
          />
          <motion.div
            className="absolute bottom-20 right-10 w-16 h-16 border border-primary/20 rounded-full hidden md:block"
            animate={{
              y: [10, -10, 10],
              rotate: [0, 180, 360]
            }}
            transition={{ duration: 8, repeat: Infinity }}
          />
          <motion.div
            className="absolute top-1/2 right-20 w-3 h-3 bg-accent/50 rounded-full hidden md:block"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{ duration: 3, repeat: Infinity }}
          />
        </section>

        {/* How it works */}
        <section id="como-funciona" className="py-24 px-6 bg-secondary/30 relative overflow-hidden">
          <motion.div 
            className="absolute inset-0 bg-grid opacity-5"
            animate={{ backgroundPosition: ['0 0', '50px 50px'] }}
            transition={{ duration: 20, repeat: Infinity }}
          />
          
          <div className="max-w-6xl mx-auto relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.7 }}
              className="text-center mb-16"
            >
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ type: 'spring', stiffness: 200, damping: 10 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 mb-6"
              >
                <Sparkles className="w-4 h-4 text-accent" />
                <span className="text-sm font-medium text-accent">Simples e Rápido</span>
              </motion.div>
              <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
                Como Funciona?
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Em 3 passos simples você tem controle total da bonificação da sua equipe
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                { step: "01", title: "Cadastre as Vendas", desc: "Cada colaborador registra os processos fechados, com forma de pagamento e valor" },
                { step: "02", title: "Acompanhe em Tempo Real", desc: "Dashboard mostra evolução, metas e comparativo entre todos os membros da equipe" },
                { step: "03", title: "Bônus Calculado Automaticamente", desc: "O sistema calcula a premiação de cada um baseado nas faixas definidas" },
              ].map((item, index) => (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ delay: index * 0.15, duration: 0.6 }}
                  whileHover={{ y: -10, scale: 1.02 }}
                  className="bg-card/80 backdrop-blur-sm rounded-2xl p-8 border border-border relative group cursor-pointer overflow-hidden"
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  />
                  <motion.div 
                    className="text-6xl font-bold text-accent/10 mb-4 relative z-10"
                    whileHover={{ scale: 1.1 }}
                  >
                    {item.step}
                  </motion.div>
                  <h3 className="text-xl font-semibold text-foreground mb-3 relative z-10">{item.title}</h3>
                  <p className="text-muted-foreground relative z-10">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="recursos" className="py-24 px-6 relative">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.7 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
                Tudo que Você Precisa
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Recursos pensados para facilitar a gestão de bonificações da sua equipe
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="bg-card/60 backdrop-blur-sm rounded-2xl p-6 border border-border group cursor-pointer relative overflow-hidden"
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-accent/0 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  />
                  <motion.div 
                    className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-all duration-300 relative z-10"
                    whileHover={{ rotate: [0, -10, 10, 0] }}
                    transition={{ duration: 0.5 }}
                  >
                    <feature.icon className="w-7 h-7 text-accent" />
                  </motion.div>
                  <h3 className="text-lg font-semibold text-foreground mb-2 relative z-10">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground relative z-10">{feature.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section id="preço" className="py-24 px-6 bg-secondary/30 relative overflow-hidden">
          <motion.div 
            className="absolute inset-0"
            style={{
              background: 'radial-gradient(ellipse at center, hsl(var(--accent) / 0.05) 0%, transparent 70%)'
            }}
          />
          
          <div className="max-w-5xl mx-auto relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.7 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
                Investimento Único
              </h2>
              <p className="text-lg text-muted-foreground">
                Pague uma vez, use para sempre. Sem mensalidades ou taxas escondidas.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.7 }}
              className="max-w-xl mx-auto"
            >
              <motion.div 
                className="bg-card/80 backdrop-blur-sm rounded-3xl p-8 md:p-10 border border-accent/30 relative overflow-hidden"
                whileHover={{ borderColor: 'hsl(var(--accent))' }}
                animate={{
                  boxShadow: [
                    '0 0 30px rgba(139, 92, 246, 0.1)',
                    '0 0 60px rgba(139, 92, 246, 0.2)',
                    '0 0 30px rgba(139, 92, 246, 0.1)'
                  ]
                }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                {/* Animated border sweep */}
                <motion.div
                  className="absolute inset-0 rounded-3xl opacity-30"
                  style={{
                    background: 'linear-gradient(90deg, transparent, hsl(var(--accent) / 0.3), transparent)',
                  }}
                  animate={{ 
                    x: ['-100%', '100%']
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                />

                {/* Popular badge */}
                <motion.div 
                  className="absolute top-0 right-0"
                  initial={{ x: 100, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5, type: 'spring', stiffness: 100 }}
                >
                  <div className="bg-accent text-accent-foreground text-xs font-bold px-4 py-2 rounded-bl-2xl">
                    RECOMENDADO
                  </div>
                </motion.div>

                <div className="text-center mb-8 relative z-10">
                  <motion.div 
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-warning/10 text-warning text-sm font-medium mb-4"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Star className="w-4 h-4" />
                    Licença Vitalícia
                  </motion.div>
                  
                  <div className="flex items-baseline justify-center gap-2 mb-2">
                    <motion.span 
                      className="text-lg text-muted-foreground line-through"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                    >
                      R$ 2.388,00
                    </motion.span>
                  </div>
                  <motion.div 
                    className="flex items-baseline justify-center gap-2 mb-4"
                    initial={{ scale: 0.5, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ type: 'spring', stiffness: 200, damping: 10, delay: 0.2 }}
                  >
                    <span className="text-5xl md:text-6xl font-bold text-foreground">R$ 1.194</span>
                    <span className="text-2xl text-muted-foreground">,00</span>
                  </motion.div>
                  <motion.p 
                    className="text-accent font-semibold"
                    animate={{ opacity: [1, 0.7, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    Pagamento Único • Sem Mensalidade
                  </motion.p>
                </div>

                <div className="grid md:grid-cols-2 gap-3 mb-8 relative z-10">
                  {benefits.map((benefit, index) => (
                    <motion.div 
                      key={index} 
                      className="flex items-center gap-3"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.05, duration: 0.4 }}
                    >
                      <motion.div
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.05, type: 'spring', stiffness: 300 }}
                      >
                        <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0" />
                      </motion.div>
                      <span className="text-sm text-foreground">{benefit}</span>
                    </motion.div>
                  ))}
                </div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="relative z-10"
                >
                  <Button 
                    className="w-full h-14 bg-accent hover:bg-accent/90 text-accent-foreground font-bold rounded-xl text-lg relative overflow-hidden group"
                    onClick={() => navigate('/auth')}
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      Quero Começar Agora
                      <motion.span
                        animate={{ x: [0, 5, 0] }}
                        transition={{ duration: 1, repeat: Infinity }}
                      >
                        <ArrowRight className="w-5 h-5" />
                      </motion.span>
                    </span>
                    <motion.div 
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                      initial={{ x: '-100%' }}
                      whileHover={{ x: '100%' }}
                      transition={{ duration: 0.6 }}
                    />
                  </Button>
                </motion.div>

                <motion.div 
                  className="flex items-center justify-center gap-6 mt-6 text-sm text-muted-foreground relative z-10"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.8 }}
                >
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Acesso Imediato
                  </div>
                  <div className="flex items-center gap-2">
                    <Headphones className="w-4 h-4" />
                    Suporte Incluso
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* CTA Final */}
        <section className="py-24 px-6 relative overflow-hidden">
          <motion.div 
            className="absolute inset-0 bg-gradient-to-b from-transparent via-accent/5 to-transparent"
          />
          
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.7 }}
            className="max-w-3xl mx-auto text-center relative z-10"
          >
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
              Pronto para Automatizar a Premiação da Sua Equipe?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Comece agora e tenha controle total sobre registros, publicações e bônus.
            </p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                size="lg"
                onClick={() => navigate('/auth')}
                className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold px-12 h-14 rounded-full text-base gap-2 relative overflow-hidden group"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Começar Agora
                  <motion.span
                    animate={{ x: [0, 4, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <ArrowRight className="w-5 h-5" />
                  </motion.span>
                </span>
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: '100%' }}
                  transition={{ duration: 0.5 }}
                />
              </Button>
            </motion.div>
          </motion.div>
        </section>
      </main>

      {/* Footer */}
      <motion.footer 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="relative z-10 border-t border-border py-12 px-6 bg-card/30 backdrop-blur-sm"
      >
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <motion.div 
            className="flex items-center gap-3"
            whileHover={{ scale: 1.05 }}
          >
            <img src={logoWebmarcas} alt="WebMarcas" className="h-8 w-auto" />
          </motion.div>
          <p className="text-sm text-muted-foreground">
            © 2025 WebMarcas. Todos os direitos reservados.
          </p>
        </div>
      </motion.footer>
    </div>
  );
};

export default Index;
