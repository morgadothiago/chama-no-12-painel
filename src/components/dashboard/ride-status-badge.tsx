import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { RideStatus } from "@/lib/api-rides";

const STATUS_CONFIG: Record<RideStatus, { label: string; className: string }> = {
  solicitada: {
    label: "Solicitada",
    className: "bg-amber-500/10 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400",
  },
  aceita: {
    label: "Aceita",
    className: "bg-blue-500/10 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400",
  },
  iniciada: {
    label: "Em andamento",
    className: "bg-blue-500/10 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400",
  },
  finalizada: {
    label: "Concluída",
    className: "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400",
  },
  cancelada: {
    label: "Cancelada",
    className: "bg-red-500/10 text-red-600 dark:bg-red-500/15 dark:text-red-400",
  },
};

export function RideStatusBadge({ status }: { status: RideStatus }) {
  const config = STATUS_CONFIG[status];

  return (
    <Badge variant="outline" className={cn("border-transparent font-medium", config.className)}>
      {config.label}
    </Badge>
  );
}
