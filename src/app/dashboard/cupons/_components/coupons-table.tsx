"use client";

import { useMemo, useState, useTransition } from "react";
import { Loader2, Search } from "lucide-react";
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
import { StatusPill } from "@/components/dashboard/status-pill";
import type { Coupon, CouponTipoDesconto } from "@/lib/api-coupons";
import { showErrorToast } from "@/lib/toast";
import { toggleCouponAction } from "../actions";

const TIPO_LABEL: Record<CouponTipoDesconto, string> = {
  percentual: "Percentual",
  fixo: "Fixo",
};

const STATUS_FILTERS = [
  { value: "todos" as const, label: "Todos" },
  { value: "ativo" as const, label: "Ativo" },
  { value: "inativo" as const, label: "Inativo" },
];

function ToggleCouponButton({ coupon }: { coupon: Coupon }) {
  const [isPending, startTransition] = useTransition();
  const [ativo, setAtivo] = useState(coupon.ativo);

  function handleToggle() {
    startTransition(async () => {
      const result = await toggleCouponAction(coupon.id, ativo);
      if (result.success) {
        setAtivo((prev) => !prev);
      } else {
        showErrorToast(result.error);
      }
    });
  }

  return (
    <Button size="sm" variant="ghost" onClick={handleToggle} disabled={isPending}>
      {isPending ? <Loader2 className="animate-spin" /> : null}
      {ativo ? "Desativar" : "Ativar"}
    </Button>
  );
}

export function CouponsTable({ coupons }: { coupons: Coupon[] }) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("todos");

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return coupons.filter((c) => {
      const matchesSearch = query.length === 0 || c.codigo.toLowerCase().includes(query);
      const matchesStatus =
        statusFilter === "todos" ||
        (statusFilter === "ativo" && c.ativo) ||
        (statusFilter === "inativo" && !c.ativo);
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
            placeholder="Buscar por código..."
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

      <div className="overflow-hidden rounded-xl ring-1 ring-border">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Código</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead>Criado em</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-10" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={6} className="py-12">
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
              filtered.map((coupon) => (
                <TableRow key={coupon.id}>
                  <TableCell>
                    <span className="font-mono text-sm font-semibold uppercase tracking-wide">
                      {coupon.codigo}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {TIPO_LABEL[coupon.tipoDesconto]}
                  </TableCell>
                  <TableCell className="font-medium">
                    {coupon.tipoDesconto === "percentual"
                      ? `${coupon.valor}%`
                      : `R$ ${coupon.valor.toFixed(2)}`}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(coupon.createdAt).toLocaleDateString("pt-BR")}
                  </TableCell>
                  <TableCell>
                    <StatusPill
                      tone={coupon.ativo ? "success" : "neutral"}
                      label={coupon.ativo ? "Ativo" : "Inativo"}
                    />
                  </TableCell>
                  <TableCell>
                    <ToggleCouponButton coupon={coupon} />
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
