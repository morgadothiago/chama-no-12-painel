import { StatusPill, type StatusTone } from "@/components/dashboard/status-pill";
import type { RideStatus } from "@/lib/api-rides";

const STATUS_CONFIG: Record<RideStatus, { label: string; tone: StatusTone }> = {
  solicitada: { label: "Solicitada", tone: "warning" },
  aceita: { label: "Aceita", tone: "info" },
  iniciada: { label: "Em andamento", tone: "progress" },
  finalizada: { label: "Concluída", tone: "success" },
  cancelada: { label: "Cancelada", tone: "danger" },
};

export function RideStatusBadge({ status }: { status: RideStatus }) {
  const config = STATUS_CONFIG[status];
  return <StatusPill tone={config.tone} label={config.label} />;
}
