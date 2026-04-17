"use client";

import { CircleAlert, Film } from "lucide-react";
import { PageShell } from "@/components/dashboard/page-shell";
import { Card } from "@/components/ui/card";
import { PageTransition } from "@/components/motion/page-transition";

export default function SavedFootageAlertsPage() {
  return (
    <PageTransition>
      <PageShell
        title="Footage Alerts"
        description="Saved clips mapped to warning and active alert events."
      >
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="glass rounded-2xl p-4">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Film className="h-4 w-4 text-primary" />
                  Clip #{String(i + 1).padStart(3, "0")}
                </div>
                <span className="rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 text-[10px] text-primary">
                  Alert linked
                </span>
              </div>
              <div className="mt-2 text-xs text-muted-foreground">
                Zone: {["North Gate", "Library", "Engineering", "Parking"][i % 4]}
              </div>
              <div className="mt-1 text-xs text-muted-foreground">
                Captured at: {new Date(Date.now() - i * 7 * 60_000).toLocaleString()}
              </div>
            </Card>
          ))}
        </div>

        <Card className="glass rounded-2xl p-6">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <CircleAlert className="h-4 w-4 text-primary" />
            Alerts Footage Usage
          </div>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-muted-foreground">
            <li>Use this queue when triaging alerts that need visual confirmation.</li>
            <li>Attach selected clip IDs to incident notes and operator actions.</li>
            <li>Promote relevant clips to critical moments for report-ready evidence.</li>
          </ul>
        </Card>
      </PageShell>
    </PageTransition>
  );
}

