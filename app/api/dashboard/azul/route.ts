import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const BACKEND_BASE_URL =
  process.env.SINISTRALITY_API_BASE_URL ??
  process.env.NEXT_PUBLIC_SINISTRALITY_API_BASE_URL ??
  "http://3.238.34.157";

function buildBackendUrl(request: NextRequest): string {
  const backendUrl = new URL("/v1/dashboard/azul", BACKEND_BASE_URL);
  backendUrl.search = request.nextUrl.search;
  return backendUrl.toString();
}

export async function GET(request: NextRequest) {
  try {
    const response = await fetch(buildBackendUrl(request), {
      method: "GET",
      cache: "no-store",
      headers: {
        Accept: "application/json",
      },
    });

    const body = await response.text();
    return new NextResponse(body, {
      status: response.status,
      headers: {
        "content-type": response.headers.get("content-type") ?? "application/json",
        "cache-control": "no-store",
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro ao conectar com a API de dashboard";
    return NextResponse.json(
      { error: message },
      {
        status: 502,
      }
    );
  }
}
