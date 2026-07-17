import Image from "next/image";
import { Suspense } from "react";
import { LoginForm } from "./login-form";

export default function LoginPage() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background px-4">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,color-mix(in_oklch,var(--primary),transparent_90%),transparent_70%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,color-mix(in_oklch,var(--primary),transparent_95%),transparent_60%)]"
      />

      <div className="relative flex w-full max-w-sm flex-col items-center gap-8">
        <div className="flex flex-col items-center gap-4">
          <div className="flex size-20 items-center justify-center rounded-2xl bg-primary shadow-lg shadow-primary/20">
            <Image
              src="/logo.png"
              alt="Chama nº 12"
              width={48}
              height={48}
              priority
              className="size-11 object-contain"
            />
          </div>
          <div className="flex flex-col items-center gap-1">
            <h1 className="font-heading text-xl font-semibold tracking-tight text-foreground">
              Chama nº 12
            </h1>
            <p className="text-sm text-muted-foreground">Painel Administrativo</p>
          </div>
        </div>

        <div className="w-full rounded-xl border border-border/50 bg-card p-6 shadow-sm">
          <div className="mb-6 flex flex-col gap-1">
            <h2 className="text-base font-semibold text-foreground">Acessar painel</h2>
            <p className="text-sm text-muted-foreground">
              Use suas credenciais para continuar.
            </p>
          </div>
          <Suspense fallback={null}>
            <LoginForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
