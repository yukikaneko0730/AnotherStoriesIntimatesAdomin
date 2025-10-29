//app/staff/shifts/page.tsx
"use client"

import { useAuth } from "@/context/AuthContext"

export default function StaffShiftsPage() {
  const { user, role } = useAuth()

  return (
    <div className="p-8 text-center">
      <h1 className="text-2xl font-poetic text-accent1 mb-4">
        {role === "HQ" ? "HQ View (Staff Shifts)" : "Your Shifts"}
      </h1>
      <p className="text-neutral/70">
        {user
          ? `Welcome, ${user.displayName || user.email}`
          : "Please log in to see your shift schedule."}
      </p>
      <div className="mt-10 text-neutral/60">🕒 Shift calendar coming soon...</div>
    </div>
  )
}
