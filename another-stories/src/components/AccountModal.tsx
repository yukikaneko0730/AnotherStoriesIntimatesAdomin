//components/AccountModal.tsx
"use client"

import { Dialog, DialogContent, DialogOverlay, DialogHeader, DialogTitle } from "@/components/ui/dialog"
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
import { VisuallyHidden } from "@radix-ui/react-visually-hidden" // 👈 追加

interface Account {
  id: number
  name: string
  role: string
  email: string
  status: "Active" | "On Leave"
  image: string
  type?: "HQ" | "Branch" | "Staff"
  branch?: string
  phone?: string
  address?: string
  founded?: string
  startDate?: string
  birthday?: string
  salaryType?: "monthly" | "hourly"
  salaryAmount?: string
  bankNumber?: string
}

interface AccountModalProps {
  open: boolean
  setOpen: (v: boolean) => void
  account: Account
}

export function AccountModal({ open, setOpen, account }: AccountModalProps) {
  const [form, setForm] = useState<Account>(account)

  const handleChange = (key: keyof Account, value: string) => {
    setForm({ ...form, [key]: value })
  }

  const handleSave = () => {
    console.log("💾 Saved:", form)
    setOpen(false)
  }

  const isBranchOrHQ = form.type === "HQ" || form.type === "Branch"
  const isBranchRole = ["Manager", "Full-time", "Part-time", "Mini-job"].includes(form.role)
  const isHourlyRole = ["Part-time", "Mini-job"].includes(form.role)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogOverlay />
      <DialogContent className="bg-base/95 border border-accent3/40 p-6 rounded-2xl shadow-xl max-w-lg w-full animate-in fade-in zoom-in">
        {/* ✅ Added invisible title for accessibility */}
        <DialogHeader>
          <VisuallyHidden>
            <DialogTitle>Account Modal</DialogTitle>
          </VisuallyHidden>
        </DialogHeader>

        <h2 className="text-xl font-poetic text-accent1 mb-4">
          {isBranchOrHQ ? "Account Details" : "Edit Account"}: {form.name}
        </h2>

        {/* ─────────────── HQ / Branch (View Only) ─────────────── */}
        {isBranchOrHQ ? (
          <div className="space-y-4">
            <div>
              <Label>Email</Label>
              <p className="text-neutral/80">{form.email || "info@anotherstories.com"}</p>
            </div>

            <div>
              <Label>Address</Label>
              <p className="text-neutral/80">
                {form.address ||
                  (form.type === "HQ"
                    ? "Kurfürstendamm 32, 10719 Berlin, Germany"
                    : "123 Rue Lafayette, Paris")}
              </p>
            </div>

            <div>
              <Label>Phone</Label>
              <p className="text-neutral/80">
                {form.phone || (form.type === "HQ" ? "+49 30 1234 5678" : "+33 1 2345 6789")}
              </p>
            </div>

            <div>
              <Label>Founded</Label>
              <p className="text-neutral/80">{form.founded || "Since 2018"}</p>
            </div>

            <Button
              onClick={() => setOpen(false)}
              className="w-full bg-accent1 text-white hover:bg-accent1/80 mt-4"
            >
              Close
            </Button>
          </div>
        ) : (
          /* ─────────────── Editable Staff ─────────────── */
          <div className="space-y-4">
            {/* Name */}
            <div>
              <Label>Name</Label>
              <Input
                value={form.name}
                onChange={(e) => handleChange("name", e.target.value)}
              />
            </div>

            {/* Email */}
            <div>
              <Label>Email</Label>
              <Input
                value={form.email}
                onChange={(e) => handleChange("email", e.target.value)}
              />
            </div>

            {/* Role */}
            <div>
              <Label>Role</Label>
              <Select
                onValueChange={(v: string) => handleChange("role", v)}
                defaultValue={form.role}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="HQ Manager">HQ Manager</SelectItem>
                  <SelectItem value="Head Office">Head Office (PR / Media / Admin)</SelectItem>
                  <SelectItem value="Manager">Branch Manager</SelectItem>
                  <SelectItem value="Full-time">Full-time Staff</SelectItem>
                  <SelectItem value="Part-time">Part-time Staff</SelectItem>
                  <SelectItem value="Mini-job">Mini-job Staff</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Branch */}
            {isBranchRole && (
              <div>
                <Label>Branch</Label>
                <Select
                  onValueChange={(v: string) => handleChange("branch", v)}
                  defaultValue={form.branch}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select branch" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Paris">Paris</SelectItem>
                    <SelectItem value="Vienna">Vienna</SelectItem>
                    <SelectItem value="Rome">Rome</SelectItem>
                    <SelectItem value="Copenhagen">Copenhagen</SelectItem>
                    <SelectItem value="Amsterdam">Amsterdam</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Start Date */}
            <div>
              <Label>Start Date</Label>
              <Input
                type="date"
                value={form.startDate || ""}
                onChange={(e) => handleChange("startDate", e.target.value)}
              />
            </div>

            {/* Birthday */}
            <div>
              <Label>Birthday</Label>
              <Input
                type="date"
                value={form.birthday || ""}
                onChange={(e) => handleChange("birthday", e.target.value)}
              />
            </div>

            {/* Salary */}
            {isHourlyRole ? (
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
                <Label>Monthly Salary (before tax, €)</Label>
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

            {/* Bank Number */}
            <div>
              <Label>Bank Account Number (IBAN)</Label>
              <Input
                placeholder="DE89 3704 0044 0532 0130 00"
                value={form.bankNumber || ""}
                onChange={(e) => handleChange("bankNumber", e.target.value)}
              />
            </div>

            <Button
              onClick={handleSave}
              className="w-full bg-accent1 text-white hover:bg-accent1/80 mt-4"
            >
              Save Changes
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
