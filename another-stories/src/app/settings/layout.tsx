//app/settings/layout.tsx
"use client"

import React from "react"
import DashboardLayout from "@/components/layout/DashboardLayout"

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <DashboardLayout>{children}</DashboardLayout>
}
