import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Button } from "@/components/ui/button";

export default async function Home() {
  const session = await getServerSession(authOptions);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-background px-4 text-center">
      <h1 className="text-4xl font-medium tracking-tight">
        Bem-vindo ao Chama nº 12
      </h1>
      <p className="max-w-md text-muted-foreground">
        Plataforma com autenticação por email e senha.
      </p>
      {session ? (
        <Button nativeButton={false} render={<Link href="/dashboard" />}>
          Ir para o dashboard
        </Button>
      ) : (
        <Button nativeButton={false} render={<Link href="/login" />}>
          Entrar
        </Button>
      )}
    </main>
  );
}
