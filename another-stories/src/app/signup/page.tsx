//app/signup/page.tsx
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth"
import { doc, setDoc } from "firebase/firestore"
import { auth, db } from "@/lib/firebase"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

export default function SignupPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState("Staff") // Default role
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // ① Create user with Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const user = userCredential.user

      // ② Update Firebase user profile
      await updateProfile(user, { displayName: name })

      // ③ Save user info to Firestore
      await setDoc(doc(db, "users", user.uid), {
        name,
        email,
        role,
        createdAt: new Date(),
      })

      toast.success("Account created successfully!")

      // ④ Redirect to dashboard based on role
      if (role === "HQ") router.push("/hq/dashboard")
      else if (role === "Store") router.push("/store/dashboard")
      else router.push("/staff/shifts")
    } catch (err: any) {
      console.error(err)
      toast.error("Signup failed. Please check your details.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-base">
      <form
        onSubmit={handleSignup}
        className="bg-surface/40 backdrop-blur-md p-8 rounded-2xl shadow-md w-full max-w-sm border border-accent3/40"
      >
        <h1 className="text-2xl font-poetic text-accent1 mb-6 text-center">
          Create an Account
        </h1>

        <div className="space-y-4">
          {/* Name */}
          <div>
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="Emma Smith"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          {/* Email */}
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

          {/* Password */}
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

          {/* Role Select */}
          <div>
            <Label>Role</Label>
            <select
              className="w-full border border-accent3/30 bg-surface/50 rounded-md px-3 py-2 text-neutral focus:ring-2 focus:ring-accent1/30"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="Staff">Staff</option>
              <option value="Store">Store Manager</option>
              <option value="HQ">HQ Admin</option>
            </select>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-accent1 text-white hover:bg-accent1/80"
          >
            {loading ? "Creating..." : "Sign Up"}
          </Button>
        </div>

        <p className="text-sm text-center mt-4 text-accent2/80">
          Already have an account?{" "}
          <a href="/login" className="text-accent1 hover:underline">
            Sign in
          </a>
        </p>
      </form>
    </div>
  )
}
