//components/ui/AccountModal.tsx
"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import Image from "next/image"

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

type EditableAccount = Branch | User

interface AccountModalProps {
  open: boolean
  setOpen: (v: boolean) => void
  account: EditableAccount
  onSave?: (updated: EditableAccount) => void | Promise<void>
}

// ─────────────── Type Guards ───────────────
const isUser = (data: EditableAccount): data is User =>
  "firstName" in data && "role" in data
const isBranch = (data: EditableAccount): data is Branch =>
  "manager" in data && "founded" in data

// ─────────────── Component ───────────────
export function AccountModal({
  open,
  setOpen,
  account,
  onSave,
}: AccountModalProps) {
  const [form, setForm] = useState<EditableAccount>(account)

  const handleChange = (key: string, value: any) => {
    setForm({ ...form, [key]: value })
  }

  const handleSubmit = () => {
    onSave?.(form)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className="
          bg-base/95 border border-accent3/40 rounded-2xl shadow-xl
          max-w-lg w-full max-h-[85vh] overflow-y-auto
          animate-in fade-in zoom-in p-4 sm:p-6
        "
      >
        {/* ─────────────── Header ─────────────── */}
        <DialogHeader>
          <DialogTitle>
            <span className="text-xl font-poetic text-accent1">
              {isUser(form)
                ? `Edit Employee: ${form.firstName} ${form.lastName}`
                : `Edit Branch: ${form.name}`}
            </span>
          </DialogTitle>
        </DialogHeader>


        <div className="space-y-4 mt-4 pb-6">
          {/* ───── Branch Edit Form ───── */}
          {isBranch(form) && (
            <>
              <div>
                <Label>Branch Name</Label>
                <Input
                  value={form.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                />
              </div>
              <div>
                <Label>Manager</Label>
                <Input
                  value={form.manager}
                  onChange={(e) => handleChange("manager", e.target.value)}
                />
              </div>
              <div>
                <Label>Email</Label>
                <Input
                  type="email"
                  value={form.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                />
              </div>
              <div>
                <Label>Phone</Label>
                <Input
                  value={form.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                />
              </div>
              <div>
                <Label>Address</Label>
                <Input
                  value={form.address || ""}
                  onChange={(e) => handleChange("address", e.target.value)}
                />
              </div>
              <div>
                <Label>Founded</Label>
                <Input
                  type="date"
                  value={form.founded}
                  onChange={(e) => handleChange("founded", e.target.value)}
                />
              </div>

              <Button
                onClick={handleSubmit}
                className="w-full bg-accent1 text-white hover:bg-accent1/80 mt-4"
              >
                Save Branch
              </Button>
            </>
          )}

          {/* ───── Employee Edit Form ───── */}
          {isUser(form) && (
            <>
              {form.avatar && (
                <div className="flex justify-center">
                  <Image
                    src={form.avatar}
                    alt={form.firstName}
                    width={70}
                    height={70}
                    className="rounded-full object-cover border border-accent3/40"
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>First Name</Label>
                  <Input
                    value={form.firstName}
                    onChange={(e) => handleChange("firstName", e.target.value)}
                  />
                </div>
                <div>
                  <Label>Last Name</Label>
                  <Input
                    value={form.lastName}
                    onChange={(e) => handleChange("lastName", e.target.value)}
                  />
                </div>
              </div>

              <div>
                <Label>Email</Label>
                <Input
                  type="email"
                  value={form.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                />
              </div>

              <div>
                <Label>Phone</Label>
                <Input
                  value={form.phone || ""}
                  onChange={(e) => handleChange("phone", e.target.value)}
                />
              </div>

              <div>
                <Label>Address</Label>
                <Input
                  value={form.address || ""}
                  onChange={(e) => handleChange("address", e.target.value)}
                />
              </div>

              <div>
                <Label>Branch</Label>
                <Input
                  value={form.branchId}
                  onChange={(e) => handleChange("branchId", e.target.value)}
                />
              </div>

              <div>
                <Label>Role</Label>
                <Select
                  defaultValue={form.role}
                  onValueChange={(v) => handleChange("role", v)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="HQ Staff">HQ Staff</SelectItem>
                    <SelectItem value="Branch Manager">Branch Manager</SelectItem>
                    <SelectItem value="Full-time">Full-time</SelectItem>
                    <SelectItem value="Part-time">Part-time</SelectItem>
                    <SelectItem value="Mini-job">Mini-job</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Salary */}
              {["Part-time", "Mini-job"].includes(form.role) ? (
                <div>
                  <Label>Hourly Wage (€)</Label>
                  <Input
                    type="number"
                    placeholder="13.50"
                    value={form.salaryAmount || ""}
                    onChange={(e) => {
                      handleChange("salaryType", "hourly")
                      handleChange("salaryAmount", e.target.value)
                    }}
                  />
                </div>
              ) : (
                <div>
                  <Label>Monthly Salary (€ before tax)</Label>
                  <Input
                    type="number"
                    placeholder="2800"
                    value={form.salaryAmount || ""}
                    onChange={(e) => {
                      handleChange("salaryType", "monthly")
                      handleChange("salaryAmount", e.target.value)
                    }}
                  />
                </div>
              )}

              <div>
                <Label>Bank Account (IBAN)</Label>
                <Input
                  placeholder="DE89 3704 0044 0532 0130 00"
                  value={form.bankNumber || ""}
                  onChange={(e) => handleChange("bankNumber", e.target.value)}
                />
              </div>

              <div>
                <Label>Joined Date</Label>
                <Input
                  type="date"
                  value={form.joined}
                  onChange={(e) => handleChange("joined", e.target.value)}
                />
              </div>

              <Button
                onClick={handleSubmit}
                className="w-full bg-accent1 text-white hover:bg-accent1/80 mt-4"
              >
                Save Employee
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
