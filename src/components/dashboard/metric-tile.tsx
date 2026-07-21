import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const ACCENT_CLASSES = {
  neutral: "bg-muted text-muted-foreground",
  emerald: "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400",
  amber: "bg-amber-500/10 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400",
  blue: "bg-blue-500/10 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400",
} as const;

/**
 * Compact numeric tile (icon chip + label + value) used inside detail-page
 * cards — e.g. driver metrics — so key numbers get the same visual weight
 * as the overview StatCard instead of being buried in a plain text row.
 */
export function MetricTile({
  label,
  value,
  icon: Icon,
  accent = "neutral",
}: {
  label: string;
  value: React.ReactNode;
  icon: LucideIcon;
  accent?: keyof typeof ACCENT_CLASSES;
}) {
  return (
    <div className="flex items-center gap-3">
      <div
        className={cn(
          "flex size-9 shrink-0 items-center justify-center rounded-lg",
          ACCENT_CLASSES[accent],
        )}
      >
        <Icon className="size-4" />
      </div>
      <div className="flex min-w-0 flex-col gap-0.5">
        <p className="truncate text-xs text-muted-foreground">{label}</p>
        <p className="text-lg font-semibold tracking-tight text-foreground tabular-nums">{value}</p>
      </div>
    </div>
  );
}
