"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { passengerFormSchema, type PassengerFormInput } from "@/lib/validations/passengers";
import { updatePassengerAction } from "@/app/dashboard/passageiros/actions";

type PassengerFormProps = {
  passengerId: string;
  defaultValues: PassengerFormInput;
};

export function PassengerForm({ passengerId, defaultValues }: PassengerFormProps) {
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PassengerFormInput>({
    resolver: zodResolver(passengerFormSchema),
    defaultValues,
  });

  async function onSubmit(values: PassengerFormInput) {
    setFormError(null);

    const result = await updatePassengerAction(passengerId, values);
    if (!result.success) {
      setFormError(result.error);
      return;
    }

    router.push(`/dashboard/passageiros/${passengerId}`);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Dados do passageiro</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <Label htmlFor="nome">Nome completo</Label>
            <Input
              id="nome"
              placeholder="Nome do passageiro"
              aria-invalid={!!errors.nome}
              {...register("nome")}
            />
            {errors.nome && <p className="text-sm text-destructive">{errors.nome.message}</p>}
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="email@example.com"
              aria-invalid={!!errors.email}
              {...register("email")}
            />
            {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="telefone">Telefone</Label>
            <Input
              id="telefone"
              placeholder="(11) 98765-4321"
              aria-invalid={!!errors.telefone}
              {...register("telefone")}
            />
            {errors.telefone && (
              <p className="text-sm text-destructive">{errors.telefone.message}</p>
            )}
          </div>

          {formError && <p className="text-sm text-destructive sm:col-span-2">{formError}</p>}
        </CardContent>
        <CardFooter className="justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Salvando..." : "Salvar alterações"}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
