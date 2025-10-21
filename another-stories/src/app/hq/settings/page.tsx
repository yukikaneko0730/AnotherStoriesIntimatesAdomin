//hq/settings/page.tsx
"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AccountModal } from "@/components/AccountModal"
import Image from "next/image"

interface Branch {
  id: number
  name: string
  address: string
  manager: string
  phone: string
  founded: string
  image: string
}

const mockBranches: Branch[] = [
  {
    id: 1,
    name: "Paris",
    address: "123 Rue Lafayette, Paris",
    manager: "Camille Duval",
    phone: "+33 1 2345 6789",
    founded: "2018",
    image: "/branch-paris.jpg",
  },
  {
    id: 2,
    name: "Vienna",
    address: "Kärntner Straße 12, Vienna",
    manager: "Sophie Weber",
    phone: "+43 1 9876 5432",
    founded: "2019",
    image: "/branch-vienna.jpg",
  },
]

export default function HQSettingsPage() {
  const [selected, setSelected] = useState<Branch | null>(null)

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-poetic text-accent1">Branches Overview</h1>
      <p className="text-neutral/80 mb-6">
        Review and update information for each store across regions.
      </p>

      <div className="grid md:grid-cols-2 gap-6">
        {mockBranches.map((branch) => (
          <Card key={branch.id} className="border-accent3/30 hover:shadow-md transition">
            <CardHeader className="flex flex-row items-center gap-3">
              <Image
                src={branch.image}
                alt={branch.name}
                width={60}
                height={60}
                className="rounded-lg object-cover"
              />
              <div>
                <CardTitle className="text-accent2">{branch.name}</CardTitle>
                <p className="text-sm text-neutral/70">Managed by {branch.manager}</p>
              </div>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p>📍 {branch.address}</p>
              <p>📞 {branch.phone}</p>
              <p>📅 Since {branch.founded}</p>
              <Button
                variant="outline"
                className="w-full mt-3 border-accent3/40 hover:bg-surface/50 text-accent1"
                onClick={() => setSelected(branch)}
              >
                Edit Branch
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Branch Modal */}
      {selected && (
        <AccountModal
          open={!!selected}
          setOpen={() => setSelected(null)}
          account={{
            id: selected.id,
            name: selected.name,
            email: "",
            role: "Manager",
            status: "Active",
            image: selected.image,
            type: "Branch",
            address: selected.address,
            phone: selected.phone,
            founded: selected.founded,
          }}
        />
      )}
    </div>
  )
}
