"use client";

import { cn } from "@/lib/utils";
import { useState } from "react";

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (first + last).toUpperCase();
}

export function DriverAvatar({
  nome,
  avatarUrl,
  className,
}: {
  nome: string;
  avatarUrl: string | null;
  className?: string;
}) {
  const [imgError, setImgError] = useState(false);

  if (avatarUrl && !imgError) {
    return (
      <img
        src={avatarUrl}
        alt={nome}
        onError={() => setImgError(true)}
        className={cn("size-8 shrink-0 rounded-full object-cover", className)}
      />
    );
  }

  return (
    <div
      className={cn(
        "flex size-8 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-medium text-secondary-foreground",
        className
      )}
      aria-hidden
    >
      {getInitials(nome)}
    </div>
  );
}
