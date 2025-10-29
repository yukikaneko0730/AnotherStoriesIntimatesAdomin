//components/hq/TopItemsSection.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  LineChart,
  Line,
  Legend,
} from "recharts";
import { motion } from "framer-motion";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { parseISO, format, isWithinInterval, startOfMonth } from "date-fns";
import { DateRange } from "react-day-picker";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Image from "next/image";

// -----------------------------
// Types
// -----------------------------
type SaleItem = {
  productId: string;
  name: string;
  category: string;
  qty: number;
  price: number;
  imageUrl?: string;
};

type SaleDoc = {
  branchId: string;
  branchName: string;
  date: string;
  items?: SaleItem[];
};

type Props = {
  range: DateRange;
  selectedBranch: string;
};

// -----------------------------
// Theme
// -----------------------------
const theme = {
  card: "#FCEDE7",
  ink: "#6B4B3A",
  accent: "#B97A57",
  accentLight: "#E8C5A4",
  grid: "#EAD9C6",
  white: "#FFFFFF",
};

const toDate = (d: string) => parseISO(d);

// -----------------------------
// Component
// -----------------------------
function TopItemsSection({ range, selectedBranch }: Props) {
  const [docs, setDocs] = useState<SaleDoc[]>([]);
  const [selectedItem, setSelectedItem] = useState<SaleItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSales = async () => {
      const snap = await getDocs(collection(db, "sales"));
      const data = snap.docs.map((d) => d.data() as SaleDoc);
      setDocs(data);
      setLoading(false);
    };
    fetchSales();
  }, []);

  const effectiveRange = useMemo(() => {
    const today = new Date();
    if (range?.from && range?.to) return range;
    return { from: new Date(today.getTime() - 29 * 86400000), to: today };
  }, [range]);

  const filtered = useMemo(() => {
    return docs.filter((s) => {
      const d = toDate(s.date);
      if (!isWithinInterval(d, { start: effectiveRange.from!, end: effectiveRange.to! })) return false;
      if (selectedBranch !== "All" && s.branchId !== selectedBranch) return false;
      return true;
    });
  }, [docs, effectiveRange, selectedBranch]);

  // 🏷️ カテゴリ別トップ3（金額）
  const topByCategory = useMemo(() => {
    const map = new Map<string, Record<string, { total: number; imageUrl?: string }>>();
    filtered.forEach((s) => {
      s.items?.forEach((it) => {
        if (!map.has(it.category)) map.set(it.category, {});
        const cat = map.get(it.category)!;
        const sales = it.qty * it.price;
        cat[it.name] = {
          total: (cat[it.name]?.total || 0) + sales,
          imageUrl: it.imageUrl,
        };
      });
    });

    return Array.from(map.entries()).map(([category, record]) => {
      const items = Object.entries(record)
        .map(([name, v]) => ({ name, total: v.total, imageUrl: v.imageUrl }))
        .sort((a, b) => b.total - a.total)
        .slice(0, 3);
      return { category, items };
    });
  }, [filtered]);

  // 📈 モーダル内の月次トレンドデータ
  const itemTrend = useMemo(() => {
    if (!selectedItem) return [];
    const trends: Record<string, number> = {};
    filtered.forEach((s) => {
      const month = format(startOfMonth(toDate(s.date)), "yyyy-MM");
      s.items?.forEach((it) => {
        if (it.name !== selectedItem.name) return;
        const rev = it.qty * it.price;
        trends[month] = (trends[month] || 0) + rev;
      });
    });
    return Object.entries(trends)
      .map(([month, total]) => ({ month, total }))
      .sort((a, b) => (a.month < b.month ? -1 : 1));
  }, [filtered, selectedItem]);

  if (loading)
    return (
      <p className="p-6 text-center text-sm" style={{ color: theme.accent }}>
        Loading Top Items…
      </p>
    );

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl p-6 mt-8"
      style={{ background: theme.card, border: `1px solid ${theme.accentLight}` }}
    >
      <h2 className="font-poetic text-xl mb-4" style={{ color: theme.accent }}>
        🏆 Top Items (click for details)
      </h2>

      <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4">
        {topByCategory.map(({ category, items }) => (
          <motion.div
            key={category}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="rounded-xl p-4"
            style={{ background: theme.white, border: `1px solid ${theme.accentLight}` }}
          >
            <h3 className="font-semibold mb-2" style={{ color: theme.accent }}>
              {category}
            </h3>
            {items.map((it, idx) => (
              <Dialog key={it.name}>
                <DialogTrigger asChild>
                  <button
                    onClick={() =>
  setSelectedItem({
    productId: it.name, // 仮のID代わり
    name: it.name,
    category,
    qty: 0,
    price: 0,
    imageUrl: it.imageUrl,
  })
}
                  >
                    <span>
                      {idx + 1}. {it.name}
                    </span>
                    <span>€{it.total.toLocaleString()}</span>
                  </button>
                </DialogTrigger>

                {/* モーダル */}
                <DialogContent
                  className="sm:max-w-[650px] rounded-xl"
                  style={{ background: theme.white, border: `1px solid ${theme.accentLight}` }}
                >
                  {selectedItem && (
                    <>
                      <DialogHeader>
  <div className="text-lg font-semibold" style={{ color: theme.accent }}>
    {selectedItem.name}
  </div>
</DialogHeader>

                      <div className="mt-3 flex flex-col md:flex-row gap-4">
                        <div className="md:w-1/3">
                          <Image
                            src={selectedItem.imageUrl || "/placeholder.jpg"}
                            alt={selectedItem.name}
                            width={200}
                            height={200}
                            className="rounded-lg object-cover w-full h-auto"
                          />
                        </div>

                        <div className="md:w-2/3">
                          <p className="text-sm mb-1 opacity-80">
                            Category: <span className="font-medium">{selectedItem.category}</span>
                          </p>
                          <p className="text-sm mb-1 opacity-80">
                            Total Revenue:{" "}
                            <span className="font-semibold" style={{ color: theme.accent }}>
                              €{itemTrend.reduce((a, b) => a + b.total, 0).toLocaleString()}
                            </span>
                          </p>

                          <div className="h-[200px] mt-4">
                            <ResponsiveContainer width="100%" height="100%">
                              <LineChart data={itemTrend}>
                                <CartesianGrid strokeDasharray="3 3" stroke={theme.grid} />
                                <XAxis dataKey="month" tick={{ fill: theme.ink }} />
                                <YAxis tick={{ fill: theme.ink }} />
                                <Tooltip formatter={(v: number) => `€${v.toLocaleString()}`} />
                                <Line
                                  type="monotone"
                                  dataKey="total"
                                  stroke={theme.accent}
                                  strokeWidth={2.2}
                                  dot={{ r: 3 }}
                                  activeDot={{ r: 6 }}
                                  isAnimationActive
                                />
                              </LineChart>
                            </ResponsiveContainer>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </DialogContent>
              </Dialog>
            ))}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

// ✅ default export はこれだけ
export default TopItemsSection;
