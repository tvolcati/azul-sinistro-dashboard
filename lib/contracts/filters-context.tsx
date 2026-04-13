"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import type { FiltrosAtivos, DimensaoFiltro } from "@/types/dashboard";

interface FiltersContextValue {
  filtros: FiltrosAtivos;
  setFiltro: (dimensao: DimensaoFiltro, values: string[]) => void;
  clearFiltro: (dimensao: DimensaoFiltro) => void;
  clearAll: () => void;
  hasFilters: boolean;
}

const FiltersContext = createContext<FiltersContextValue | null>(null);

export function FiltersProvider({ children }: { children: ReactNode }) {
  const [filtros, setFiltros] = useState<FiltrosAtivos>({});

  const setFiltro = useCallback(
    (dimensao: DimensaoFiltro, values: string[]) => {
      setFiltros((prev) => ({
        ...prev,
        [dimensao]: values.length ? values : undefined,
      }));
    },
    []
  );

  const clearFiltro = useCallback((dimensao: DimensaoFiltro) => {
    setFiltros((prev) => {
      const next = { ...prev };
      delete next[dimensao];
      return next;
    });
  }, []);

  const clearAll = useCallback(() => setFiltros({}), []);

  const hasFilters = Object.values(filtros).some((v) => v && v.length > 0);

  return (
    <FiltersContext.Provider
      value={{ filtros, setFiltro, clearFiltro, clearAll, hasFilters }}
    >
      {children}
    </FiltersContext.Provider>
  );
}

export function useFilters() {
  const ctx = useContext(FiltersContext);
  if (!ctx) throw new Error("useFilters must be inside FiltersProvider");
  return ctx;
}
