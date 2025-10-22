//components/layout/DashboardLayout.tsx
"use client"

import { useState } from "react"
import Link from "next/link"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { Menu, Bell, Search } from "lucide-react"
import Image from "next/image"
import { DialogTitle } from "@radix-ui/react-dialog"
import { useAuth } from "@/context/AuthContext"

type UserRole = "HQ" | "Store" | "Staff"

interface NavLink {
  label: string
  href: string
  icon: string
}

interface Notification {
  id: number
  icon: string
  text: string
  time: string
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // ✅ Get user data and role from AuthContext
  const { user, role, loading } = useAuth()

  const [open, setOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)

  // ✅ Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-accent1 text-xl">
        Loading your dashboard...
      </div>
    )
  }

  // ✅ Handle no user or role
  if (!user || !role) {
    return (
      <div className="flex items-center justify-center min-h-screen text-accent2 text-xl">
        Access denied. Please log in again.
      </div>
    )
  }

  // ✅ Role-based navigation links
  const navLinks: Record<UserRole, NavLink[]> = {
    HQ: [
      { label: "Dashboard", href: "/hq/dashboard", icon: "📊" },
      { label: "Branches", href: "/hq/branches", icon: "🏬" },
      { label: "Reports", href: "/hq/reports", icon: "🧾" },
      { label: "Chats", href: "/hq/chats", icon: "💬" },
      { label: "Settings", href: "/hq/settings", icon: "⚙️" },
    ],
    Store: [
      { label: "Dashboard", href: "/store/dashboard", icon: "📈" },
      { label: "Calendar", href: "/store/calendar", icon: "🗓" },
      { label: "Reports", href: "/store/reports", icon: "🧾" },
      { label: "Chats", href: "/store/chats", icon: "💬" },
      { label: "Settings", href: "/store/settings", icon: "⚙️" },
    ],
    Staff: [
      { label: "My Shifts", href: "/staff/shifts", icon: "⏰" },
      { label: "Community", href: "/staff/blog", icon: "🪶" },
      { label: "Chats", href: "/staff/chats", icon: "💬" },
      { label: "Profile", href: "/staff/settings", icon: "🪞" },
    ],
  }

  const currentLinks = role && (["HQ", "Store", "Staff"] as const).includes(role as UserRole)
    ? navLinks[role as UserRole]
    : []

  const notifications: Notification[] = [
    { id: 1, icon: "💌", text: "New message from Emma", time: "2m ago" },
    { id: 2, icon: "🧾", text: "Report submitted by SOHO Store", time: "1h ago" },
    { id: 3, icon: "🪞", text: "Profile updated successfully", time: "Yesterday" },
  ]

  // ─────────────────────────────
  // Layout
  // ─────────────────────────────
  return (
    <div className="flex min-h-screen bg-base text-neutral font-sans">
      {/* ─────────────── Sidebar (Desktop) ─────────────── */}
      <aside className="hidden md:flex w-64 flex-col border-r border-accent3/40 bg-surface/30 p-6 backdrop-blur-sm">
        <h2 className="text-2xl font-poetic text-accent1 mb-10 tracking-wide">
          {role === "HQ" && "Today’s Chapter – HQ"}
          {role === "Store" && "Today’s Chapter – Store"}
          {role === "Staff" && "Today’s Chapter – You"}
        </h2>

        <nav className="flex flex-col gap-3 text-neutral/90">
          {currentLinks.map((link: NavLink) => (
            <Link
              key={link.href}
              href={link.href}
              className="hover:text-accent1 transition-colors flex items-center gap-2"
            >
              <span>{link.icon}</span> {link.label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* ─────────────── Sidebar (Mobile) ─────────────── */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden fixed top-4 left-4 z-50 bg-surface/50 backdrop-blur-sm rounded-full hover:bg-surface/80"
            aria-label="Open menu"
          >
            <Menu className="h-6 w-6 text-accent1" />
          </Button>
        </SheetTrigger>

        <SheetContent side="left" className="bg-surface/95 border-accent3/40 p-6">
          <DialogTitle className="sr-only">Navigation Menu</DialogTitle>
          <h2 className="text-2xl font-poetic text-accent1 mb-8 tracking-wide">
            {role === "HQ" && "HQ Dashboard"}
            {role === "Store" && "Store Dashboard"}
            {role === "Staff" && "My Page"}
          </h2>

          <nav className="flex flex-col gap-3 text-neutral/90">
            {currentLinks.map((link: NavLink) => (
              <Link
                key={link.href}
                href={link.href}
                className="hover:text-accent1 transition flex items-center gap-2"
              >
                <span>{link.icon}</span> {link.label}
              </Link>
            ))}
          </nav>
        </SheetContent>
      </Sheet>

      {/* ─────────────── Main Section ─────────────── */}
      <main className="flex-1 flex flex-col">
        {/* Topbar */}
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-6 border-b border-accent3/40 bg-base/80 backdrop-blur-sm gap-4">
          <h1 className="font-poetic text-2xl text-accent2 tracking-wide">
            {role === "HQ" && "Welcome back, HQ Admin."}
            {role === "Store" && "Welcome back, Store Manager."}
            {role === "Staff" && (
              <>
                Welcome back, <span className="italic text-accent1">beautiful.</span>
              </>
            )}
          </h1>

          {/* Right section */}
          <div className="flex items-center gap-4 w-full sm:w-auto">
            {/* Search */}
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-accent2/70" />
              <Input
                type="text"
                placeholder="Search your stories..."
                className="pl-9 pr-3 py-2 bg-surface/50 border border-accent3/30 rounded-full text-neutral placeholder:text-accent2/60 focus:outline-none focus:ring-2 focus:ring-accent1/30 transition"
              />
            </div>

            {/* Notifications */}
            <Popover open={notifOpen} onOpenChange={setNotifOpen}>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className="relative flex items-center justify-center bg-surface/50 hover:bg-surface/70 rounded-full p-2 transition focus:outline-none focus:ring-2 focus:ring-accent1/30"
                  aria-label="Notifications"
                >
                  <Bell className="h-5 w-5 text-accent2" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-accent1 rounded-full" />
                </button>
              </PopoverTrigger>

              <PopoverContent className="w-80 overflow-hidden p-0">
                <div className="flex items-center justify-between px-4 py-3 border-b border-accent3/30">
                  <p className="font-serif text-accent2">Notifications</p>
                  <button className="text-xs text-accent1 hover:underline">Mark all as read</button>
                </div>
                <ul className="max-h-80 overflow-auto">
                  {notifications.map((n: Notification) => (
                    <li
                      key={n.id}
                      className="flex items-start gap-3 px-4 py-3 hover:bg-surface/40 transition"
                    >
                      <span className="text-lg leading-none">{n.icon}</span>
                      <div className="flex-1">
                        <p className="text-sm text-neutral">{n.text}</p>
                        <p className="text-xs text-accent2/70 mt-1">{n.time}</p>
                      </div>
                      <span className="mt-1 h-2 w-2 rounded-full bg-accent1" />
                    </li>
                  ))}
                </ul>
              </PopoverContent>
            </Popover>
          </div>
        </header>

        <Separator className="bg-accent3/40" />

        {/* Main content */}
        <section className="p-6 flex-1 bg-base/90">{children}</section>
      </main>
    </div>
  )
}
