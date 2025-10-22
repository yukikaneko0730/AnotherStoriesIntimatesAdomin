//hq/dashboard/page.tsx
"use client"

import { useEffect, useState } from "react"
import {
  collection,
  onSnapshot,
  query,
  where,
  CollectionReference,
  Query,
  DocumentData,
} from "firebase/firestore"
import { db } from "@/lib/firebase"
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

interface SalesData {
  id: string
  branchId: string
  branchName: string
  date: string
  grossSales: number
  cashSales: number
  cardSales: number
  transactions: number
}

export default function HQDashboardPage() {
  const [sales, setSales] = useState<SalesData[]>([])
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")

  useEffect(() => {
    let q: CollectionReference<DocumentData> | Query<DocumentData> = collection(db, "sales")

    if (startDate && endDate) {
      q = query(
        collection(db, "sales"),
        where("date", ">=", startDate),
        where("date", "<=", endDate)
      )
    }

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as SalesData[]
      setSales(data)
    })

    return () => unsubscribe()
  }, [startDate, endDate])

  const grouped = sales.reduce((acc: Record<string, any>, cur) => {
    if (!acc[cur.branchName]) {
      acc[cur.branchName] = {
        branchName: cur.branchName,
        grossSales: 0,
        cashSales: 0,
        cardSales: 0,
        transactions: 0,
      }
    }
    acc[cur.branchName].grossSales += cur.grossSales
    acc[cur.branchName].cashSales += cur.cashSales
    acc[cur.branchName].cardSales += cur.cardSales
    acc[cur.branchName].transactions += cur.transactions
    return acc
  }, {})
  const chartData = Object.values(grouped)

  return (
    <div className="p-6 space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-poetic text-accent1">HQ Dashboard 📊</h1>

        <div className="flex gap-2 items-center">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border rounded-lg px-3 py-2 bg-white/70"
          />
          <span className="text-accent2">〜</span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border rounded-lg px-3 py-2 bg-white/70"
          />
          <Button
            variant="outline"
            onClick={() => {
              setStartDate("")
              setEndDate("")
              toast.info("フィルターをリセットしました")
            }}
          >
            Reset
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {chartData.map((b: any) => (
          <div
            key={b.branchName}
            className="p-4 bg-surface/60 border border-accent3/30 rounded-2xl hover:bg-surface/80 transition"
          >
            <h3 className="text-lg font-semibold text-accent2">{b.branchName}</h3>
            <p className="text-neutral/80 mt-1">
              💰 <strong>{b.grossSales.toLocaleString()} €</strong>
            </p>
            <p className="text-neutral/60 text-sm mt-1">
              Cash: {b.cashSales.toLocaleString()} €<br />
              Card: {b.cardSales.toLocaleString()} €<br />
              🧾 {b.transactions} transactions
            </p>
          </div>
        ))}
      </div>

      <div className="bg-surface/50 border border-accent3/30 p-6 rounded-2xl">
        <h2 className="text-xl font-poetic text-accent2 mb-4">Branch Sales Overview</h2>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0dcd3" />
            <XAxis dataKey="branchName" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="grossSales" fill="#C5A57C" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
