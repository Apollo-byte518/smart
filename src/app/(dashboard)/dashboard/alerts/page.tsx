"use client";

import * as React from "react";
import { PageShell } from "@/components/dashboard/page-shell";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAlerts } from "@/hooks/api/use-alerts";
import { StatusBadge } from "@/components/status-badge";
import { PageTransition } from "@/components/motion/page-transition";

export default function AlertsPage() {
  const alerts = useAlerts();
  const [filter, setFilter] = React.useState<"all" | "warning" | "critical">("all");

  const items = alerts.data ?? [];
  const filtered =
    filter === "all" ? items : items.filter((a) => a.severity === filter);

  return (
    <PageTransition>
      <PageShell
        title="Alerts"
        description="Real-time alerts list with severity filtering and live polling."
        actions={
          <Tabs value={filter} onValueChange={(v) => setFilter(v as typeof filter)}>
            <TabsList className="bg-white/5">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="warning">Warning</TabsTrigger>
              <TabsTrigger value="critical">Critical</TabsTrigger>
            </TabsList>
          </Tabs>
        }
      >
        <Card className="glass overflow-hidden rounded-2xl">
          <div className="border-b border-border/60 px-5 py-4">
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold">Incoming feed</div>
              <div className="text-xs text-muted-foreground">
                Polling every <span className="text-foreground">3s</span>
              </div>
            </div>
          </div>

          <div className="divide-y divide-border/60">
            {alerts.isLoading ? (
              <div className="grid gap-3 p-5">
                <Skeleton className="h-16 rounded-2xl bg-white/5" />
                <Skeleton className="h-16 rounded-2xl bg-white/5" />
                <Skeleton className="h-16 rounded-2xl bg-white/5" />
                <Skeleton className="h-16 rounded-2xl bg-white/5" />
              </div>
            ) : alerts.isError ? (
              <div className="p-5">
                <div className="rounded-2xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                  Failed to load alerts.
                </div>
              </div>
            ) : filtered.length === 0 ? (
              <div className="p-5">
                <div className="rounded-2xl border border-border/60 bg-white/5 px-4 py-3 text-sm text-muted-foreground">
                  No alerts in this category.
                </div>
              </div>
            ) : (
              filtered.map((a) => (
                <div key={a.id} className="px-5 py-4 transition-colors hover:bg-white/[0.03]">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 space-y-1">
                      <div className="flex items-center gap-2">
                        <div className="truncate text-sm font-semibold">{a.title}</div>
                        <StatusBadge severity={a.severity} />
                      </div>
                      <div className="text-sm text-muted-foreground">{a.description}</div>
                      <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
                        <span>{a.location}</span>
                        <span>•</span>
                        <span>{a.source}</span>
                        <span>•</span>
                        <span>{new Date(a.createdAt).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </PageShell>
    </PageTransition>
  );
}

