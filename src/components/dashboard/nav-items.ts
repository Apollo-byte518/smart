import {
  Activity,
  Bell,
  Camera,
  LayoutDashboard,
  Settings,
  Shield,
  Users,
} from "lucide-react";

export const dashboardNav = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/monitoring", label: "Live Monitoring", icon: Camera },
  { href: "/dashboard/alerts", label: "Alerts", icon: Bell },
  { href: "/dashboard/users", label: "User Management", icon: Users },
  { href: "/dashboard/reports", label: "Reports", icon: Activity },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
] as const;

export const systemBadges = [
  { label: "Secure Mode", icon: Shield },
] as const;

