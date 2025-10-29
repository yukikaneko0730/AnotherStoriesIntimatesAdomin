///hq/branches/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  doc,
  getDoc,
  onSnapshot,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { toast } from "sonner";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

interface Branch {
  id?: string;
  name: string;
  manager: string;
  email: string;
  phone: string;
  founded: string;
  status: string;
  image: string;
}

export default function BranchDetailPage() {
  const router = useRouter();
  const { id } = useParams();
  const [branch, setBranch] = useState<Branch | null>(null);
  const [salesData, setSalesData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch branch data
  useEffect(() => {
    if (!id) return;
    const ref = doc(db, "branches", id as string);
    const unsubscribe = onSnapshot(ref, (snap) => {
      if (snap.exists()) {
        setBranch({ id: snap.id, ...(snap.data() as Branch) });
      } else {
        toast.error("Branch not found ❌");
        router.push("/hq/branches");
      }
    });
    return () => unsubscribe();
  }, [id, router]);

  // ✅ Fetch sales for this branch
  useEffect(() => {
    const fetchSales = async () => {
      if (!id) return;
      const q = query(collection(db, "sales"), where("branchId", "==", id));
      const snap = await getDocs(q);
      const raw = snap.docs.map((d) => d.data());
      const grouped: Record<string, any> = {};

      raw.forEach((s: any) => {
        if (!grouped[s.date]) {
          grouped[s.date] = {
            date: s.date,
            grossSales: 0,
            cashSales: 0,
            cardSales: 0,
            transactions: 0,
          };
        }
        grouped[s.date].grossSales += s.grossSales;
        grouped[s.date].cashSales += s.cashSales;
        grouped[s.date].cardSales += s.cardSales;
        grouped[s.date].transactions += s.transactions;
      });

      const sorted = Object.values(grouped).sort(
        (a: any, b: any) =>
          new Date(a.date).getTime() - new Date(b.date).getTime()
      );

      setSalesData(sorted);
      setLoading(false);
    };

    fetchSales();
  }, [id]);

  if (!branch) return <p className="p-6 text-accent1">Loading branch...</p>;
  if (loading) return <p className="p-6 text-accent1">Loading sales data...</p>;

  const latest = salesData[salesData.length - 1] || {};
  const pieData = [
    { name: "Cash", value: latest.cashSales || 0 },
    { name: "Card", value: latest.cardSales || 0 },
    { name: "Online", value: Math.floor(latest.grossSales * 0.15) },
    { name: "Gift", value: Math.floor(latest.grossSales * 0.05) },
  ];
  const COLORS = ["#F0D9C1", "#E8C5A4", "#D9A679", "#B97A57"];

  return (
    <div className="max-w-5xl mx-auto p-8 space-y-10 bg-[#FBF8F3] rounded-2xl">
      {/* ───── Header ───── */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-poetic text-[#B97A57]">
          {branch.name} 🏬
        </h1>
        <Button variant="outline" onClick={() => router.push("/hq/branches")}>
          ← Back
        </Button>
      </div>

      {/* ───── Basic Info ───── */}
      <div className="flex items-center gap-6 bg-[#F7E8D9] p-6 rounded-2xl">
        <Image
          src={branch.image || "/avatar-placeholder.png"}
          alt={branch.name}
          width={100}
          height={100}
          className="rounded-full border border-[#E8C5A4]"
        />
        <div>
          <p className="text-sm text-[#A67C52]">
            👩‍💼 <strong>Manager:</strong> {branch.manager || "-"}
          </p>
          <p className="text-sm text-[#A67C52]">
            📧 <strong>Email:</strong> {branch.email}
          </p>
          <p className="text-sm text-[#A67C52]">
            📞 <strong>Phone:</strong> {branch.phone || "-"}
          </p>
          <p className="text-sm text-[#A67C52]">
            📅 <strong>Founded:</strong> {branch.founded || "-"}
          </p>
        </div>
      </div>

      {/* ───── 1️⃣ Line Chart ───── */}
      <div className="p-6 bg-[#F7E8D9] rounded-2xl shadow-sm">
        <h2 className="text-lg font-poetic text-[#B97A57] mb-2">
          📈 Daily Sales Trend
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={salesData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ead9c6" />
            <XAxis dataKey="date" tick={{ fill: "#b17b57" }} />
            <YAxis tick={{ fill: "#b17b57" }} />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="grossSales"
              stroke="#B97A57"
              strokeWidth={2}
              dot={{ r: 3 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* ───── 2️⃣ Bar Chart ───── */}
      <div className="p-6 bg-[#F7E8D9] rounded-2xl shadow-sm">
        <h2 className="text-lg font-poetic text-[#B97A57] mb-2">
          💳 Payment Comparison
        </h2>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart
            data={[
              { type: "Cash", value: latest.cashSales || 0 },
              { type: "Card", value: latest.cardSales || 0 },
              { type: "Online", value: Math.floor(latest.grossSales * 0.15) },
              { type: "Gift", value: Math.floor(latest.grossSales * 0.05) },
            ]}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0e5da" />
            <XAxis dataKey="type" tick={{ fill: "#a67c52" }} />
            <YAxis tick={{ fill: "#a67c52" }} />
            <Tooltip />
            <Bar dataKey="value" radius={[8, 8, 0, 0]} fill="#E8C5A4" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* ───── 3️⃣ Pie Chart ───── */}
      <div className="p-6 bg-[#F7E8D9] rounded-2xl shadow-sm">
        <h2 className="text-lg font-poetic text-[#B97A57] mb-2">
          🪞 Sales Composition
        </h2>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              label={({ name, percent }: { name?: string; percent?: number }) =>
              `${name ?? ""} ${(percent ? percent * 100 : 0).toFixed(0)}%`
              }
            >
              {pieData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
