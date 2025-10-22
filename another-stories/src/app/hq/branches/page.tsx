//hq/branches/page.tsx
"use client"

import { useEffect, useState } from "react"
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
  onSnapshot,
} from "firebase/firestore"
import { db } from "@/lib/firebase"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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

export default function HQBranchesPage() {
  const [branches, setBranches] = useState<Branch[]>([])
  const [filtered, setFiltered] = useState<Branch[]>([])
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("All")
  const [newBranch, setNewBranch] = useState({
    name: "",
    manager: "",
    email: "",
    phone: "",
    founded: "",
    status: "Active",
    image: "/avatar-placeholder.png",
  })
  const router = useRouter()
  const branchesRef = collection(db, "branches")

  // ✅ Realtime updates
  useEffect(() => {
    const unsubscribe = onSnapshot(branchesRef, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Branch[]
      setBranches(data)
      setFiltered(data)
    })
    return () => unsubscribe()
  }, [])

  // ✅ Filter branches (search + status)
  useEffect(() => {
    const filteredList = branches.filter((b) => {
      const matchesSearch =
        b.name.toLowerCase().includes(search.toLowerCase()) ||
        b.manager.toLowerCase().includes(search.toLowerCase())
      const matchesStatus =
        statusFilter === "All" || b.status === statusFilter
      return matchesSearch && matchesStatus
    })
    setFiltered(filteredList)
  }, [search, statusFilter, branches])

  // ✅ Add new branch
  const handleAddBranch = async () => {
    if (!newBranch.name || !newBranch.email) {
      toast.error("Please fill all fields")
      return
    }
    try {
      await addDoc(branchesRef, newBranch)
      toast.success(`Branch "${newBranch.name}" added`)
      setNewBranch({
        name: "",
        manager: "",
        email: "",
        phone: "",
        founded: "",
        status: "Active",
        image: "/avatar-placeholder.png",
      })
    } catch (error) {
      console.error(error)
      toast.error("Error adding branch")
    }
  }

  // ✅ Delete branch (with confirmation)
  const handleDeleteBranch = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return
    try {
      await deleteDoc(doc(db, "branches", id))
      toast.success("Branch deleted")
    } catch (error) {
      console.error(error)
      toast.error("Error deleting branch")
    }
  }

  // ✅ Toggle status
  const toggleStatus = async (id: string, current: string) => {
    const newStatus = current === "Active" ? "Closed" : "Active"
    try {
      await updateDoc(doc(db, "branches", id), { status: newStatus })
      toast.success(`Branch marked as ${newStatus}`)
    } catch (error) {
      console.error(error)
      toast.error("Failed to update status")
    }
  }

  return (
    <div className="space-y-8 p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-poetic text-accent1">Branches</h1>
      </div>

      {/* ───── Search & Filter ───── */}
      <div className="flex flex-wrap gap-3 items-center bg-surface/50 p-4 rounded-2xl border border-accent3/30">
        <Input
          placeholder="Search by branch or manager..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-xs"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-accent3/40 rounded-xl px-3 py-2 bg-white/50"
        >
          <option value="All">All</option>
          <option value="Active">Active</option>
          <option value="Closed">Closed</option>
        </select>
      </div>

      {/* ───── Add Branch Form ───── */}
      <div className="flex flex-wrap gap-3 items-center border border-accent3/30 bg-surface/40 p-4 rounded-2xl">
        <Input
          placeholder="Branch Name"
          value={newBranch.name}
          onChange={(e) => setNewBranch({ ...newBranch, name: e.target.value })}
          className="max-w-xs"
        />
        <Input
          placeholder="Manager Name"
          value={newBranch.manager}
          onChange={(e) =>
            setNewBranch({ ...newBranch, manager: e.target.value })
          }
          className="max-w-xs"
        />
        <Input
          placeholder="Email"
          value={newBranch.email}
          onChange={(e) => setNewBranch({ ...newBranch, email: e.target.value })}
          className="max-w-xs"
        />
        <Input
          placeholder="Phone"
          value={newBranch.phone}
          onChange={(e) => setNewBranch({ ...newBranch, phone: e.target.value })}
          className="max-w-xs"
        />
        <Input
          placeholder="Founded (YYYY-MM-DD)"
          value={newBranch.founded}
          onChange={(e) =>
            setNewBranch({ ...newBranch, founded: e.target.value })
          }
          className="max-w-xs"
        />
        <Button onClick={handleAddBranch} className="bg-accent1 text-white">
          Add Branch
        </Button>
      </div>

      {/* ───── Branch Cards ───── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((branch) => (
          <div
            key={branch.id}
            onClick={() => router.push(`/hq/branches/${branch.id}`)}
            className="p-4 rounded-2xl border border-accent3/30 bg-surface/50 hover:bg-surface/70 transition relative cursor-pointer"
          >
            <Image
              src={branch.image}
              alt={branch.name}
              width={50}
              height={50}
              className="rounded-full mb-2"
            />
            <h2 className="font-semibold text-accent2">{branch.name}</h2>
            <p className="text-sm text-neutral/80">{branch.email}</p>
            <p className="text-xs text-neutral/60 mt-1">
              👩‍💼 {branch.manager || "-"} <br />
              📞 {branch.phone || "-"} <br />
              📅 {branch.founded || "-"}
            </p>

            <div className="flex items-center justify-between mt-3">
              <Button
                size="sm"
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation()
                  branch.id && toggleStatus(branch.id, branch.status)
                }}
                className={
                  branch.status === "Active"
                    ? "text-green-600 border-green-300"
                    : "text-gray-500 border-gray-300"
                }
              >
                {branch.status}
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation()
                  branch.id && handleDeleteBranch(branch.id, branch.name)
                }}
                className="text-red-500"
              >
                ✕
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
