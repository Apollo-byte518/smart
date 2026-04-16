"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { PageShell } from "@/components/dashboard/page-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { logoutClient } from "@/lib/auth";
import { PageTransition } from "@/components/motion/page-transition";

export default function SettingsPage() {
  const router = useRouter();
  const [polling, setPolling] = React.useState<"balanced" | "fast" | "eco">("balanced");

  return (
    <PageTransition>
      <PageShell title="Settings" description="Preferences and system configuration (mock).">
        <div className="grid gap-4 lg:grid-cols-2">
          <Card className="glass rounded-2xl p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="text-sm font-semibold">Appearance</div>
                <div className="text-sm text-muted-foreground">
                  Dark mode is default (premium neon theme).
                </div>
              </div>
              <Badge variant="outline" className="rounded-full border-primary/30 bg-primary/10 text-primary">
                Dark
              </Badge>
            </div>
            <div className="mt-4 text-sm text-muted-foreground">
              Theme switching can be enabled later, but the product is intentionally optimized for
              dark security operations rooms.
            </div>
          </Card>

          <Card className="glass rounded-2xl p-6">
            <div className="space-y-1">
              <div className="text-sm font-semibold">Real-time updates</div>
              <div className="text-sm text-muted-foreground">
                Tune polling for your environment.
              </div>
            </div>
            <div className="mt-4 grid gap-2">
              {[
                { id: "eco", label: "Eco", desc: "Lower refresh rate (battery friendly)" },
                { id: "balanced", label: "Balanced", desc: "Recommended for most use" },
                { id: "fast", label: "Fast", desc: "Higher refresh rate (SOC mode)" },
              ].map((o) => (
                <button
                  key={o.id}
                  type="button"
                  onClick={() => setPolling(o.id as typeof polling)}
                  className={[
                    "flex w-full items-start justify-between gap-4 rounded-2xl border border-border/60 bg-white/5 px-4 py-3 text-left transition-colors hover:bg-white/[0.08]",
                    polling === o.id ? "neon-ring border-primary/30" : "",
                  ].join(" ")}
                >
                  <div>
                    <div className="text-sm font-medium">{o.label}</div>
                    <div className="text-sm text-muted-foreground">{o.desc}</div>
                  </div>
                  {polling === o.id ? (
                    <Badge
                      variant="outline"
                      className="rounded-full border-primary/30 bg-primary/10 text-primary"
                    >
                      Selected
                    </Badge>
                  ) : null}
                </button>
              ))}
            </div>
          </Card>

          <Card className="glass rounded-2xl p-6 lg:col-span-2">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="space-y-1">
                <div className="text-sm font-semibold">Account</div>
                <div className="text-sm text-muted-foreground">
                  Mock auth for demo purposes. Logging out clears local session.
                </div>
              </div>
              <Button
                variant="secondary"
                className="bg-white/5 hover:bg-white/10"
                onClick={() => {
                  logoutClient();
                  router.replace("/login");
                }}
              >
                Logout
              </Button>
            </div>
          </Card>
        </div>
      </PageShell>
    </PageTransition>
  );
}

