import type {
  DashboardPayload,
  FiltrosAtivos,
  SinistroMensal,
} from "@/types/dashboard";

const MESES_BEFORE: SinistroMensal[] = [
  { competencia: "2025-01", sinistro: 9_800_000, utilizacoes: 87298 },
  { competencia: "2025-02", sinistro: 10_200_000, utilizacoes: 92836 },
  { competencia: "2025-03", sinistro: 11_100_000, utilizacoes: 95953 },
  { competencia: "2025-04", sinistro: 10_700_000, utilizacoes: 93979 },
  { competencia: "2025-05", sinistro: 10_900_000, utilizacoes: 93957 },
  { competencia: "2025-06", sinistro: 11_400_000, utilizacoes: 89809 },
  { competencia: "2025-07", sinistro: 11_200_000, utilizacoes: 95710 },
  { competencia: "2025-08", sinistro: 10_600_000, utilizacoes: 93945 },
  { competencia: "2025-09", sinistro: 10_800_000, utilizacoes: 96716 },
];

const MESES_AFTER: SinistroMensal[] = [
  { competencia: "2025-10", sinistro: 9_400_000, utilizacoes: 99749 },
  { competencia: "2025-11", sinistro: 8_900_000, utilizacoes: 87331 },
  { competencia: "2025-12", sinistro: 8_200_000, utilizacoes: 72685 },
  { competencia: "2026-01", sinistro: 7_800_000, utilizacoes: 64898 },
];

function sum(arr: number[]) {
  return arr.reduce((a, b) => a + b, 0);
}

function applyFatorFiltro(filtros: FiltrosAtivos): number {
  // Reduz proporcionalmente quando filtros estão ativos (mock simplificado)
  let fator = 1;
  if (filtros.faixa_etaria?.length) fator *= 0.35;
  if (filtros.sexo?.length === 1) fator *= 0.52;
  if (filtros.estado?.length) fator *= 0.6;
  if (filtros.cidade?.length) fator *= 0.3;
  if (filtros.tipo_plano?.length) fator *= 0.4;
  if (filtros.cronicidade?.length) fator *= 0.2;
  return fator;
}

export function getMockDashboardData(
  filtros: FiltrosAtivos = {}
): DashboardPayload {
  const fator = applyFatorFiltro(filtros);
  const total_titulares = Math.round(2825 * fator);

  const sinistro_before_total = Math.round(
    sum(MESES_BEFORE.map((m) => m.sinistro)) * fator
  );
  const util_before_total = Math.round(
    sum(MESES_BEFORE.map((m) => m.utilizacoes)) * fator
  );
  const sinistro_after_total = Math.round(
    sum(MESES_AFTER.map((m) => m.sinistro)) * fator
  );
  const util_after_total = Math.round(
    sum(MESES_AFTER.map((m) => m.utilizacoes)) * fator
  );

  return {
    cohort: {
      total_titulares,
      periodo_before: { inicio: "2025-01-01", fim: "2025-09-30" },
      periodo_after: { inicio: "2025-10-01", fim: "2026-01-31" },
      ultimo_refresh: "2026-04-13T10:00:00Z",
      nota: "Análise restrita a titulares com agendamento registrado pela Sanus no período after.",
    },
    sinistro: {
      before: {
        sinistro_total: sinistro_before_total,
        sinistro_por_pessoa: Math.round(sinistro_before_total / total_titulares),
        utilizacoes_total: util_before_total,
        utilizacoes_por_pessoa: Math.round(util_before_total / total_titulares),
        serie_mensal: MESES_BEFORE.map((m) => ({
          ...m,
          sinistro: Math.round(m.sinistro * fator),
          utilizacoes: Math.round(m.utilizacoes * fator),
        })),
      },
      after: {
        sinistro_total: sinistro_after_total,
        sinistro_por_pessoa: Math.round(sinistro_after_total / total_titulares),
        utilizacoes_total: util_after_total,
        utilizacoes_por_pessoa: Math.round(util_after_total / total_titulares),
        serie_mensal: MESES_AFTER.map((m) => ({
          ...m,
          sinistro: Math.round(m.sinistro * fator),
          utilizacoes: Math.round(m.utilizacoes * fator),
        })),
      },
      variacao_sinistro_pct:
        (sinistro_after_total - sinistro_before_total) / sinistro_before_total,
      variacao_utilizacoes_pct:
        (util_after_total - util_before_total) / util_before_total,
    },
    servicos: {
      consulta_digital: {
        total: Math.round(3097 * fator),
        percentual_cohort: Math.round(3097 * fator) / total_titulares,
        confianca: "alta",
        top_especialidades: [
          { label: "Clínico Geral", count: Math.round(820 * fator) },
          { label: "Psiquiatria", count: Math.round(540 * fator) },
          { label: "Nutricionista", count: Math.round(430 * fator) },
          { label: "Ginecologia", count: Math.round(380 * fator) },
          { label: "Outros", count: Math.round(927 * fator) },
        ],
      },
      ps_digital: {
        total: Math.round(9513 * fator),
        percentual_cohort: Math.round(9513 * fator) / total_titulares,
        confianca: "alta",
      },
      consulta_fisica: {
        total: Math.round(3124 * fator),
        percentual_cohort: Math.round(3124 * fator) / total_titulares,
        confianca: "media",
        top_especialidades: [
          { label: "Oftalmologia", count: Math.round(680 * fator) },
          { label: "Cardiologia", count: Math.round(520 * fator) },
          { label: "Endocrinologia", count: Math.round(410 * fator) },
          { label: "Outros", count: Math.round(1514 * fator) },
        ],
      },
    },
    plano_com_sanus: {
      mesmo_dia: Math.round(312 * fator),
      ate_7_dias: Math.round(840 * fator),
      ate_15_dias: Math.round(1190 * fator),
      percentual_cohort_mesmo_dia: (312 * fator) / total_titulares,
      percentual_cohort_7d: (840 * fator) / total_titulares,
      percentual_cohort_15d: (1190 * fator) / total_titulares,
      nota_escopo:
        "Cruzamento restrito a titulares com CPF em ambas as bases.",
    },
    clusters: [
      {
        dimensao: "faixa_etaria",
        label_display: "Faixa Etária",
        cobertura: 1,
        grupos: [
          { label: "0 a 18 anos", total: Math.round(210 * fator), percentual: 0.074 },
          { label: "19 a 23 anos", total: Math.round(140 * fator), percentual: 0.050 },
          { label: "24 a 28 anos", total: Math.round(190 * fator), percentual: 0.067 },
          { label: "29 a 33 anos", total: Math.round(310 * fator), percentual: 0.110 },
          { label: "34 a 38 anos", total: Math.round(380 * fator), percentual: 0.135 },
          { label: "39 a 43 anos", total: Math.round(420 * fator), percentual: 0.149 },
          { label: "44 a 48 anos", total: Math.round(370 * fator), percentual: 0.131 },
          { label: "49 a 53 anos", total: Math.round(310 * fator), percentual: 0.110 },
          { label: "54 a 58 anos", total: Math.round(250 * fator), percentual: 0.088 },
          { label: "59 anos ou mais", total: Math.round(245 * fator), percentual: 0.087 },
        ],
      },
      {
        dimensao: "sexo",
        label_display: "Sexo",
        cobertura: 1,
        grupos: [
          { label: "Feminino", total: Math.round(1540 * fator), percentual: 0.545 },
          { label: "Masculino", total: Math.round(1285 * fator), percentual: 0.455 },
        ],
      },
      {
        dimensao: "estado",
        label_display: "Estado",
        cobertura: 0.599,
        grupos: [
          { label: "SP", total: Math.round(1180 * fator), percentual: 0.699 },
          { label: "MG", total: Math.round(213 * fator), percentual: 0.126 },
          { label: "PE", total: Math.round(77 * fator), percentual: 0.046 },
          { label: "RJ", total: Math.round(61 * fator), percentual: 0.036 },
          { label: "Outros", total: Math.round(155 * fator), percentual: 0.092 },
        ],
      },
      {
        dimensao: "tipo_plano",
        label_display: "Tipo de Plano",
        cobertura: 1,
        grupos: [
          { label: "AMBHOSPOBSENFREEMBOLSO", total: Math.round(980 * fator), percentual: 0.347 },
          { label: "AMBHOSPOBSAPTREEMBOLSO", total: Math.round(820 * fator), percentual: 0.290 },
          { label: "UNIMEDBASICOEMPCOAIII", total: Math.round(680 * fator), percentual: 0.241 },
          { label: "Outros", total: Math.round(345 * fator), percentual: 0.122 },
        ],
      },
      {
        dimensao: "cronicidade",
        label_display: "Cronicidade",
        cobertura: 0.61,
        grupos: [
          { label: "Não Crônico", total: Math.round(1050 * fator), percentual: 0.609 },
          { label: "Crônico", total: Math.round(432 * fator), percentual: 0.250 },
          { label: "Obesidade", total: Math.round(158 * fator), percentual: 0.092 },
          { label: "Saúde Mental", total: Math.round(84 * fator), percentual: 0.049 },
        ],
      },
    ],
  };
}
