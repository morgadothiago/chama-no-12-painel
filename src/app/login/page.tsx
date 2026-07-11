import Image from "next/image";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LoginForm } from "./login-form";

export default function LoginPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,color-mix(in_oklch,var(--primary),transparent_92%),transparent_60%)]"
      />

      <div className="relative flex w-full max-w-sm flex-col items-center gap-6">
        <div className="flex flex-col items-center gap-3">
          <Image
            src="/logo.png"
            alt="Chama nº 12"
            width={112}
            height={112}
            priority
            className="size-24 rounded-2xl object-cover ring-1 ring-foreground/10"
          />
          <span className="font-heading text-lg font-semibold tracking-tight">
            Chama nº 12
          </span>
        </div>

        <Card className="w-full">
          <CardHeader>
            <CardTitle>Entrar</CardTitle>
            <CardDescription>Use suas credenciais para acessar o painel.</CardDescription>
          </CardHeader>
          <LoginForm />
        </Card>
      </div>
    </div>
  );
}
