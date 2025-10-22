//hq/layout.tsx
"use client"

import ProtectedRoute from "@/components/auth/ProtectedRoute"
import DashboardLayout from "@/components/layout/DashboardLayout"

export default function HQLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute allowedRoles={["HQ"]}>
      <DashboardLayout>{children}</DashboardLayout>
    </ProtectedRoute>
  )
}
