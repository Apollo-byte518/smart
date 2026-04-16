"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShieldCheck } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  const router = useRouter();
  const { isAuthed, login } = useAuth();
  const [email, setEmail] = React.useState("operator@campus.edu");
  const [password, setPassword] = React.useState("demo");
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (isAuthed) router.replace("/dashboard");
  }, [isAuthed, router]);

  return (
    <div className="mx-auto grid w-full max-w-6xl place-items-center px-4 py-16">
      <div className="grid w-full max-w-md gap-6">
        <Card className="glass rounded-2xl p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <div className="text-sm font-semibold">Login</div>
              <div className="text-sm text-muted-foreground">
                Enter your credentials to access the dashboard.
              </div>
            </div>
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/15 ring-1 ring-primary/25">
              <ShieldCheck className="h-5 w-5 text-primary" />
            </div>
          </div>

          <form
            className="mt-6 grid gap-4"
            onSubmit={async (e) => {
              e.preventDefault();
              setError(null);
              setBusy(true);
              try {
                await new Promise((r) => setTimeout(r, 650));
                if (!email.includes("@")) throw new Error("Enter a valid email.");
                if (password.length < 1) throw new Error("Enter a password.");
                login(email);
                router.replace("/dashboard");
              } catch (err) {
                setError(err instanceof Error ? err.message : "Login failed.");
              } finally {
                setBusy(false);
              }
            }}
          >
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white/5"
                placeholder="operator@campus.edu"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-white/5"
                placeholder="demo"
                required
              />
            </div>

            {error ? (
              <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {error}
              </div>
            ) : null}

            <Button
              type="submit"
              disabled={busy}
              className="neon-ring bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {busy ? "Signing in..." : "Sign in"}
            </Button>
          </form>

          <div className="mt-6 flex items-center justify-between text-xs text-muted-foreground">
            <span>Demo: operator@campus.edu / demo</span>
            <Link className="hover:text-foreground" href="/">
              Back to site
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}

