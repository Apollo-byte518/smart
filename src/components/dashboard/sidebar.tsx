"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { dashboardNav } from "@/components/dashboard/nav-items";
import { Logo } from "@/components/brand/logo";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-[280px] shrink-0 border-r border-border/60 bg-background/40 backdrop-blur-xl md:block">
      <div className="flex h-16 items-center px-4">
        <Logo href="/dashboard" />
      </div>
      <div className="px-3 pb-6">
        <Separator className="mb-4 bg-border/60" />
        <nav className="grid gap-1">
          {dashboardNav.map((item) => {
            const active =
              pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition-colors",
                  active
                    ? "bg-white/[0.06] text-foreground ring-1 ring-primary/20 shadow-[0_0_28px_theme(colors.primary/0.08)]"
                    : "text-muted-foreground hover:bg-white/5 hover:text-foreground",
                )}
              >
                <span
                  className={cn(
                    "grid h-9 w-9 place-items-center rounded-xl border border-border/60 bg-white/5",
                    active && "border-primary/30 bg-primary/10",
                  )}
                >
                  <Icon
                    className={cn(
                      "h-[18px] w-[18px]",
                      active ? "text-primary" : "text-foreground",
                    )}
                  />
                </span>
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="mt-6 rounded-2xl border border-border/60 bg-white/[0.04] p-4">
          <div className="text-xs text-muted-foreground">System</div>
          <div className="mt-2 text-sm font-medium">Smart Secure Campus</div>
          <div className="mt-1 text-xs text-muted-foreground">
            Futuristic monitoring and alert triage.
          </div>
        </div>
      </div>
    </aside>
  );
}

