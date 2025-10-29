//components/layout/DashboardLayout.tsx
"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { role } = useAuth();

  return (
    <div className="flex min-h-screen bg-base text-neutral font-sans">
      {/* Sidebar */}
      <aside className="hidden md:flex w-64 flex-col border-r border-accent3/40 bg-surface/30 p-6">
        <h2 className="text-2xl font-poetic text-accent1 mb-10 tracking-wide">
          Today’s Chapter – {role === "HQ" ? "HQ" : role === "Store" ? "Store" : "You"}
        </h2>
        <nav className="flex flex-col gap-3 text-neutral/90">
          <Link href="/hq/dashboard" className="hover:text-accent1 transition-colors flex items-center gap-2">
            📊 Dashboard
          </Link>
          <Link href="/hq/branches" className="hover:text-accent1 transition-colors flex items-center gap-2">
            🏬 Branches
          </Link>
          <Link href="/hq/reports" className="hover:text-accent1 transition-colors flex items-center gap-2">
            🧾 Reports
          </Link>

          {/* 📰 Blog — HQ only */}
          {role === "HQ" && (
            <>
              <Link href="/hq/blog" className="hover:text-accent1 transition-colors flex items-center gap-2">
                📰 Blog
              </Link>
              <Link href="/hq/blog/new" className="hover:text-accent1 transition-colors flex items-center gap-2">
                ✍️ Write a Post
              </Link>
            </>
          )}

          <Link href="/hq/chats" className="hover:text-accent1 transition-colors flex items-center gap-2">
            💬 Chats
          </Link>
          <Link href="/hq/settings" className="hover:text-accent1 transition-colors flex items-center gap-2">
            ⚙️ Settings
          </Link>
        </nav>
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col">{children}</main>
    </div>
  );
}
