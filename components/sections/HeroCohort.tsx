"use client";

import type { CohortSummary } from "@/types/dashboard";
import { formatNumber, formatDate } from "@/lib/formatters";

export function HeroCohort({ cohort }: { cohort: CohortSummary }) {
  return (
    <section className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-8 rounded-2xl">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div>
            <p className="text-blue-200 text-sm font-medium uppercase tracking-wide mb-1">
              Cohort analisado
            </p>
            <h2 className="text-4xl font-bold tabular-nums">
              {formatNumber(cohort.total_titulares)}
            </h2>
            <p className="text-blue-100 mt-1">titulares</p>
          </div>

          <div className="flex gap-8">
            <div>
              <p className="text-blue-300 text-xs uppercase tracking-wide">Before</p>
              <p className="text-white font-semibold">
                {fmtPeriodo(cohort.periodo_before)}
              </p>
            </div>
            <div>
              <p className="text-blue-300 text-xs uppercase tracking-wide">After</p>
              <p className="text-white font-semibold">
                {fmtPeriodo(cohort.periodo_after)}
              </p>
            </div>
            <div>
              <p className="text-blue-300 text-xs uppercase tracking-wide">Atualizado</p>
              <p className="text-white font-semibold">
                {formatDate(cohort.ultimo_refresh)}
              </p>
            </div>
          </div>
        </div>

        <p className="mt-4 text-blue-200 text-xs border-t border-blue-500 pt-3">
          ℹ️ {cohort.nota}
        </p>
      </div>
    </section>
  );
}

function fmtPeriodo(p: { inicio: string; fim: string }) {
  const fmt = (d: string) =>
    new Date(d + "T12:00:00").toLocaleDateString("pt-BR", {
      month: "short",
      year: "2-digit",
    });
  return `${fmt(p.inicio)} – ${fmt(p.fim)}`;
}
