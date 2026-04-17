"use client";

import Link from "next/link";
import { Archive, CircleAlert, ShieldAlert } from "lucide-react";
import { PageShell } from "@/components/dashboard/page-shell";
import { Card } from "@/components/ui/card";
import { PageTransition } from "@/components/motion/page-transition";

export default function SavedFootagePage() {
  return (
    <PageTransition>
      <PageShell
        title="Saved Footage"
        description="Camera clips and retained recordings for incident follow-up."
      >
        <div className="grid gap-4 md:grid-cols-2">
          <Link href="/dashboard/saved-footage/alerts" className="block">
            <Card className="glass h-full rounded-2xl p-6 transition-transform duration-300 hover:-translate-y-0.5">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-xl border border-primary/30 bg-primary/10">
                  <CircleAlert className="h-5 w-5 text-primary" />
                </span>
                <div>
                  <div className="text-sm font-semibold">Footage Alerts</div>
                  <div className="text-xs text-muted-foreground">Saved clips linked to active/warning alerts.</div>
                </div>
              </div>
            </Card>
          </Link>
          <Link href="/dashboard/saved-footage/critical-moments" className="block">
            <Card className="glass h-full rounded-2xl p-6 transition-transform duration-300 hover:-translate-y-0.5">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-xl border border-primary/30 bg-primary/10">
                  <ShieldAlert className="h-5 w-5 text-primary" />
                </span>
                <div>
                  <div className="text-sm font-semibold">Critical Moments</div>
                  <div className="text-xs text-muted-foreground">High-priority captures for reports and escalation.</div>
                </div>
              </div>
            </Card>
          </Link>
        </div>

        <Card className="glass rounded-2xl p-6">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <Archive className="h-4 w-4 text-primary" />
            Footage Retention Notes
          </div>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-muted-foreground">
            <li>Saved footage is grouped by camera, zone, and incident timestamp.</li>
            <li>Use child pages to quickly filter footage tied to alerts or critical incidents.</li>
            <li>Report exports should reference clip IDs for auditable investigations.</li>
          </ul>
        </Card>
      </PageShell>
    </PageTransition>
  );
}

