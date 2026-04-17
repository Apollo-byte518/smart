"use client";

import * as React from "react";
import { Camera as CameraIcon, Signal, SignalHigh, SignalLow, SignalZero } from "lucide-react";
import { PageShell } from "@/components/dashboard/page-shell";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useCameras } from "@/hooks/api/use-cameras";
import { PageTransition } from "@/components/motion/page-transition";
import type { Camera } from "@/types/api";

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
  const [selectedCamera, setSelectedCamera] = React.useState<Camera | null>(null);

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
                  <Card
                    key={c.id}
                    className="glass group cursor-pointer overflow-hidden rounded-2xl transition-transform duration-300 hover:scale-[1.02]"
                    role="button"
                    tabIndex={0}
                    onClick={() => setSelectedCamera(c)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setSelectedCamera(c);
                      }
                    }}
                  >
                    <div className="relative aspect-video">
                      <div className="absolute inset-0 transition-transform duration-500 ease-out group-hover:scale-110">
                        <div className="absolute inset-0 bg-gradient-to-br from-white/6 via-transparent to-primary/10" />
                        <div className="absolute inset-0 opacity-70 [background-image:radial-gradient(circle_at_30%_30%,rgba(34,211,238,0.12),transparent_40%),radial-gradient(circle_at_80%_20%,rgba(59,130,246,0.12),transparent_35%)]" />
                      </div>
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

        {selectedCamera ? (
          <div
            className="fixed inset-0 z-50 grid place-items-center bg-black/65 p-4 backdrop-blur-sm"
            onClick={() => setSelectedCamera(null)}
          >
            <Card
              className="glass w-full max-w-3xl overflow-hidden rounded-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative aspect-video">
                <div className="absolute inset-0 bg-gradient-to-br from-white/6 via-transparent to-primary/10" />
                <div className="absolute inset-0 opacity-70 [background-image:radial-gradient(circle_at_30%_30%,rgba(34,211,238,0.12),transparent_40%),radial-gradient(circle_at_80%_20%,rgba(59,130,246,0.12),transparent_35%)]" />

                <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full border border-border/60 bg-black/30 px-3 py-1 text-xs text-foreground backdrop-blur">
                  <span className={`h-2 w-2 rounded-full ${statusDot(selectedCamera.status)}`} />
                  {selectedCamera.status}
                </div>
                <div className="absolute right-4 top-4 rounded-full border border-border/60 bg-black/30 p-2 text-foreground backdrop-blur">
                  {signalIcon(selectedCamera.status)}
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedCamera(null)}
                  className="absolute bottom-4 right-4 rounded-full border border-border/60 bg-black/30 px-3 py-1 text-xs text-foreground backdrop-blur transition-colors hover:bg-black/45"
                >
                  Close
                </button>
              </div>

              <div className="grid gap-4 border-t border-border/60 p-4 md:grid-cols-3">
                <div className="md:col-span-2">
                  <div className="text-base font-semibold">{selectedCamera.name}</div>
                  <div className="mt-1 text-sm text-muted-foreground">
                    Zone: {selectedCamera.zone}
                  </div>
                </div>
                <div className="text-sm text-muted-foreground md:text-right">
                  Last seen: {new Date(selectedCamera.lastSeenAt).toLocaleString()}
                </div>
              </div>
            </Card>
          </div>
        ) : null}
      </PageShell>
    </PageTransition>
  );
}

