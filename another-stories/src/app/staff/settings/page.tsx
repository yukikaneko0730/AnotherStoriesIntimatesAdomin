//staff/settings/page.tsx
"use client"

import { useState, useEffect } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { doc, getDoc, setDoc } from "firebase/firestore"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { db, storage } from "@/lib/firebase"
import { useAuth } from "@/context/AuthContext"
import ProtectedRoute from "@/components/auth/ProtectedRoute"
import { toast } from "sonner"

// Define a strong type for form data
interface ProfileForm {
  name: string
  email: string
  phone: string
  bio: string
  avatar: string
}

export default function StaffSettingsPage() {
  const { user, role, loading } = useAuth()
  const [form, setForm] = useState<ProfileForm>({
    name: "",
    email: "",
    phone: "",
    bio: "",
    avatar: "",
  })
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)

  // 🧭 Fetch Firestore profile data
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return
      try {
        const userRef = doc(db, "users", user.uid)
        const snap = await getDoc(userRef)

        if (snap.exists()) {
          const data = snap.data()
          setForm({
            name: data.name || "",
            email: data.email || user.email || "",
            phone: data.phone || "",
            bio: data.bio || "",
            avatar: data.avatar || "/avatar-placeholder.png",
          })
        } else {
          // First-time setup
          setForm({
            name: user.displayName || "",
            email: user.email || "",
            phone: "",
            bio: "",
            avatar: "/avatar-placeholder.png",
          })
        }
      } catch (error) {
        console.error("Error fetching profile:", error)
      }
    }

    fetchProfile()
  }, [user])

  // 📝 Handle input change
  const handleChange = (key: keyof ProfileForm, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  // 🖼 Handle avatar upload (Firebase Storage)
  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !user) return

    setUploading(true)
    try {
      const avatarRef = ref(storage, `avatars/${user.uid}`)
      await uploadBytes(avatarRef, file)
      const url = await getDownloadURL(avatarRef)

      setForm((prev) => ({ ...prev, avatar: url }))
      toast.success("Profile photo updated ✅")

      // Also update Firestore
      const userRef = doc(db, "users", user.uid)
      await setDoc(
        userRef,
        {
          avatar: url,
          updatedAt: new Date(),
        },
        { merge: true }
      )
    } catch (error) {
      console.error("Error uploading avatar:", error)
      toast.error("Failed to upload photo ❌")
    } finally {
      setUploading(false)
    }
  }

  // 💾 Save updated profile in Firestore
  const handleSave = async () => {
    if (!user) return
    setSaving(true)
    try {
      const userRef = doc(db, "users", user.uid)
      await setDoc(
        userRef,
        {
          ...form,
          role: role || "Staff",
          updatedAt: new Date(),
        },
        { merge: true }
      )
      toast.success("Profile saved successfully ✅")
    } catch (error) {
      console.error("Error saving profile:", error)
      toast.error("Failed to save profile ❌")
    } finally {
      setSaving(false)
    }
  }

  // 🔄 Show loading state
  if (loading) {
    return <p className="text-center text-neutral/60 mt-20">Loading...</p>
  }

  // 🚫 If no user, ProtectedRoute will redirect automatically
  return (
    <ProtectedRoute allowedRoles={["Staff"]}>
      <div className="max-w-xl mx-auto space-y-6">
        <h1 className="text-3xl font-poetic text-accent1">My Profile</h1>
        <p className="text-neutral/80 mb-4">
          Update your personal information and let your story shine.
        </p>

        {/* 🖼 Avatar Section */}
        <div className="flex items-center gap-4">
          <Image
            src={form.avatar || "/avatar-placeholder.png"}
            alt="Profile"
            width={64}
            height={64}
            className="rounded-full border border-accent3/40 object-cover"
          />
          <div>
            <input
              type="file"
              id="avatar"
              accept="image/*"
              onChange={handleAvatarUpload}
              className="hidden"
            />
            <label htmlFor="avatar">
              <Button
                variant="outline"
                className="border-accent3/40 hover:bg-surface/40"
                disabled={uploading}
              >
                {uploading ? "Uploading..." : "Change Photo"}
              </Button>
            </label>
          </div>
        </div>

        {/* 🧾 Info Form */}
        <div className="space-y-4">
          <div>
            <Label>Name</Label>
            <Input value={form.name} onChange={(e) => handleChange("name", e.target.value)} />
          </div>

          <div>
            <Label>Email</Label>
            <Input
              value={form.email}
              disabled
              className="bg-gray-50 text-neutral/60 cursor-not-allowed"
            />
          </div>

          <div>
            <Label>Phone</Label>
            <Input value={form.phone} onChange={(e) => handleChange("phone", e.target.value)} />
          </div>

          <div>
            <Label>Bio</Label>
            <Input
              value={form.bio}
              onChange={(e) => handleChange("bio", e.target.value)}
              placeholder="Tell us your story..."
            />
          </div>

          <Button
            onClick={handleSave}
            disabled={saving}
            className="w-full bg-accent1 text-white hover:bg-accent1/80 mt-4"
          >
            {saving ? "Saving..." : "Save Profile"}
          </Button>
        </div>
      </div>
    </ProtectedRoute>
  )
}
