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
  LogOut,
  ChevronRight,
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
      <SidebarHeader>
        <div className="flex items-center gap-3 px-2 py-1">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary shadow-sm">
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
            <span className="text-[11px] text-muted-foreground">Painel Administrativo</span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarSeparator />

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navegação</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
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
                        "group/item relative",
                        isActive && "after:absolute after:bottom-1.5 after:left-2 after:right-2 after:top-1.5 after:rounded-md after:bg-primary/10",
                      )}
                    >
                      <div
                        className={cn(
                          "flex size-5 shrink-0 items-center justify-center transition-colors",
                          isActive ? "text-primary" : "text-sidebar-foreground/60 group-hover/item:text-sidebar-foreground",
                        )}
                      >
                        <Icon className="size-4" />
                      </div>
                      <span className="flex-1 truncate text-sm font-medium">{item.label}</span>
                      {isActive && (
                        <div className="absolute -left-3 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-primary" />
                      )}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <div className="px-3 py-2">
          <p className="text-[11px] text-muted-foreground">v1.0.0</p>
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

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-14 shrink-0 items-center justify-between border-b border-border bg-background/80 px-4 backdrop-blur-sm md:px-6">
          <div className="flex items-center gap-2">
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
            {pageTitle && (
              <>
                <ChevronRight className="hidden size-4 text-muted-foreground/50 md:block" />
                <span className="hidden text-sm font-medium text-muted-foreground md:block">
                  {pageTitle}
                </span>
              </>
            )}
          </div>

          <div className="ml-auto flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-medium leading-tight text-foreground">{user.name}</p>
              <p className="text-xs leading-tight text-muted-foreground">{user.email}</p>
            </div>
            <SignOutButton />
          </div>
        </header>

        <main className="flex-1 px-4 py-6 md:px-8 md:py-8">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
