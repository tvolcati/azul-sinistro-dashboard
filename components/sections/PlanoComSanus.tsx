"use client";

import type { PlanoComSanus } from "@/types/dashboard";
import { formatNumber, formatPct } from "@/lib/formatters";

export function PlanoComSanusSection({ plano }: { plano: PlanoComSanus }) {
  return (
    <section>
      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
        Plano com a Sanus — sinal temporal
      </h3>
      <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
        <p className="text-sm text-gray-600 mb-5">
          Titulares que tiveram um evento de sinistro dentro da janela de um agendamento Sanus.
        </p>

        <div className="grid grid-cols-3 gap-4 mb-5">
          <JanelaCard
            label="Mesmo dia"
            count={plano.mesmo_dia}
            pct={plano.percentual_cohort_mesmo_dia}
            color="bg-blue-600"
          />
          <JanelaCard
            label="Até 7 dias"
            count={plano.ate_7_dias}
            pct={plano.percentual_cohort_7d}
            color="bg-blue-400"
          />
          <JanelaCard
            label="Até 15 dias"
            count={plano.ate_15_dias}
            pct={plano.percentual_cohort_15d}
            color="bg-blue-200"
          />
        </div>

        {/* Barra visual comparativa */}
        <div className="space-y-2">
          {[
            { label: "Mesmo dia", pct: plano.percentual_cohort_mesmo_dia, color: "bg-blue-600" },
            { label: "Até 7 dias", pct: plano.percentual_cohort_7d, color: "bg-blue-400" },
            { label: "Até 15 dias", pct: plano.percentual_cohort_15d, color: "bg-blue-200" },
          ].map((j) => (
            <div key={j.label} className="flex items-center gap-3">
              <span className="text-xs text-gray-500 w-20 shrink-0">{j.label}</span>
              <div className="flex-1 bg-gray-100 rounded-full h-2">
                <div
                  className={`${j.color} h-2 rounded-full`}
                  style={{ width: `${Math.min(j.pct * 100 * 2, 100)}%` }}
                />
              </div>
              <span className="text-xs font-medium text-gray-700 w-12 text-right">
                {formatPct(j.pct, 1)}
              </span>
            </div>
          ))}
        </div>

        <p className="text-[11px] text-amber-600 mt-4 border-t border-gray-100 pt-3">
          ⚠ {plano.nota_escopo}
        </p>
      </div>
    </section>
  );
}

function JanelaCard({
  label,
  count,
  pct,
  color,
}: {
  label: string;
  count: number;
  pct: number;
  color: string;
}) {
  return (
    <div className="text-center p-3 bg-gray-50 rounded-xl">
      <div className={`w-3 h-3 rounded-full ${color} mx-auto mb-2`} />
      <p className="text-2xl font-bold text-gray-900 tabular-nums">
        {formatNumber(count)}
      </p>
      <p className="text-xs text-gray-500 mt-0.5">{label}</p>
      <p className="text-xs font-medium text-blue-600 mt-1">{formatPct(pct, 1)}</p>
    </div>
  );
}
