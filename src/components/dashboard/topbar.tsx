"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bell, Home, LogOut, Search } from "lucide-react";
import { MobileSidebar } from "@/components/dashboard/mobile-sidebar";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/use-auth";
import { useAlerts } from "@/hooks/api/use-alerts";
import { StatusBadge } from "@/components/status-badge";

export function Topbar() {
  const router = useRouter();
  const { logout } = useAuth();
  const alerts = useAlerts();

  const items = alerts.data ?? [];
  const unread = items.filter((a) => a.severity !== "active").length;
  const preview = items.slice(0, 3);

  return (
    <header className="sticky top-0 z-30 border-b border-border/60 bg-background/45 backdrop-blur-xl">
      <div className="flex h-16 items-center gap-3 px-4">
        <MobileSidebar />
        <div className="relative hidden w-[520px] max-w-[48vw] md:block">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search alerts, users, cameras..."
            className="h-10 bg-white/5 pl-9"
          />
        </div>

        <div className="ml-auto flex items-center gap-2">
          <Button
            variant="secondary"
            className="bg-white/5 hover:bg-white/10"
            render={<Link href="/" />}
          >
            <Home className="h-4 w-4" />
            <span className="hidden md:inline">Back to site</span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  variant="secondary"
                  size="icon"
                  className="relative bg-white/5 hover:bg-white/10"
                  aria-label="Notifications"
                >
                  <Bell className="h-5 w-5" />
                  {unread > 0 ? (
                    <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-primary px-1 text-[10px] font-semibold text-primary-foreground shadow-[0_0_18px_theme(colors.primary/0.35)]">
                      {unread}
                    </span>
                  ) : null}
                </Button>
              }
            />
            <DropdownMenuContent align="end" className="w-[340px]">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {alerts.isError ? (
                <div className="px-3 py-2 text-sm text-destructive">Failed to load alerts.</div>
              ) : preview.length === 0 ? (
                <div className="px-3 py-2 text-sm text-muted-foreground">No alerts right now.</div>
              ) : (
                <div className="grid gap-2 px-2 py-2">
                  {preview.map((a) => (
                    <Link
                      key={a.id}
                      href="/dashboard/alerts"
                      className="glass rounded-xl px-3 py-2 transition-colors hover:bg-white/[0.06]"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="truncate text-sm font-medium">{a.title}</div>
                        <StatusBadge severity={a.severity} />
                      </div>
                      <div className="mt-1 line-clamp-1 text-xs text-muted-foreground">
                        {a.location} • {a.source}
                      </div>
                    </Link>
                  ))}
                </div>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem render={<Link href="/dashboard/alerts" />}>
                View all alerts
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button variant="secondary" className="bg-white/5 hover:bg-white/10">
                  <Avatar className="mr-2 h-6 w-6">
                    <AvatarFallback className="bg-primary/15 text-primary">OP</AvatarFallback>
                  </Avatar>
                  <span className="hidden text-sm md:inline">Operator</span>
                </Button>
              }
            />
            <DropdownMenuContent align="end" className="w-52">
              <DropdownMenuLabel>Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  logout();
                  router.replace("/login");
                }}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}

