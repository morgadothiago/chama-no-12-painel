"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { driverFormSchema, type DriverFormInput } from "@/lib/validations/drivers";
import { createDriverAction, updateDriverAction } from "@/app/dashboard/motoristas/actions";

type DriverFormProps = {
  mode: "create" | "edit";
  driverId?: string;
  defaultValues?: DriverFormInput;
};

const EMPTY_VALUES: DriverFormInput = {
  nome: "",
  email: "",
  telefone: "",
  cnh: "",
  veiculo: { placa: "", modelo: "", ano: new Date().getFullYear() },
  endereco: { cep: "", logradouro: "", numero: "", bairro: "", cidade: "", uf: "" },
};

export function DriverForm({ mode, driverId, defaultValues }: DriverFormProps) {
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<DriverFormInput>({
    resolver: zodResolver(driverFormSchema),
    defaultValues: defaultValues ?? EMPTY_VALUES,
  });

  async function onSubmit(values: DriverFormInput) {
    setFormError(null);

    const result =
      mode === "create"
        ? await createDriverAction(values)
        : await updateDriverAction(driverId as string, values);

    if (!result.success) {
      setFormError(result.error);
      return;
    }

    router.push(`/dashboard/motoristas/${result.data.id}`);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Dados do motorista</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="nome">Nome completo</Label>
              <Input
                id="nome"
                placeholder="Nome do motorista"
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
            <div className="flex flex-col gap-2">
              <Label htmlFor="cnh">CNH</Label>
              <Input
                id="cnh"
                placeholder="Número da CNH"
                aria-invalid={!!errors.cnh}
                {...register("cnh")}
              />
              {errors.cnh && <p className="text-sm text-destructive">{errors.cnh.message}</p>}
            </div>
          </div>

          <div className="flex flex-col gap-1.5 border-t border-border pt-4">
            <span className="text-sm font-medium">Veículo</span>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="flex flex-col gap-2">
                <Label htmlFor="placa">Placa</Label>
                <Input
                  id="placa"
                  placeholder="ABC1D23"
                  aria-invalid={!!errors.veiculo?.placa}
                  {...register("veiculo.placa")}
                />
                {errors.veiculo?.placa && (
                  <p className="text-sm text-destructive">{errors.veiculo.placa.message}</p>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="modelo">Modelo</Label>
                <Input
                  id="modelo"
                  placeholder="Chevrolet Onix"
                  aria-invalid={!!errors.veiculo?.modelo}
                  {...register("veiculo.modelo")}
                />
                {errors.veiculo?.modelo && (
                  <p className="text-sm text-destructive">{errors.veiculo.modelo.message}</p>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="ano">Ano</Label>
                <Input
                  id="ano"
                  type="number"
                  placeholder="2023"
                  aria-invalid={!!errors.veiculo?.ano}
                  {...register("veiculo.ano", { valueAsNumber: true })}
                />
                {errors.veiculo?.ano && (
                  <p className="text-sm text-destructive">{errors.veiculo.ano.message}</p>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-1.5 border-t border-border pt-4">
            <span className="text-sm font-medium">Endereço</span>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <Label htmlFor="cep">CEP</Label>
                <Input id="cep" placeholder="01310100" aria-invalid={!!errors.endereco?.cep} {...register("endereco.cep")} />
                {errors.endereco?.cep && <p className="text-sm text-destructive">{errors.endereco.cep.message}</p>}
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="numero">Número</Label>
                <Input id="numero" placeholder="1000" aria-invalid={!!errors.endereco?.numero} {...register("endereco.numero")} />
                {errors.endereco?.numero && <p className="text-sm text-destructive">{errors.endereco.numero.message}</p>}
              </div>
              <div className="flex flex-col gap-2 sm:col-span-2">
                <Label htmlFor="logradouro">Logradouro</Label>
                <Input id="logradouro" placeholder="Av. Paulista" aria-invalid={!!errors.endereco?.logradouro} {...register("endereco.logradouro")} />
                {errors.endereco?.logradouro && <p className="text-sm text-destructive">{errors.endereco.logradouro.message}</p>}
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="bairro">Bairro</Label>
                <Input id="bairro" placeholder="Bela Vista" aria-invalid={!!errors.endereco?.bairro} {...register("endereco.bairro")} />
                {errors.endereco?.bairro && <p className="text-sm text-destructive">{errors.endereco.bairro.message}</p>}
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="cidade">Cidade</Label>
                <Input id="cidade" placeholder="São Paulo" aria-invalid={!!errors.endereco?.cidade} {...register("endereco.cidade")} />
                {errors.endereco?.cidade && <p className="text-sm text-destructive">{errors.endereco.cidade.message}</p>}
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="uf">UF</Label>
                <Input id="uf" placeholder="SP" maxLength={2} aria-invalid={!!errors.endereco?.uf} {...register("endereco.uf")} />
                {errors.endereco?.uf && <p className="text-sm text-destructive">{errors.endereco.uf.message}</p>}
              </div>
            </div>
          </div>

          {formError && <p className="text-sm text-destructive">{formError}</p>}
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
            {isSubmitting
              ? "Salvando..."
              : mode === "create"
                ? "Cadastrar motorista"
                : "Salvar alterações"}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
