"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  DollarSign,
  User,
  Ticket,
  Car,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { SignOutButton } from "../sign-out-button";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/dashboard/corridas", label: "Corridas", icon: Car, exact: false },
  { href: "/dashboard/motoristas", label: "Motoristas", icon: Users, exact: false },
  { href: "/dashboard/passageiros", label: "Passageiros", icon: User, exact: false },
  { href: "/dashboard/preco", label: "Preço", icon: DollarSign, exact: false },
  { href: "/dashboard/cupons", label: "Cupons", icon: Ticket, exact: false },
];

function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="offcanvas">
      <SidebarHeader className="px-1 pt-2">
        <div className="flex items-center gap-2.5 px-2 py-2">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-sidebar-primary shadow-sm">
            <Image
              src="/logo.png"
              alt=""
              width={20}
              height={20}
              className="size-5 object-contain"
            />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="font-heading text-sm font-semibold text-sidebar-foreground">
              Chama nº 12
            </span>
            <span className="text-[11px] text-sidebar-foreground/50">Painel Administrativo</span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarSeparator />

      <SidebarContent className="px-1 py-1">
        <SidebarGroup>
          <SidebarGroupLabel className="px-2 text-[10px] font-semibold tracking-widest text-sidebar-foreground/40 uppercase">
            Navegação
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-0.5">
              {NAV_ITEMS.map((item) => {
                const isActive = item.exact
                  ? pathname === item.href
                  : pathname === item.href || pathname.startsWith(`${item.href}/`);
                const Icon = item.icon;

                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      isActive={isActive}
                      tooltip={item.label}
                      render={<Link href={item.href} />}
                      className={cn(
                        "group/item relative h-9 rounded-lg px-2.5 transition-colors",
                        isActive && "bg-sidebar-accent",
                      )}
                    >
                      <div
                        className={cn(
                          "flex size-5 shrink-0 items-center justify-center transition-colors",
                          isActive
                            ? "text-sidebar-primary"
                            : "text-sidebar-foreground/45 group-hover/item:text-sidebar-foreground/80",
                        )}
                      >
                        <Icon className="size-4" />
                      </div>
                      <span
                        className={cn(
                          "flex-1 truncate text-sm",
                          isActive ? "font-medium text-sidebar-foreground" : "text-sidebar-foreground/80",
                        )}
                      >
                        {item.label}
                      </span>
                      {isActive && (
                        <div className="absolute -left-1 top-1/2 h-4 w-0.5 -translate-y-1/2 rounded-full bg-sidebar-primary" />
                      )}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="px-1 pb-2">
        <SidebarSeparator className="mb-1" />
        <div className="px-3 py-1.5">
          <p className="text-[11px] text-sidebar-foreground/35">v1.0.0</p>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}

export function DashboardShell({
  user,
  children,
}: {
  user: { name?: string | null; email?: string | null };
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const pageTitle = NAV_ITEMS.find(
    (item) =>
      item.href !== "/dashboard" &&
      (pathname === item.href || pathname.startsWith(`${item.href}/`)),
  )?.label;

  const initials = (user.name ?? user.email ?? "?")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-14 shrink-0 items-center justify-between border-b border-border bg-background/85 px-4 backdrop-blur-md md:px-6">
          <div className="flex items-center gap-2.5">
            <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
            <Separator orientation="vertical" className="h-5" />
            <div className="flex items-center gap-2 md:hidden">
              <div className="flex size-6 items-center justify-center rounded-md bg-primary shadow-xs">
                <Image
                  src="/logo.png"
                  alt=""
                  width={14}
                  height={14}
                  className="size-3.5 object-contain"
                />
              </div>
              <span className="font-heading text-sm font-semibold">Chama nº 12</span>
            </div>
            <span className="hidden text-sm font-medium text-foreground md:block">
              {pageTitle ?? "Dashboard"}
            </span>
          </div>

          <div className="ml-auto flex items-center gap-3">
            <div className="hidden items-center gap-2.5 border-r border-border pr-3 sm:flex">
              <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-secondary text-[11px] font-medium text-secondary-foreground">
                {initials}
              </div>
              <div className="text-right leading-tight">
                <p className="text-sm font-medium text-foreground">{user.name}</p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
              </div>
            </div>
            <SignOutButton />
          </div>
        </header>

        <main className="flex-1 px-4 py-6 md:px-8 md:py-8">
          <div className="mx-auto w-full max-w-7xl">{children}</div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
