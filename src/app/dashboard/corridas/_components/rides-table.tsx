"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { io } from "socket.io-client";
import {
  CheckCircle2,
  Loader2,
  MoreHorizontal,
  Search,
  XCircle,
  ArrowUpDown,
} from "lucide-react";
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
import { showErrorToast, showSuccessToast } from "@/lib/toast";
import { cancelRideAction, completeRideAction } from "../actions";
import { cn } from "@/lib/utils";

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

async function fetchRideById(id: string, token: string): Promise<Ride | null> {
  try {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/rides/${id}`;
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    if (!res.ok) return null;
    const body = await res.json();
    return body.data ?? null;
  } catch {
    return null;
  }
}

function RideRowActions({ ride }: { ride: Ride }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleComplete() {
    startTransition(async () => {
      const result = await completeRideAction(ride.id);
      if (!result.success) {
        showErrorToast(result.error);
        return;
      }
      showSuccessToast("Corrida finalizada.");
      router.refresh();
    });
  }

  function handleCancel() {
    startTransition(async () => {
      const result = await cancelRideAction(ride.id);
      if (!result.success) {
        showErrorToast(result.error);
        return;
      }
      showSuccessToast("Corrida cancelada.");
      router.refresh();
    });
  }

  const canComplete = ride.status === "iniciada";
  const canCancel =
    ride.status === "solicitada" || ride.status === "aceita" || ride.status === "iniciada";

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
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={handleComplete} disabled={!canComplete || isPending}>
          <CheckCircle2 className="size-4 text-emerald-600" />
          Finalizar corrida
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleCancel} disabled={!canCancel || isPending} variant="destructive">
          <XCircle className="size-4" />
          Cancelar corrida
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function RidesTable({ rides: initialRides }: { rides: Ride[] }) {
  const router = useRouter();
  const { data: session } = useSession();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<RideStatus | "todas">("todas");
  const [rides, setRides] = useState(initialRides);

  useEffect(() => {
    setRides(initialRides);
  }, [initialRides]);

  useEffect(() => {
    const token = (session?.user as { apiToken?: string } | undefined)?.apiToken;
    if (!token) return;

    const socket = io(`${process.env.NEXT_PUBLIC_API_URL}/ws`, {
      auth: { token },
      transports: ["websocket"],
      reconnection: true,
      reconnectionDelay: 2000,
    });

    socket.on("admin:ride-event", async (event: { type: string; rideId: string }) => {
      if (event.type === "new-request") {
        router.refresh();
        return;
      }
      const updated = await fetchRideById(event.rideId, token);
      if (updated) {
        setRides((prev) => prev.map((r) => (r.id === event.rideId ? updated : r)));
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [session, router]);

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

  const sortedRides = useMemo(() => {
    return [...filteredRides].sort(
      (a, b) => new Date(b.solicitadaEm).getTime() - new Date(a.solicitadaEm).getTime(),
    );
  }, [filteredRides]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground/50" />
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Buscar passageiro, origem ou destino..."
            className="h-9 pl-9 text-sm"
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
              className={cn(
                "h-8 px-3 text-xs",
                statusFilter !== filter.value && "text-muted-foreground hover:text-foreground",
              )}
            >
              {filter.label}
            </Button>
          ))}
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-border/50">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="text-xs font-medium uppercase tracking-wider text-muted-foreground/70">
                Passageiro
              </TableHead>
              <TableHead className="hidden text-xs font-medium uppercase tracking-wider text-muted-foreground/70 md:table-cell">
                Origem → Destino
              </TableHead>
              <TableHead className="hidden text-xs font-medium uppercase tracking-wider text-muted-foreground/70 sm:table-cell">
                <div className="flex items-center gap-1">
                  Valor
                  <ArrowUpDown className="size-3" />
                </div>
              </TableHead>
              <TableHead className="hidden text-xs font-medium uppercase tracking-wider text-muted-foreground/70 lg:table-cell">
                Solicitação
              </TableHead>
              <TableHead className="text-xs font-medium uppercase tracking-wider text-muted-foreground/70">
                Status
              </TableHead>
              <TableHead className="w-10" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedRides.length === 0 ? (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={6} className="py-16">
                  <div className="flex flex-col items-center justify-center gap-3 text-center">
                    <div className="flex size-12 items-center justify-center rounded-full bg-muted/50">
                      <Search className="size-5 text-muted-foreground/40" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">Nenhuma corrida encontrada</p>
                      <p className="text-sm text-muted-foreground">
                        {search || statusFilter !== "todas"
                          ? "Tente ajustar a busca ou o filtro."
                          : "Nenhuma corrida registrada ainda."}
                      </p>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              sortedRides.map((ride) => (
                <TableRow
                  key={ride.id}
                  className="transition-colors hover:bg-muted/20"
                >
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium text-foreground">{ride.passengerName}</span>
                      {ride.passengerPhone && (
                        <span className="text-xs text-muted-foreground">{ride.passengerPhone}</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="hidden max-w-[280px] truncate text-muted-foreground md:table-cell">
                    {ride.origem} <span className="text-muted-foreground/40">→</span> {ride.destino}
                  </TableCell>
                  <TableCell className="hidden tabular-nums text-muted-foreground sm:table-cell">
                    {formatValor(ride.valor)}
                  </TableCell>
                  <TableCell className="hidden text-muted-foreground lg:table-cell">
                    <span className="text-sm tabular-nums">{formatData(ride.solicitadaEm)}</span>
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

      {sortedRides.length > 0 && (
        <p className="text-xs text-muted-foreground/60">
          {sortedRides.length} de {rides.length} corrida{sortedRides.length === 1 ? "" : "s"}
        </p>
      )}
    </div>
  );
}
