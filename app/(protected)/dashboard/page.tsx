"use client";

import { useEffect, useState } from "react";
import { getMockDashboardData } from "@/lib/mocks/dashboard";
import { fetchDashboardData } from "@/lib/api/dashboard";
import { FiltersProvider, useFilters } from "@/lib/contracts/filters-context";
import { config } from "@/lib/config/environment";
import { GlobalFilters } from "@/components/filters/GlobalFilters";
import { HeroCohort } from "@/components/sections/HeroCohort";
import { KPIs } from "@/components/sections/KPIs";
import { SinistroChart } from "@/components/charts/SinistroChart";
import { ServicosSanusSection } from "@/components/sections/ServicosSanus";
import { PlanoComSanusSection } from "@/components/sections/PlanoComSanus";
import { ClusterExplorer } from "@/components/sections/ClusterExplorer";
import { ClusterDetalhe } from "@/components/sections/ClusterDetalhe";
import type { DashboardPayload } from "@/types/dashboard";

export default function DashboardPage() {
  return (
    <FiltersProvider>
      <DashboardContent />
    </FiltersProvider>
  );
}

function DashboardContent() {
  const { filtros } = useFilters();
  const [data, setData] = useState<DashboardPayload | null>(null);
  const [usingFallback, setUsingFallback] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const strategy = config.getDataFetchStrategy();

    async function load() {
      try {
        // Always use mock if configured to do so
        if (strategy.useMock) {
          if (!isMounted) return;
          setUsingFallback(false);
          setError(null);
          setData(getMockDashboardData(filtros));
          return;
        }

        // Try API
        const payload = await fetchDashboardData(filtros);
        if (!isMounted) return;
        setUsingFallback(false);
        setError(null);
        setData(payload);
      } catch (err) {
        if (!isMounted) return;

        // In production, show error - don't fallback
        if (!strategy.allowFallback) {
          setError(
            err instanceof Error
              ? err.message
              : "Erro ao carregar dados do servidor. Tente novamente em alguns instantes."
          );
          setData(null);
          return;
        }

        // In preview/dev, fallback to mock with warning
        setUsingFallback(true);
        setError(null);
        setData(getMockDashboardData(filtros));
      }
    }

    setData(null);
    setError(null);
    load();

    return () => {
      isMounted = false;
    };
  }, [filtros]);

  if (!data) {
    if (error) {
      return (
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="max-w-md rounded-md border border-red-300 bg-red-50 px-4 py-6">
            <h3 className="text-lg font-semibold text-red-900 mb-2">
              Erro ao carregar dashboard
            </h3>
            <p className="text-sm text-red-800 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="inline-block rounded bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
            >
              Tentar novamente
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <>
      {usingFallback ? (
        <div className="max-w-7xl mx-auto px-6 pt-6">
          <div className="rounded-md border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            API indisponivel no momento. Exibindo dados mock para nao bloquear a navegacao.
          </div>
        </div>
      ) : null}

      <GlobalFilters clusters={data.clusters} />

      <main className="max-w-7xl mx-auto px-6 py-6 space-y-8">
        <HeroCohort cohort={data.cohort} />
        <KPIs sinistro={data.sinistro} />
        <SinistroChart sinistro={data.sinistro} />
        <ServicosSanusSection servicos={data.servicos} />
        <PlanoComSanusSection plano={data.plano_com_sanus} />
        <ClusterExplorer clusters={data.clusters} />
        <ClusterDetalhe data={data} />
      </main>
    </>
  );
}
