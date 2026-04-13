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
      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
        Uso dos serviços Sanus (período after)
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <ServicoCard
          titulo="Consulta Digital"
          descricao="Conexa — Consulta Eletiva"
          metrica={servicos.consulta_digital}
          icon="💻"
        />
        <ServicoCard
          titulo="PS Digital"
          descricao="Conexa — PA Digital"
          metrica={servicos.ps_digital}
          icon="🚑"
        />
        <ServicoCard
          titulo="Consulta Física"
          descricao="Azul — Agendamento presencial"
          metrica={servicos.consulta_fisica}
          icon="🏥"
        />
      </div>
      <p className="text-xs text-gray-400 mt-3">
        PS Físico está fora desta versão por baixo volume e semântica ambígua nos dados.
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
    <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
      <div className="flex items-start justify-between mb-3">
        <div>
          <span className="text-xl">{icon}</span>
          <h4 className="font-semibold text-gray-900 mt-1">{titulo}</h4>
          <p className="text-xs text-gray-400">{descricao}</p>
        </div>
        <span
          className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${cfg.color}`}
          title="Nível de confiança da classificação dos dados"
        >
          {cfg.label}
        </span>
      </div>

      <div className="flex items-baseline gap-2 mb-3">
        <span className="text-2xl font-bold text-gray-900">
          {formatNumber(metrica.total)}
        </span>
        <span className="text-sm text-gray-500">eventos</span>
      </div>

      <div className="bg-gray-50 rounded-lg px-3 py-2 mb-3">
        <div className="flex justify-between text-xs">
          <span className="text-gray-500">% do cohort</span>
          <span className="font-semibold text-gray-900">
            {formatPct(metrica.percentual_cohort, 0)}
          </span>
        </div>
        <div className="mt-1.5 h-1.5 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-500 rounded-full"
            style={{ width: `${Math.min(metrica.percentual_cohort * 100, 100)}%` }}
          />
        </div>
      </div>

      {metrica.top_especialidades && (
        <div>
          <p className="text-[10px] text-gray-400 uppercase tracking-wide mb-1.5">Top especialidades</p>
          {metrica.top_especialidades.slice(0, 4).map((e) => (
            <div key={e.label} className="flex justify-between text-xs py-0.5">
              <span className="text-gray-600">{e.label}</span>
              <span className="text-gray-500">{formatNumber(e.count)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
