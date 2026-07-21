import { Route, Star, Wallet } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MetricTile } from "@/components/dashboard/metric-tile";
import type { DriverMetrics } from "@/lib/drivers";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export function DriverMetricsCard({ metrics }: { metrics: DriverMetrics }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Métricas</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <MetricTile label="Corridas feitas" value={metrics.corridas} icon={Route} accent="blue" />
        <MetricTile
          label="Avaliação média"
          value={metrics.avaliacaoMedia > 0 ? metrics.avaliacaoMedia.toFixed(2) : "—"}
          icon={Star}
          accent="amber"
        />
        <MetricTile label="Ganhos" value={formatCurrency(metrics.ganhos)} icon={Wallet} accent="emerald" />
      </CardContent>
    </Card>
  );
}
