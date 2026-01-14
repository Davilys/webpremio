import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format, isSameMonth } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon, Pencil, Lock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import type { Database } from "@/integrations/supabase/types";

type Registration = Database["public"]["Tables"]["registrations"]["Row"];
type PaymentMethod = Database["public"]["Enums"]["payment_method"];
type PublicationType = Database["public"]["Enums"]["publication_type"];

const baseSchema = z.object({
  nome_cliente: z.string().min(1, "Nome do cliente é obrigatório").max(200),
  nome_marca: z.string().min(1, "Nome da marca é obrigatório").max(200),
  quantidade: z.coerce.number().min(1, "Quantidade mínima é 1"),
  forma_pagamento: z.enum(["avista", "parcelado", "promocao"]),
  data_referencia: z.date({ required_error: "Data é obrigatória" }),
  observacoes: z.string().max(500).optional(),
  valor_promocao: z.coerce.number().optional(),
});

const publicacaoSchema = baseSchema.extend({
  tipo_publicacao: z.enum([
    "exigencia_merito",
    "recurso",
    "notificacao_extrajudicial",
    "oposicao",
    "deferimento",
    "indeferimento",
    "codigo_003",
  ]),
});

type BaseFormData = z.infer<typeof baseSchema>;
type PublicacaoFormData = z.infer<typeof publicacaoSchema>;

interface EditRegistrationModalProps {
  registration: Registration;
  type: "registro" | "publicacao";
  onSuccess: () => void;
}

const PAYMENT_LABELS: Record<PaymentMethod, string> = {
  avista: "À Vista",
  parcelado: "Parcelado",
  promocao: "Promoção",
};

const PUBLICATION_LABELS: Record<PublicationType, string> = {
  exigencia_merito: "Exigência de Mérito",
  recurso: "Recurso",
  notificacao_extrajudicial: "Notificação Extrajudicial",
  oposicao: "Oposição",
  deferimento: "Deferimento",
  indeferimento: "Indeferimento",
  codigo_003: "Código 003",
};

export const canEditRegistration = (dataReferencia: string): boolean => {
  const registrationDate = new Date(dataReferencia + "T00:00:00");
  const now = new Date();
  return isSameMonth(registrationDate, now);
};

export function EditRegistrationModal({
  registration,
  type,
  onSuccess,
}: EditRegistrationModalProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const canEdit = canEditRegistration(registration.data_referencia);
  const schema = type === "publicacao" ? publicacaoSchema : baseSchema;

  const form = useForm<BaseFormData | PublicacaoFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      nome_cliente: registration.nome_cliente,
      nome_marca: registration.nome_marca,
      quantidade: registration.quantidade,
      forma_pagamento: registration.forma_pagamento,
      data_referencia: new Date(registration.data_referencia + "T00:00:00"),
      observacoes: registration.observacoes || "",
      valor_promocao: registration.valor_promocao || undefined,
      ...(type === "publicacao" && registration.tipo_publicacao
        ? { tipo_publicacao: registration.tipo_publicacao }
        : {}),
    },
  });

  const formaPagamento = form.watch("forma_pagamento");

  useEffect(() => {
    if (open) {
      form.reset({
        nome_cliente: registration.nome_cliente,
        nome_marca: registration.nome_marca,
        quantidade: registration.quantidade,
        forma_pagamento: registration.forma_pagamento,
        data_referencia: new Date(registration.data_referencia + "T00:00:00"),
        observacoes: registration.observacoes || "",
        valor_promocao: registration.valor_promocao || undefined,
        ...(type === "publicacao" && registration.tipo_publicacao
          ? { tipo_publicacao: registration.tipo_publicacao }
          : {}),
      });
    }
  }, [open, registration, form, type]);

  const onSubmit = async (data: BaseFormData | PublicacaoFormData) => {
    setIsSubmitting(true);

    try {
      const updateData: Partial<Registration> = {
        nome_cliente: data.nome_cliente.trim(),
        nome_marca: data.nome_marca.trim(),
        quantidade: data.quantidade,
        forma_pagamento: data.forma_pagamento,
        data_referencia: format(data.data_referencia, "yyyy-MM-dd"),
        observacoes: data.observacoes?.trim() || null,
        valor_promocao:
          data.forma_pagamento === "promocao" ? data.valor_promocao : null,
      };

      if (type === "publicacao" && "tipo_publicacao" in data) {
        updateData.tipo_publicacao = data.tipo_publicacao;
      }

      const { error } = await supabase
        .from("registrations")
        .update(updateData)
        .eq("id", registration.id);

      if (error) throw error;

      toast({
        title: "Registro atualizado",
        description: "As alterações foram salvas com sucesso.",
      });

      setOpen(false);
      onSuccess();
    } catch (error) {
      console.error("Erro ao atualizar registro:", error);
      toast({
        title: "Erro ao atualizar",
        description: "Não foi possível salvar as alterações.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!canEdit) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" disabled className="opacity-50">
              <Lock className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Edição bloqueada - mês encerrado</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Pencil className="h-5 w-5" />
            Editar {type === "registro" ? "Registro de Marca" : "Publicação"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="nome_cliente"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do Cliente *</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Nome completo do cliente" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="nome_marca"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome da Marca *</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Nome da marca" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {type === "publicacao" && (
              <FormField
                control={form.control}
                name="tipo_publicacao"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Publicação *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o tipo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.entries(PUBLICATION_LABELS).map(
                          ([value, label]) => (
                            <SelectItem key={value} value={value}>
                              {label}
                            </SelectItem>
                          )
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="quantidade"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantidade *</FormLabel>
                    <FormControl>
                      <Input type="number" min={1} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="forma_pagamento"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Forma de Pagamento *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.entries(PAYMENT_LABELS).map(([value, label]) => (
                          <SelectItem key={value} value={value}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {formaPagamento === "promocao" && (
              <FormField
                control={form.control}
                name="valor_promocao"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valor da Promoção (R$) *</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        min={0}
                        placeholder="0,00"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="data_referencia"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Data *</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "dd/MM/yyyy", { locale: ptBR })
                          ) : (
                            <span>Selecione a data</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        locale={ptBR}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="observacoes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observações</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Observações adicionais (opcional)"
                      rows={3}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Salvando..." : "Salvar Alterações"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
