"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { PageShell } from "@/components/dashboard/page-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { logoutClient } from "@/lib/auth";
import { PageTransition } from "@/components/motion/page-transition";

export default function SettingsPage() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [polling, setPolling] = React.useState<"balanced" | "fast" | "eco">("balanced");
  const [memberEmail, setMemberEmail] = React.useState("");
  const [memberRole, setMemberRole] = React.useState<"Admin" | "Operator" | "Viewer">("Viewer");
  const [memberError, setMemberError] = React.useState<string | null>(null);
  const [members, setMembers] = React.useState<
    Array<{ email: string; role: "Admin" | "Operator" | "Viewer" }>
  >([]);

  const roles: Array<"Admin" | "Operator" | "Viewer"> = ["Admin", "Operator", "Viewer"];

  return (
    <PageTransition>
      <PageShell title="Settings" description="Preferences and system configuration (mock).">
        <div className="grid gap-3 lg:grid-cols-2">
          <Card className="glass rounded-xl p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="text-sm font-semibold">Appearance</div>
                <div className="text-xs text-muted-foreground">
                  Choose dark or light mode for dashboard usage.
                </div>
              </div>
              <Badge variant="outline" className="rounded-full border-primary/30 bg-primary/10 text-primary">
                {theme === "light" ? "Light" : "Dark"}
              </Badge>
            </div>
            <div className="mt-3 flex gap-2">
              <Button
                type="button"
                size="sm"
                variant={theme === "dark" ? "default" : "secondary"}
                className={theme === "dark" ? "h-8 px-3 text-xs" : "h-8 bg-white/5 px-3 text-xs hover:bg-white/10"}
                onClick={() => setTheme("dark")}
              >
                Dark mode
              </Button>
              <Button
                type="button"
                size="sm"
                variant={theme === "light" ? "default" : "secondary"}
                className={theme === "light" ? "h-8 px-3 text-xs" : "h-8 bg-white/5 px-3 text-xs hover:bg-white/10"}
                onClick={() => setTheme("light")}
              >
                Light mode
              </Button>
            </div>
          </Card>

          <Card className="glass rounded-xl p-4">
            <div className="space-y-1">
              <div className="text-sm font-semibold">Real-time updates</div>
              <div className="text-xs text-muted-foreground">
                Tune polling for your environment.
              </div>
            </div>
            <div className="mt-3 grid gap-2">
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
                    "flex w-full items-start justify-between gap-3 rounded-xl border border-border/60 bg-white/5 px-3 py-2 text-left transition-colors hover:bg-white/[0.08]",
                    polling === o.id ? "neon-ring border-primary/30" : "",
                  ].join(" ")}
                >
                  <div>
                    <div className="text-xs font-medium">{o.label}</div>
                    <div className="text-xs text-muted-foreground">{o.desc}</div>
                  </div>
                  {polling === o.id ? (
                    <Badge
                      variant="outline"
                      className="rounded-full border-primary/30 bg-primary/10 text-[10px] text-primary"
                    >
                      Selected
                    </Badge>
                  ) : null}
                </button>
              ))}
            </div>
          </Card>

          <Card className="glass rounded-xl p-4 lg:col-span-2">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="text-sm font-semibold">Roles</div>
                <div className="text-xs text-muted-foreground">
                  Available roles that can be assigned to added members.
                </div>
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {roles.map((role) => (
                <Badge key={role} variant="outline" className="rounded-full border-border/60 bg-white/5 text-xs">
                  {role}
                </Badge>
              ))}
            </div>
            <div className="mt-3 grid gap-2 md:grid-cols-3">
              <div className="rounded-lg border border-border/60 bg-white/5 p-3">
                <div className="text-xs font-semibold">Admin</div>
                <div className="mt-1 text-[11px] text-muted-foreground">Can do:</div>
                <ul className="mt-1 list-disc space-y-1 pl-4 text-[11px] text-muted-foreground">
                  <li>Manage members and assign roles</li>
                  <li>Access all pages and settings</li>
                  <li>View all alerts, reports, and footage</li>
                </ul>
                <div className="mt-2 text-[11px] text-muted-foreground">Cannot do:</div>
                <ul className="mt-1 list-disc space-y-1 pl-4 text-[11px] text-muted-foreground">
                  <li>Bypass authentication requirements</li>
                </ul>
              </div>
              <div className="rounded-lg border border-border/60 bg-white/5 p-3">
                <div className="text-xs font-semibold">Operator</div>
                <div className="mt-1 text-[11px] text-muted-foreground">Can do:</div>
                <ul className="mt-1 list-disc space-y-1 pl-4 text-[11px] text-muted-foreground">
                  <li>Monitor cameras and triage alerts</li>
                  <li>Open saved footage and reports</li>
                  <li>Review incidents and statuses</li>
                </ul>
                <div className="mt-2 text-[11px] text-muted-foreground">Cannot do:</div>
                <ul className="mt-1 list-disc space-y-1 pl-4 text-[11px] text-muted-foreground">
                  <li>Manage members or change roles</li>
                </ul>
              </div>
              <div className="rounded-lg border border-border/60 bg-white/5 p-3">
                <div className="text-xs font-semibold">Viewer</div>
                <div className="mt-1 text-[11px] text-muted-foreground">Can do:</div>
                <ul className="mt-1 list-disc space-y-1 pl-4 text-[11px] text-muted-foreground">
                  <li>View dashboards and summaries</li>
                  <li>Read reports and footage listings</li>
                </ul>
                <div className="mt-2 text-[11px] text-muted-foreground">Cannot do:</div>
                <ul className="mt-1 list-disc space-y-1 pl-4 text-[11px] text-muted-foreground">
                  <li>Change settings, roles, or members</li>
                  <li>Perform operational escalations</li>
                </ul>
              </div>
            </div>
          </Card>

          <Card className="glass rounded-xl p-4 lg:col-span-2">
            <div className="space-y-1">
              <div className="text-sm font-semibold">Add members</div>
              <div className="text-xs text-muted-foreground">
                Add users by <span className="font-medium text-foreground">gmail.com</span> and assign a role.
              </div>
            </div>
            <form
              className="mt-3 grid gap-2 md:grid-cols-[1fr_180px_auto]"
              onSubmit={(e) => {
                e.preventDefault();
                const normalized = memberEmail.trim().toLowerCase();
                if (!normalized.endsWith("@gmail.com")) {
                  setMemberError("Only gmail.com emails are allowed.");
                  return;
                }
                if (members.some((m) => m.email === normalized)) {
                  setMemberError("Member already exists.");
                  return;
                }
                setMembers((prev) => [{ email: normalized, role: memberRole }, ...prev]);
                setMemberEmail("");
                setMemberRole("Viewer");
                setMemberError(null);
              }}
            >
              <Input
                value={memberEmail}
                onChange={(e) => setMemberEmail(e.target.value)}
                placeholder="name@gmail.com"
                className="h-9 bg-white/5 text-sm"
              />
              <select
                value={memberRole}
                onChange={(e) => setMemberRole(e.target.value as typeof memberRole)}
                className="h-9 rounded-md border border-border/60 bg-background px-2 text-sm text-foreground outline-none"
                style={{ colorScheme: theme === "light" ? "light" : "dark" }}
              >
                {roles.map((role) => (
                  <option key={role} value={role} className="bg-background text-foreground">
                    {role}
                  </option>
                ))}
              </select>
              <Button type="submit" className="h-9 px-3 text-xs">
                Add member
              </Button>
            </form>
            {memberError ? <div className="mt-2 text-xs text-destructive">{memberError}</div> : null}

            {members.length ? (
              <div className="mt-3 grid gap-2">
                {members.map((m) => (
                  <div
                    key={m.email}
                    className="flex flex-col gap-2 rounded-lg border border-border/60 bg-white/5 px-3 py-2 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="text-xs text-foreground">{m.email}</div>
                    <select
                      value={m.role}
                      onChange={(e) => {
                        const next = e.target.value as (typeof roles)[number];
                        setMembers((prev) =>
                          prev.map((x) => (x.email === m.email ? { ...x, role: next } : x)),
                        );
                      }}
                      className="h-8 rounded-md border border-border/60 bg-background px-2 text-xs text-foreground outline-none"
                      style={{ colorScheme: theme === "light" ? "light" : "dark" }}
                    >
                      {roles.map((role) => (
                        <option key={role} value={role} className="bg-background text-foreground">
                          {role}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-3 text-xs text-muted-foreground">No members added yet.</div>
            )}
          </Card>

          <Card className="glass rounded-xl p-4 lg:col-span-2">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="space-y-1">
                <div className="text-sm font-semibold">Account</div>
                <div className="text-xs text-muted-foreground">
                  Mock auth for demo purposes. Logging out clears local session.
                </div>
              </div>
              <Button
                variant="secondary"
                className="h-8 bg-white/5 px-3 text-xs hover:bg-white/10"
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

