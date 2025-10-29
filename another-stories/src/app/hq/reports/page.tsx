//hq/reports/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { motion } from "framer-motion";
import {
  format,
  parseISO,
  eachDayOfInterval,
  eachMonthOfInterval,
  startOfMonth,
  endOfMonth,
  isWithinInterval,
  addYears,
  addDays,
  differenceInCalendarDays,
} from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { DateRange } from "react-day-picker";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import TopItemsSection from "@/components/hq/TopItemsSection";

// -----------------------------
// Types
// -----------------------------
type IntervalMode = "Daily" | "Monthly";

type SaleItem = {
  productId: string;
  name: string;
  category: "Bra" | "Panties" | "Accessories" | "Apparel" | string;
  qty: number;
};

type SaleDoc = {
  branchId: string;
  branchName: string;
  date: string;
  grossSales: number;
  cashSales: number;
  cardSales: number;
  transactions: number;
  items?: SaleItem[];
};

type Branch = { id: string; name: string };
type Category = "Bra" | "Panties" | "Accessories" | "Apparel" | "All";

// -----------------------------
// Theme
// -----------------------------
const theme = {
  bg: "#FFF8F6",
  card: "#FCEDE7",
  ink: "#6B4B3A",
  accent: "#B97A57",
  accentLight: "#E8C5A4",
  grid: "#EAD9C6",
  bar: "#F0D9C1",
  good: "#3BA17C",
  bad: "#C25B5B",
  white: "#FFFFFF",
  chip: "#F9E2D7",
  chipActive: "#EBC7B1",
};

// -----------------------------
// Helpers
// -----------------------------
const currency = (n: number) =>
  n.toLocaleString(undefined, { style: "currency", currency: "EUR", maximumFractionDigits: 0 });

function toDate(d: string) {
  return parseISO(d);
}

function clampRange(range?: DateRange): DateRange {
  const today = new Date();
  if (range?.from && range?.to) return range;
  if (range?.from && !range.to) return { from: range.from, to: today };
  const to = today;
  const from = addDays(to, -29);
  return { from, to };
}

function aggregateDaily(docs: SaleDoc[], range: DateRange) {
  const days = eachDayOfInterval({ start: range.from!, end: range.to! });
  const map = new Map<string, { date: string; grossSales: number; transactions: number }>();
  for (const d of days) {
    const key = format(d, "yyyy-MM-dd");
    map.set(key, { date: key, grossSales: 0, transactions: 0 });
  }
  for (const s of docs) {
    const d = toDate(s.date);
    if (!isWithinInterval(d, { start: range.from!, end: range.to! })) continue;
    const key = s.date;
    const row = map.get(key);
    if (row) {
      row.grossSales += s.grossSales;
      row.transactions += s.transactions;
    }
  }
  return Array.from(map.values()).sort((a, b) => (a.date < b.date ? -1 : 1));
}

function aggregateMonthly(docs: SaleDoc[], range: DateRange) {
  const months = eachMonthOfInterval({ start: startOfMonth(range.from!), end: endOfMonth(range.to!) });
  const map = new Map<string, { month: string; grossSales: number; transactions: number }>();
  for (const m of months) {
    const key = format(m, "yyyy-MM");
    map.set(key, { month: key, grossSales: 0, transactions: 0 });
  }
  for (const s of docs) {
    const d = toDate(s.date);
    if (!isWithinInterval(d, { start: range.from!, end: range.to! })) continue;
    const key = format(d, "yyyy-MM");
    const row = map.get(key);
    if (row) {
      row.grossSales += s.grossSales;
      row.transactions += s.transactions;
    }
  }
  return Array.from(map.values()).sort((a, b) => (a.month < b.month ? -1 : 1));
}

function computeYoY(docs: SaleDoc[], range: DateRange) {
  const currSum = docs.reduce((acc, s) => {
    const d = toDate(s.date);
    return isWithinInterval(d, { start: range.from!, end: range.to! }) ? acc + s.grossSales : acc;
  }, 0);
  const lastFrom = addYears(range.from!, -1);
  const lastTo = addYears(range.to!, -1);
  const prevSum = docs.reduce((acc, s) => {
    const d = toDate(s.date);
    return isWithinInterval(d, { start: lastFrom, end: lastTo }) ? acc + s.grossSales : acc;
  }, 0);
  const growth = prevSum === 0 ? 0 : ((currSum - prevSum) / prevSum) * 100;
  return { currSum, prevSum, growth };
}

function buildBranches(docs: SaleDoc[]): Branch[] {
  const map = new Map<string, string>();
  docs.forEach((d) => map.set(d.branchId, d.branchName));
  return Array.from(map.entries()).map(([id, name]) => ({ id, name }));
}

function compareBranches(docs: SaleDoc[], range: DateRange, selected?: string) {
  const byBranch = new Map<string, { name: string; grossSales: number; transactions: number }>();
  docs.forEach((s) => {
    if (selected && selected !== "All" && s.branchId !== selected) return;
    const d = toDate(s.date);
    if (!isWithinInterval(d, { start: range.from!, end: range.to! })) return;
    const curr = byBranch.get(s.branchId) ?? { name: s.branchName, grossSales: 0, transactions: 0 };
    curr.grossSales += s.grossSales;
    curr.transactions += s.transactions;
    byBranch.set(s.branchId, curr);
  });
  return Array.from(byBranch.values()).sort((a, b) => b.grossSales - a.grossSales);
}

// -----------------------------
// Component
// -----------------------------
export default function HQReportsPage() {
  const [docs, setDocs] = useState<SaleDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState<DateRange>(() => clampRange());
  const effectiveRange = clampRange(range);
  const [mode, setMode] = useState<IntervalMode>("Daily");
  const [selectedBranch, setSelectedBranch] = useState<string>("All");

  useEffect(() => {
    const fetchSales = async () => {
      const snap = await getDocs(collection(db, "sales"));
      const raw = snap.docs.map((d) => d.data() as SaleDoc);
      setDocs(raw);
      setLoading(false);
    };
    fetchSales();
  }, []);

  const branches = useMemo(() => [{ id: "All", name: "All Branches" }, ...buildBranches(docs)], [docs]);
  const trendData = useMemo(
    () =>
      mode === "Daily"
        ? aggregateDaily(docs, effectiveRange).map((r) => ({ ...r, label: r.date }))
        : aggregateMonthly(docs, effectiveRange).map((r) => ({ ...r, label: r.month })),
    [docs, effectiveRange, mode]
  );
  const { currSum, prevSum, growth } = useMemo(() => computeYoY(docs, effectiveRange), [docs, effectiveRange]);
  const branchCompare = useMemo(
    () => compareBranches(docs, effectiveRange, selectedBranch),
    [docs, effectiveRange, selectedBranch]
  );

  const kpis = useMemo(() => {
    const filtered = docs.filter((s) => {
      if (selectedBranch !== "All" && s.branchId !== selectedBranch) return false;
      const d = toDate(s.date);
      return isWithinInterval(d, { start: effectiveRange.from!, end: effectiveRange.to! });
    });
    const totals = filtered.reduce(
      (acc, s) => {
        acc.gross += s.grossSales;
        acc.tx += s.transactions;
        return acc;
      },
      { gross: 0, tx: 0 }
    );
    const days = Math.max(1, differenceInCalendarDays(effectiveRange.to!, effectiveRange.from!) + 1);
    return {
      revenue: totals.gross,
      avgTicket: totals.tx === 0 ? 0 : totals.gross / totals.tx,
      txCount: totals.tx,
      avgTxPerDay: totals.tx / days,
    };
  }, [docs, effectiveRange, selectedBranch]);

  if (loading)
    return (
      <p className="p-8 text-center" style={{ color: theme.accent }}>
        Loading reports…
      </p>
    );

  return (
    <div className="min-h-screen p-6 md:p-8" style={{ background: theme.bg, color: theme.ink }}>
      <div className="mb-6">
        <h1 className="text-3xl font-poetic" style={{ color: theme.accent }}>
          HQ Sales Reports
        </h1>
        <p className="text-sm opacity-80">Warm, clear, and business-focused insights.</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-3 md:items-center">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full md:w-auto"
              style={{ borderColor: theme.accentLight, color: theme.ink, background: theme.white }}
            >
              {effectiveRange.from && effectiveRange.to
                ? `${format(effectiveRange.from, "MMM d, yyyy")} – ${format(effectiveRange.to, "MMM d, yyyy")}`
                : "Pick a date range"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="p-3" align="start">
            <Calendar
              mode="range"
              numberOfMonths={2}
              selected={range}
              onSelect={(r) => setRange(r ? r : range)}
              className="rounded-xl"
            />
          </PopoverContent>
        </Popover>

        {/* Interval Switch */}
        <div className="flex gap-2">
          <Button
            onClick={() => setMode("Daily")}
            style={{
              background: mode === "Daily" ? theme.accent : theme.white,
              color: mode === "Daily" ? theme.white : theme.ink,
              borderColor: theme.accentLight,
            }}
          >
            Daily
          </Button>
          <Button
            onClick={() => setMode("Monthly")}
            style={{
              background: mode === "Monthly" ? theme.accent : theme.white,
              color: mode === "Monthly" ? theme.white : theme.ink,
              borderColor: theme.accentLight,
            }}
          >
            Monthly
          </Button>
        </div>

        {/* Branch buttons */}
        <div className="flex-1" />
        <div className="flex gap-2 flex-wrap">
          {branches.map((b) => (
            <Button
              key={b.id}
              onClick={() => setSelectedBranch(b.id)}
              style={{
                background: selectedBranch === b.id ? theme.accent : theme.white,
                color: selectedBranch === b.id ? "white" : theme.ink,
                borderColor: theme.accentLight,
              }}
            >
              {b.name}
            </Button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        {[
          { title: "Total Revenue", value: currency(kpis.revenue) },
          {
            title: "Growth Rate (YoY)",
            value: `${growth >= 0 ? "▲" : "▼"} ${Math.abs(growth).toFixed(1)}%`,
            color: growth >= 0 ? theme.good : theme.bad,
          },
          { title: "Avg Transactions / Day", value: kpis.avgTxPerDay.toFixed(1) },
          { title: "Avg Basket", value: currency(kpis.avgTicket) },
        ].map((k, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 + i * 0.05 }}
            className="rounded-2xl p-5"
            style={{
              background: theme.card,
              border: `1px solid ${theme.accentLight}`,
              color: k.color ?? theme.ink,
            }}
          >
            <p className="text-sm opacity-70 mb-1">{k.title}</p>
            <p className="text-2xl font-semibold">{k.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Trend Chart */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-6 rounded-2xl p-5"
        style={{ background: theme.card, border: `1px solid ${theme.accentLight}` }}
      >
        <h2 className="font-poetic mb-2 text-lg" style={{ color: theme.accent }}>
          Sales Trend ({mode})
        </h2>
        <div className="h-[340px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke={theme.grid} />
              <XAxis dataKey="label" tick={{ fill: theme.ink }} />
              <YAxis tick={{ fill: theme.ink }} />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="grossSales"
                name="Gross Sales"
                stroke={theme.accent}
                strokeWidth={2.2}
                dot={{ r: 3 }}
              />
              <Line
                type="monotone"
                dataKey="transactions"
                name="Transactions"
                stroke={theme.accentLight}
                strokeWidth={1.8}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Branch Comparison */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-6 rounded-2xl p-5"
        style={{
          background: theme.card,
          border: `1px solid ${theme.accentLight}`,
        }}
      >
        <h2 className="font-poetic mb-2 text-lg" style={{ color: theme.accent }}>
          Branch Comparison{" "}
          {selectedBranch !== "All"
            ? `– ${branches.find((b) => b.id === selectedBranch)?.name}`
            : ""}
        </h2>
        <div className="h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={branchCompare}>
              <CartesianGrid strokeDasharray="3 3" stroke={theme.grid} />
              <XAxis dataKey="name" tick={{ fill: theme.ink }} />
              <YAxis tick={{ fill: theme.ink }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="grossSales" name="Revenue" radius={[8, 8, 0, 0]} fill={theme.bar} />
              <Bar dataKey="transactions" name="Transactions" radius={[8, 8, 0, 0]} fill={theme.accentLight} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* 🛍️ Top Items Section */}
      <TopItemsSection range={range} selectedBranch={selectedBranch} />
    </div>
  );
}
