"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginSchema, type LoginFormValues } from "@/lib/validations/auth";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [formError, setFormError] = useState<string | null>(
    searchParams.get("error") === "unauthorized"
      ? "Acesso restrito a administradores."
      : null,
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(values: LoginFormValues) {
    setFormError(null);

    const result = await signIn("credentials", {
      email: values.email,
      password: values.password,
      redirect: false,
    });

    if (result?.error) {
      setFormError("Email ou senha inválidos.");
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-5">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="email" className="text-sm font-medium">
          Email
        </Label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="admin@exemplo.com"
          aria-invalid={!!errors.email}
          className="h-10"
          {...register("email")}
        />
        {errors.email && (
          <p className="text-xs text-destructive">{errors.email.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="password" className="text-sm font-medium">
          Senha
        </Label>
        <Input
          id="password"
          type="password"
          autoComplete="current-password"
          placeholder="••••••••"
          aria-invalid={!!errors.password}
          className="h-10"
          {...register("password")}
        />
        {errors.password && (
          <p className="text-xs text-destructive">{errors.password.message}</p>
        )}
      </div>

      {formError && (
        <div className="rounded-lg bg-destructive/10 px-3 py-2">
          <p className="text-xs text-destructive">{formError}</p>
        </div>
      )}

      <Button type="submit" className="h-10 w-full" disabled={isSubmitting}>
        {isSubmitting ? (
          <span className="flex items-center gap-2">
            <Loader2 className="size-4 animate-spin" />
            Entrando...
          </span>
        ) : (
          "Entrar"
        )}
      </Button>
    </form>
  );
}
