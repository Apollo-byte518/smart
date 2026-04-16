"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { dashboardNav } from "@/components/dashboard/nav-items";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/brand/logo";

export function MobileSidebar() {
  const pathname = usePathname();

  return (
    <Sheet>
      <SheetTrigger
        render={
          <Button
            variant="secondary"
            size="icon"
            className="bg-white/5 hover:bg-white/10 md:hidden"
            aria-label="Open navigation"
          >
            <Menu className="h-5 w-5" />
          </Button>
        }
      />
      <SheetContent side="left" className="w-[320px] border-border/60 bg-background/70 p-0">
        <div className="flex h-16 items-center justify-between px-4">
          <SheetHeader>
            <SheetTitle>
              <Logo href="/dashboard" />
            </SheetTitle>
          </SheetHeader>
        </div>
        <div className="px-3 pb-6">
          <nav className="grid gap-1">
            {dashboardNav.map((item) => {
              const active =
                pathname === item.href ||
                (item.href !== "/dashboard" && pathname.startsWith(item.href));
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition-colors",
                    active
                      ? "bg-white/[0.06] text-foreground ring-1 ring-primary/20"
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
        </div>
      </SheetContent>
    </Sheet>
  );
}

