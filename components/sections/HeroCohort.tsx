"use client";

import type { CohortSummary } from "@/types/dashboard";
import { formatNumber, formatDate } from "@/lib/formatters";

export function HeroCohort({ cohort }: { cohort: CohortSummary }) {
  return (
    <section className="relative overflow-hidden rounded-3xl px-6 py-8 text-white shadow-lg shadow-cyan-200/50 bg-gradient-to-br from-sky-700 via-cyan-600 to-emerald-500">
      <div className="pointer-events-none absolute -top-16 -right-10 h-52 w-52 rounded-full bg-white/20 blur-2xl" />
      <div className="pointer-events-none absolute -bottom-20 -left-10 h-56 w-56 rounded-full bg-indigo-900/20 blur-2xl" />
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div>
            <p className="text-cyan-100 text-xs font-semibold uppercase tracking-widest mb-2">
              Cohort analisado
            </p>
            <h2 className="text-4xl font-bold tabular-nums">
              {formatNumber(cohort.total_titulares)}
            </h2>
            <p className="text-cyan-50/90 mt-1">titulares</p>
          </div>

          <div className="flex gap-8">
            <div>
              <p className="text-cyan-100 text-xs uppercase tracking-wide">Before</p>
              <p className="text-white font-semibold">
                {fmtPeriodo(cohort.periodo_before)}
              </p>
            </div>
            <div>
              <p className="text-cyan-100 text-xs uppercase tracking-wide">After</p>
              <p className="text-white font-semibold">
                {fmtPeriodo(cohort.periodo_after)}
              </p>
            </div>
            <div>
              <p className="text-cyan-100 text-xs uppercase tracking-wide">Atualizado</p>
              <p className="text-white font-semibold">
                {formatDate(cohort.ultimo_refresh)}
              </p>
            </div>
          </div>
        </div>

        <p className="mt-4 text-cyan-50/90 text-xs border-t border-white/30 pt-3">
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
