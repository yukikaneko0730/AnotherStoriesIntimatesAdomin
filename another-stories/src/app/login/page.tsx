// src/app/login/page.tsx
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { signInWithEmailAndPassword } from "firebase/auth"
import { doc, getDoc } from "firebase/firestore"
import { auth, db } from "@/lib/firebase"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { useAuth } from "@/context/AuthContext" 

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { setRole } = useAuth() 

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      // ① Firebase Auth login
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      const user = userCredential.user

      // ② Firestore role
      const userRef = doc(db, "users", user.uid)
      const userSnap = await getDoc(userRef)

      if (userSnap.exists()) {
        const role = userSnap.data().role
        setRole(role) // 👈 ロールをAuthContextにセット！
        toast.success(`Welcome back, ${role}!`)

        // ③ Redirect by role
        if (role === "HQ") router.push("/hq/dashboard")
        else if (role === "Store") router.push("/store/dashboard")
        else router.push("/staff/shifts")
      } else {
        toast.error("No user record found in Firestore.")
      }
    } catch (err: any) {
      toast.error("Login failed. Please check your email or password.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-base">
      <form
        onSubmit={handleLogin}
        className="bg-surface/40 backdrop-blur-md p-8 rounded-2xl shadow-md w-full max-w-sm border border-accent3/40"
      >
        <h1 className="text-2xl font-poetic text-accent1 mb-6 text-center">
          Another Stories Intimates
        </h1>

        <div className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-accent1 text-white hover:bg-accent1/80"
          >
            {loading ? "Signing in..." : "Sign In"}
          </Button>
        </div>

        <p className="text-sm text-center mt-4 text-accent2/80">
          Don’t have an account?{" "}
          <a href="/signup" className="text-accent1 hover:underline">
            Sign up
          </a>
        </p>
      </form>
    </div>
  )
}
