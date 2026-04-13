"use client";

import { useFilters } from "@/lib/contracts/filters-context";
import type { ClusterDimensao } from "@/types/dashboard";

interface Props {
  clusters: ClusterDimensao[];
}

const SANUS_SERVICE_OPTIONS = [
  { value: "consulta_fisica", label: "Consulta Física" },
  { value: "consulta_digital", label: "Consulta Digital" },
  { value: "healthcoach", label: "HealthCoach" },
  { value: "ps_fisico", label: "Pronto Socorro Físico" },
  { value: "ps_digital", label: "Pronto Socorro Digital" },
];

export function GlobalFilters({ clusters }: Props) {
  const { filtros, setFiltro, clearAll, hasFilters } = useFilters();
  const activeServices = filtros.servico_sanus ?? [];

  return (
    <div className="sticky top-0 z-20 border-b border-white/40 bg-white/70 backdrop-blur-xl shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-3 flex flex-wrap items-center gap-3">
        <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
          Filtros
        </span>

        <ServiceFilterDropdown
          active={activeServices}
          onChange={(vals) => setFiltro("servico_sanus", vals)}
        />

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
            className="ml-auto rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-xs text-rose-700 hover:bg-rose-100"
          >
            Limpar filtros
          </button>
        )}
      </div>
    </div>
  );
}

function ServiceFilterDropdown({
  active,
  onChange,
}: {
  active: string[];
  onChange: (vals: string[]) => void;
}) {
  function toggle(value: string) {
    if (active.includes(value)) {
      onChange(active.filter((v) => v !== value));
    } else {
      onChange([...active, value]);
    }
  }

  const hasActive = active.length > 0;

  return (
    <div className="relative group">
      <button
        className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
          hasActive
            ? "border-cyan-500 bg-cyan-50 text-cyan-800"
            : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
        }`}
      >
        Serviços Sanus
        {hasActive && (
          <span className="bg-cyan-600 text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px]">
            {active.length}
          </span>
        )}
        <span className="text-slate-400">▾</span>
      </button>

      <div className="absolute top-full left-0 mt-1 bg-white border border-slate-100 rounded-xl shadow-lg p-2 min-w-[220px] hidden group-focus-within:block group-hover:block z-30">
        {SANUS_SERVICE_OPTIONS.map((option) => (
          <label
            key={option.value}
            className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-slate-50 cursor-pointer"
          >
            <input
              type="checkbox"
              checked={active.includes(option.value)}
              onChange={() => toggle(option.value)}
              className="accent-cyan-600"
            />
            <span className="text-xs text-slate-700 flex-1">{option.label}</span>
          </label>
        ))}
        {active.length > 0 && (
          <button
            onClick={() => onChange([])}
            className="w-full text-xs text-slate-500 hover:text-slate-700 pt-2 mt-1 border-t border-slate-100"
          >
            Limpar
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
            ? "border-indigo-500 bg-indigo-50 text-indigo-700"
            : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
        }`}
      >
        {cluster.label_display}
        {hasActive && (
          <span className="bg-indigo-600 text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px]">
            {active.length}
          </span>
        )}
        {isPartial && (
          <span className="text-amber-500 text-[10px]" title={`Cobertura ~${Math.round(cluster.cobertura * 100)}%`}>
            ⚠
          </span>
        )}
        <span className="text-slate-400">▾</span>
      </button>

      <div className="absolute top-full left-0 mt-1 bg-white border border-slate-100 rounded-xl shadow-lg p-2 min-w-[180px] hidden group-focus-within:block group-hover:block z-30">
        {isPartial && (
          <p className="text-[10px] text-amber-700 px-2 pb-2 border-b border-slate-100 mb-1">
            Cobertura ~{Math.round(cluster.cobertura * 100)}% da base
          </p>
        )}
        {cluster.grupos.map((g) => (
          <label
            key={g.label}
            className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-slate-50 cursor-pointer"
          >
            <input
              type="checkbox"
              checked={active.includes(g.label)}
              onChange={() => toggle(g.label)}
              className="accent-indigo-600"
            />
            <span className="text-xs text-slate-700 flex-1">{g.label}</span>
            <span className="text-xs text-slate-400">
              {Math.round(g.percentual * 100)}%
            </span>
          </label>
        ))}
        {active.length > 0 && (
          <button
            onClick={() => onChange([])}
            className="w-full text-xs text-slate-500 hover:text-slate-700 pt-2 mt-1 border-t border-slate-100"
          >
            Limpar
          </button>
        )}
      </div>
    </div>
  );
}
