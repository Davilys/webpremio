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
import { LogIn, UserPlus, Mail, Lock, User, Loader2, ArrowRight, CheckCircle2 } from 'lucide-react';
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
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-primary animate-spin" />
      </div>
    );
  }

  const benefits = [
    'Gestão de Registros de Marca',
    'Controle de Publicações',
    'Cálculo Automático de Bônus',
    'Dashboard em Tempo Real',
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col lg:flex-row">
      {/* Left Panel - Branding (Hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-3/5 bg-gradient-to-br from-primary via-primary to-accent relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div 
            className="absolute inset-0" 
            style={{ 
              backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
              backgroundSize: '20px 20px'
            }} 
          />
        </div>
        
        <div className="relative z-10 flex flex-col justify-center px-12 xl:px-20 text-primary-foreground">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <div className="flex items-center gap-4 mb-10">
              <img src={logoWebmarcas} alt="WebMarcas" className="w-16 h-16 object-contain" />
              <div>
                <h2 className="text-2xl font-bold text-white">WebMarcas</h2>
                <p className="text-white/70 text-sm">Sistema de Premiação</p>
              </div>
            </div>
            
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 mb-10">
              <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
              <span className="text-sm font-medium text-white/80">Sistema Online</span>
            </div>
            
            <h1 className="text-4xl xl:text-5xl font-bold tracking-tight leading-[1.1] mb-6 text-white">
              Gerencie sua<br />
              <span className="text-white/80">equipe com eficiência</span>
            </h1>
            
            <p className="text-lg text-white/70 max-w-md mb-12">
              Sistema completo de gestão de premiação para sua equipe de vendas.
            </p>

            <div className="space-y-3">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={benefit}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.1, duration: 0.4 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
                    <CheckCircle2 className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-white/80 text-sm">{benefit}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="absolute -bottom-20 -right-20 w-80 h-80 rounded-full bg-white/5" />
        <div className="absolute top-1/4 -right-10 w-40 h-40 rounded-full bg-white/10" />
      </div>

      {/* Right Panel - Auth Form (Full screen on mobile) */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 lg:p-12 min-h-screen lg:min-h-0">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-[400px]"
        >
          {/* Mobile header with gradient */}
          <div className="lg:hidden mb-8 text-center">
            <div className="inline-flex items-center justify-center gap-3 p-4 rounded-2xl bg-gradient-to-br from-primary to-accent mb-4">
              <img src={logoWebmarcas} alt="WebMarcas" className="w-12 h-12 object-contain" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">WebMarcas</h1>
            <p className="text-sm text-muted-foreground mt-1">Sistema de Premiação</p>
          </div>

          {/* Desktop logo */}
          <div className="hidden lg:flex items-center justify-center gap-3 mb-8">
            <img src={logoWebmarcas} alt="WebMarcas" className="w-12 h-12 object-contain" />
            <span className="text-xl font-bold text-foreground tracking-tight">WebMarcas</span>
          </div>

          <Card className="border-border/50 shadow-lg">
            <CardHeader className="text-center pb-2 pt-6">
              <h2 className="text-xl font-semibold text-foreground">Bem-vindo</h2>
              <p className="text-sm text-muted-foreground">Entre para acessar o sistema</p>
            </CardHeader>

            <CardContent className="pt-4 pb-6">
              <Tabs defaultValue="login" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6 bg-secondary h-12 rounded-xl p-1">
                  <TabsTrigger 
                    value="login" 
                    className="gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm text-sm font-medium rounded-lg h-10"
                  >
                    <LogIn className="w-4 h-4" />
                    Entrar
                  </TabsTrigger>
                  <TabsTrigger 
                    value="signup" 
                    className="gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm text-sm font-medium rounded-lg h-10"
                  >
                    <UserPlus className="w-4 h-4" />
                    Cadastrar
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="login" className="space-y-4 mt-0">
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="login-email" className="text-sm font-medium text-foreground">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="login-email"
                          type="email"
                          placeholder="seu@email.com"
                          className="pl-11"
                          value={loginForm.email}
                          onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="login-password" className="text-sm font-medium text-foreground">Senha</Label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="login-password"
                          type="password"
                          placeholder="••••••••"
                          className="pl-11"
                          value={loginForm.password}
                          onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    <Button type="submit" size="xl" className="w-full gap-2" disabled={isLoading}>
                      {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Entrar <ArrowRight className="w-4 h-4" /></>}
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="signup" className="space-y-4 mt-0">
                  <form onSubmit={handleSignUp} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signup-nome" className="text-sm font-medium text-foreground">Nome Completo</Label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input id="signup-nome" type="text" placeholder="Seu nome" className="pl-11" value={signUpForm.nome} onChange={(e) => setSignUpForm({ ...signUpForm, nome: e.target.value })} required />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signup-email" className="text-sm font-medium text-foreground">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input id="signup-email" type="email" placeholder="seu@email.com" className="pl-11" value={signUpForm.email} onChange={(e) => setSignUpForm({ ...signUpForm, email: e.target.value })} required />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signup-password" className="text-sm font-medium text-foreground">Senha</Label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input id="signup-password" type="password" placeholder="••••••••" className="pl-11" value={signUpForm.password} onChange={(e) => setSignUpForm({ ...signUpForm, password: e.target.value })} required />
                      </div>
                    </div>

                    <Button type="submit" size="xl" className="w-full gap-2" disabled={isLoading}>
                      {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Criar Conta <ArrowRight className="w-4 h-4" /></>}
                    </Button>

                    <p className="text-xs text-center text-muted-foreground pt-2">
                      O primeiro usuário será automaticamente Administrador
                    </p>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <p className="text-center text-muted-foreground text-xs mt-8">
            © 2025 WebMarcas. Todos os direitos reservados.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Auth;
