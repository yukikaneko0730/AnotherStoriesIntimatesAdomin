//store/settings/page.tsx
"use client"

import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function StoreSettingsPage() {
  const [form, setForm] = useState({
    name: "Another Stories Paris",
    address: "123 Rue Lafayette, Paris",
    phone: "+33 1 2345 6789",
    openingHours: "10:00–20:00",
  })

  const handleChange = (key: string, value: string) => {
    setForm({ ...form, [key]: value })
  }

  const handleSave = () => {
    console.log("Saved store:", form)
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-3xl font-poetic text-accent1">Store Settings</h1>
      <p className="text-neutral/80">
        Update your store information. Changes will be reflected on HQ’s dashboard.
      </p>

      <div className="space-y-4">
        <div>
          <Label>Store Name</Label>
          <Input value={form.name} onChange={(e) => handleChange("name", e.target.value)} />
        </div>

        <div>
          <Label>Address</Label>
          <Input value={form.address} onChange={(e) => handleChange("address", e.target.value)} />
        </div>

        <div>
          <Label>Phone</Label>
          <Input value={form.phone} onChange={(e) => handleChange("phone", e.target.value)} />
        </div>

        <div>
          <Label>Opening Hours</Label>
          <Input
            value={form.openingHours}
            onChange={(e) => handleChange("openingHours", e.target.value)}
          />
        </div>

        <Button
          onClick={handleSave}
          className="w-full bg-accent1 text-white hover:bg-accent1/80"
        >
          Save Changes
        </Button>
      </div>
    </div>
  )
}
