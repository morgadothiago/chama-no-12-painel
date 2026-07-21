import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

/**
 * Shared semantic tone system for every status indicator in the dashboard
 * (motoristas, corridas, passageiros, cupons, bandeiras). Keeping a single
 * source of truth here means "ativo" always reads the same green, "pendente"
 * always the same amber, etc. — regardless of which domain it belongs to.
 */
export type StatusTone = "success" | "warning" | "danger" | "progress" | "info" | "neutral";

const TONE_CLASSES: Record<StatusTone, string> = {
  success: "bg-emerald-500/10 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400",
  warning: "bg-amber-500/10 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400",
  danger: "bg-red-500/10 text-red-700 dark:bg-red-500/15 dark:text-red-400",
  progress: "bg-violet-500/10 text-violet-700 dark:bg-violet-500/15 dark:text-violet-400",
  info: "bg-blue-500/10 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400",
  neutral: "bg-muted text-muted-foreground",
};

const DOT_CLASSES: Record<StatusTone, string> = {
  success: "bg-emerald-500",
  warning: "bg-amber-500",
  danger: "bg-red-500",
  progress: "bg-violet-500",
  info: "bg-blue-500",
  neutral: "bg-muted-foreground/50",
};

export function StatusPill({
  tone,
  label,
  className,
}: {
  tone: StatusTone;
  label: string;
  className?: string;
}) {
  return (
    <Badge
      variant="outline"
      className={cn("gap-1.5 border-transparent font-medium", TONE_CLASSES[tone], className)}
    >
      <span className={cn("size-1.5 shrink-0 rounded-full", DOT_CLASSES[tone])} aria-hidden />
      {label}
    </Badge>
  );
}
