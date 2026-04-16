import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { Alert } from "@/types/api";

async function fetchAlerts() {
  const { data } = await api.get<{ items: Alert[] }>("/api/alerts");
  return data.items;
}

export function useAlerts() {
  return useQuery({
    queryKey: ["alerts"],
    queryFn: fetchAlerts,
    refetchInterval: 3_000,
  });
}

