//components/auth/ProtectedRoute.tsx
"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"

export default function ProtectedRoute({
  allowedRoles,
  children,
}: {
  allowedRoles?: string[]
  children: React.ReactNode
}) {
  const { user, role, loading } = useAuth()
  const router = useRouter()

  // 🔁 Redirect logic
  useEffect(() => {
    if (!loading) {
      if (!user) {
        // Not logged in → redirect to login
        router.push("/login")
      } else if (allowedRoles && role && !allowedRoles.includes(role)) {
        // Logged in but role not allowed → redirect to dashboard
        if (role === "HQ") router.push("/hq/dashboard")
        else if (role === "Store") router.push("/store/dashboard")
        else router.push("/staff/shifts")
      }
    }
  }, [user, role, loading, allowedRoles, router])

  // ⏳ While checking authentication
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-accent2">
        Checking authentication...
      </div>
    )
  }

  // 🚫 No user
  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen text-accent2">
        Redirecting to login...
      </div>
    )
  }

  // ✅ Authorized
  return <>{children}</>
}
