//store/settings/page.tsx
"use client"

import { useState, useEffect } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { doc, getDoc, setDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import ProtectedRoute from "@/components/auth/ProtectedRoute"
import { toast } from "sonner"
import { useAuth } from "@/context/AuthContext"


export default function StoreSettingsPage() {
  const { user, role, loading } = useAuth()
  const [form, setForm] = useState({
    name: "",
    address: "",
    phone: "",
    openingHours: "",
  })
  const [saving, setSaving] = useState(false)

  // 🧭 Firestore
  useEffect(() => {
    const fetchStoreData = async () => {
      if (!user) return
      try {
        const storeRef = doc(db, "stores", user.uid)
        const storeSnap = await getDoc(storeRef)

        if (storeSnap.exists()) {
          setForm(storeSnap.data() as typeof form)
        } else {
          console.log("No store data found, using default form")
        }
      } catch (error) {
        console.error("Error fetching store:", error)
      }
    }

    fetchStoreData()
  }, [user])

  // change
  const handleChange = (key: string, value: string) => {
    setForm({ ...form, [key]: value })
  }

  // save
  const handleSave = async () => {
    if (!user) return
    setSaving(true)
    try {
      const storeRef = doc(db, "stores", user.uid)
      await setDoc(storeRef, form, { merge: true })
      toast.success("Store information updated successfully ✅")
    } catch (error) {
      console.error("Error saving store:", error)
      toast.error("Failed to save changes ❌")
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <p className="text-center text-neutral/60 mt-20">Loading...</p>

  return (
    <ProtectedRoute allowedRoles={["Store"]}>
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="text-3xl font-poetic text-accent1">Store Settings</h1>
        <p className="text-neutral/80">
          Update your store information. Changes will be reflected on HQ’s dashboard.
        </p>

        <div className="space-y-4">
          <div>
            <Label>Store Name</Label>
            <Input
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="Another Stories Paris"
            />
          </div>

          <div>
            <Label>Address</Label>
            <Input
              value={form.address}
              onChange={(e) => handleChange("address", e.target.value)}
              placeholder="123 Rue Lafayette, Paris"
            />
          </div>

          <div>
            <Label>Phone</Label>
            <Input
              value={form.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              placeholder="+33 1 2345 6789"
            />
          </div>

          <div>
            <Label>Opening Hours</Label>
            <Input
              value={form.openingHours}
              onChange={(e) => handleChange("openingHours", e.target.value)}
              placeholder="10:00–20:00"
            />
          </div>

          <Button
            onClick={handleSave}
            disabled={saving}
            className="w-full bg-accent1 text-white hover:bg-accent1/80"
          >
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>
    </ProtectedRoute>
  )
}
