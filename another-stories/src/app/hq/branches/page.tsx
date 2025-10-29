//hq/branches/page.tsx
"use client";

import { useEffect, useState } from "react";
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
  onSnapshot,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
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

export default function HQBranchesPage() {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [filtered, setFiltered] = useState<Branch[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [newBranch, setNewBranch] = useState({
    name: "",
    manager: "",
    email: "",
    phone: "",
    founded: "",
    status: "Active",
    image: "/avatar-placeholder.png",
  });
  const router = useRouter();
  const branchesRef = collection(db, "branches");

  useEffect(() => {
    const unsubscribe = onSnapshot(branchesRef, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Branch[];
      setBranches(data);
      setFiltered(data);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const filteredList = branches.filter((b) => {
      const matchesSearch =
        b.name.toLowerCase().includes(search.toLowerCase()) ||
        b.manager.toLowerCase().includes(search.toLowerCase());
      const matchesStatus =
        statusFilter === "All" || b.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
    setFiltered(filteredList);
  }, [search, statusFilter, branches]);

  const handleAddBranch = async () => {
    if (!newBranch.name || !newBranch.email) {
      toast.error("Please fill all fields");
      return;
    }
    try {
      await addDoc(branchesRef, newBranch);
      toast.success(`Branch "${newBranch.name}" added`);
      setNewBranch({
        name: "",
        manager: "",
        email: "",
        phone: "",
        founded: "",
        status: "Active",
        image: "/avatar-placeholder.png",
      });
    } catch (error) {
      console.error(error);
      toast.error("Error adding branch");
    }
  };

  const handleDeleteBranch = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;
    try {
      await deleteDoc(doc(db, "branches", id));
      toast.success("Branch deleted");
    } catch (error) {
      console.error(error);
      toast.error("Error deleting branch");
    }
  };

  const toggleStatus = async (id: string, current: string) => {
    const newStatus = current === "Active" ? "Closed" : "Active";
    try {
      await updateDoc(doc(db, "branches", id), { status: newStatus });
      toast.success(`Branch marked as ${newStatus}`);
    } catch (error) {
      console.error(error);
      toast.error("Failed to update status");
    }
  };

  const [branchSales, setBranchSales] = useState<Record<string, any>>({});

  // 🔸 Fetch sales summaries for each branch
  useEffect(() => {
    const fetchBranchSales = async () => {
      const salesRef = collection(db, "sales");
      const snap = await getDocs(salesRef);
      const sales = snap.docs.map((doc) => doc.data());
      const grouped: Record<string, any> = {};

      sales.forEach((s: any) => {
        if (!grouped[s.branchName]) {
          grouped[s.branchName] = { gross: 0, cash: 0, card: 0 };
        }
        grouped[s.branchName].gross += s.grossSales || 0;
        grouped[s.branchName].cash += s.cashSales || 0;
        grouped[s.branchName].card += s.cardSales || 0;
      });
      setBranchSales(grouped);
    };
    fetchBranchSales();
  }, []);

  return (
    <div className="space-y-8 p-6 bg-[#FBF8F3] min-h-screen">
      <h1 className="text-3xl font-poetic text-[#B97A57]">🏬 Branches Overview</h1>

      {/* Search + Filter */}
      <div className="flex flex-wrap gap-3 items-center bg-[#F7E8D9] p-4 rounded-2xl border border-[#E6CBB0]">
        <Input
          placeholder="Search by branch or manager..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-xs"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-[#E6CBB0] rounded-xl px-3 py-2 bg-white/50"
        >
          <option value="All">All</option>
          <option value="Active">Active</option>
          <option value="Closed">Closed</option>
        </select>
      </div>

      {/* Branch Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((branch) => {
          const sales = branchSales[branch.name] || { gross: 0, cash: 0, card: 0 };
          const chartData = [
            { type: "Cash", value: sales.cash },
            { type: "Card", value: sales.card },
          ];

          return (
            <div
              key={branch.id}
              onClick={() => router.push(`/hq/branches/${branch.id}`)}
              className="p-6 rounded-2xl border border-[#E6CBB0] bg-[#F7E8D9] hover:bg-[#F3DFC9] transition relative cursor-pointer shadow-sm"
            >
              <div className="flex items-center gap-3 mb-3">
                <Image
                  src={branch.image}
                  alt={branch.name}
                  width={48}
                  height={48}
                  className="rounded-full"
                />
                <div>
                  <h2 className="font-semibold text-[#B97A57]">{branch.name}</h2>
                  <p className="text-sm text-[#A67C52]">{branch.manager}</p>
                </div>
              </div>

              <p className="text-xs text-[#A67C52] mb-3">
                ☎️ {branch.phone || "-"} <br /> 📅 {branch.founded || "-"}
              </p>

              {/* 小型棒グラフで支店別のキャッシュ／カード比率 */}
              <div className="h-[100px] mb-3">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#EBD9C7" />
                    <XAxis dataKey="type" tick={{ fill: "#A67C52", fontSize: 10 }} />
                    <YAxis tick={{ fill: "#A67C52", fontSize: 10 }} />
                    <Tooltip />
                    <Bar dataKey="value" fill="#D9A679" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <p className="text-xs text-[#A67C52]">
                💰 Total Sales: €{sales.gross.toLocaleString()}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
