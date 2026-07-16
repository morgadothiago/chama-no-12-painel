import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { DriverStatus } from "@/lib/validations/drivers";

const STATUS_CONFIG: Record<DriverStatus, { label: string; className: string }> = {
  ativo: {
    label: "Ativo",
    className:
      "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400",
  },
  inativo: {
    label: "Inativo",
    className:
      "bg-muted text-muted-foreground",
  },
  pendente: {
    label: "Pendente",
    className:
      "bg-amber-500/10 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400",
  },
  rejeitado: {
    label: "Rejeitado",
    className:
      "bg-destructive/10 text-destructive dark:bg-destructive/20",
  },
};

export function StatusBadge({ status }: { status: DriverStatus }) {
  const config = STATUS_CONFIG[status];

  return (
    <Badge variant="outline" className={cn("border-transparent font-medium", config.className)}>
      {config.label}
    </Badge>
  );
}
