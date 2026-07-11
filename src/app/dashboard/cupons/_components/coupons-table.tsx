"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
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
import type { Coupon, CouponType } from "@/lib/coupons";

const TIPO_LABEL: Record<CouponType, string> = {
  percentual: "Percentual",
  fixo: "Fixo",
  primeira_corrida: "Primeira corrida",
  indicacao: "Indicação",
};

const STATUS_FILTERS = [
  { value: "todos" as const, label: "Todos" },
  { value: "ativo" as const, label: "Ativo" },
  { value: "inativo" as const, label: "Inativo" },
];

export function CouponsTable({ coupons }: { coupons: Coupon[] }) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("todos");

  const now = new Date();

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return coupons.filter((c) => {
      const matchesSearch = query.length === 0 || c.codigo.toLowerCase().includes(query) || c.descricao.toLowerCase().includes(query);
      const matchesStatus = statusFilter === "todos" || (statusFilter === "ativo" && c.ativo) || (statusFilter === "inativo" && !c.ativo);
      return matchesSearch && matchesStatus;
    });
  }, [coupons, search, statusFilter]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por código ou descrição..."
            className="pl-8"
            aria-label="Buscar cupom"
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
              <TableHead>Código</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead>Validade</TableHead>
              <TableHead>Usos</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={7} className="py-12">
                  <div className="flex flex-col items-center justify-center gap-2 text-center">
                    <Search className="size-8 text-muted-foreground/50" />
                    <p className="text-sm font-medium">Nenhum cupom encontrado</p>
                    <p className="text-sm text-muted-foreground">
                      Ajuste a busca ou o filtro para ver outros resultados.
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((coupon) => {
                const expirada = new Date(coupon.dataFim) < now;
                return (
                  <TableRow key={coupon.id}>
                    <TableCell>
                      <span className="font-mono text-sm font-semibold uppercase tracking-wide">
                        {coupon.codigo}
                      </span>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {TIPO_LABEL[coupon.tipo]}
                    </TableCell>
                    <TableCell className="font-medium">
                      {coupon.tipo === "percentual" ? `${coupon.valor}%` : `R$ ${coupon.valor.toFixed(2)}`}
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate text-sm text-muted-foreground">
                      {coupon.descricao}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(coupon.dataFim).toLocaleDateString("pt-BR")}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {coupon.usosAtuais}/{coupon.limiteUsos}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={cn(
                          "border-transparent font-medium",
                          expirada
                            ? "bg-red-500/10 text-red-600 dark:bg-red-500/15 dark:text-red-400"
                            : coupon.ativo
                              ? "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400"
                              : "bg-muted text-muted-foreground"
                        )}
                      >
                        {expirada ? "Expirado" : coupon.ativo ? "Ativo" : "Inativo"}
                      </Badge>
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
