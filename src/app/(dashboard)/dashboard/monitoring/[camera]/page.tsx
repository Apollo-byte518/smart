"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Camera as CameraIcon, Signal, SignalHigh, SignalLow, SignalZero } from "lucide-react";
import { PageShell } from "@/components/dashboard/page-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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

export default function CameraFullscreenPage() {
  const router = useRouter();
  const params = useParams<{ camera: string }>();
  const cameras = useCameras();
  const cameraName = decodeURIComponent(params.camera ?? "");

  const camera = cameras.data?.find((c) => c.name.toLowerCase() === cameraName.toLowerCase());

  return (
    <PageTransition>
      <PageShell
        title={camera ? `${camera.name} - Full View` : "Camera Full View"}
        description="Dedicated full-page camera view."
        actions={
          <Button
            variant="secondary"
            className="bg-white/5 hover:bg-white/10"
            onClick={() => router.replace("/dashboard/monitoring")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to monitoring
          </Button>
        }
      >
        {cameras.isLoading ? (
          <Skeleton className="h-[70vh] rounded-2xl bg-white/5" />
        ) : !camera ? (
          <Card className="glass rounded-2xl p-6">
            <div className="text-sm font-semibold">Camera not found</div>
            <div className="mt-1 text-sm text-muted-foreground">
              We couldn&apos;t find <span className="font-medium text-foreground">{cameraName}</span>.
            </div>
            <div className="mt-4">
              <Link href="/dashboard/monitoring" className="text-sm text-primary hover:underline">
                Return to camera grid
              </Link>
            </div>
          </Card>
        ) : (
          <Card className="glass overflow-hidden rounded-2xl">
            <div className="relative h-[72vh] min-h-[520px]">
              <div className="absolute inset-0 bg-gradient-to-br from-white/6 via-transparent to-primary/10" />
              <div className="absolute inset-0 opacity-75 [background-image:radial-gradient(circle_at_30%_30%,rgba(34,211,238,0.14),transparent_42%),radial-gradient(circle_at_80%_20%,rgba(59,130,246,0.14),transparent_38%)]" />

              <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full border border-border/60 bg-black/30 px-3 py-1 text-xs text-foreground backdrop-blur">
                <span className={`h-2 w-2 rounded-full ${statusDot(camera.status)}`} />
                {camera.status}
              </div>
              <div className="absolute right-4 top-4 rounded-full border border-border/60 bg-black/30 p-2 text-foreground backdrop-blur">
                {signalIcon(camera.status)}
              </div>

              <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-4">
                <div className="rounded-xl border border-border/60 bg-black/30 px-4 py-3 backdrop-blur">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <CameraIcon className="h-4 w-4 text-primary" />
                    {camera.name}
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">Zone: {camera.zone}</div>
                </div>
                <div className="rounded-xl border border-border/60 bg-black/30 px-4 py-3 text-xs text-muted-foreground backdrop-blur">
                  Last seen: {new Date(camera.lastSeenAt).toLocaleString()}
                </div>
              </div>
            </div>
          </Card>
        )}
      </PageShell>
    </PageTransition>
  );
}

