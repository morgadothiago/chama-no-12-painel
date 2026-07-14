"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CheckCircle2, Eye, Loader2, MoreHorizontal, Pencil, Search, Trash2 } from "lucide-react";
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
import { StatusBadge } from "@/components/dashboard/status-badge";
import { DriverAvatar } from "@/components/dashboard/driver-avatar";
import type { Driver } from "@/lib/drivers";
import type { DriverStatus } from "@/lib/validations/drivers";
import { approveDriverAction, rejectDriverAction } from "../actions";

const STATUS_FILTERS: { value: DriverStatus | "todos"; label: string }[] = [
  { value: "todos", label: "Todos" },
  { value: "ativo", label: "Ativo" },
  { value: "pendente", label: "Pendente" },
  { value: "inativo", label: "Inativo" },
];

function DriverRowActions({ driver }: { driver: Driver }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleApprove() {
    startTransition(async () => {
      await approveDriverAction(driver.id);
      router.refresh();
    });
  }

  function handleDelete() {
    startTransition(async () => {
      await rejectDriverAction(driver.id);
      router.refresh();
    });
  }

  return (
    <AlertDialog>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={<Button variant="ghost" size="icon-sm" aria-label={`Ações para ${driver.nome}`} />}
        >
          {isPending ? <Loader2 className="animate-spin" /> : <MoreHorizontal />}
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem render={<Link href={`/dashboard/motoristas/${driver.id}`} />}>
            <Eye />
            Ver detalhes
          </DropdownMenuItem>
          <DropdownMenuItem render={<Link href={`/dashboard/motoristas/${driver.id}/editar`} />}>
            <Pencil />
            Editar
          </DropdownMenuItem>
          {driver.status === "pendente" && (
            <DropdownMenuItem onClick={handleApprove} disabled={isPending}>
              <CheckCircle2 />
              Aprovar
            </DropdownMenuItem>
          )}
          {driver.status !== "pendente" && (
            <AlertDialogTrigger render={<DropdownMenuItem onSelect={(e) => e.preventDefault()} variant="destructive" />}>
              <Trash2 />
              Excluir
            </AlertDialogTrigger>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Excluir motorista?</AlertDialogTitle>
          <AlertDialogDescription>
            {driver.nome} será removido da base de motoristas. Essa ação não pode ser desfeita.
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

export function DriversTable({ drivers }: { drivers: Driver[] }) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<DriverStatus | "todos">("todos");

  const filteredDrivers = useMemo(() => {
    const query = search.trim().toLowerCase();

    return drivers.filter((driver) => {
      const matchesSearch = query.length === 0 || driver.nome.toLowerCase().includes(query);
      const matchesStatus = statusFilter === "todos" || driver.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [drivers, search, statusFilter]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Buscar por nome..."
            className="pl-8"
            aria-label="Buscar motorista por nome"
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
              <TableHead>Motorista</TableHead>
              <TableHead>Veículo</TableHead>
              <TableHead>Corridas</TableHead>
              <TableHead>Avaliação</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-10" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredDrivers.length === 0 ? (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={6} className="py-12">
                  <div className="flex flex-col items-center justify-center gap-2 text-center">
                    <Search className="size-8 text-muted-foreground/50" />
                    <p className="text-sm font-medium">Nenhum motorista encontrado</p>
                    <p className="text-sm text-muted-foreground">
                      Ajuste a busca ou o filtro de status para ver outros resultados.
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredDrivers.map((driver) => (
                <TableRow key={driver.id}>
                  <TableCell>
                    <Link
                      href={`/dashboard/motoristas/${driver.id}`}
                      className="flex items-center gap-2.5"
                    >
                      <DriverAvatar nome={driver.nome} avatarUrl={driver.avatarUrl} />
                      <div className="flex flex-col">
                        <span className="font-medium text-foreground">{driver.nome}</span>
                        <span className="text-xs text-muted-foreground">{driver.email}</span>
                      </div>
                    </Link>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {driver.veiculo.modelo} · {driver.veiculo.placa}
                  </TableCell>
                  <TableCell className="text-muted-foreground">{driver.metrics.corridas}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {driver.metrics.avaliacaoMedia > 0
                      ? driver.metrics.avaliacaoMedia.toFixed(1)
                      : "—"}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={driver.status} />
                  </TableCell>
                  <TableCell>
                    <DriverRowActions driver={driver} />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
