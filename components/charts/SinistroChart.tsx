"use client";

import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Legend,
} from "recharts";
import type { SinistroBeforeAfter } from "@/types/dashboard";
import { mesLabel, formatBRL } from "@/lib/formatters";

export function SinistroChart({ sinistro }: { sinistro: SinistroBeforeAfter }) {
  const data = [
    ...sinistro.before.serie_mensal.map((m) => ({ ...m, periodo: "before" })),
    ...sinistro.after.serie_mensal.map((m) => ({ ...m, periodo: "after" })),
  ].map((m) => ({
    mes: mesLabel(m.competencia),
    competencia: m.competencia,
    sinistro: m.sinistro,
    utilizacoes: m.utilizacoes,
    periodo: m.periodo,
  }));

  return (
    <section>
      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
        Evolução mensal
      </h3>
      <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
        <ResponsiveContainer width="100%" height={280}>
          <ComposedChart data={data} margin={{ top: 4, right: 16, bottom: 0, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="mes"
              tick={{ fontSize: 11 }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              yAxisId="sinistro"
              orientation="left"
              tick={{ fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => formatBRL(v)}
            />
            <YAxis
              yAxisId="util"
              orientation="right"
              tick={{ fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
            />
            <Tooltip
              formatter={(value, name) => {
                if (name === "sinistro") return [formatBRL(Number(value)), "Sinistro"];
                return [`${Number(value).toLocaleString("pt-BR")}`, "Utilizações"];
              }}
            />
            <Legend />
            {/* Linha vertical marcando início do after */}
            <ReferenceLine
              x="Out/25"
              yAxisId="sinistro"
              stroke="#3b82f6"
              strokeDasharray="4 2"
              label={{ value: "Sanus", position: "insideTopRight", fontSize: 10, fill: "#3b82f6" }}
            />
            <Bar
              yAxisId="sinistro"
              dataKey="sinistro"
              name="sinistro"
              fill="#3b82f6"
              opacity={0.7}
              radius={[3, 3, 0, 0]}
            />
            <Line
              yAxisId="util"
              type="monotone"
              dataKey="utilizacoes"
              name="utilizacoes"
              stroke="#f59e0b"
              strokeWidth={2}
              dot={false}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
