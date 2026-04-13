"use client";

import { useFilters } from "@/lib/contracts/filters-context";
import type { ClusterDimensao } from "@/types/dashboard";

interface Props {
  clusters: ClusterDimensao[];
}

export function GlobalFilters({ clusters }: Props) {
  const { filtros, setFiltro, clearAll, hasFilters } = useFilters();

  return (
    <div className="sticky top-0 z-20 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-3 flex flex-wrap items-center gap-3">
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
          Filtros
        </span>

        {clusters.map((c) => {
          const active = filtros[c.dimensao as keyof typeof filtros] ?? [];
          return (
            <FilterDropdown
              key={c.dimensao}
              cluster={c}
              active={active}
              onChange={(vals) => setFiltro(c.dimensao, vals)}
            />
          );
        })}

        {hasFilters && (
          <button
            onClick={clearAll}
            className="text-xs text-red-500 hover:text-red-700 underline ml-auto"
          >
            Limpar filtros
          </button>
        )}
      </div>
    </div>
  );
}

function FilterDropdown({
  cluster,
  active,
  onChange,
}: {
  cluster: ClusterDimensao;
  active: string[];
  onChange: (vals: string[]) => void;
}) {
  const isPartial = cluster.cobertura < 1;
  const hasActive = active.length > 0;

  function toggle(label: string) {
    if (active.includes(label)) {
      onChange(active.filter((v) => v !== label));
    } else {
      onChange([...active, label]);
    }
  }

  return (
    <div className="relative group">
      <button
        className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
          hasActive
            ? "border-blue-500 bg-blue-50 text-blue-700"
            : "border-gray-200 text-gray-600 hover:border-gray-300"
        }`}
      >
        {cluster.label_display}
        {hasActive && (
          <span className="bg-blue-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px]">
            {active.length}
          </span>
        )}
        {isPartial && (
          <span className="text-amber-500 text-[10px]" title={`Cobertura ~${Math.round(cluster.cobertura * 100)}%`}>
            ⚠
          </span>
        )}
        <span className="text-gray-400">▾</span>
      </button>

      <div className="absolute top-full left-0 mt-1 bg-white border border-gray-100 rounded-xl shadow-lg p-2 min-w-[180px] hidden group-focus-within:block group-hover:block z-30">
        {isPartial && (
          <p className="text-[10px] text-amber-600 px-2 pb-2 border-b border-gray-100 mb-1">
            Cobertura ~{Math.round(cluster.cobertura * 100)}% da base
          </p>
        )}
        {cluster.grupos.map((g) => (
          <label
            key={g.label}
            className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-gray-50 cursor-pointer"
          >
            <input
              type="checkbox"
              checked={active.includes(g.label)}
              onChange={() => toggle(g.label)}
              className="accent-blue-500"
            />
            <span className="text-xs text-gray-700 flex-1">{g.label}</span>
            <span className="text-xs text-gray-400">
              {Math.round(g.percentual * 100)}%
            </span>
          </label>
        ))}
        {active.length > 0 && (
          <button
            onClick={() => onChange([])}
            className="w-full text-xs text-gray-400 hover:text-gray-600 pt-2 mt-1 border-t border-gray-100"
          >
            Limpar
          </button>
        )}
      </div>
    </div>
  );
}
