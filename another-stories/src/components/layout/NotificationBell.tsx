// src/components/NotificationBell.tsx
"use client"

import { useState } from "react"
import { Bell } from "lucide-react"
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover"

export function NotificationBell() {
  const [notifications, setNotifications] = useState([
    { id: 1, text: "✨ New message from Maya", read: false },
    { id: 2, text: "🗓 Team meeting at 2 PM", read: false },
    { id: 3, text: "💖 New follower joined", read: true },
  ])

  const markAllAsRead = () =>
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))

  const hasUnread = notifications.some((n) => !n.read)

  return (
    <Popover>
      {/* ✅ Native button, not shadcn <Button> */}
      <PopoverTrigger asChild>
        <button
          type="button"
          className="relative flex items-center justify-center bg-surface/50 hover:bg-surface/70 rounded-full p-2 transition focus:outline-none focus:ring-2 focus:ring-accent1/30"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5 text-accent2" />
          {hasUnread && (
            <span className="absolute top-1 right-1 w-2 h-2 bg-accent1 rounded-full" />
          )}
        </button>
      </PopoverTrigger>

      <PopoverContent
        align="end"
        sideOffset={10}
        className="min-w-[260px] bg-base/95 border border-accent3/40 rounded-xl shadow-md animate-in fade-in-10 slide-in-from-top-3"
      >
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-accent1 font-poetic text-lg">Notifications</h3>
          <button
            onClick={markAllAsRead}
            className="text-xs text-accent2 hover:text-accent1 transition"
          >
            Mark all as read
          </button>
        </div>

        <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1">
          {notifications.length === 0 ? (
            <p className="text-sm text-accent2/70 italic">
              You’re all caught up ✨
            </p>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                className={`text-sm rounded-md px-3 py-2 border border-accent3/20 ${
                  n.read
                    ? "bg-surface/40 text-neutral/80"
                    : "bg-surface/70 text-accent1 font-medium"
                } hover:bg-surface/60 transition`}
              >
                {n.text}
              </div>
            ))
          )}
        </div>

        <div className="border-t border-accent3/40 mt-3 pt-2 text-right">
          <button className="text-xs text-accent2 hover:text-accent1 transition">
            View all →
          </button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
