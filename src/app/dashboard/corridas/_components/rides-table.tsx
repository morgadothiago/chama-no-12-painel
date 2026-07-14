"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Loader2, MoreHorizontal, Search, XCircle } from "lucide-react";
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
import { RideStatusBadge } from "@/components/dashboard/ride-status-badge";
import type { Ride, RideStatus } from "@/lib/api-rides";
import { cancelRideAction, completeRideAction } from "../actions";

const STATUS_FILTERS: { value: RideStatus | "todas"; label: string }[] = [
  { value: "todas", label: "Todas" },
  { value: "solicitada", label: "Solicitada" },
  { value: "aceita", label: "Aceita" },
  { value: "iniciada", label: "Em andamento" },
  { value: "finalizada", label: "Concluída" },
  { value: "cancelada", label: "Cancelada" },
];

function formatValor(valor: number | null) {
  if (valor === null) return "—";
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function formatData(iso: string) {
  return new Date(iso).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });
}

function RideRowActions({ ride }: { ride: Ride }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleComplete() {
    startTransition(async () => {
      await completeRideAction(ride.id);
      router.refresh();
    });
  }

  function handleCancel() {
    startTransition(async () => {
      await cancelRideAction(ride.id);
      router.refresh();
    });
  }

  const canComplete = ride.status === "iniciada";
  const canCancel = ride.status === "solicitada" || ride.status === "aceita" || ride.status === "iniciada";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label={`Ações para corrida de ${ride.passengerName}`}
          />
        }
      >
        {isPending ? <Loader2 className="animate-spin" /> : <MoreHorizontal />}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={handleComplete} disabled={!canComplete || isPending}>
          <CheckCircle2 />
          Finalizar corrida
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleCancel} disabled={!canCancel || isPending} variant="destructive">
          <XCircle />
          Cancelar corrida
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function RidesTable({ rides }: { rides: Ride[] }) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<RideStatus | "todas">("todas");

  const filteredRides = useMemo(() => {
    const query = search.trim().toLowerCase();

    return rides.filter((ride) => {
      const matchesSearch =
        query.length === 0 ||
        ride.passengerName.toLowerCase().includes(query) ||
        ride.origem.toLowerCase().includes(query) ||
        ride.destino.toLowerCase().includes(query);
      const matchesStatus = statusFilter === "todas" || ride.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [rides, search, statusFilter]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Buscar por passageiro, origem ou destino..."
            className="pl-8"
            aria-label="Buscar corrida"
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
              <TableHead>Origem → Destino</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead>Solicitada em</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-10" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRides.length === 0 ? (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={6} className="py-12">
                  <div className="flex flex-col items-center justify-center gap-2 text-center">
                    <Search className="size-8 text-muted-foreground/50" />
                    <p className="text-sm font-medium">Nenhuma corrida encontrada</p>
                    <p className="text-sm text-muted-foreground">
                      Ajuste a busca ou o filtro de status para ver outros resultados.
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredRides.map((ride) => (
                <TableRow key={ride.id}>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium text-foreground">{ride.passengerName}</span>
                      {ride.passengerPhone && (
                        <span className="text-xs text-muted-foreground">{ride.passengerPhone}</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {ride.origem} → {ride.destino}
                  </TableCell>
                  <TableCell className="text-muted-foreground">{formatValor(ride.valor)}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatData(ride.solicitadaEm)}
                  </TableCell>
                  <TableCell>
                    <RideStatusBadge status={ride.status} />
                  </TableCell>
                  <TableCell>
                    <RideRowActions ride={ride} />
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
