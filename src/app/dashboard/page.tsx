import { getServerSession } from "next-auth";
import { Car, Users, UserCheck, ClockAlert, TrendingUp } from "lucide-react";
import Link from "next/link";
import { authOptions } from "@/lib/auth";
import { fetchDrivers } from "@/lib/api-drivers";
import { fetchRides } from "@/lib/api-rides";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const STATUS_CONFIG = {
  solicitada: { label: "Solicitada", className: "bg-amber-500/10 text-amber-600 dark:text-amber-400" },
  aceita: { label: "Aceita", className: "bg-blue-500/10 text-blue-600 dark:text-blue-400" },
  iniciada: { label: "Em andamento", className: "bg-blue-500/10 text-blue-600 dark:text-blue-400" },
  finalizada: { label: "Concluída", className: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" },
  cancelada: { label: "Cancelada", className: "bg-red-500/10 text-red-600 dark:text-red-400" },
} as const;

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  const drivers = await fetchDrivers();
  const rides = await fetchRides();

  const totalDrivers = drivers.length;
  const ativos = drivers.filter((d) => d.status === "ativo").length;
  const pendentes = drivers.filter((d) => d.status === "pendente").length;
  const hoje = new Date().toISOString().slice(0, 10);
  const corridasHoje = rides.filter((r) => r.solicitadaEm.startsWith(hoje)).length;
  const ativas = rides.filter((r) => r.status === "aceita" || r.status === "iniciada");

  const ultimasCorridas = rides
    .sort((a, b) => new Date(b.solicitadaEm).getTime() - new Date(a.solicitadaEm).getTime())
    .slice(0, 5);

  return (
    <div className="flex flex-col gap-8">
      <div className="rounded-xl border border-border/50 bg-gradient-to-br from-primary/[0.03] to-transparent p-6 md:p-8">
        <PageHeader
          title={`Bem-vindo, ${session?.user.name?.split(" ")[0] ?? "Admin"}`}
          description={`${corridasHoje} corrida${corridasHoje === 1 ? "" : "s"} hoje · ${ativos} motorista${ativos === 1 ? "" : "s"} ativo${ativos === 1 ? "" : "s"}`}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total de motoristas"
          value={totalDrivers}
          icon={Users}
          accent="neutral"
          trend={{ value: `${pendentes} pendentes`, positive: pendentes === 0 }}
        />
        <StatCard label="Motoristas ativos" value={ativos} icon={UserCheck} accent="emerald" />
        <StatCard
          label="Corridas hoje"
          value={corridasHoje}
          icon={Car}
          accent="blue"
        />
        <StatCard label="Em andamento" value={ativas.length} icon={TrendingUp} accent="amber" />
      </div>

      {ultimasCorridas.length > 0 && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base font-medium">Últimas corridas</CardTitle>
            <Link
              href="/dashboard/corridas"
              className="text-xs font-medium text-primary hover:text-primary/80 transition-colors"
            >
              Ver todas
            </Link>
          </CardHeader>
          <CardContent className="px-0">
            <div className="divide-y divide-border/50">
              {ultimasCorridas.map((ride) => {
                const config = STATUS_CONFIG[ride.status];
                return (
                  <div
                    key={ride.id}
                    className="flex items-center justify-between px-6 py-3 transition-colors hover:bg-muted/30"
                  >
                    <div className="flex min-w-0 flex-col gap-0.5">
                      <span className="truncate text-sm font-medium text-foreground">
                        {ride.passengerName}
                      </span>
                      <span className="truncate text-xs text-muted-foreground">
                        {ride.origem} → {ride.destino}
                      </span>
                    </div>
                    <div className="flex shrink-0 items-center gap-3">
                      {ride.valor && (
                        <span className="text-sm font-medium tabular-nums text-foreground">
                          {ride.valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                        </span>
                      )}
                      <Badge
                        variant="outline"
                        className={cn("border-transparent font-medium", config.className)}
                      >
                        {config.label}
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
