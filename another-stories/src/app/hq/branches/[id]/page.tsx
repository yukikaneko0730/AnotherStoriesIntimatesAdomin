///hq/branches/[id]/page.tsx
"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { doc, getDoc, updateDoc, onSnapshot } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { toast } from "sonner"

interface Branch {
  id?: string
  name: string
  manager: string
  email: string
  phone: string
  founded: string
  status: string
  image: string
}

export default function BranchDetailPage() {
  const router = useRouter()
  const { id } = useParams()
  const [branch, setBranch] = useState<Branch | null>(null)
  const [editMode, setEditMode] = useState(false)
  const [editData, setEditData] = useState<Branch | null>(null)
  const [loading, setLoading] = useState(true)

  // ✅ Firestore
  useEffect(() => {
    if (!id) return
    const ref = doc(db, "branches", id as string)
    const unsubscribe = onSnapshot(ref, (snap) => {
      if (snap.exists()) {
        const data = snap.data() as Branch
        setBranch({ id: snap.id, ...data })
        setEditData({ id: snap.id, ...data })
      } else {
        toast.error("Branch not found ❌")
        router.push("/hq/branches")
      }
      setLoading(false)
    })
    return () => unsubscribe()
  }, [id, router])

  // save
  const handleSave = async () => {
    if (!id || !editData) return
    try {
      const ref = doc(db, "branches", id as string)
      // ⛳ updateDoc（Partial<Branch>）
      await updateDoc(ref, {
        name: editData.name,
        manager: editData.manager,
        email: editData.email,
        phone: editData.phone,
        founded: editData.founded,
        status: editData.status,
        image: editData.image,
      } as Partial<Branch>)
      toast.success("Branch details updated ✅")
      setEditMode(false)
    } catch (error) {
      console.error(error)
      toast.error("Failed to update branch ❌")
    }
  }

  if (loading)
    return <p className="p-6 text-accent1 animate-pulse">Loading branch details...</p>

  if (!branch)
    return <p className="p-6 text-neutral/60">Branch not found</p>

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-8">
      {/* ───── Header ───── */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-poetic text-accent1">{branch.name}</h1>
        <Button
          variant="outline"
          onClick={() => router.push("/hq/branches")}
          className="text-accent2 hover:bg-accent1/10 transition"
        >
          ← Back
        </Button>
      </div>

      {/* ───── Image & Status ───── */}
      <div className="flex items-center gap-6 bg-surface/50 p-4 rounded-2xl border border-accent3/30">
        <Image
          src={branch.image || "/avatar-placeholder.png"}
          alt={branch.name}
          width={100}
          height={100}
          className="rounded-full border border-accent3/40"
        />
        <div>
          <p className="text-sm text-neutral/70 mb-1">
            Status:{" "}
            <span
              className={
                branch.status === "Active"
                  ? "text-green-600 font-medium"
                  : "text-gray-500 font-medium"
              }
            >
              {branch.status}
            </span>
          </p>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setEditMode((prev) => !prev)}
            className="text-accent2 border-accent3/30"
          >
            {editMode ? "Cancel Edit" : "Edit Branch ✏️"}
          </Button>
        </div>
      </div>

      {/* ───── Details ───── */}
      <div className="border border-accent3/30 rounded-2xl bg-surface/60 p-6 space-y-4 shadow-sm">
        {editMode ? (
          <>
            {[
              { label: "Branch Name", key: "name" },
              { label: "Manager", key: "manager" },
              { label: "Email", key: "email" },
              { label: "Phone", key: "phone" },
              { label: "Founded", key: "founded" },
            ].map((field) => (
              <div key={field.key}>
                <label className="block text-sm text-neutral/70 mb-1">{field.label}</label>
                <Input
                  value={(editData as any)?.[field.key] || ""}
                  onChange={(e) =>
                    setEditData({
                      ...editData!,
                      [field.key]: e.target.value,
                    })
                  }
                />
              </div>
            ))}

            <Button
              onClick={handleSave}
              className="bg-accent1 text-white mt-4 hover:bg-accent2 transition"
            >
              Save Changes
            </Button>
          </>
        ) : (
          <div className="space-y-2 text-neutral/80 leading-relaxed">
            <p>👩‍💼 <strong>Manager:</strong> {branch.manager || "-"}</p>
            <p>📧 <strong>Email:</strong> {branch.email}</p>
            <p>📞 <strong>Phone:</strong> {branch.phone || "-"}</p>
            <p>📅 <strong>Founded:</strong> {branch.founded || "-"}</p>
          </div>
        )}
      </div>

      {/* ───── Future Extensions ───── */}
      <div className="p-6 bg-surface/40 border border-accent3/30 rounded-2xl">
        <h2 className="text-lg font-poetic text-accent2 mb-2">Coming Soon:</h2>
        <ul className="list-disc ml-6 text-neutral/70 text-sm space-y-1">
          <li>Sales analytics integration 📊</li>
          <li>Branch chat with HQ 💬</li>
          <li>Manager task overview 🗂️</li>
        </ul>
      </div>
    </div>
  )
}
