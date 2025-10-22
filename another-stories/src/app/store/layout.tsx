//app/staff/layout.tsx
"use client"

import ProtectedRoute from "@/components/auth/ProtectedRoute"
import DashboardLayout from "@/components/layout/DashboardLayout"

export default function StaffLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute allowedRoles={["Staff"]}>
      <DashboardLayout>{children}</DashboardLayout>
    </ProtectedRoute>
  )
}
