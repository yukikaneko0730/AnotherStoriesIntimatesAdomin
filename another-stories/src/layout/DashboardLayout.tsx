//components/layout/DashboardLayout.tsx
"use client"

import Link from "next/link"
import { useAuth } from "@/context/AuthContext"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, role } = useAuth()

  return (
    <div className="flex min-h-screen bg-base text-neutral font-sans">
      {/* Sidebar */}
      <aside className="hidden md:flex w-64 flex-col border-r border-accent3/40 bg-surface/30 p-6">
        <h2 className="text-2xl font-poetic text-accent1 mb-10 tracking-wide">
          Today’s Chapter – {role || "Guest"}
        </h2>

        <nav className="flex flex-col gap-3 text-neutral/90">
          {/* HQ Links */}
          {role === "HQ" && (
            <>
              <Link
                href="/hq/dashboard"
                className="hover:text-accent1 transition-colors flex items-center gap-2"
              >
                📊 Dashboard
              </Link>
              <Link
                href="/hq/branches"
                className="hover:text-accent1 transition-colors flex items-center gap-2"
              >
                🏬 Branches
              </Link>
              <Link
                href="/hq/reports"
                className="hover:text-accent1 transition-colors flex items-center gap-2"
              >
                🧾 Reports
              </Link>
              <Link
                href="/hq/chats"
                className="hover:text-accent1 transition-colors flex items-center gap-2"
              >
                💬 Chats
              </Link>
              <Link
                href="/hq/settings"
                className="hover:text-accent1 transition-colors flex items-center gap-2"
              >
                ⚙️ Settings
              </Link>

              <div className="mt-8 border-t border-accent3/30 pt-4 space-y-2">
                <Link
                  href="/hq/blog"
                  className="hover:text-accent1 transition-colors flex items-center gap-2"
                >
                  📰 Blog
                </Link>
                <Link
                  href="/hq/blog/new"
                  className="hover:text-accent1 transition-colors flex items-center gap-2"
                >
                  ✏️ Write Blog
                </Link>
              </div>
            </>
          )}

          {/* Store Links */}
          {role === "Store" && (
            <>
              <Link
                href="/store/dashboard"
                className="hover:text-accent1 transition-colors flex items-center gap-2"
              >
                📊 Dashboard
              </Link>
              <Link
                href="/store/reports"
                className="hover:text-accent1 transition-colors flex items-center gap-2"
              >
                🧾 Reports
              </Link>
              <Link
                href="/store/chats"
                className="hover:text-accent1 transition-colors flex items-center gap-2"
              >
                💬 Chats
              </Link>
              <Link
                href="/store/settings"
                className="hover:text-accent1 transition-colors flex items-center gap-2"
              >
                ⚙️ Settings
              </Link>

              <div className="mt-8 border-t border-accent3/30 pt-4">
                <Link
                  href="/store/blog"
                  className="hover:text-accent1 transition-colors flex items-center gap-2"
                >
                  📰 Blog
                </Link>
              </div>
            </>
          )}

          {/* Staff Links */}
          {role === "Staff" && (
            <>
              <Link
                href="/staff/shifts"
                className="hover:text-accent1 transition-colors flex items-center gap-2"
              >
                🕒 Shifts
              </Link>
              <Link
                href="/staff/chats"
                className="hover:text-accent1 transition-colors flex items-center gap-2"
              >
                💬 Chats
              </Link>
              <Link
                href="/staff/settings"
                className="hover:text-accent1 transition-colors flex items-center gap-2"
              >
                ⚙️ Settings
              </Link>

              <div className="mt-8 border-t border-accent3/30 pt-4">
                <Link
                  href="/staff/blog"
                  className="hover:text-accent1 transition-colors flex items-center gap-2"
                >
                  📰 Blog
                </Link>
              </div>
            </>
          )}
        </nav>
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col">{children}</main>
    </div>
  )
}
