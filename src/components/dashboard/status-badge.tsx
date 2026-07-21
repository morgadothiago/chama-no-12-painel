import { StatusPill, type StatusTone } from "@/components/dashboard/status-pill";
import type { DriverStatus } from "@/lib/validations/drivers";

const STATUS_CONFIG: Record<DriverStatus, { label: string; tone: StatusTone }> = {
  ativo: { label: "Ativo", tone: "success" },
  inativo: { label: "Inativo", tone: "neutral" },
  pendente: { label: "Pendente", tone: "warning" },
  rejeitado: { label: "Rejeitado", tone: "danger" },
};

export function StatusBadge({ status }: { status: DriverStatus }) {
  const config = STATUS_CONFIG[status];
  return <StatusPill tone={config.tone} label={config.label} />;
}
