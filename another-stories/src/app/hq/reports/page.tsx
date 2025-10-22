//reports/page.tsx
"use client"

import { useEffect, useState } from "react"
import { collection, onSnapshot, query, orderBy } from "firebase/firestore"
import { db } from "@/lib/firebase"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
  BarChart,
  Bar,
} from "recharts"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"

interface SalesData {
  id: string
  date: string
  branchId: string
  grossSales: number
  cashSales: number
  cardSales: number
  expenses: number
  profit: number
}

export default function HQReportsPage() {
  const [sales, setSales] = useState<SalesData[]>([])
  const [filtered, setFiltered] = useState<SalesData[]>([])
  const [period, setPeriod] = useState<"daily" | "weekly" | "monthly">("daily")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const q = query(collection(db, "sales"), orderBy("date"))
    const unsubscribe = onSnapshot(q, (snapshot) => {
      try {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as SalesData[]
        setSales(data)
        setFiltered(data)
      } catch (error) {
        console.error(error)
        toast.error("Failed to fetch sales data")
      } finally {
        setLoading(false)
      }
    })
    return () => unsubscribe()
  }, [])

  // ✅ 期間フィルタリング（将来的に週次・月次集計対応）
  const handlePeriodChange = (value: "daily" | "weekly" | "monthly") => {
    setPeriod(value)
    setFiltered(sales) // 今はそのまま、後で集計ロジック追加
  }

  // ✅ 合計・平均値
  const totalGross = filtered.reduce((acc, s) => acc + s.grossSales, 0)
  const totalProfit = filtered.reduce((acc, s) => acc + s.profit, 0)
  const avgExpense =
    filtered.length > 0
      ? filtered.reduce((acc, s) => acc + s.expenses, 0) / filtered.length
      : 0

  if (loading)
    return <p className="p-6 text-accent1 animate-pulse">Loading reports...</p>

  return (
    <div className="p-6 space-y-8">
      {/* ───── Header ───── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-3xl font-poetic text-accent1">Sales Reports 📊</h1>

        <div className="flex gap-2">
          {["daily", "weekly", "monthly"].map((p) => (
            <Button
              key={p}
              variant={period === p ? "default" : "outline"}
              onClick={() => handlePeriodChange(p as any)}
              className={
                period === p
                  ? "bg-accent1 text-white"
                  : "border-accent3/30 text-accent2"
              }
            >
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      {/* ───── KPI Summary ───── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-surface/60 border-accent3/30 rounded-2xl">
          <CardHeader>
            <CardTitle className="text-accent2">Total Sales</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold text-accent1">
            €{totalGross.toLocaleString()}
          </CardContent>
        </Card>

        <Card className="bg-surface/60 border-accent3/30 rounded-2xl">
          <CardHeader>
            <CardTitle className="text-accent2">Total Profit</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold text-green-700">
            €{totalProfit.toLocaleString()}
          </CardContent>
        </Card>

        <Card className="bg-surface/60 border-accent3/30 rounded-2xl">
          <CardHeader>
            <CardTitle className="text-accent2">Avg Expenses</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold text-neutral">
            €{avgExpense.toFixed(0)}
          </CardContent>
        </Card>
      </div>

      {/* ───── Sales Trends ───── */}
      <Card className="bg-surface/50 border-accent3/30 rounded-2xl p-4">
        <CardHeader>
          <CardTitle className="text-accent2">Gross Sales Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={filtered}>
              <CartesianGrid strokeDasharray="3 3" stroke="#d9d6cf" />
              <XAxis dataKey="date" stroke="#a1978c" />
              <YAxis stroke="#a1978c" />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="grossSales"
                stroke="#c9a37e"
                strokeWidth={2}
                dot={{ r: 3 }}
                name="Gross Sales"
              />
              <Line
                type="monotone"
                dataKey="profit"
                stroke="#739072"
                strokeWidth={2}
                dot={{ r: 3 }}
                name="Profit"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* ───── Revenue Breakdown ───── */}
      <Card className="bg-surface/50 border-accent3/30 rounded-2xl p-4">
        <CardHeader>
          <CardTitle className="text-accent2">Revenue Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={filtered}>
              <CartesianGrid strokeDasharray="3 3" stroke="#d9d6cf" />
              <XAxis dataKey="date" stroke="#a1978c" />
              <YAxis stroke="#a1978c" />
              <Tooltip />
              <Legend />
              <Bar dataKey="cashSales" fill="#b79981" name="Cash Sales" />
              <Bar dataKey="cardSales" fill="#8c7261" name="Card Sales" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
