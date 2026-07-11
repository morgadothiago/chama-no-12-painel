import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const ACCENT_CLASSES = {
  neutral: "bg-muted text-muted-foreground",
  emerald: "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400",
  amber: "bg-amber-500/10 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400",
} as const;

export function StatCard({
  label,
  value,
  icon: Icon,
  accent = "neutral",
}: {
  label: string;
  value: number | string;
  icon: LucideIcon;
  accent?: keyof typeof ACCENT_CLASSES;
}) {
  return (
    <Card>
      <CardContent className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1.5">
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <p className="text-2xl font-semibold tracking-tight">{value}</p>
        </div>
        <div className={cn("flex size-9 shrink-0 items-center justify-center rounded-lg", ACCENT_CLASSES[accent])}>
          <Icon className="size-4" />
        </div>
      </CardContent>
    </Card>
  );
}
