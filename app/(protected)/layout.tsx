import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";

export default async function ProtectedLayout({ children }: { children: ReactNode }) {
  const session = await auth();
  if (!session) redirect("/login");

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-bold text-blue-600">Sanus</span>
            <span className="text-gray-300">·</span>
            <span className="text-sm text-gray-500">Dashboard Azul</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">{session.user.name}</span>
            <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
              {session.user.role}
            </span>
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/login" });
              }}
            >
              <button
                type="submit"
                className="text-xs text-gray-400 hover:text-gray-700 transition-colors"
              >
                Sair
              </button>
            </form>
          </div>
        </div>
      </header>

      {children}
    </div>
  );
}
