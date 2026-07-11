import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
      <CardContent>
        <dl className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-3">
          <div>
            <dt className="text-muted-foreground">Corridas feitas</dt>
            <dd className="text-lg font-semibold">{metrics.corridas}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Avaliação média</dt>
            <dd className="text-lg font-semibold">
              {metrics.avaliacaoMedia > 0 ? metrics.avaliacaoMedia.toFixed(2) : "—"}
            </dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Ganhos</dt>
            <dd className="text-lg font-semibold">{formatCurrency(metrics.ganhos)}</dd>
          </div>
        </dl>
      </CardContent>
    </Card>
  );
}
