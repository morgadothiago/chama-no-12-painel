"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, Loader2, Lock, MoreHorizontal, Pencil, Search, Trash2, Unlock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Passenger } from "@/lib/passengers";
import {
  blockPassengerAction,
  deletePassengerAction,
  unblockPassengerAction,
} from "../actions";

const STATUS_CONFIG: Record<string, { label: string; className: string }> = {
  ativo: {
    label: "Ativo",
    className: "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400",
  },
  inativo: {
    label: "Inativo",
    className: "bg-muted text-muted-foreground",
  },
  bloqueado: {
    label: "Bloqueado",
    className: "bg-red-500/10 text-red-600 dark:bg-red-500/15 dark:text-red-400",
  },
  excluido: {
    label: "Excluído",
    className: "bg-muted text-muted-foreground",
  },
};

const STATUS_FILTERS = [
  { value: "todos" as const, label: "Todos" },
  { value: "ativo" as const, label: "Ativo" },
  { value: "inativo" as const, label: "Inativo" },
  { value: "bloqueado" as const, label: "Bloqueado" },
];

function PassengerRowActions({ passenger }: { passenger: Passenger }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleToggleBlock() {
    startTransition(async () => {
      const action = passenger.status === "bloqueado" ? unblockPassengerAction : blockPassengerAction;
      await action(passenger.id);
      router.refresh();
    });
  }

  function handleDelete() {
    startTransition(async () => {
      await deletePassengerAction(passenger.id);
      router.refresh();
    });
  }

  if (passenger.status === "excluido") {
    return (
      <Button
        variant="ghost"
        size="icon-sm"
        nativeButton={false}
        render={<Link href={`/dashboard/passageiros/${passenger.id}`} />}
        aria-label={`Ver detalhes de ${passenger.nome}`}
      >
        <Eye />
      </Button>
    );
  }

  return (
    <AlertDialog>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={<Button variant="ghost" size="icon-sm" aria-label={`Ações para ${passenger.nome}`} />}
        >
          {isPending ? <Loader2 className="animate-spin" /> : <MoreHorizontal />}
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem render={<Link href={`/dashboard/passageiros/${passenger.id}`} />}>
            <Eye />
            Ver detalhes
          </DropdownMenuItem>
          <DropdownMenuItem render={<Link href={`/dashboard/passageiros/${passenger.id}/editar`} />}>
            <Pencil />
            Editar
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleToggleBlock} disabled={isPending}>
            {passenger.status === "bloqueado" ? <Unlock /> : <Lock />}
            {passenger.status === "bloqueado" ? "Desbloquear" : "Bloquear"}
          </DropdownMenuItem>
          <AlertDialogTrigger render={<DropdownMenuItem onSelect={(e) => e.preventDefault()} variant="destructive" />}>
            <Trash2 />
            Excluir
          </AlertDialogTrigger>
        </DropdownMenuContent>
      </DropdownMenu>
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
  );
}

export function PassengersTable({ passengers }: { passengers: Passenger[] }) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("todos");

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return passengers.filter((p) => {
      const matchesSearch = query.length === 0 || p.nome.toLowerCase().includes(query) || p.email.toLowerCase().includes(query);
      const matchesStatus = statusFilter === "todos" || p.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [passengers, search, statusFilter]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nome ou email..."
            className="pl-8"
            aria-label="Buscar passageiro"
          />
        </div>

        <div className="flex flex-wrap gap-1">
          {STATUS_FILTERS.map((filter) => (
            <Button
              key={filter.value}
              type="button"
              size="sm"
              variant={statusFilter === filter.value ? "secondary" : "ghost"}
              onClick={() => setStatusFilter(filter.value)}
            >
              {filter.label}
            </Button>
          ))}
        </div>
      </div>

      <div className="overflow-hidden rounded-xl ring-1 ring-foreground/10">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Passageiro</TableHead>
              <TableHead>Telefone</TableHead>
              <TableHead>Corridas</TableHead>
              <TableHead>Total gasto</TableHead>
              <TableHead>Cadastro</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-10" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={7} className="py-12">
                  <div className="flex flex-col items-center justify-center gap-2 text-center">
                    <Search className="size-8 text-muted-foreground/50" />
                    <p className="text-sm font-medium">Nenhum passageiro encontrado</p>
                    <p className="text-sm text-muted-foreground">
                      Ajuste a busca ou o filtro para ver outros resultados.
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((passenger) => {
                const statusConfig = STATUS_CONFIG[passenger.status];
                return (
                  <TableRow key={passenger.id}>
                    <TableCell>
                      <Link
                        href={`/dashboard/passageiros/${passenger.id}`}
                        className="flex items-center gap-2.5"
                      >
                        <div className="flex size-8 items-center justify-center rounded-full bg-muted text-xs font-semibold text-muted-foreground">
                          {passenger.nome.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-medium text-foreground">{passenger.nome}</span>
                          <span className="text-xs text-muted-foreground">{passenger.email}</span>
                        </div>
                      </Link>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{passenger.telefone}</TableCell>
                    <TableCell className="text-muted-foreground">{passenger.totalCorridas}</TableCell>
                    <TableCell className="text-muted-foreground">
                      R$ {passenger.totalGasto.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(passenger.cadastroEm).toLocaleDateString("pt-BR")}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={cn("border-transparent font-medium", statusConfig.className)}
                      >
                        {statusConfig.label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <PassengerRowActions passenger={passenger} />
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
