/**
 * Environment configuration for Azul Sinistro Dashboard
 * 
 * Stages:
 * 1. Development (NEXT_PUBLIC_USE_MOCK_DATA=true) - Always mock
 * 2. Preview/Staging - Try real API, fallback to mock with warning
 * 3. Production - Real API only, with error boundary (no fallback)
 */

export type DataSource = "mock" | "api" | "error";
export type Environment = "development" | "preview" | "production";

export const config = {
  // API configuration
  apiBaseUrl: process.env.NEXT_PUBLIC_SINISTRALITY_API_BASE_URL || "http://localhost:8000",
  useMockData: process.env.NEXT_PUBLIC_USE_MOCK_DATA === "true",

  // Auth configuration
  authUrl: process.env.NEXTAUTH_URL || "http://localhost:3000",

  // Determine environment based on URL and flags
  getEnvironment(): Environment {
    if (typeof window === "undefined") {
      // Server-side
      return process.env.VERCEL_ENV === "production"
        ? "production"
        : process.env.VERCEL_ENV === "preview"
        ? "preview"
        : "development";
    }

    // Client-side
    const hostname = window.location.hostname;

    if (hostname === "localhost" || hostname === "127.0.0.1") {
      return "development";
    }

    if (hostname.includes("vercel.app")) {
      return process.env.NEXT_PUBLIC_VERCEL_ENV === "production"
        ? "production"
        : "preview";
    }

    // Custom domain checks
    if (hostname.includes("production") || hostname.includes("-prod")) {
      return "production";
    }

    return "preview";
  },

  // Determine if API fallback should be allowed
  allowFallback(): boolean {
    const env = this.getEnvironment();
    return env !== "production";
  },

  // Strategy based on environment
  getDataFetchStrategy(): {
    useMock: boolean;
    allowFallback: boolean;
    strict: boolean;
  } {
    if (this.useMockData) {
      return { useMock: true, allowFallback: false, strict: false };
    }

    const env = this.getEnvironment();

    if (env === "production") {
      return {
        useMock: false,
        allowFallback: false, // No fallback in production - let errors bubble up
        strict: true, // Strict error reporting
      };
    }

    if (env === "preview") {
      return {
        useMock: false,
        allowFallback: true, // Try API, fallback to mock with warning
        strict: false,
      };
    }

    // development
    return {
      useMock: false,
      allowFallback: true,
      strict: false,
    };
  },

  // Log environment info
  logEnvironmentInfo(): void {
    if (typeof window === "undefined") return;

    const env = this.getEnvironment();
    const strategy = this.getDataFetchStrategy();

    console.log(
      `[Azul Dashboard] Environment: ${env}`,
      `API: ${this.apiBaseUrl}`,
      `Strategy:`,
      strategy
    );
  },
};
