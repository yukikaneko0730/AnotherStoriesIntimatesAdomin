//components/layout/DashboardLayout.tsx
import Link from "next/link";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-base text-neutral font-sans">
      {/* Sidebar */}
      <aside className="hidden md:flex w-64 flex-col border-r border-accent3/40 bg-surface/30 p-6">
        <h2 className="text-2xl font-poetic text-accent1 mb-10 tracking-wide">
          Today’s Chapter
        </h2>
        <nav className="flex flex-col gap-3 text-neutral/90">
          <Link href="/dashboard" className="hover:text-accent1 transition-colors flex items-center gap-2">
            📊 Dashboard
          </Link>
          <Link href="/calendar" className="hover:text-accent1 transition-colors flex items-center gap-2">
            🗓 Calendar
          </Link>
          <Link href="/reports" className="hover:text-accent1 transition-colors flex items-center gap-2">
            🧾 Reports
          </Link>
          <Link href="/chats" className="hover:text-accent1 transition-colors flex items-center gap-2">
            💬 Chats
          </Link>
          <Link href="/settings" className="hover:text-accent1 transition-colors flex items-center gap-2">
            🪞 Settings
          </Link>
        </nav>
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col">
        {children}
      </main>
    </div>
  );
}
