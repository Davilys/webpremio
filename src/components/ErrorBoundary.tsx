import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home, WifiOff } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  isChunkLoadError = (): boolean => {
    const errorMessage = this.state.error?.message || '';
    return (
      errorMessage.includes('Failed to fetch dynamically imported module') ||
      errorMessage.includes('Loading chunk') ||
      errorMessage.includes('ChunkLoadError') ||
      errorMessage.includes('Loading CSS chunk')
    );
  };

  handleRetry = () => {
    if (this.isChunkLoadError()) {
      // Force a full page reload to clear cached chunks
      window.location.reload();
    } else {
      this.setState({ hasError: false, error: null, errorInfo: null });
    }
  };

  handleGoHome = () => {
    window.location.href = '/dashboard';
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const isChunkError = this.isChunkLoadError();

      return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
          <div className="max-w-md w-full bg-card rounded-xl p-8 card-shadow text-center space-y-6">
            <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center ${
              isChunkError ? 'bg-amber-500/10' : 'bg-destructive/10'
            }`}>
              {isChunkError ? (
                <WifiOff className="w-8 h-8 text-amber-500" />
              ) : (
                <AlertTriangle className="w-8 h-8 text-destructive" />
              )}
            </div>
            
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-foreground">
                {isChunkError ? 'Conexão Interrompida' : 'Algo deu errado'}
              </h1>
              <p className="text-muted-foreground">
                {isChunkError 
                  ? 'A página não pôde ser carregada. Isso geralmente acontece por uma atualização do sistema ou conexão instável.'
                  : 'Ocorreu um erro inesperado. Por favor, tente novamente ou volte para a página inicial.'}
              </p>
            </div>

            {process.env.NODE_ENV === 'development' && this.state.error && !isChunkError && (
              <div className="p-4 rounded-lg bg-muted text-left overflow-auto max-h-40">
                <p className="text-sm font-mono text-destructive">
                  {this.state.error.toString()}
                </p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button onClick={this.handleRetry} variant="outline" className="gap-2">
                <RefreshCw className="w-4 h-4" />
                {isChunkError ? 'Recarregar Página' : 'Tentar Novamente'}
              </Button>
              {!isChunkError && (
                <Button onClick={this.handleGoHome} className="gap-2">
                  <Home className="w-4 h-4" />
                  Ir para Dashboard
                </Button>
              )}
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
