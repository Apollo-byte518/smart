"use client";

import Link from "next/link";
import { PageShell } from "@/components/dashboard/page-shell";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useStats } from "@/hooks/api/use-stats";
import { useAlerts } from "@/hooks/api/use-alerts";
import { AlertsTrendChart } from "@/components/charts/alerts-trend";
import { SeverityBreakdownChart } from "@/components/charts/severity-breakdown";
import { PageTransition } from "@/components/motion/page-transition";

export default function ReportsPage() {
  const stats = useStats();
  const alerts = useAlerts();

  const items = alerts.data ?? [];
  const critical = items.filter((a) => a.severity === "critical").length;
  const warning = items.filter((a) => a.severity === "warning").length;
  const active = items.filter((a) => a.severity === "active").length;

  return (
    <PageTransition>
      <PageShell
        title="Reports"
        description="Analytics dashboard with charts and KPIs."
      >
        <div className="grid gap-4 lg:grid-cols-3">
          <Card className="glass rounded-2xl p-6 lg:col-span-2">
            <div className="text-sm font-semibold">Trends</div>
            <div className="mt-1 text-sm text-muted-foreground">
              Alerts and access event series (mock).
            </div>
            <div className="mt-4">
              {stats.isLoading || !stats.data ? (
                <Skeleton className="h-[320px] rounded-2xl bg-white/5" />
              ) : (
                <AlertsTrendChart stats={stats.data} />
              )}
            </div>
          </Card>

          <Card className="glass rounded-2xl p-6">
            <div className="text-sm font-semibold">Severity breakdown</div>
            <div className="mt-1 text-sm text-muted-foreground">
              Live alerts by category.
            </div>
            <div className="mt-4">
              {alerts.isLoading ? (
                <Skeleton className="h-[260px] rounded-2xl bg-white/5" />
              ) : alerts.isError ? (
                <div className="rounded-2xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                  Failed to load alerts.
                </div>
              ) : (
                <SeverityBreakdownChart critical={critical} warning={warning} active={active} />
              )}
            </div>
          </Card>
        </div>

        <Card className="glass rounded-2xl p-6">
          <div className="text-sm font-semibold">Operational summary</div>
          <div className="mt-1 text-sm text-muted-foreground">
            Snapshot of the system based on mock stats feed.
          </div>
          <div className="mt-5 grid gap-4 md:grid-cols-4">
            {stats.isLoading || !stats.data ? (
              <>
                <Skeleton className="h-20 rounded-2xl bg-white/5" />
                <Skeleton className="h-20 rounded-2xl bg-white/5" />
                <Skeleton className="h-20 rounded-2xl bg-white/5" />
                <Skeleton className="h-20 rounded-2xl bg-white/5" />
              </>
            ) : (
              <>
                <div className="glass rounded-2xl p-4">
                  <div className="text-xs text-muted-foreground">Total Students</div>
                  <div className="mt-1 text-xl font-semibold">
                    {stats.data.totalStudents.toLocaleString()}
                  </div>
                </div>
                <div className="glass rounded-2xl p-4">
                  <div className="text-xs text-muted-foreground">Active Cameras</div>
                  <div className="mt-1 text-xl font-semibold">
                    {stats.data.activeCameras.toLocaleString()}
                  </div>
                </div>
                <div className="glass rounded-2xl p-4">
                  <div className="text-xs text-muted-foreground">Security Alerts</div>
                  <div className="mt-1 text-xl font-semibold">
                    {stats.data.securityAlerts.toLocaleString()}
                  </div>
                </div>
                <div className="glass rounded-2xl p-4">
                  <div className="text-xs text-muted-foreground">System Status</div>
                  <div className="mt-1 text-xl font-semibold">{stats.data.systemStatus}</div>
                </div>
              </>
            )}
          </div>
        </Card>

        <div className="w-fit">
          <Card className="glass w-fit rounded-xl p-3">
            <div className="text-sm font-semibold">Footage in reports</div>
            <div className="mt-1 max-w-[280px] text-xs text-muted-foreground">
              Review report-ready footage from alert captures and critical moments.
            </div>
            <div className="mt-3 grid max-w-[210px] gap-2">
              <Link
                href="/dashboard/saved-footage/alerts"
                className="inline-flex h-7 items-center justify-center rounded-md border border-border/60 bg-white/[0.04] px-2 text-[10px] font-medium text-foreground/90 transition-colors hover:bg-white/[0.09] hover:text-foreground"
              >
                Open Footage Alerts
              </Link>
              <Link
                href="/dashboard/saved-footage/critical-moments"
                className="inline-flex h-7 items-center justify-center rounded-md border border-border/60 bg-white/[0.04] px-2 text-[10px] font-medium text-foreground/90 transition-colors hover:bg-white/[0.09] hover:text-foreground"
              >
                Open Critical Moments
              </Link>
            </div>
          </Card>
        </div>
      </PageShell>
    </PageTransition>
  );
}

