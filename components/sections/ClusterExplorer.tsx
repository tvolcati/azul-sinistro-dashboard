"use client";

import type { ClusterDimensao } from "@/types/dashboard";
import { useFilters } from "@/lib/contracts/filters-context";
import { formatNumber } from "@/lib/formatters";

export function ClusterExplorer({ clusters }: { clusters: ClusterDimensao[] }) {
  const { filtros, setFiltro } = useFilters();

  return (
    <section>
      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
        Cluster explorer
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {clusters.map((c) => (
          <ClusterCard
            key={c.dimensao}
            cluster={c}
            active={filtros[c.dimensao as keyof typeof filtros] ?? []}
            onToggle={(label) => {
              const cur = filtros[c.dimensao as keyof typeof filtros] ?? [];
              const next = cur.includes(label)
                ? cur.filter((v) => v !== label)
                : [...cur, label];
              setFiltro(c.dimensao, next);
            }}
          />
        ))}
      </div>
    </section>
  );
}

function ClusterCard({
  cluster,
  active,
  onToggle,
}: {
  cluster: ClusterDimensao;
  active: string[];
  onToggle: (label: string) => void;
}) {
  const maxTotal = Math.max(...cluster.grupos.map((g) => g.total));

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-semibold text-gray-900">{cluster.label_display}</h4>
        {cluster.cobertura < 1 && (
          <span
            className="text-[10px] text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full"
            title={`Dados disponíveis para ~${Math.round(cluster.cobertura * 100)}% dos titulares`}
          >
            ~{Math.round(cluster.cobertura * 100)}% cobertura
          </span>
        )}
      </div>

      <div className="space-y-1.5">
        {cluster.grupos.map((g) => {
          const isActive = active.includes(g.label);
          const barWidth = (g.total / maxTotal) * 100;

          return (
            <button
              key={g.label}
              onClick={() => onToggle(g.label)}
              className={`w-full text-left rounded-lg px-2 py-1.5 transition-colors ${
                isActive ? "bg-blue-50 ring-1 ring-blue-200" : "hover:bg-gray-50"
              }`}
            >
              <div className="flex justify-between items-baseline text-xs mb-1">
                <span className={isActive ? "text-blue-700 font-medium" : "text-gray-700"}>
                  {g.label}
                </span>
                <span className="text-gray-500 tabular-nums">
                  {formatNumber(g.total)}
                </span>
              </div>
              <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${isActive ? "bg-blue-500" : "bg-gray-300"}`}
                  style={{ width: `${barWidth}%` }}
                />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
