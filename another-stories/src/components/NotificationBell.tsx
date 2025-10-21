// src/components/NotificationBell.tsx
"use client"

import { useState } from "react"
import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"

export function NotificationBell() {
  const [notifications] = useState([
    { id: 1, text: "✨ New message from Maya" },
    { id: 2, text: "🗓 Team meeting at 2 PM" },
    { id: 3, text: "💖 New follower joined" },
  ])

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative bg-surface/50 hover:bg-surface/70 rounded-full p-2"
        >
          <Bell className="h-5 w-5 text-accent2" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-accent1 rounded-full" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="min-w-[220px]">
        <h3 className="text-accent1 font-poetic mb-2">Notifications</h3>
        <div className="space-y-2">
          {notifications.map((n) => (
            <div
              key={n.id}
              className="text-sm text-neutral/90 bg-surface/40 rounded-md px-3 py-2 hover:bg-surface/60 transition"
            >
              {n.text}
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}
