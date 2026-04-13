"use client";

import type { DashboardPayload } from "@/types/dashboard";
import { useFilters } from "@/lib/contracts/filters-context";
import { formatNumber, formatBRL, formatPct } from "@/lib/formatters";

export function ClusterDetalhe({ data }: { data: DashboardPayload }) {
  const { filtros, hasFilters, clearAll } = useFilters();

  if (!hasFilters) return null;

  const labels: string[] = [];
  for (const [dim, vals] of Object.entries(filtros)) {
    if (vals?.length) {
      labels.push(...(vals as string[]).map((v) => `${v}`));
    }
  }

  const { cohort, sinistro, servicos, plano_com_sanus } = data;

  return (
    <section className="border-t border-blue-100 pt-6">
      <div className="flex items-center gap-3 mb-5">
        <div className="flex flex-wrap gap-1.5">
          {labels.map((l) => (
            <span
              key={l}
              className="bg-blue-100 text-blue-700 text-xs font-medium px-2.5 py-1 rounded-full"
            >
              {l}
            </span>
          ))}
        </div>
        <button
          onClick={clearAll}
          className="text-xs text-gray-400 hover:text-gray-600 ml-auto"
        >
          ✕ Limpar seleção
        </button>
      </div>

      <div className="bg-blue-50 rounded-2xl p-5 border border-blue-100">
        <p className="text-xs text-blue-600 uppercase tracking-wide font-semibold mb-4">
          Detalhe do cluster selecionado
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
          <MiniStat label="Titulares" value={formatNumber(cohort.total_titulares)} />
          <MiniStat
            label="Sinistro after/pessoa"
            value={formatBRL(sinistro.after.sinistro_por_pessoa)}
            delta={sinistro.variacao_sinistro_pct}
          />
          <MiniStat
            label="Utilizações after"
            value={formatNumber(sinistro.after.utilizacoes_total)}
          />
          <MiniStat
            label="Var. sinistro"
            value={formatPct(sinistro.variacao_sinistro_pct)}
            isPercent
            delta={sinistro.variacao_sinistro_pct}
          />
        </div>

        <div className="grid grid-cols-3 gap-3 mb-5">
          {[
            { label: "Consulta Digital", v: servicos.consulta_digital },
            { label: "PS Digital", v: servicos.ps_digital },
            { label: "Consulta Física", v: servicos.consulta_fisica },
          ].map(({ label, v }) => (
            <div key={label} className="bg-white rounded-xl p-3 text-center">
              <p className="text-[11px] text-gray-500 mb-1">{label}</p>
              <p className="text-lg font-bold text-gray-900">{formatNumber(v.total)}</p>
              <p className="text-xs text-blue-600">{formatPct(v.percentual_cohort, 0)}</p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl p-3 flex items-center gap-6">
          <div className="text-xs text-gray-500">Plano c/ Sanus (15d)</div>
          <div className="font-bold text-gray-900">
            {formatNumber(plano_com_sanus.ate_15_dias)}
          </div>
          <div className="text-blue-600 text-sm font-medium">
            {formatPct(plano_com_sanus.percentual_cohort_15d, 1)}
          </div>
        </div>
      </div>
    </section>
  );
}

function MiniStat({
  label,
  value,
  delta,
  isPercent = false,
}: {
  label: string;
  value: string;
  delta?: number;
  isPercent?: boolean;
}) {
  const color =
    delta !== undefined
      ? delta < 0
        ? "text-emerald-600"
        : "text-red-600"
      : "text-gray-900";

  return (
    <div className="bg-white rounded-xl p-3">
      <p className="text-[11px] text-gray-500 mb-1">{label}</p>
      <p className={`text-base font-bold ${isPercent ? color : "text-gray-900"}`}>
        {value}
      </p>
    </div>
  );
}
