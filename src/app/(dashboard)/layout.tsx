"use client";

import * as React from "react";
import { usePathname, useRouter } from "next/navigation";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Topbar } from "@/components/dashboard/topbar";
import { isAuthedClient } from "@/lib/auth";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [ready, setReady] = React.useState(false);

  React.useEffect(() => {
    if (!isAuthedClient()) {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
      return;
    }
    setReady(true);
  }, [pathname, router]);

  if (!ready) {
    return (
      <div className="flex min-h-full flex-1">
        <div className="hidden w-[280px] border-r border-border/60 md:block" />
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="h-16 border-b border-border/60" />
          <div className="grid gap-4 p-4 md:p-6">
            <div className="grid gap-4 md:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-28 rounded-2xl bg-white/5" />
              ))}
            </div>
            <Skeleton className="h-[320px] rounded-2xl bg-white/5" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-full flex-1">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar />
        <main className="min-w-0 flex-1 px-4 py-6 md:px-6">{children}</main>
      </div>
    </div>
  );
}

