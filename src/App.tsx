import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { Suspense, lazy } from "react";
import ErrorBoundary from "@/components/ErrorBoundary";
import LoadingSpinner from "@/components/LoadingSpinner";

// Lazy load pages for better performance
const Index = lazy(() => import("./pages/Index"));
const Auth = lazy(() => import("./pages/Auth"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const NovoRegistro = lazy(() => import("./pages/NovoRegistro"));
const RegistroMarca = lazy(() => import("./pages/RegistroMarca"));
const Publicacao = lazy(() => import("./pages/Publicacao"));
const Usuarios = lazy(() => import("./pages/Usuarios"));
const Equipe = lazy(() => import("./pages/Equipe"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

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

const PageWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ErrorBoundary>
      <Suspense fallback={<LoadingSpinner fullScreen />}>
        {children}
      </Suspense>
    </ErrorBoundary>
  );
};

const AppRoutes = () => {
  return (
    <Routes>
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
      <Route path="*" element={<PageWrapper><NotFound /></PageWrapper>} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
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
  </QueryClientProvider>
);

export default App;
