"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SignOutButton() {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => signOut({ callbackUrl: "/" })}
      className="h-8 gap-1.5 px-3 text-xs text-muted-foreground hover:text-foreground"
    >
      <LogOut className="size-3.5" />
      <span className="hidden sm:inline">Sair</span>
    </Button>
  );
}
