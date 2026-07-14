"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Lock, Trash2, Unlock } from "lucide-react";
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
import type { Passenger } from "@/lib/passengers";
import {
  blockPassengerAction,
  deletePassengerAction,
  unblockPassengerAction,
} from "@/app/dashboard/passageiros/actions";

export function PassengerStatusActions({ passenger }: { passenger: Passenger }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleToggleBlock() {
    setError(null);
    startTransition(async () => {
      const action = passenger.status === "bloqueado" ? unblockPassengerAction : blockPassengerAction;
      const result = await action(passenger.id);
      if (!result.success) {
        setError(result.error);
        return;
      }
      router.refresh();
    });
  }

  function handleDelete() {
    setError(null);
    startTransition(async () => {
      const result = await deletePassengerAction(passenger.id);
      if (!result.success) {
        setError(result.error);
        return;
      }
      router.push("/dashboard/passageiros");
      router.refresh();
    });
  }

  if (passenger.status === "excluido") {
    return null;
  }

  return (
    <div className="flex flex-col items-end gap-2">
      <div className="flex flex-wrap items-center justify-end gap-2">
        <Button
          size="sm"
          variant={passenger.status === "bloqueado" ? "default" : "outline"}
          onClick={handleToggleBlock}
          disabled={isPending}
        >
          {isPending ? (
            <Loader2 className="animate-spin" />
          ) : passenger.status === "bloqueado" ? (
            <Unlock />
          ) : (
            <Lock />
          )}
          {passenger.status === "bloqueado" ? "Desbloquear" : "Bloquear"}
        </Button>

        <AlertDialog>
          <AlertDialogTrigger render={<Button size="sm" variant="destructive" disabled={isPending} />}>
            <Trash2 />
            Excluir
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Excluir passageiro?</AlertDialogTitle>
              <AlertDialogDescription>
                {passenger.nome} será removido da base de passageiros. Essa ação não pode ser
                desfeita.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction render={<Button variant="destructive" onClick={handleDelete} />}>
                Excluir
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
