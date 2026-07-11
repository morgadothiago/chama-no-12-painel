"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Eye, Search } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Passenger } from "@/lib/passengers";

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
};

const STATUS_FILTERS = [
  { value: "todos" as const, label: "Todos" },
  { value: "ativo" as const, label: "Ativo" },
  { value: "inativo" as const, label: "Inativo" },
  { value: "bloqueado" as const, label: "Bloqueado" },
];

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
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        nativeButton={false}
                        render={<Link href={`/dashboard/passageiros/${passenger.id}`} />}
                        aria-label={`Ver detalhes de ${passenger.nome}`}
                      >
                        <Eye />
                      </Button>
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
