"use client";

import { Camera as CameraIcon, Signal, SignalHigh, SignalLow, SignalZero } from "lucide-react";
import { PageShell } from "@/components/dashboard/page-shell";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useCameras } from "@/hooks/api/use-cameras";
import { PageTransition } from "@/components/motion/page-transition";

function statusDot(status: string) {
  if (status === "Online") return "bg-emerald-400";
  if (status === "Degraded") return "bg-amber-400";
  return "bg-red-400";
}

function signalIcon(status: string) {
  if (status === "Online") return <SignalHigh className="h-4 w-4 text-emerald-200" />;
  if (status === "Degraded") return <SignalLow className="h-4 w-4 text-amber-200" />;
  if (status === "Offline") return <SignalZero className="h-4 w-4 text-red-200" />;
  return <Signal className="h-4 w-4 text-muted-foreground" />;
}

export default function MonitoringPage() {
  const cameras = useCameras();

  return (
    <PageTransition>
      <PageShell
        title="Live Monitoring"
        description="Camera grid mock UI with live status polling."
      >
        {cameras.isError ? (
          <Card className="glass rounded-2xl p-6">
            <div className="text-sm font-semibold">Failed to load cameras</div>
            <div className="mt-1 text-sm text-muted-foreground">
              Please refresh—mock API may be temporarily unavailable.
            </div>
          </Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {cameras.isLoading || !cameras.data
              ? Array.from({ length: 12 }).map((_, i) => (
                  <Skeleton key={i} className="aspect-video rounded-2xl bg-white/5" />
                ))
              : cameras.data.map((c) => (
                  <Card key={c.id} className="glass group overflow-hidden rounded-2xl">
                    <div className="relative aspect-video">
                      <div className="absolute inset-0 bg-gradient-to-br from-white/6 via-transparent to-primary/10" />
                      <div className="absolute inset-0 opacity-70 [background-image:radial-gradient(circle_at_30%_30%,rgba(34,211,238,0.12),transparent_40%),radial-gradient(circle_at_80%_20%,rgba(59,130,246,0.12),transparent_35%)]" />
                      <div className="absolute left-3 top-3 flex items-center gap-2 rounded-full border border-border/60 bg-black/25 px-2.5 py-1 text-xs text-foreground backdrop-blur">
                        <span className={`h-2 w-2 rounded-full ${statusDot(c.status)}`} />
                        {c.status}
                      </div>
                      <div className="absolute right-3 top-3 rounded-full border border-border/60 bg-black/25 p-2 text-foreground backdrop-blur">
                        {signalIcon(c.status)}
                      </div>
                      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-3">
                        <div className="truncate rounded-xl border border-border/60 bg-black/25 px-3 py-2 text-sm backdrop-blur">
                          <div className="flex items-center gap-2">
                            <CameraIcon className="h-4 w-4 text-primary" />
                            <span className="truncate font-medium">{c.name}</span>
                          </div>
                          <div className="mt-0.5 text-xs text-muted-foreground">{c.zone}</div>
                        </div>
                        <div className="hidden rounded-xl border border-border/60 bg-black/25 px-3 py-2 text-xs text-muted-foreground backdrop-blur md:block">
                          Last seen: {new Date(c.lastSeenAt).toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
          </div>
        )}
      </PageShell>
    </PageTransition>
  );
}

