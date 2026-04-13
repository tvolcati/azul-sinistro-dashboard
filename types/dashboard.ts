// ── Filtros ──────────────────────────────────────────────────────────────────

export interface FiltrosAtivos {
  faixa_etaria?: string[];
  sexo?: string[];
  cidade?: string[];
  estado?: string[];
  tipo_plano?: string[];
  cronicidade?: string[];
  servico_sanus?: string[];
}

// ── Cohort ───────────────────────────────────────────────────────────────────

export interface CohortSummary {
  total_titulares: number;
  periodo_before: { inicio: string; fim: string };
  periodo_after: { inicio: string; fim: string };
  ultimo_refresh: string;
  nota: string;
}

// ── Sinistro ─────────────────────────────────────────────────────────────────

export interface SinistroMensal {
  /** formato YYYY-MM */
  competencia: string;
  sinistro: number;
  utilizacoes: number;
}

export interface SinistroAgregado {
  sinistro_total: number;
  sinistro_por_pessoa: number;
  utilizacoes_total: number;
  utilizacoes_por_pessoa: number;
  serie_mensal: SinistroMensal[];
}

export interface SinistroBeforeAfter {
  before: SinistroAgregado;
  after: SinistroAgregado;
  variacao_sinistro_pct: number;   // ex: -0.12 = -12%
  variacao_utilizacoes_pct: number;
}

// ── Serviços Sanus ────────────────────────────────────────────────────────────

export type NivelConfianca = "alta" | "media" | "experimental";

export interface ServicoMetrica {
  total: number;
  percentual_cohort: number; // 0-1
  confianca: NivelConfianca;
  top_especialidades?: { label: string; count: number }[];
}

export interface ServicosSanus {
  consulta_digital: ServicoMetrica;
  ps_digital: ServicoMetrica;
  consulta_fisica: ServicoMetrica;
  ps_fisico: ServicoMetrica;
  healthcoach: ServicoMetrica;
}

// ── Plano com a Sanus ─────────────────────────────────────────────────────────

export interface PlanoComSanus {
  mesmo_dia: number;
  ate_7_dias: number;
  ate_15_dias: number;
  percentual_cohort_mesmo_dia: number;
  percentual_cohort_7d: number;
  percentual_cohort_15d: number;
  nota_escopo: string;
}

// ── Clusters ──────────────────────────────────────────────────────────────────

export type DimensaoCluster =
  | "faixa_etaria"
  | "sexo"
  | "cidade"
  | "estado"
  | "tipo_plano"
  | "cronicidade";

export type DimensaoFiltro = DimensaoCluster | "servico_sanus";

export interface ClusterGrupo {
  label: string;
  total: number;
  percentual: number; // 0-1
}

export interface ClusterDimensao {
  dimensao: DimensaoCluster;
  label_display: string;
  cobertura: number; // 0-1
  grupos: ClusterGrupo[];
}

// ── Payload completo ──────────────────────────────────────────────────────────

export interface DashboardPayload {
  cohort: CohortSummary;
  sinistro: SinistroBeforeAfter;
  servicos: ServicosSanus;
  plano_com_sanus: PlanoComSanus;
  clusters: ClusterDimensao[];
}
