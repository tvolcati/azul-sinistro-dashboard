import { handlers } from "@/auth";
import type { NextRequest } from "next/server";

// next-auth beta.30 ainda não tipou os handlers para o padrão Next.js 16
// (params como Promise). Os wrappers abaixo resolvem o type-check sem
// alterar o comportamento em runtime.
export async function GET(request: NextRequest) {
  return (handlers.GET as (r: NextRequest) => Promise<Response>)(request);
}

export async function POST(request: NextRequest) {
  return (handlers.POST as (r: NextRequest) => Promise<Response>)(request);
}
