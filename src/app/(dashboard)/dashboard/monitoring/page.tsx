"use client";

import * as React from "react";
import {
  Camera as CameraIcon,
  Expand,
  Search,
  Signal,
  SignalHigh,
  SignalLow,
  SignalZero,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { PageShell } from "@/components/dashboard/page-shell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
  const router = useRouter();
  const cameras = useCameras();
  const [selectedCamera, setSelectedCamera] = React.useState<Camera | null>(null);
  const [query, setQuery] = React.useState("");
  const [focusedCameraId, setFocusedCameraId] = React.useState<string | null>(null);
  const [pendingFocusAfterModal, setPendingFocusAfterModal] = React.useState<string | null>(null);
  const cardRefs = React.useRef<Record<string, HTMLDivElement | null>>({});

  const focusCameraInGrid = React.useCallback((cameraId: string) => {
    setFocusedCameraId(cameraId);
    cardRefs.current[cameraId]?.scrollIntoView({ behavior: "smooth", block: "center" });
    window.setTimeout(() => setFocusedCameraId(null), 1800);
  }, []);

  const jumpToCamera = React.useCallback(() => {
    if (!cameras.data?.length) return;
    const q = query.trim().toLowerCase();
    if (!q) return;

    const match =
      cameras.data.find((c) => c.name.toLowerCase() === q) ??
      cameras.data.find((c) => c.name.toLowerCase().includes(q));

    if (!match) return;
    setPendingFocusAfterModal(match.id);
    setSelectedCamera(match);
  }, [cameras.data, query]);

  const closeModal = React.useCallback(() => {
    const selectedId = selectedCamera?.id ?? null;
    setSelectedCamera(null);
    const targetId = pendingFocusAfterModal ?? selectedId;
    setPendingFocusAfterModal(null);
    if (!targetId) return;
    window.setTimeout(() => focusCameraInGrid(targetId), 120);
  }, [focusCameraInGrid, pendingFocusAfterModal, selectedCamera?.id]);

  return (
    <PageTransition>
      <PageShell
        title="Live Monitoring"
        description="Camera grid mock UI with live status polling."
      >
        <Card className="glass rounded-xl p-3">
          <form
            className="flex flex-col gap-2 sm:flex-row sm:items-center"
            onSubmit={(e) => {
              e.preventDefault();
              jumpToCamera();
            }}
          >
            <div className="relative min-w-0 flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search camera (e.g. CAM-011)"
                className="h-9 bg-white/5 pl-9 text-sm"
              />
            </div>
            <Button type="submit" className="h-9 px-3 text-xs">
              Go to camera
            </Button>
          </form>
        </Card>

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
                    ref={(el) => {
                      cardRefs.current[c.id] = el;
                    }}
                    className={[
                      "glass group cursor-pointer overflow-hidden rounded-2xl transition-transform duration-300 hover:scale-[1.02]",
                      focusedCameraId === c.id ? "ring-2 ring-primary shadow-[0_0_28px_theme(colors.primary/0.35)]" : "",
                    ].join(" ")}
                    role="button"
                    tabIndex={0}
                    onClick={() => {
                      setPendingFocusAfterModal(null);
                      setSelectedCamera(c);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setPendingFocusAfterModal(null);
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
                      <div className="absolute right-3 top-3 flex items-center gap-2">
                        <button
                          type="button"
                          className="rounded-full border border-border/60 bg-black/25 p-2 text-foreground backdrop-blur transition-colors hover:bg-black/40"
                          aria-label={`Open ${c.name} in full view`}
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/dashboard/monitoring/${encodeURIComponent(c.name)}`);
                          }}
                        >
                          <Expand className="h-4 w-4" />
                        </button>
                        <div className="rounded-full border border-border/60 bg-black/25 p-2 text-foreground backdrop-blur">
                          {signalIcon(c.status)}
                        </div>
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
            className="fixed inset-0 z-50 grid items-start justify-center bg-black/65 p-4 pt-20 backdrop-blur-sm"
            onClick={closeModal}
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
                <div className="absolute right-4 top-4 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      router.push(
                        `/dashboard/monitoring/${encodeURIComponent(selectedCamera.name)}`,
                      )
                    }
                    className="rounded-full border border-border/60 bg-black/30 p-2 text-foreground backdrop-blur transition-colors hover:bg-black/45"
                    aria-label="Open full page camera view"
                  >
                    <Expand className="h-4 w-4" />
                  </button>
                  <div className="rounded-full border border-border/60 bg-black/30 p-2 text-foreground backdrop-blur">
                    {signalIcon(selectedCamera.status)}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={closeModal}
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

