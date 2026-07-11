"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateTarifaPadraoAction, type TarifaPadraoInput } from "@/app/dashboard/preco/actions";

const schema = z.object({
  taxaBase: z.number().min(0, "Não pode ser negativo"),
  valorPorKm: z.number().min(0, "Não pode ser negativo"),
  valorPorMinuto: z.number().min(0, "Não pode ser negativo"),
  valorMinimo: z.number().min(0, "Não pode ser negativo"),
});

type TarifaPadraoFormProps = {
  defaultValues: TarifaPadraoInput;
};

const FIELDS: { name: keyof TarifaPadraoInput; label: string }[] = [
  { name: "taxaBase", label: "Taxa base (R$)" },
  { name: "valorPorKm", label: "Valor por km (R$)" },
  { name: "valorPorMinuto", label: "Valor por minuto (R$)" },
  { name: "valorMinimo", label: "Valor mínimo (R$)" },
];

/**
 * Único bloco de preço que os apps de motorista/passageiro de fato leem
 * (`GET /pricing`) — por isso é o único editável aqui. Bandeiras/preços
 * dinâmicos abaixo continuam só vitrine (nenhum app consome ainda).
 */
export function TarifaPadraoForm({ defaultValues }: TarifaPadraoFormProps) {
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TarifaPadraoInput>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  async function onSubmit(values: TarifaPadraoInput) {
    setStatus("idle");
    setErrorMessage(null);

    const result = await updateTarifaPadraoAction(values);

    if (result.success) {
      setStatus("success");
    } else {
      setStatus("error");
      setErrorMessage(result.error);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      {FIELDS.map((field) => (
        <div key={field.name} className="flex flex-col gap-1.5">
          <Label htmlFor={field.name}>{field.label}</Label>
          <Input
            id={field.name}
            type="number"
            step="0.01"
            min="0"
            {...register(field.name, { valueAsNumber: true })}
          />
          {errors[field.name] ? (
            <span className="text-xs text-destructive">{errors[field.name]?.message}</span>
          ) : null}
        </div>
      ))}

      {status === "success" ? (
        <span className="text-sm text-emerald-600">
          Tarifa atualizada — já vale pros apps do motorista e do passageiro.
        </span>
      ) : null}
      {status === "error" ? (
        <span className="text-sm text-destructive">{errorMessage}</span>
      ) : null}

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Salvando..." : "Salvar tarifa"}
      </Button>
    </form>
  );
}
