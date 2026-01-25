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
import logoWebmarcas from '@/assets/logo-webmarcas-icon.png';

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
});

const signUpSchema = z.object({
  nome: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres').max(100),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
});

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
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#0a0a0a' }}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <Loader2 className="w-8 h-8" style={{ color: '#00f2ff' }} />
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
      className="min-h-screen flex flex-col lg:flex-row overflow-hidden"
      style={{ 
        backgroundColor: '#0a0a0a',
        fontFamily: "'Poppins', sans-serif"
      }}
    >
      {/* Animated Background Effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Cyan glow effect - top right */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          transition={{ duration: 2 }}
          className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(0,242,255,0.15) 0%, transparent 70%)',
            filter: 'blur(60px)',
          }}
        />
        {/* Secondary glow - bottom left */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          transition={{ duration: 2, delay: 0.5 }}
          className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(0,200,255,0.1) 0%, transparent 70%)',
            filter: 'blur(80px)',
          }}
        />
        {/* Floating particles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full"
            style={{
              backgroundColor: 'rgba(0,242,255,0.3)',
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.6, 0.2],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Left Panel - Branding (Hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-3/5 relative">
        <div className="relative z-10 flex flex-col justify-center px-12 xl:px-20 w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
          >
            {/* Logo */}
            <motion.div 
              className="flex items-center gap-4 mb-12"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <div 
                className="p-3 rounded-2xl"
                style={{
                  background: 'linear-gradient(135deg, rgba(0,242,255,0.2) 0%, rgba(0,180,220,0.1) 100%)',
                  border: '1px solid rgba(0,242,255,0.3)',
                  backdropFilter: 'blur(10px)',
                }}
              >
                <img src={logoWebmarcas} alt="WebMarcas" className="w-14 h-14 object-contain" />
              </div>
              <div>
                <h2 className="text-2xl font-bold" style={{ color: '#ffffff' }}>WebMarcas</h2>
                <p className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>Sistema de Premiação</p>
              </div>
            </motion.div>
            
            {/* Status badge */}
            <motion.div 
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-10"
              style={{
                background: 'rgba(0,242,255,0.1)',
                border: '1px solid rgba(0,242,255,0.2)',
              }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <span 
                className="w-2 h-2 rounded-full animate-pulse" 
                style={{ backgroundColor: '#00f2ff', boxShadow: '0 0 10px #00f2ff' }} 
              />
              <span className="text-sm font-medium" style={{ color: '#00f2ff' }}>Sistema Online</span>
            </motion.div>
            
            {/* Main heading with gradient text */}
            <motion.h1 
              className="text-4xl xl:text-5xl font-bold tracking-tight leading-[1.15] mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.6 }}
            >
              <span style={{ color: '#ffffff' }}>Gerencie sua equipe</span>
              <br />
              <span 
                style={{ 
                  background: 'linear-gradient(90deg, #00f2ff 0%, #00c4dc 50%, #0090b0 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                com eficiência
              </span>
            </motion.h1>
            
            <motion.p 
              className="text-lg max-w-md mb-12"
              style={{ color: 'rgba(148,163,184,1)' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.6 }}
            >
              Sistema completo de gestão de premiação para sua equipe de vendas.
            </motion.p>

            {/* Benefits list */}
            <div className="space-y-4">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={benefit.text}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.0 + index * 0.15, duration: 0.5 }}
                  className="flex items-center gap-4 group"
                >
                  <div 
                    className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                    style={{
                      background: 'rgba(0,242,255,0.1)',
                      border: '1px solid rgba(0,242,255,0.2)',
                    }}
                  >
                    <benefit.icon className="w-5 h-5" style={{ color: '#00f2ff' }} />
                  </div>
                  <span className="font-medium" style={{ color: 'rgba(255,255,255,0.8)' }}>{benefit.text}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Decorative elements */}
        <motion.div 
          className="absolute bottom-20 right-20 w-64 h-64 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(0,242,255,0.05) 0%, transparent 70%)',
          }}
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Right Panel - Auth Form */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 lg:p-12 min-h-screen lg:min-h-0 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="w-full max-w-[420px]"
        >
          {/* Mobile header */}
          <motion.div 
            className="lg:hidden mb-10 text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div 
              className="inline-flex items-center justify-center p-4 rounded-2xl mb-4"
              style={{
                background: 'linear-gradient(135deg, rgba(0,242,255,0.2) 0%, rgba(0,180,220,0.1) 100%)',
                border: '1px solid rgba(0,242,255,0.3)',
              }}
            >
              <img src={logoWebmarcas} alt="WebMarcas" className="w-14 h-14 object-contain" />
            </div>
            <h1 className="text-2xl font-bold" style={{ color: '#ffffff' }}>WebMarcas</h1>
            <p className="text-sm mt-1" style={{ color: 'rgba(148,163,184,1)' }}>Sistema de Premiação</p>
          </motion.div>

          {/* Desktop logo */}
          <motion.div 
            className="hidden lg:flex items-center justify-center gap-3 mb-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <img src={logoWebmarcas} alt="WebMarcas" className="w-12 h-12 object-contain" />
            <span className="text-xl font-bold tracking-tight" style={{ color: '#ffffff' }}>WebMarcas</span>
          </motion.div>

          {/* Glassmorphism Card */}
          <Card 
            className="border shadow-2xl overflow-hidden"
            style={{
              backgroundColor: 'rgba(255,255,255,0.03)',
              borderColor: 'rgba(255,255,255,0.08)',
              backdropFilter: 'blur(20px)',
            }}
          >
            <CardHeader className="text-center pb-2 pt-8">
              <motion.h2 
                className="text-2xl font-semibold"
                style={{ color: '#ffffff' }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.4 }}
              >
                Bem-vindo
              </motion.h2>
              <motion.p 
                className="text-sm mt-1"
                style={{ color: 'rgba(148,163,184,1)' }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.4 }}
              >
                Entre para acessar o sistema
              </motion.p>
            </CardHeader>

            <CardContent className="pt-6 pb-8 px-6">
              <Tabs defaultValue="login" className="w-full">
                <TabsList 
                  className="grid w-full grid-cols-2 mb-6 h-12 rounded-xl p-1"
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.08)',
                  }}
                >
                  <TabsTrigger 
                    value="login" 
                    className="gap-2 text-sm font-medium rounded-lg h-10 transition-all duration-300 data-[state=active]:shadow-lg"
                    style={{
                      color: 'rgba(255,255,255,0.7)',
                    }}
                  >
                    <LogIn className="w-4 h-4" />
                    Entrar
                  </TabsTrigger>
                  <TabsTrigger 
                    value="signup" 
                    className="gap-2 text-sm font-medium rounded-lg h-10 transition-all duration-300 data-[state=active]:shadow-lg"
                    style={{
                      color: 'rgba(255,255,255,0.7)',
                    }}
                  >
                    <UserPlus className="w-4 h-4" />
                    Cadastrar
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="login" className="space-y-4 mt-0">
                  <form onSubmit={handleLogin} className="space-y-5">
                    <div className="space-y-2">
                      <Label htmlFor="login-email" className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.8)' }}>Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'rgba(148,163,184,1)' }} />
                        <Input
                          id="login-email"
                          type="email"
                          placeholder="seu@email.com"
                          className="pl-11 h-12 rounded-xl transition-all duration-300 focus:ring-2"
                          style={{
                            backgroundColor: 'rgba(255,255,255,0.05)',
                            borderColor: 'rgba(255,255,255,0.1)',
                            color: '#ffffff',
                          }}
                          value={loginForm.email}
                          onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="login-password" className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.8)' }}>Senha</Label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'rgba(148,163,184,1)' }} />
                        <Input
                          id="login-password"
                          type="password"
                          placeholder="••••••••"
                          className="pl-11 h-12 rounded-xl transition-all duration-300 focus:ring-2"
                          style={{
                            backgroundColor: 'rgba(255,255,255,0.05)',
                            borderColor: 'rgba(255,255,255,0.1)',
                            color: '#ffffff',
                          }}
                          value={loginForm.password}
                          onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button 
                        type="submit" 
                        className="w-full h-12 text-base font-semibold rounded-xl gap-2 transition-all duration-300"
                        style={{
                          background: 'linear-gradient(135deg, #00f2ff 0%, #00c4dc 100%)',
                          color: '#0a0a0a',
                          boxShadow: '0 0 30px rgba(0,242,255,0.3)',
                        }}
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <>
                            Entrar
                            <ArrowRight className="w-5 h-5" />
                          </>
                        )}
                      </Button>
                    </motion.div>
                  </form>
                </TabsContent>

                <TabsContent value="signup" className="space-y-4 mt-0">
                  <form onSubmit={handleSignUp} className="space-y-5">
                    <div className="space-y-2">
                      <Label htmlFor="signup-nome" className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.8)' }}>Nome Completo</Label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'rgba(148,163,184,1)' }} />
                        <Input 
                          id="signup-nome" 
                          type="text" 
                          placeholder="Seu nome" 
                          className="pl-11 h-12 rounded-xl transition-all duration-300 focus:ring-2"
                          style={{
                            backgroundColor: 'rgba(255,255,255,0.05)',
                            borderColor: 'rgba(255,255,255,0.1)',
                            color: '#ffffff',
                          }}
                          value={signUpForm.nome} 
                          onChange={(e) => setSignUpForm({ ...signUpForm, nome: e.target.value })} 
                          required 
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signup-email" className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.8)' }}>Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'rgba(148,163,184,1)' }} />
                        <Input 
                          id="signup-email" 
                          type="email" 
                          placeholder="seu@email.com" 
                          className="pl-11 h-12 rounded-xl transition-all duration-300 focus:ring-2"
                          style={{
                            backgroundColor: 'rgba(255,255,255,0.05)',
                            borderColor: 'rgba(255,255,255,0.1)',
                            color: '#ffffff',
                          }}
                          value={signUpForm.email} 
                          onChange={(e) => setSignUpForm({ ...signUpForm, email: e.target.value })} 
                          required 
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signup-password" className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.8)' }}>Senha</Label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'rgba(148,163,184,1)' }} />
                        <Input 
                          id="signup-password" 
                          type="password" 
                          placeholder="••••••••" 
                          className="pl-11 h-12 rounded-xl transition-all duration-300 focus:ring-2"
                          style={{
                            backgroundColor: 'rgba(255,255,255,0.05)',
                            borderColor: 'rgba(255,255,255,0.1)',
                            color: '#ffffff',
                          }}
                          value={signUpForm.password} 
                          onChange={(e) => setSignUpForm({ ...signUpForm, password: e.target.value })} 
                          required 
                        />
                      </div>
                    </div>

                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button 
                        type="submit" 
                        className="w-full h-12 text-base font-semibold rounded-xl gap-2 transition-all duration-300"
                        style={{
                          background: 'linear-gradient(135deg, #00f2ff 0%, #00c4dc 100%)',
                          color: '#0a0a0a',
                          boxShadow: '0 0 30px rgba(0,242,255,0.3)',
                        }}
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <>
                            Criar Conta
                            <ArrowRight className="w-5 h-5" />
                          </>
                        )}
                      </Button>
                    </motion.div>

                    <p className="text-xs text-center pt-2" style={{ color: 'rgba(148,163,184,0.7)' }}>
                      O primeiro usuário será automaticamente Administrador
                    </p>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <motion.p 
            className="text-center text-xs mt-8"
            style={{ color: 'rgba(148,163,184,0.5)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
          >
            © 2025 WebMarcas. Todos os direitos reservados.
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
};

export default Auth;
