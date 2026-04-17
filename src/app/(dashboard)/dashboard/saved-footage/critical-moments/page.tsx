"use client";

import { ShieldAlert, TriangleAlert } from "lucide-react";
import { PageShell } from "@/components/dashboard/page-shell";
import { Card } from "@/components/ui/card";
import { PageTransition } from "@/components/motion/page-transition";

export default function SavedFootageCriticalMomentsPage() {
  return (
    <PageTransition>
      <PageShell
        title="Critical Moments"
        description="High-severity footage snapshots prepared for reports and escalation."
      >
        <div className="grid gap-4 md:grid-cols-2">
          {[
            { title: "Perimeter breach signal", zone: "North Gate" },
            { title: "After-hours access anomaly", zone: "Engineering Building" },
            { title: "Camera tamper event", zone: "Library Entrance" },
            { title: "Unauthorized door attempt", zone: "Admin Hall" },
          ].map((item) => (
            <Card key={item.title} className="glass rounded-2xl p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-sm font-semibold">{item.title}</div>
                  <div className="mt-1 text-xs text-muted-foreground">{item.zone}</div>
                </div>
                <span className="rounded-full border border-destructive/30 bg-destructive/10 px-2 py-0.5 text-[10px] text-destructive">
                  Critical
                </span>
              </div>
              <div className="mt-3 text-xs text-muted-foreground">
                Saved for reporting at {new Date().toLocaleTimeString()}.
              </div>
            </Card>
          ))}
        </div>

        <Card className="glass rounded-2xl p-6">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <ShieldAlert className="h-4 w-4 text-primary" />
            Reports-ready critical footage
          </div>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-muted-foreground">
            <li>Critical moments are intended for executive summaries and incident reports.</li>
            <li>Each item should include camera ID, zone, timestamp, and linked alert ID.</li>
            <li>Review before export to avoid false-positive escalation in final reports.</li>
          </ul>
          <div className="mt-4 inline-flex items-center gap-2 rounded-lg border border-border/60 bg-white/5 px-3 py-2 text-xs text-muted-foreground">
            <TriangleAlert className="h-4 w-4 text-amber-300" />
            Tip: verify camera health at capture time before finalizing evidence.
          </div>
        </Card>
      </PageShell>
    </PageTransition>
  );
}

