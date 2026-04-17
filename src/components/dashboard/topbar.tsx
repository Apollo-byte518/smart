"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bell, Home, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/use-auth";
import { useAlerts } from "@/hooks/api/use-alerts";
import { StatusBadge } from "@/components/status-badge";

export function Topbar() {
  const router = useRouter();
  const { logout } = useAuth();
  const alerts = useAlerts();
  const [notificationsOpen, setNotificationsOpen] = React.useState(false);
  const [accountOpen, setAccountOpen] = React.useState(false);
  const notificationsRef = React.useRef<HTMLDivElement | null>(null);
  const accountRef = React.useRef<HTMLDivElement | null>(null);

  const items = alerts.data ?? [];
  const unread = items.filter((a) => a.severity !== "active").length;
  const preview = items.slice(0, 3);

  React.useEffect(() => {
    const onPointerDown = (ev: MouseEvent) => {
      if (!notificationsRef.current) return;
      if (!notificationsRef.current.contains(ev.target as Node)) {
        setNotificationsOpen(false);
      }
      if (!accountRef.current) return;
      if (!accountRef.current.contains(ev.target as Node)) {
        setAccountOpen(false);
      }
    };
    const onKeyDown = (ev: KeyboardEvent) => {
      if (ev.key === "Escape") {
        setNotificationsOpen(false);
        setAccountOpen(false);
      }
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  return (
    <header className="sticky top-0 z-30 border-b border-border/60 bg-background/45 backdrop-blur-xl">
      <div className="flex h-16 items-center gap-3 px-4">
        <div className="ml-auto flex items-center gap-2">
          <Button
            variant="secondary"
            className="bg-white/5 hover:bg-white/10"
            render={<Link href="/" />}
          >
            <Home className="h-4 w-4" />
            <span className="hidden md:inline">Back to site</span>
          </Button>

          <div ref={notificationsRef} className="relative">
            <Button
              variant="secondary"
              size="icon"
              className="relative bg-white/5 hover:bg-white/10"
              aria-label="Notifications"
              onClick={() => setNotificationsOpen((prev) => !prev)}
            >
              <Bell className="h-5 w-5" />
              {unread > 0 ? (
                <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-primary px-1 text-[10px] font-semibold text-primary-foreground">
                  {unread}
                </span>
              ) : null}
            </Button>

            {notificationsOpen ? (
              <div className="absolute right-0 top-[calc(100%+8px)] z-50 w-[340px] rounded-lg border border-border/60 bg-popover p-2 text-popover-foreground shadow-lg">
                <div className="px-2 py-1 text-xs font-medium text-muted-foreground">
                  Notifications
                </div>
                <div className="my-1 h-px bg-border" />
                {alerts.isError ? (
                  <div className="px-3 py-2 text-sm text-destructive">Failed to load alerts.</div>
                ) : preview.length === 0 ? (
                  <div className="px-3 py-2 text-sm text-muted-foreground">No alerts right now.</div>
                ) : (
                  <div className="grid gap-2 px-1 py-1">
                    {preview.map((a) => (
                      <Link
                        key={a.id}
                        href="/dashboard/alerts"
                        onClick={() => setNotificationsOpen(false)}
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
                <div className="my-1 h-px bg-border" />
                <Link
                  href="/dashboard/alerts"
                  onClick={() => setNotificationsOpen(false)}
                  className="block rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-accent hover:text-accent-foreground"
                >
                  View all alerts
                </Link>
              </div>
            ) : null}
          </div>

          <div ref={accountRef} className="relative">
            <Button
              variant="secondary"
              className="bg-white/5 hover:bg-white/10"
              onClick={() => setAccountOpen((prev) => !prev)}
            >
              <Avatar className="mr-2 h-6 w-6">
                <AvatarFallback className="bg-primary/15 text-primary">OP</AvatarFallback>
              </Avatar>
              <span className="hidden text-sm md:inline">Operator</span>
            </Button>

            {accountOpen ? (
              <div className="absolute right-0 top-[calc(100%+8px)] z-50 w-52 rounded-lg border border-border/60 bg-popover p-2 text-popover-foreground shadow-lg">
                <div className="px-2 py-1 text-xs font-medium text-muted-foreground">Account</div>
                <div className="my-1 h-px bg-border" />
                <button
                  type="button"
                  className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-accent hover:text-accent-foreground"
                  onClick={() => {
                    setAccountOpen(false);
                    logout();
                    router.replace("/login");
                  }}
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </header>
  );
}

