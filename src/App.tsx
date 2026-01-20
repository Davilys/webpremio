import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { Suspense, lazy } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ErrorBoundary from "@/components/ErrorBoundary";
import LoadingSpinner from "@/components/LoadingSpinner";

// Lazy load pages for better performance
const Index = lazy(() => import("./pages/Index"));
const Auth = lazy(() => import("./pages/Auth"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const NovoRegistro = lazy(() => import("./pages/NovoRegistro"));
const RegistroMarca = lazy(() => import("./pages/RegistroMarca"));
const Publicacao = lazy(() => import("./pages/Publicacao"));
const Devedores = lazy(() => import("./pages/Devedores"));
const NovoDevedor = lazy(() => import("./pages/NovoDevedor"));
const Usuarios = lazy(() => import("./pages/Usuarios"));
const Equipe = lazy(() => import("./pages/Equipe"));
const Configuracoes = lazy(() => import("./pages/Configuracoes"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const pageTransition = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: { duration: 0.25, ease: [0.4, 0, 0.2, 1] as const }
};

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner fullScreen message="Verificando autenticação..." />;
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
};

const AnimatedPage: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <motion.div
      initial={pageTransition.initial}
      animate={pageTransition.animate}
      exit={pageTransition.exit}
      transition={pageTransition.transition}
      className="w-full h-full"
    >
      {children}
    </motion.div>
  );
};

const PageWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ErrorBoundary>
      <Suspense fallback={<LoadingSpinner fullScreen />}>
        <AnimatedPage>
          {children}
        </AnimatedPage>
      </Suspense>
    </ErrorBoundary>
  );
};

const AppRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageWrapper><Index /></PageWrapper>} />
        <Route path="/auth" element={<PageWrapper><Auth /></PageWrapper>} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <PageWrapper><Dashboard /></PageWrapper>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/novo"
          element={
            <ProtectedRoute>
              <PageWrapper><NovoRegistro /></PageWrapper>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/registro"
          element={
            <ProtectedRoute>
              <PageWrapper><RegistroMarca /></PageWrapper>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/publicacao"
          element={
            <ProtectedRoute>
              <PageWrapper><Publicacao /></PageWrapper>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/devedores"
          element={
            <ProtectedRoute>
              <PageWrapper><Devedores /></PageWrapper>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/novo-devedor"
          element={
            <ProtectedRoute>
              <PageWrapper><NovoDevedor /></PageWrapper>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/usuarios"
          element={
            <ProtectedRoute>
              <PageWrapper><Usuarios /></PageWrapper>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/equipe"
          element={
            <ProtectedRoute>
              <PageWrapper><Equipe /></PageWrapper>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/configuracoes"
          element={
            <ProtectedRoute>
              <PageWrapper><Configuracoes /></PageWrapper>
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<PageWrapper><NotFound /></PageWrapper>} />
      </Routes>
    </AnimatePresence>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <ErrorBoundary>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AuthProvider>
              <AppRoutes />
            </AuthProvider>
          </BrowserRouter>
        </ErrorBoundary>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
