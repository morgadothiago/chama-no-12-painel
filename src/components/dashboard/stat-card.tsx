import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const ACCENT_CLASSES = {
  neutral: "bg-muted/50 text-muted-foreground",
  emerald:
    "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400 ring-1 ring-emerald-500/20 dark:ring-emerald-400/20",
  amber:
    "bg-amber-500/10 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400 ring-1 ring-amber-500/20 dark:ring-amber-400/20",
  blue: "bg-blue-500/10 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400 ring-1 ring-blue-500/20 dark:ring-blue-400/20",
} as const;

export function StatCard({
  label,
  value,
  icon: Icon,
  accent = "neutral",
  trend,
}: {
  label: string;
  value: number | string;
  icon: LucideIcon;
  accent?: keyof typeof ACCENT_CLASSES;
  trend?: { value: string; positive: boolean };
}) {
  return (
    <Card className="group transition-all duration-200 hover:shadow-sm">
      <CardContent className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1.5">
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <div className="flex items-baseline gap-2">
            <p className="text-2xl font-semibold tracking-tight text-foreground">{value}</p>
            {trend && (
              <span
                className={cn(
                  "text-xs font-medium",
                  trend.positive ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400",
                )}
              >
                {trend.positive ? "+" : ""}
                {trend.value}
              </span>
            )}
          </div>
        </div>
        <div
          className={cn(
            "flex size-10 shrink-0 items-center justify-center rounded-xl transition-all duration-200",
            ACCENT_CLASSES[accent],
            accent !== "neutral" && "group-hover:scale-105",
          )}
        >
          <Icon className="size-4.5" />
        </div>
      </CardContent>
    </Card>
  );
}
