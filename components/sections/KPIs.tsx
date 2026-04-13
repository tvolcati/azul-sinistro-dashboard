"use client";

import type { SinistroBeforeAfter } from "@/types/dashboard";
import { formatBRL, formatNumber, formatPct } from "@/lib/formatters";

export function KPIs({ sinistro }: { sinistro: SinistroBeforeAfter }) {
  const { before, after } = sinistro;

  return (
    <section>
      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
        Sinistro — Before vs After
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPICard
          label="Sinistro total"
          before={formatBRL(before.sinistro_total)}
          after={formatBRL(after.sinistro_total)}
          delta={sinistro.variacao_sinistro_pct}
          tooltip="Soma do valor de sinistro no período"
        />
        <KPICard
          label="Sinistro / pessoa"
          before={formatBRL(before.sinistro_por_pessoa)}
          after={formatBRL(after.sinistro_por_pessoa)}
          delta={
            (after.sinistro_por_pessoa - before.sinistro_por_pessoa) /
            before.sinistro_por_pessoa
          }
          tooltip="Sinistro total dividido pelo número de titulares"
        />
        <KPICard
          label="Utilizações"
          before={formatNumber(before.utilizacoes_total)}
          after={formatNumber(after.utilizacoes_total)}
          delta={sinistro.variacao_utilizacoes_pct}
          tooltip="Total de linhas de utilização do plano"
        />
        <KPICard
          label="Utilizações / pessoa"
          before={formatNumber(before.utilizacoes_por_pessoa)}
          after={formatNumber(after.utilizacoes_por_pessoa)}
          delta={
            (after.utilizacoes_por_pessoa - before.utilizacoes_por_pessoa) /
            before.utilizacoes_por_pessoa
          }
          tooltip="Utilizações totais divididas pelo número de titulares"
        />
      </div>
    </section>
  );
}

function KPICard({
  label,
  before,
  after,
  delta,
  tooltip,
}: {
  label: string;
  before: string;
  after: string;
  delta: number;
  tooltip: string;
}) {
  const isPositive = delta > 0;
  // Para sinistro: queda é boa (verde), alta é ruim (vermelho)
  const color = isPositive ? "text-red-600" : "text-emerald-600";
  const bg = isPositive ? "bg-red-50" : "bg-emerald-50";

  return (
    <div
      className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm"
      title={tooltip}
    >
      <p className="text-xs text-gray-500 mb-3">{label}</p>
      <div className="flex items-baseline gap-2 mb-1">
        <span className="text-lg font-bold text-gray-900">{after}</span>
        <span className={`text-xs font-semibold px-1.5 py-0.5 rounded-full ${color} ${bg}`}>
          {formatPct(delta)}
        </span>
      </div>
      <p className="text-xs text-gray-400">before: {before}</p>
    </div>
  );
}
