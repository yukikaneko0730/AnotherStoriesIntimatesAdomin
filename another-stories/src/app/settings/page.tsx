//app/settings/page.tsx
"use client"

import { useState, useEffect } from "react"
import { AccountModal } from "@/components/AccountModal"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { BirthdayBalloons } from "@/components/BirthdayBalloons" // 🎈 バルーンアニメーション

export default function SettingsPage() {
  const [open, setOpen] = useState(false)
  const [selectedAccount, setSelectedAccount] = useState<any>(null)
  const [showBalloons, setShowBalloons] = useState(false)

  const headquarters = [
    { id: 1, name: "Headquarters Berlin", role: "HQ Manager", email: "hq@anotherstories.com", status: "Active", image: "/avatar-placeholder.png" },
  ]

  const branches = [
    { id: 2, name: "Paris Branch", role: "Manager", email: "paris@anotherstories.com", status: "Active", image: "/avatar-placeholder.png" },
    { id: 3, name: "Vienna Branch", role: "Manager", email: "vienna@anotherstories.com", status: "Active", image: "/avatar-placeholder.png" },
    { id: 4, name: "Rome Branch", role: "Manager", email: "rome@anotherstories.com", status: "Active", image: "/avatar-placeholder.png" },
    { id: 5, name: "Copenhagen Branch", role: "Manager", email: "cph@anotherstories.com", status: "Active", image: "/avatar-placeholder.png" },
    { id: 6, name: "Amsterdam Branch", role: "Manager", email: "ams@anotherstories.com", status: "Active", image: "/avatar-placeholder.png" },
  ]

  const staff = Array.from({ length: 30 }, (_, i) => ({
    id: 10 + i,
    name: `Staff ${i + 1}`,
    role: "Sales",
    email: `staff${i + 1}@anotherstories.com`,
    status: i % 2 === 0 ? "Active" : "On Leave",
    birthday: i === 2 ? "2025-10-23" : "2025-01-10", // 🎂 デモ
    image: "/avatar-placeholder.png",
  }))

  const handleEdit = (account: any) => {
    setSelectedAccount(account)
    setOpen(true)
  }

  // 🎈 誕生日が近いスタッフを検出してアニメーションを表示
  useEffect(() => {
    const today = new Date()
    const upcoming = staff.find((s) => {
      const bday = new Date(s.birthday)
      return bday.getMonth() === today.getMonth() && bday.getDate() === today.getDate()
    })
    if (upcoming) setShowBalloons(true)
  }, [])

  return (
    <div className="space-y-10 relative">
      {showBalloons && (
  <BirthdayBalloons
    names={staff
      .filter((s) => {
        const today = new Date()
        const bday = new Date(s.birthday)
        return bday.getMonth() === today.getMonth() && bday.getDate() === today.getDate()
      })
      .map((s) => s.name)}
  />
)}

      <h2 className="font-poetic text-accent1 text-2xl mb-6">Settings & Accounts</h2>

      {/* Headquarters */}
      <section>
        <h3 className="font-serif text-accent2 mb-3">Headquarters</h3>
        <div className="flex flex-wrap gap-4">
          {headquarters.map((account) => (
            <div
              key={account.id}
              className="bg-surface/50 border border-accent3/30 rounded-xl p-4 w-64 flex flex-col items-center text-center"
            >
              <Image src={account.image} alt={account.name} width={60} height={60} className="rounded-full mb-3" />
              <p className="font-semibold text-neutral">{account.name}</p>
              <p className="text-sm text-accent2/70">{account.role}</p>
              <Button
                onClick={() => handleEdit(account)}
                variant="outline"
                className="mt-3 text-accent1 border-accent3/50 hover:bg-surface/70"
              >
                Edit
              </Button>
            </div>
          ))}
        </div>
      </section>

      {/* Branches */}
      <section>
        <h3 className="font-serif text-accent2 mb-3">European Branches</h3>
        <div className="flex flex-wrap gap-4">
          {branches.map((account) => (
            <div
              key={account.id}
              className="bg-surface/50 border border-accent3/30 rounded-xl p-4 w-64 flex flex-col items-center text-center"
            >
              <Image src={account.image} alt={account.name} width={60} height={60} className="rounded-full mb-3" />
              <p className="font-semibold text-neutral">{account.name}</p>
              <p className="text-sm text-accent2/70">{account.role}</p>
              <Button
                onClick={() => handleEdit(account)}
                variant="outline"
                className="mt-3 text-accent1 border-accent3/50 hover:bg-surface/70"
              >
                Edit
              </Button>
            </div>
          ))}
        </div>
      </section>

      {/* Staff */}
      <section>
        <h3 className="font-serif text-accent2 mb-3">Individual Staff</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {staff.map((account) => (
            <div
              key={account.id}
              className="bg-surface/40 border border-accent3/20 rounded-lg p-3 text-center relative"
            >
              <Image src={account.image} alt={account.name} width={50} height={50} className="rounded-full mx-auto mb-2" />
              <p className="text-sm font-medium">{account.name}</p>
              <p className="text-xs text-accent2/70">{account.role}</p>

              {/* 🎂 If birthday today */}
              {(() => {
                const today = new Date()
                const bday = new Date(account.birthday)
                if (bday.getMonth() === today.getMonth() && bday.getDate() === today.getDate()) {
                  return (
                    <button
                      onClick={() => alert(`🎉 Happy Birthday ${account.name}! 💕`)}
                      className="absolute -top-2 -right-2 bg-accent1 text-white text-xs px-2 py-1 rounded-full animate-bounce"
                    >
                      🎈
                    </button>
                  )
                }
              })()}

              <Button
                onClick={() => handleEdit(account)}
                variant="ghost"
                size="sm"
                className="text-accent1 text-xs mt-2"
              >
                Edit
              </Button>
            </div>
          ))}
        </div>
      </section>

      {/* Account Modal */}
      {selectedAccount && (
        <AccountModal
          open={open}
          setOpen={setOpen}
          account={selectedAccount}
        />
      )}
    </div>
  )
}
