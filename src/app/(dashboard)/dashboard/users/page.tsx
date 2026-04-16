"use client";

import { PageShell } from "@/components/dashboard/page-shell";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useUsers } from "@/hooks/api/use-users";
import { PageTransition } from "@/components/motion/page-transition";

function RoleBadge({ role }: { role: string }) {
  const map: Record<string, string> = {
    Admin: "border-primary/30 bg-primary/10 text-primary hover:bg-primary/10",
    Operator: "border-cyan-400/25 bg-cyan-400/10 text-cyan-200 hover:bg-cyan-400/10",
    Viewer: "border-white/15 bg-white/5 text-foreground/80 hover:bg-white/5",
  };
  return (
    <Badge variant="outline" className={`rounded-full ${map[role] ?? ""}`}>
      {role}
    </Badge>
  );
}

function StatusPill({ status }: { status: string }) {
  const cls =
    status === "Active"
      ? "border-emerald-400/25 bg-emerald-400/10 text-emerald-200"
      : "border-amber-400/25 bg-amber-400/10 text-amber-200";
  return (
    <Badge variant="outline" className={`rounded-full ${cls}`}>
      {status}
    </Badge>
  );
}

export default function UsersPage() {
  const users = useUsers();

  return (
    <PageTransition>
      <PageShell
        title="User Management"
        description="Roles, permissions, and user status overview."
      >
        <Card className="glass overflow-hidden rounded-2xl">
          <div className="border-b border-border/60 px-5 py-4">
            <div className="text-sm font-semibold">Users</div>
            <div className="text-sm text-muted-foreground">
              Admin / Operator / Viewer (mock data).
            </div>
          </div>

          {users.isLoading ? (
            <div className="grid gap-3 p-5">
              <Skeleton className="h-12 rounded-2xl bg-white/5" />
              <Skeleton className="h-12 rounded-2xl bg-white/5" />
              <Skeleton className="h-12 rounded-2xl bg-white/5" />
            </div>
          ) : users.isError ? (
            <div className="p-5">
              <div className="rounded-2xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                Failed to load users.
              </div>
            </div>
          ) : (users.data ?? []).length === 0 ? (
            <div className="p-5">
              <div className="rounded-2xl border border-border/60 bg-white/5 px-4 py-3 text-sm text-muted-foreground">
                No users found.
              </div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Last active</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(users.data ?? []).map((u) => (
                  <TableRow key={u.id} className="hover:bg-white/[0.03]">
                    <TableCell className="font-medium">{u.name}</TableCell>
                    <TableCell className="text-muted-foreground">{u.email}</TableCell>
                    <TableCell>
                      <RoleBadge role={u.role} />
                    </TableCell>
                    <TableCell>
                      <StatusPill status={u.status} />
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground">
                      {new Date(u.lastActiveAt).toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Card>
      </PageShell>
    </PageTransition>
  );
}

