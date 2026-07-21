import { StatusPill, type StatusTone } from "@/components/dashboard/status-pill";
import type { Passenger } from "@/lib/passengers";

const STATUS_CONFIG: Record<Passenger["status"], { label: string; tone: StatusTone }> = {
  ativo: { label: "Ativo", tone: "success" },
  inativo: { label: "Inativo", tone: "neutral" },
  bloqueado: { label: "Bloqueado", tone: "danger" },
  excluido: { label: "Excluído", tone: "neutral" },
};

export function PassengerStatusBadge({ status }: { status: Passenger["status"] }) {
  const config = STATUS_CONFIG[status];
  return <StatusPill tone={config.tone} label={config.label} />;
}
