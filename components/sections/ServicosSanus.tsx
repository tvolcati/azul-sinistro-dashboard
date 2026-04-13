"use client";

import type { ServicosSanus, NivelConfianca } from "@/types/dashboard";
import { formatNumber, formatPct } from "@/lib/formatters";

const CONFIANCA_CONFIG: Record<NivelConfianca, { label: string; color: string }> = {
  alta: { label: "Alta confiança", color: "text-emerald-600 bg-emerald-50" },
  media: { label: "Confiança média", color: "text-amber-600 bg-amber-50" },
  experimental: { label: "Experimental", color: "text-gray-500 bg-gray-100" },
};

export function ServicosSanusSection({ servicos }: { servicos: ServicosSanus }) {
  return (
    <section>
      <h3 className="text-sm font-semibold text-slate-600 uppercase tracking-wide mb-4">
        Uso dos serviços Sanus (período after)
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
        <ServicoCard
          titulo="Consulta Digital"
          descricao="Conexa — Consulta Eletiva"
          metrica={servicos.consulta_digital}
          icon="Telemed"
        />
        <ServicoCard
          titulo="Consulta Física"
          descricao="Consulta presencial"
          metrica={servicos.consulta_fisica}
          icon="Presencial"
        />
        <ServicoCard
          titulo="PS Digital"
          descricao="Conexa — PA Digital"
          metrica={servicos.ps_digital}
          icon="PS Dig"
        />
        <ServicoCard
          titulo="PS Físico"
          descricao="Pronto atendimento presencial"
          metrica={servicos.ps_fisico}
          icon="PS Fis"
        />
        <ServicoCard
          titulo="HealthCoach"
          descricao="Interações de coaching em saúde"
          metrica={servicos.healthcoach}
          icon="Coach"
        />
      </div>
      <p className="text-xs text-slate-500 mt-3">
        Os totais representam eventos classificados para o cohort filtrado atual.
      </p>
    </section>
  );
}

function ServicoCard({
  titulo,
  descricao,
  metrica,
  icon,
}: {
  titulo: string;
  descricao: string;
  metrica: { total: number; percentual_cohort: number; confianca: NivelConfianca; top_especialidades?: { label: string; count: number }[] };
  icon: string;
}) {
  const cfg = CONFIANCA_CONFIG[metrica.confianca];

  return (
    <div className="rounded-2xl border border-cyan-100/70 bg-white/85 backdrop-blur p-4 shadow-sm shadow-cyan-100/50">
      <div className="flex items-start justify-between mb-3">
        <div>
          <span className="inline-flex rounded-md bg-cyan-50 px-2 py-0.5 text-[11px] font-semibold text-cyan-700">{icon}</span>
          <h4 className="font-semibold text-slate-900 mt-2">{titulo}</h4>
          <p className="text-xs text-slate-500">{descricao}</p>
        </div>
        <span
          className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${cfg.color}`}
          title="Nível de confiança da classificação dos dados"
        >
          {cfg.label}
        </span>
      </div>

      <div className="flex items-baseline gap-2 mb-3">
        <span className="text-2xl font-bold text-slate-900">
          {formatNumber(metrica.total)}
        </span>
        <span className="text-sm text-slate-500">eventos</span>
      </div>

      <div className="bg-slate-50 rounded-lg px-3 py-2 mb-3">
        <div className="flex justify-between text-xs">
          <span className="text-slate-500">% do cohort</span>
          <span className="font-semibold text-slate-900">
            {formatPct(metrica.percentual_cohort, 0)}
          </span>
        </div>
        <div className="mt-1.5 h-1.5 bg-slate-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-cyan-500 rounded-full"
            style={{ width: `${Math.min(metrica.percentual_cohort * 100, 100)}%` }}
          />
        </div>
      </div>

      {metrica.top_especialidades && (
        <div>
          <p className="text-[10px] text-slate-400 uppercase tracking-wide mb-1.5">Top especialidades</p>
          {metrica.top_especialidades.slice(0, 4).map((e) => (
            <div key={e.label} className="flex justify-between text-xs py-0.5">
              <span className="text-slate-600">{e.label}</span>
              <span className="text-slate-500">{formatNumber(e.count)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
