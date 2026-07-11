"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Loader2, Power, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import type { Driver } from "@/lib/drivers";
import {
  approveDriverAction,
  rejectDriverAction,
  toggleActiveAction,
} from "@/app/dashboard/motoristas/actions";

export function DriverStatusActions({ driver }: { driver: Driver }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleApprove() {
    setError(null);
    startTransition(async () => {
      const result = await approveDriverAction(driver.id);
      if (!result.success) {
        setError(result.error);
        return;
      }
      router.refresh();
    });
  }

  function handleReject() {
    setError(null);
    startTransition(async () => {
      const result = await rejectDriverAction(driver.id);
      if (!result.success) {
        setError(result.error);
        return;
      }
      router.push("/dashboard/motoristas");
      router.refresh();
    });
  }

  function handleToggleActive() {
    setError(null);
    startTransition(async () => {
      const result = await toggleActiveAction(driver.id);
      if (!result.success) {
        setError(result.error);
        return;
      }
      router.refresh();
    });
  }

  return (
    <div className="flex flex-col items-end gap-2">
      <div className="flex flex-wrap items-center justify-end gap-2">
        {driver.status === "pendente" && (
          <>
            <Button size="sm" onClick={handleApprove} disabled={isPending}>
              {isPending ? (
                <Loader2 className="animate-spin" />
              ) : (
                <CheckCircle2 />
              )}
              Aprovar
            </Button>

            <AlertDialog>
              <AlertDialogTrigger render={<Button size="sm" variant="destructive" disabled={isPending} />}>
                <XCircle />
                Rejeitar
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Rejeitar motorista?</AlertDialogTitle>
                  <AlertDialogDescription>
                    {driver.nome} será removido da base de motoristas. Essa ação não pode ser
                    desfeita.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction
                    render={<Button variant="destructive" onClick={handleReject} />}
                  >
                    Rejeitar
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </>
        )}

        {driver.status !== "pendente" && (
          <AlertDialog>
            <AlertDialogTrigger
              render={
                <Button
                  size="sm"
                  variant={driver.status === "ativo" ? "outline" : "default"}
                  disabled={isPending}
                />
              }
            >
              {isPending ? <Loader2 className="animate-spin" /> : <Power />}
              {driver.status === "ativo" ? "Inativar" : "Ativar"}
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  {driver.status === "ativo" ? "Inativar motorista?" : "Ativar motorista?"}
                </AlertDialogTitle>
                <AlertDialogDescription>
                  {driver.status === "ativo"
                    ? `${driver.nome} não poderá mais aceitar corridas até ser reativado.`
                    : `${driver.nome} voltará a poder aceitar corridas.`}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction render={<Button onClick={handleToggleActive} />}>
                  Confirmar
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
