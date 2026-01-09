import React from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { FileText, MoreHorizontal } from 'lucide-react';

interface Registration {
  id: string;
  nome_cliente: string;
  nome_marca: string;
  tipo_premiacao: 'registro' | 'publicacao';
  forma_pagamento: 'avista' | 'parcelado' | 'promocao';
  quantidade: number;
  data_referencia: string;
}

interface RecentRegistrationsTableProps {
  registrations: Registration[];
  className?: string;
}

const RecentRegistrationsTable: React.FC<RecentRegistrationsTableProps> = ({
  registrations,
  className,
}) => {
  if (registrations.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className={cn(
          "bg-card rounded-2xl p-8 border border-border/50 text-center",
          "shadow-[0_4px_24px_-4px_hsl(210_60%_15%/0.08)]",
          className
        )}
      >
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
            <FileText className="w-8 h-8 text-muted-foreground" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground mb-1">
              Nenhum cadastro encontrado
            </h3>
            <p className="text-sm text-muted-foreground">
              Os registros aparecerão aqui quando forem adicionados
            </p>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className={cn(
        "bg-card rounded-2xl border border-border/50 overflow-hidden",
        "shadow-[0_4px_24px_-4px_hsl(210_60%_15%/0.08)]",
        className
      )}
    >
      <div className="p-6 border-b border-border/50">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-foreground">Últimos Cadastros</h3>
          <span className="text-sm text-muted-foreground">
            {registrations.length} registros
          </span>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border/50 bg-muted/30">
              <th className="text-left py-3 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Cliente
              </th>
              <th className="text-left py-3 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Marca
              </th>
              <th className="text-left py-3 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Tipo
              </th>
              <th className="text-left py-3 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Pagamento
              </th>
              <th className="text-left py-3 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Qtd
              </th>
              <th className="text-left py-3 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Data
              </th>
            </tr>
          </thead>
          <tbody>
            {registrations.slice(0, 5).map((reg, index) => (
              <motion.tr
                key={reg.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index + 0.5 }}
                className="border-b border-border/30 hover:bg-muted/20 transition-colors duration-200"
              >
                <td className="py-4 px-6">
                  <span className="font-medium text-foreground">
                    {reg.nome_cliente}
                  </span>
                </td>
                <td className="py-4 px-6 text-muted-foreground">
                  {reg.nome_marca}
                </td>
                <td className="py-4 px-6">
                  <span
                    className={cn(
                      "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold",
                      reg.tipo_premiacao === 'registro'
                        ? 'bg-primary/10 text-primary'
                        : 'bg-accent/10 text-accent'
                    )}
                  >
                    {reg.tipo_premiacao === 'registro' ? 'Registro' : 'Publicação'}
                  </span>
                </td>
                <td className="py-4 px-6">
                  <span
                    className={cn(
                      "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold",
                      reg.forma_pagamento === 'avista'
                        ? 'bg-success/10 text-success'
                        : reg.forma_pagamento === 'parcelado'
                        ? 'bg-warning/10 text-warning'
                        : 'bg-muted text-muted-foreground'
                    )}
                  >
                    {reg.forma_pagamento === 'avista' 
                      ? 'À Vista' 
                      : reg.forma_pagamento === 'parcelado'
                      ? 'Parcelado'
                      : 'Promoção'}
                  </span>
                </td>
                <td className="py-4 px-6">
                  <span className="font-semibold text-foreground">
                    {reg.quantidade}
                  </span>
                </td>
                <td className="py-4 px-6 text-sm text-muted-foreground">
                  {format(new Date(reg.data_referencia), 'dd/MM/yyyy')}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default RecentRegistrationsTable;
