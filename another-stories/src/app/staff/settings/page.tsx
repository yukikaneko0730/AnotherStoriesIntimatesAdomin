//staff/settings/page.tsx
"use client"

import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Image from "next/image"

export default function StaffSettingsPage() {
  const [form, setForm] = useState({
    name: "Emma Johnson",
    email: "emma@stories.com",
    phone: "+49 176 1234 5678",
    bio: "Lingerie stylist and story collector.",
    avatar: "/avatar-placeholder.png",
  })

  const handleChange = (key: string, value: string) => {
    setForm({ ...form, [key]: value })
  }

  const handleSave = () => {
    console.log("Saved profile:", form)
  }

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <h1 className="text-3xl font-poetic text-accent1">My Profile</h1>
      <p className="text-neutral/80 mb-4">
        Update your personal information and let your story shine.
      </p>

      <div className="flex items-center gap-4">
        <Image
          src={form.avatar}
          alt="Profile"
          width={64}
          height={64}
          className="rounded-full border border-accent3/40"
        />
        <Button variant="outline" className="border-accent3/40 hover:bg-surface/40">
          Change Photo
        </Button>
      </div>

      <div className="space-y-4">
        <div>
          <Label>Name</Label>
          <Input value={form.name} onChange={(e) => handleChange("name", e.target.value)} />
        </div>

        <div>
          <Label>Email</Label>
          <Input value={form.email} onChange={(e) => handleChange("email", e.target.value)} />
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
          className="w-full bg-accent1 text-white hover:bg-accent1/80 mt-4"
        >
          Save Profile
        </Button>
      </div>
    </div>
  )
}
