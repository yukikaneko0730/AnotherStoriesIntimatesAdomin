//hq/settings/page.tsx
"use client"

import { useEffect, useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AccountModal } from "@/components/AccountModal"
import Image from "next/image"
import ProtectedRoute from "@/components/auth/ProtectedRoute"
import { collection, getDocs, doc, updateDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { toast } from "sonner"
import { CheckCircleIcon, AlertTriangleIcon, Search } from "lucide-react"
import { useAuth } from "@/context/AuthContext"

// ─────────────── Types ───────────────
interface Branch {
  id: string
  name: string
  address: string
  manager: string
  phone: string
  founded: string
  email: string
}

interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  address?: string
  phone?: string
  bankNumber?: string
  avatar?: string
  branchId: string
  joined: string
  role: "HQ Staff" | "Branch Manager" | "Full-time" | "Part-time" | "Mini-job"
  salaryType?: "monthly" | "hourly"
  salaryAmount?: string
}

type EditableAccount = (Branch | User) & { type?: "branch" | "user" }

// ─────────────── Page Component ───────────────
export default function HQSettingsPage() {
  const [branches, setBranches] = useState<Branch[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [selected, setSelected] = useState<EditableAccount | null>(null)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const { user } = useAuth()

  // ───── Fetch data ─────
  useEffect(() => {
    const fetchData = async () => {
      try {
        const branchSnap = await getDocs(collection(db, "branches"))
        const userSnap = await getDocs(collection(db, "users"))

        const branchesData = branchSnap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Branch[]

        const usersData = userSnap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as User[]

        setBranches(branchesData)
        setUsers(usersData)
      } catch (err) {
        console.error("Error loading data:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  // ───── Search Filter (safe version) ─────
  const filteredBranches = useMemo(() => {
    const lower = search.trim().toLowerCase()
    return branches.filter((b) => {
      return (
        b.name?.toLowerCase().includes(lower) ||
        b.manager?.toLowerCase().includes(lower) ||
        b.address?.toLowerCase().includes(lower)
      )
    })
  }, [branches, search])

  const filteredUsers = useMemo(() => {
    const lower = search.trim().toLowerCase()
    return users.filter((u) => {
      return (
        u.firstName?.toLowerCase().includes(lower) ||
        u.lastName?.toLowerCase().includes(lower) ||
        u.email?.toLowerCase().includes(lower) ||
        u.branchId?.toLowerCase().includes(lower)
      )
    })
  }, [users, search])

  // ───── Save Branch ─────
  const handleSaveBranch = async (updatedBranch: Branch) => {
    try {
      const ref = doc(db, "branches", updatedBranch.id)
      await updateDoc(ref, {
        ...updatedBranch,
        updatedAt: new Date().toISOString(),
        updatedBy: user?.email || "HQ Admin",
      })

      setBranches((prev) =>
        prev.map((b) => (b.id === updatedBranch.id ? updatedBranch : b))
      )
      setSelected(null)

      toast.success(`${updatedBranch.name} updated successfully`, {
        description: `Saved by ${user?.email || "HQ Admin"}`,
        icon: <CheckCircleIcon className="w-5 h-5 text-green-600" />,
      })
    } catch (error) {
      console.error("Error updating branch:", error)
      toast.error("Failed to update branch", {
        description: "Something went wrong while saving.",
        icon: <AlertTriangleIcon className="w-5 h-5 text-red-600" />,
      })
    }
  }

  // ───── Save User ─────
  const handleSaveUser = async (updatedUser: User) => {
    try {
      const ref = doc(db, "users", updatedUser.id)
      await updateDoc(ref, {
        ...updatedUser,
        updatedAt: new Date().toISOString(),
        updatedBy: user?.email || "HQ Admin",
      })

      setUsers((prev) =>
        prev.map((u) => (u.id === updatedUser.id ? updatedUser : u))
      )
      setSelected(null)

      toast.success(
        `${updatedUser.firstName} ${updatedUser.lastName} updated successfully`,
        {
          description: `Saved by ${user?.email || "HQ Admin"}`,
          icon: <CheckCircleIcon className="w-5 h-5 text-green-600" />,
        }
      )
    } catch (error) {
      console.error("Error updating user:", error)
      toast.error("Failed to update user", {
        description: "Something went wrong while saving.",
        icon: <AlertTriangleIcon className="w-5 h-5 text-red-600" />,
      })
    }
  }

  if (loading)
    return <p className="text-neutral/60 p-6">Loading data from Firestore...</p>

  // ─────────────── UI ───────────────
  return (
    <ProtectedRoute allowedRoles={["HQ"]}>
      <div className="space-y-10">
        {/* ─── Search ─── */}
        <div className="flex items-center gap-3 mb-6">
          <Search className="text-accent2 w-5 h-5" />
          <Input
            placeholder="Search by name, email, branch, or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border-accent3/40"
          />
        </div>

        {/* ─── Branches Overview ─── */}
        <section>
          <h1 className="text-3xl font-poetic text-accent1">Branches Overview</h1>
          <p className="text-neutral/80 mb-6">
            Review and update information for each store across regions.
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            {filteredBranches.length > 0 ? (
              filteredBranches.map((branch) => (
                <Card
                  key={branch.id}
                  className="border-accent3/30 hover:shadow-md transition"
                >
                  <CardHeader className="flex flex-row items-center gap-3">
                    <Image
                      src={`/branch-${branch.id}.jpg`}
                      alt={branch.name}
                      width={60}
                      height={60}
                      className="rounded-lg object-cover"
                    />
                    <div>
                      <CardTitle className="text-accent2">{branch.name}</CardTitle>
                      <p className="text-sm text-neutral/70">
                        Managed by {branch.manager}
                      </p>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <p>📍 {branch.address}</p>
                    <p>📞 {branch.phone}</p>
                    <p>📅 Since {branch.founded}</p>
                    <Button
                      variant="outline"
                      className="w-full mt-3 border-accent3/40 hover:bg-surface/50 text-accent1"
                      onClick={() =>
                        setSelected({ ...branch, type: "branch" as const })
                      }
                    >
                      Edit Branch
                    </Button>
                  </CardContent>
                </Card>
              ))
            ) : (
              <p className="text-neutral/60">No branches found.</p>
            )}
          </div>
        </section>

        {/* ─── Employees Overview ─── */}
        <section>
          <h2 className="text-3xl font-poetic text-accent1">Employees Overview</h2>
          <p className="text-neutral/80 mb-6">
            Manage and update individual employee information across all regions.
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <Card
                  key={user.id}
                  className="border-accent3/30 hover:shadow-md transition"
                >
                  <CardHeader className="flex flex-row items-center gap-3">
                    <Image
                      src={user.avatar || "/default-avatar.png"}
                      alt={user.firstName || "User"}
                      width={60}
                      height={60}
                      className="rounded-full object-cover"
                    />
                    <div>
                      <CardTitle className="text-accent2">
                        {user.firstName} {user.lastName}
                      </CardTitle>
                      <p className="text-sm text-neutral/70">{user.role}</p>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <p>🏢 Branch: {user.branchId}</p>
                    <p>📧 {user.email}</p>
                    <p>📅 Joined: {user.joined}</p>
                    <Button
                      variant="outline"
                      className="w-full mt-3 border-accent3/40 hover:bg-surface/50 text-accent1"
                      onClick={() =>
                        setSelected({ ...user, type: "user" as const })
                      }
                    >
                      Edit Employee
                    </Button>
                  </CardContent>
                </Card>
              ))
            ) : (
              <p className="text-neutral/60">No employees found.</p>
            )}
          </div>
        </section>

        {/* ─── Shared Modal ─── */}
        {selected && (
          <AccountModal
            open={!!selected}
            setOpen={() => setSelected(null)}
            account={selected}
            onSave={(updated) => {
              if ("manager" in updated) handleSaveBranch(updated as Branch)
              else handleSaveUser(updated as User)
            }}
          />
        )}
      </div>
    </ProtectedRoute>
  )
}
