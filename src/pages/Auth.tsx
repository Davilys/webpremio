import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { LogIn, UserPlus, Mail, Lock, User, Loader2, ArrowRight, CheckCircle2, Shield, Award, TrendingUp } from 'lucide-react';
import { z } from 'zod';
import logoWebmarcas from '@/assets/logo-webmarcas.png';
import ScrollingText from '@/components/ScrollingText';

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
});

const signUpSchema = z.object({
  nome: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres').max(100),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
});

// Light theme floating elements with soft glow
const FloatingElements: React.FC = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* Main cyan radial glow - top right */}
      <motion.div
        className="absolute w-[900px] h-[900px] rounded-full"
        style={{
          top: '-25%',
          right: '-15%',
          background: 'radial-gradient(circle, rgba(0, 145, 255, 0.15) 0%, rgba(0, 194, 255, 0.08) 40%, transparent 70%)',
          filter: 'blur(60px)',
        }}
        animate={{
          scale: [1, 1.05, 1],
          x: [0, 20, 0],
          y: [0, -15, 0],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      
      {/* Secondary blue glow - bottom left */}
      <motion.div
        className="absolute w-[700px] h-[700px] rounded-full"
        style={{
          bottom: '-20%',
          left: '-15%',
          background: 'radial-gradient(circle, rgba(0, 145, 255, 0.12) 0%, rgba(0, 100, 200, 0.05) 40%, transparent 70%)',
          filter: 'blur(80px)',
        }}
        animate={{
          scale: [1, 1.1, 1],
          x: [0, -15, 0],
          y: [0, 20, 0],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
      />

      {/* Center accent glow */}
      <motion.div
        className="absolute w-[500px] h-[500px] rounded-full"
        style={{
          top: '35%',
          left: '45%',
          transform: 'translate(-50%, -50%)',
          background: 'radial-gradient(circle, rgba(0, 194, 255, 0.08) 0%, transparent 60%)',
          filter: 'blur(50px)',
        }}
        animate={{
          opacity: [0.4, 0.7, 0.4],
          scale: [0.95, 1.05, 0.95],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Floating soft particles */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: Math.random() * 4 + 2 + 'px',
            height: Math.random() * 4 + 2 + 'px',
            backgroundColor: `rgba(0, 145, 255, ${Math.random() * 0.25 + 0.1})`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            boxShadow: '0 0 8px rgba(0, 145, 255, 0.3)',
          }}
          animate={{
            y: [0, -(Math.random() * 40 + 15), 0],
            x: [0, (Math.random() - 0.5) * 30, 0],
            opacity: [0.3, 0.7, 0.3],
          }}
          transition={{
            duration: Math.random() * 5 + 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: Math.random() * 4,
          }}
        />
      ))}

      {/* Subtle grid overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0, 145, 255, 0.4) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 145, 255, 0.4) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />
    </div>
  );
};

// Animated text component with fade-in effect
const GlowingText: React.FC<{ children: React.ReactNode; delay?: number }> = ({ children, delay = 0 }) => {
  return (
    <motion.span
      initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      transition={{ 
        duration: 0.8, 
        delay,
        ease: [0.25, 0.4, 0.25, 1]
      }}
      className="inline-block"
    >
      {children}
    </motion.span>
  );
};

const Auth: React.FC = () => {
  const { signIn, signUp, user, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [signUpForm, setSignUpForm] = useState({ nome: '', email: '', password: '' });

  useEffect(() => {
    if (!loading && user) {
      navigate('/dashboard');
    }
  }, [user, loading, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const result = loginSchema.safeParse(loginForm);
    if (!result.success) {
      toast({
        title: 'Erro de validação',
        description: result.error.errors[0].message,
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    const { error } = await signIn(loginForm.email, loginForm.password);
    setIsLoading(false);

    if (error) {
      toast({
        title: 'Erro ao fazer login',
        description: error.message === 'Invalid login credentials' 
          ? 'Email ou senha incorretos' 
          : error.message,
        variant: 'destructive',
      });
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const result = signUpSchema.safeParse(signUpForm);
    if (!result.success) {
      toast({
        title: 'Erro de validação',
        description: result.error.errors[0].message,
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    const { error } = await signUp(signUpForm.email, signUpForm.password, signUpForm.nome);
    setIsLoading(false);

    if (error) {
      if (error.message.includes('already registered')) {
        toast({
          title: 'Email já cadastrado',
          description: 'Este email já está em uso. Tente fazer login.',
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Erro ao criar conta',
          description: error.message,
          variant: 'destructive',
        });
      }
    } else {
      toast({
        title: 'Conta criada com sucesso!',
        description: 'Você será redirecionado para o sistema.',
      });
    }
  };

  if (loading) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center"
        style={{ 
          background: 'linear-gradient(180deg, #FAFAFA 0%, #F0F7FF 50%, #E8F4FF 100%)',
        }}
      >
        <FloatingElements />
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          className="relative"
        >
          <div 
            className="w-12 h-12 rounded-full border-2 border-t-transparent"
            style={{ 
              borderColor: 'rgba(0, 145, 255, 0.3)',
              borderTopColor: 'transparent',
              boxShadow: '0 0 20px rgba(0, 145, 255, 0.2)',
            }}
          />
          <div 
            className="absolute inset-0 w-12 h-12 rounded-full border-2 border-t-transparent animate-spin"
            style={{ 
              borderColor: '#0091FF',
              borderTopColor: 'transparent',
              animationDuration: '0.8s',
            }}
          />
        </motion.div>
      </div>
    );
  }

  const benefits = [
    { icon: Shield, text: 'Gestão de Registros de Marca' },
    { icon: Award, text: 'Controle de Publicações' },
    { icon: TrendingUp, text: 'Cálculo Automático de Bônus' },
    { icon: CheckCircle2, text: 'Dashboard em Tempo Real' },
  ];

  return (
    <div 
      className="min-h-screen flex flex-col lg:flex-row overflow-hidden relative"
      style={{ 
        background: 'linear-gradient(180deg, #FAFAFA 0%, #F0F7FF 50%, #E8F4FF 100%)',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
      <FloatingElements />

      {/* Left Panel - Branding (Hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-3/5 relative z-10">
        <div className="relative z-10 flex flex-col justify-center px-12 xl:px-20 w-full">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 1, ease: [0.25, 0.4, 0.25, 1] }}
          >
            {/* Logo with soft glow */}
            <motion.div 
              className="flex items-center gap-5 mb-14"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              <motion.div 
                className="relative"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div 
                  className="absolute inset-0 rounded-2xl blur-xl"
                  style={{ background: 'rgba(0, 145, 255, 0.15)' }}
                />
                <div 
                  className="relative p-4 rounded-2xl"
                  style={{
                    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.7) 100%)',
                    border: '1px solid rgba(0, 145, 255, 0.2)',
                    backdropFilter: 'blur(10px)',
                    boxShadow: '0 8px 32px rgba(0, 145, 255, 0.12)',
                  }}
                >
                  <img src={logoWebmarcas} alt="WebMarcas" className="w-16 h-16 object-contain" />
                </div>
              </motion.div>
              <div>
                <h2 
                  className="text-3xl font-bold tracking-tight"
                  style={{ 
                    color: '#0F172A',
                  }}
                >
                  WebMarcas
                </h2>
                <p 
                  className="text-sm font-medium mt-1"
                  style={{ color: '#0091FF' }}
                >
                  Sistema de Premiação
                </p>
              </div>
            </motion.div>
            
            {/* Status badge */}
            <motion.div 
              className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full mb-12"
              style={{
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.7) 100%)',
                border: '1px solid rgba(0, 145, 255, 0.15)',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 4px 20px rgba(0, 145, 255, 0.08)',
              }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              <motion.span 
                className="w-2.5 h-2.5 rounded-full"
                style={{ 
                  backgroundColor: '#22C55E',
                  boxShadow: '0 0 10px #22C55E, 0 0 20px rgba(34, 197, 94, 0.4)',
                }}
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.8, 1, 0.8],
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              <span 
                className="text-sm font-semibold tracking-wide"
                style={{ color: '#0F172A' }}
              >
                Sistema Online
              </span>
            </motion.div>
            
            {/* Main heading with gradient text */}
            <motion.h1 
              className="text-4xl xl:text-5xl 2xl:text-6xl font-bold tracking-tight leading-[1.15] mb-8"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.8, ease: [0.25, 0.4, 0.25, 1] }}
            >
              <GlowingText delay={0.8}>
                <span style={{ color: '#0F172A' }}>Registre sua marca e</span>
              </GlowingText>
              <br />
              <ScrollingText 
                phrases={[
                  'proteja seu negócio',
                  'garanta exclusividade',
                  'evite cópias e prejuízos',
                  'cresça com segurança',
                ]}
                interval={3500}
                className="min-h-[1.3em]"
                style={{ 
                  background: 'linear-gradient(135deg, #0091FF 0%, #00C2FF 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              />
            </motion.h1>
            
            <motion.p 
              className="text-lg xl:text-xl max-w-lg mb-14 leading-relaxed"
              style={{ color: '#475569' }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1, duration: 0.7 }}
            >
              Sistema completo de gestão de premiação para sua equipe de vendas. 
              Controle registros, publicações e bonificações em tempo real.
            </motion.p>

            {/* Benefits list with stagger */}
            <div className="space-y-5">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={benefit.text}
                  initial={{ opacity: 0, x: -40 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ 
                    delay: 1.2 + index * 0.15, 
                    duration: 0.6,
                    ease: [0.25, 0.4, 0.25, 1]
                  }}
                  className="flex items-center gap-4 group cursor-default"
                >
                  <motion.div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-500"
                    style={{
                      background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.8) 100%)',
                      border: '1px solid rgba(0, 145, 255, 0.15)',
                      boxShadow: '0 4px 20px rgba(0, 145, 255, 0.08)',
                    }}
                    whileHover={{ 
                      scale: 1.1,
                      boxShadow: '0 8px 30px rgba(0, 145, 255, 0.2)',
                    }}
                  >
                    <benefit.icon className="w-5 h-5" style={{ color: '#0091FF' }} />
                  </motion.div>
                  <span 
                    className="font-medium text-base group-hover:translate-x-1 transition-transform duration-300"
                    style={{ color: '#0F172A' }}
                  >
                    {benefit.text}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Decorative floating element */}
        <motion.div 
          className="absolute bottom-24 right-24 w-72 h-72 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(0, 145, 255, 0.1) 0%, transparent 70%)',
          }}
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.4, 0.6, 0.4],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Right Panel - Auth Form */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 lg:p-12 min-h-screen lg:min-h-0 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.25, 0.4, 0.25, 1] }}
          className="w-full max-w-[440px]"
        >
          {/* Mobile header */}
          <motion.div 
            className="lg:hidden mb-12 text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div 
              className="relative inline-flex items-center justify-center p-4 rounded-2xl mb-5"
              style={{
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.8) 100%)',
                border: '1px solid rgba(0, 145, 255, 0.2)',
                boxShadow: '0 8px 32px rgba(0, 145, 255, 0.1)',
              }}
            >
              <div 
                className="absolute inset-0 rounded-2xl blur-xl"
                style={{ background: 'rgba(0, 145, 255, 0.1)' }}
              />
              <img src={logoWebmarcas} alt="WebMarcas" className="relative w-14 h-14 object-contain" />
            </motion.div>
            <h1 
              className="text-2xl font-bold tracking-tight"
              style={{ color: '#0F172A' }}
            >
              WebMarcas
            </h1>
            <p 
              className="text-sm font-medium mt-1.5"
              style={{ color: '#0091FF' }}
            >
              Sistema de Premiação
            </p>
          </motion.div>

          {/* Desktop logo */}
          <motion.div 
            className="hidden lg:flex items-center justify-center gap-4 mb-12"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <img 
              src={logoWebmarcas} 
              alt="WebMarcas" 
              className="w-14 h-14 object-contain"
              style={{ filter: 'drop-shadow(0 4px 12px rgba(0, 145, 255, 0.15))' }}
            />
            <span 
              className="text-2xl font-bold tracking-tight"
              style={{ color: '#0F172A' }}
            >
              WebMarcas
            </span>
          </motion.div>

          {/* Glassmorphism Card - Light theme */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.7 }}
          >
            <Card 
              className="border shadow-2xl overflow-hidden relative"
              style={{
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.85) 100%)',
                borderColor: 'rgba(0, 145, 255, 0.15)',
                backdropFilter: 'blur(20px)',
                boxShadow: '0 25px 50px -12px rgba(0, 145, 255, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.8)',
              }}
            >
              {/* Card glow effect */}
              <div 
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: 'linear-gradient(180deg, rgba(0, 145, 255, 0.03) 0%, transparent 50%)',
                }}
              />

              <CardHeader className="text-center pb-2 pt-8 relative z-10">
                <motion.h2 
                  className="text-2xl font-semibold tracking-tight"
                  style={{ color: '#0F172A' }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7, duration: 0.5 }}
                >
                  Bem-vindo
                </motion.h2>
                <motion.p 
                  className="text-sm mt-2"
                  style={{ color: '#64748B' }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8, duration: 0.5 }}
                >
                  Entre para acessar o sistema
                </motion.p>
              </CardHeader>

              <CardContent className="pt-6 pb-8 px-6 relative z-10">
                <Tabs defaultValue="login" className="w-full">
                  <TabsList 
                    className="grid w-full grid-cols-2 mb-6 h-13 rounded-xl p-1.5"
                    style={{
                      backgroundColor: 'rgba(241, 245, 249, 0.8)',
                      border: '1px solid rgba(0, 145, 255, 0.1)',
                    }}
                  >
                    <TabsTrigger 
                      value="login" 
                      className="gap-2 text-sm font-semibold rounded-lg h-10 transition-all duration-300 data-[state=active]:bg-white data-[state=active]:shadow-lg data-[state=active]:text-[#0091FF]"
                      style={{
                        color: '#64748B',
                      }}
                    >
                      <LogIn className="w-4 h-4" />
                      Entrar
                    </TabsTrigger>
                    <TabsTrigger 
                      value="signup" 
                      className="gap-2 text-sm font-semibold rounded-lg h-10 transition-all duration-300 data-[state=active]:bg-white data-[state=active]:shadow-lg data-[state=active]:text-[#0091FF]"
                      style={{
                        color: '#64748B',
                      }}
                    >
                      <UserPlus className="w-4 h-4" />
                      Cadastrar
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="login" className="space-y-4 mt-0">
                    <form onSubmit={handleLogin} className="space-y-5">
                      <motion.div 
                        className="space-y-2"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.9, duration: 0.5 }}
                      >
                        <Label 
                          htmlFor="login-email" 
                          className="text-sm font-medium"
                          style={{ color: '#0F172A' }}
                        >
                          Email
                        </Label>
                        <div className="relative group">
                          <Mail 
                            className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors duration-300 group-focus-within:text-[#0091FF]"
                            style={{ color: '#94A3B8' }}
                          />
                          <Input
                            id="login-email"
                            type="email"
                            placeholder="seu@email.com"
                            className="pl-11 h-12 rounded-xl transition-all duration-300 focus:ring-2 focus:ring-[#0091FF]/20 focus:border-[#0091FF] placeholder:text-slate-400"
                            style={{
                              backgroundColor: '#F8FAFC',
                              borderColor: 'rgba(0, 145, 255, 0.2)',
                              color: '#0F172A',
                            }}
                            value={loginForm.email}
                            onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                            required
                          />
                        </div>
                      </motion.div>

                      <motion.div 
                        className="space-y-2"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1.0, duration: 0.5 }}
                      >
                        <Label 
                          htmlFor="login-password" 
                          className="text-sm font-medium"
                          style={{ color: '#0F172A' }}
                        >
                          Senha
                        </Label>
                        <div className="relative group">
                          <Lock 
                            className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors duration-300 group-focus-within:text-[#0091FF]"
                            style={{ color: '#94A3B8' }}
                          />
                          <Input
                            id="login-password"
                            type="password"
                            placeholder="••••••••"
                            className="pl-11 h-12 rounded-xl transition-all duration-300 focus:ring-2 focus:ring-[#0091FF]/20 focus:border-[#0091FF] placeholder:text-slate-400"
                            style={{
                              backgroundColor: '#F8FAFC',
                              borderColor: 'rgba(0, 145, 255, 0.2)',
                              color: '#0F172A',
                            }}
                            value={loginForm.password}
                            onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                            required
                          />
                        </div>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.1, duration: 0.5 }}
                      >
                        <Button
                          type="submit"
                          className="w-full h-12 rounded-xl text-base font-semibold transition-all duration-300 group relative overflow-hidden text-white"
                          style={{
                            background: 'linear-gradient(135deg, #0091FF 0%, #00C2FF 100%)',
                            boxShadow: '0 4px 20px rgba(0, 145, 255, 0.35)',
                          }}
                          disabled={isLoading}
                        >
                          <span className="relative z-10 flex items-center justify-center gap-2">
                            {isLoading ? (
                              <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                              <>
                                Entrar
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                              </>
                            )}
                          </span>
                          <motion.div
                            className="absolute inset-0"
                            style={{
                              background: 'linear-gradient(135deg, #00C2FF 0%, #0091FF 100%)',
                            }}
                            initial={{ opacity: 0 }}
                            whileHover={{ opacity: 1 }}
                            transition={{ duration: 0.3 }}
                          />
                        </Button>
                      </motion.div>
                    </form>
                  </TabsContent>

                  <TabsContent value="signup" className="space-y-4 mt-0">
                    <form onSubmit={handleSignUp} className="space-y-5">
                      <motion.div 
                        className="space-y-2"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.9, duration: 0.5 }}
                      >
                        <Label 
                          htmlFor="signup-nome" 
                          className="text-sm font-medium"
                          style={{ color: '#0F172A' }}
                        >
                          Nome completo
                        </Label>
                        <div className="relative group">
                          <User 
                            className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors duration-300 group-focus-within:text-[#0091FF]"
                            style={{ color: '#94A3B8' }}
                          />
                          <Input
                            id="signup-nome"
                            type="text"
                            placeholder="Seu nome"
                            className="pl-11 h-12 rounded-xl transition-all duration-300 focus:ring-2 focus:ring-[#0091FF]/20 focus:border-[#0091FF] placeholder:text-slate-400"
                            style={{
                              backgroundColor: '#F8FAFC',
                              borderColor: 'rgba(0, 145, 255, 0.2)',
                              color: '#0F172A',
                            }}
                            value={signUpForm.nome}
                            onChange={(e) => setSignUpForm({ ...signUpForm, nome: e.target.value })}
                            required
                          />
                        </div>
                      </motion.div>

                      <motion.div 
                        className="space-y-2"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1.0, duration: 0.5 }}
                      >
                        <Label 
                          htmlFor="signup-email" 
                          className="text-sm font-medium"
                          style={{ color: '#0F172A' }}
                        >
                          Email
                        </Label>
                        <div className="relative group">
                          <Mail 
                            className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors duration-300 group-focus-within:text-[#0091FF]"
                            style={{ color: '#94A3B8' }}
                          />
                          <Input
                            id="signup-email"
                            type="email"
                            placeholder="seu@email.com"
                            className="pl-11 h-12 rounded-xl transition-all duration-300 focus:ring-2 focus:ring-[#0091FF]/20 focus:border-[#0091FF] placeholder:text-slate-400"
                            style={{
                              backgroundColor: '#F8FAFC',
                              borderColor: 'rgba(0, 145, 255, 0.2)',
                              color: '#0F172A',
                            }}
                            value={signUpForm.email}
                            onChange={(e) => setSignUpForm({ ...signUpForm, email: e.target.value })}
                            required
                          />
                        </div>
                      </motion.div>

                      <motion.div 
                        className="space-y-2"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1.1, duration: 0.5 }}
                      >
                        <Label 
                          htmlFor="signup-password" 
                          className="text-sm font-medium"
                          style={{ color: '#0F172A' }}
                        >
                          Senha
                        </Label>
                        <div className="relative group">
                          <Lock 
                            className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors duration-300 group-focus-within:text-[#0091FF]"
                            style={{ color: '#94A3B8' }}
                          />
                          <Input
                            id="signup-password"
                            type="password"
                            placeholder="••••••••"
                            className="pl-11 h-12 rounded-xl transition-all duration-300 focus:ring-2 focus:ring-[#0091FF]/20 focus:border-[#0091FF] placeholder:text-slate-400"
                            style={{
                              backgroundColor: '#F8FAFC',
                              borderColor: 'rgba(0, 145, 255, 0.2)',
                              color: '#0F172A',
                            }}
                            value={signUpForm.password}
                            onChange={(e) => setSignUpForm({ ...signUpForm, password: e.target.value })}
                            required
                          />
                        </div>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.2, duration: 0.5 }}
                      >
                        <Button
                          type="submit"
                          className="w-full h-12 rounded-xl text-base font-semibold transition-all duration-300 group relative overflow-hidden text-white"
                          style={{
                            background: 'linear-gradient(135deg, #0091FF 0%, #00C2FF 100%)',
                            boxShadow: '0 4px 20px rgba(0, 145, 255, 0.35)',
                          }}
                          disabled={isLoading}
                        >
                          <span className="relative z-10 flex items-center justify-center gap-2">
                            {isLoading ? (
                              <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                              <>
                                Criar conta
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                              </>
                            )}
                          </span>
                          <motion.div
                            className="absolute inset-0"
                            style={{
                              background: 'linear-gradient(135deg, #00C2FF 0%, #0091FF 100%)',
                            }}
                            initial={{ opacity: 0 }}
                            whileHover={{ opacity: 1 }}
                            transition={{ duration: 0.3 }}
                          />
                        </Button>
                      </motion.div>
                    </form>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </motion.div>

          {/* Footer text */}
          <motion.p 
            className="text-center text-sm mt-8"
            style={{ color: '#64748B' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.3, duration: 0.5 }}
          >
            © 2025 WebMarcas. Todos os direitos reservados.
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
};

export default Auth;
