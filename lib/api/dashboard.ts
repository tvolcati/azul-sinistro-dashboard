import type { DashboardPayload, FiltrosAtivos } from "@/types/dashboard";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_SINISTRALITY_API_BASE_URL ?? "http://localhost:8000";

function buildQueryString(filtros: FiltrosAtivos): string {
  const params = new URLSearchParams();

  for (const v of filtros.faixa_etaria ?? []) params.append("faixa_etaria", v);
  for (const v of filtros.sexo ?? []) params.append("sexo", v);
  for (const v of filtros.cidade ?? []) params.append("cidade", v);
  for (const v of filtros.estado ?? []) params.append("estado", v);
  for (const v of filtros.tipo_plano ?? []) params.append("tipo_plano", v);
  for (const v of filtros.cronicidade ?? []) params.append("cronicidade", v);

  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

export async function fetchDashboardData(
  filtros: FiltrosAtivos = {}
): Promise<DashboardPayload> {
  const query = buildQueryString(filtros);
  const response = await fetch(`${API_BASE_URL}/v1/dashboard/azul${query}`, {
    method: "GET",
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Erro ao buscar dashboard: ${response.status}`);
  }

  return (await response.json()) as DashboardPayload;
}
