"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { couponFormSchema, type CouponFormInput } from "@/lib/validations/coupons";
import { createCouponAction } from "@/app/dashboard/cupons/actions";

const EMPTY_VALUES: CouponFormInput = {
  codigo: "",
  tipoDesconto: "percentual",
  valor: 0,
};

export function CouponForm() {
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CouponFormInput>({
    resolver: zodResolver(couponFormSchema),
    defaultValues: EMPTY_VALUES,
  });

  async function onSubmit(values: CouponFormInput) {
    setFormError(null);

    const result = await createCouponAction(values);
    if (!result.success) {
      setFormError(result.error);
      return;
    }

    router.push("/dashboard/cupons");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Dados do cupom</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <Label htmlFor="codigo">Código</Label>
            <Input
              id="codigo"
              placeholder="BEMVINDO10"
              className="font-mono uppercase"
              aria-invalid={!!errors.codigo}
              {...register("codigo")}
            />
            {errors.codigo && <p className="text-sm text-destructive">{errors.codigo.message}</p>}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="tipoDesconto">Tipo de desconto</Label>
            <select
              id="tipoDesconto"
              className="h-9 rounded-md border border-input bg-transparent px-3 text-sm shadow-xs outline-none focus-visible:ring-2 focus-visible:ring-ring"
              {...register("tipoDesconto")}
            >
              <option value="percentual">Percentual (%)</option>
              <option value="fixo">Valor fixo (R$)</option>
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="valor">Valor</Label>
            <Input
              id="valor"
              type="number"
              step="0.01"
              placeholder="10"
              aria-invalid={!!errors.valor}
              {...register("valor", { valueAsNumber: true })}
            />
            {errors.valor && <p className="text-sm text-destructive">{errors.valor.message}</p>}
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
            {isSubmitting ? "Salvando..." : "Criar cupom"}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
