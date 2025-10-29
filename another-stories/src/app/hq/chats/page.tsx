//hq/chats/page.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Image as ImageIcon, Smile, Check } from "lucide-react";
import Image from "next/image";
import Picker from "emoji-picker-react";
import { getFirestore, collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase"; 

// Soft theme
const theme = {
  bg: "#FFF8F6",
  card: "#FFFFFF",
  accent: "#B97A57",
  accentLight: "#E8C5A4",
  border: "#EAD9C6",
  ink: "#6B4B3A",
  good: "#3BA17C",
};

// Branch dummy data
const branches = [
  { id: "paris", name: "Paris Branch", avatar: "/profiphoto/manager-paris.png", last: "Shipment arrived safely 🌸", unread: true },
  { id: "vienna", name: "Vienna Branch", avatar: "/profiphoto/manager-vienna.png", last: "All set for weekend sale!", unread: false },
  { id: "rome", name: "Rome Branch", avatar: "/profiphoto/manager-rome.png", last: "Requesting new display photos", unread: true },
  { id: "copenhagen", name: "Copenhagen Branch", avatar: "/profiphoto/manager-copenhagen.png", last: "Inventory updated ✔️", unread: false },
  { id: "amsterdam", name: "Amsterdam Branch", avatar: "/profiphoto/manager-amsterdam.png", last: "Morning briefing confirmed", unread: false },
];

// Soft fade-slide animation
const fadeSlide = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45 }, 
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: { duration: 0.35 }, 
  },
};


export default function HQChatsPage() {
  const [selected, setSelected] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"branches" | "employees">("branches");
  const [employees, setEmployees] = useState<any[]>([]);

  const [messages, setMessages] = useState<
    { id: number; sender: string; text?: string; imageUrl?: string; time: string; read?: boolean }[]
  >([]);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Fetch employee data from Firestore
  useEffect(() => {
  const fetchEmployees = async () => {
    const q = query(collection(db, "users"), where("role", "==", "employee"));
    const snapshot = await getDocs(q);
    const list = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    console.log("👩‍💼 Employees fetched:", list); 
    setEmployees(list);
  };
  fetchEmployees();
}, []);

  // Dummy messages for preview
  useEffect(() => {
    if (!selected) return;
    setMessages([
      { id: 1, sender: "branch", text: "Bonjour HQ! Shipment arrived 🌸", time: "10:22 AM", read: true },
      { id: 2, sender: "hq", text: "Wonderful! Display them near the window 💫", time: "10:24 AM", read: true },
    ]);
  }, [selected]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, preview]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setPreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleSend = () => {
    if (!newMessage && !preview) return;
    const newMsg = {
      id: Date.now(),
      sender: "hq",
      text: newMessage || undefined,
      imageUrl: preview || undefined,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      read: false,
    };
    setMessages((prev) => [...prev, newMsg]);
    setNewMessage("");
    setPreview(null);
    setShowEmojiPicker(false);

    setTimeout(() => {
      setMessages((prev) => prev.map((m) => (m.id === newMsg.id ? { ...m, read: true } : m)));
    }, 2000);
  };

  const filteredBranches = branches.filter((b) =>
    b.name.toLowerCase().includes(search.toLowerCase())
  );
  const filteredEmployees = employees.filter((e) =>
    `${e.firstName} ${e.lastName}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div
      className="min-h-screen flex rounded-2xl overflow-hidden border"
      style={{ background: theme.bg, borderColor: theme.border }}
    >
      {/* Sidebar */}
      <div
        className="w-[340px] flex flex-col border-r"
        style={{ borderColor: theme.border, background: theme.card }}
      >
        {/* Header */}
        <div className="p-4 border-b" style={{ borderColor: theme.border }}>
          <h1 className="text-2xl font-poetic" style={{ color: theme.accent }}>
            Chats
          </h1>
          <p className="text-sm opacity-70">with Branch Managers & Employees</p>

          {/* Tabs */}
          <div className="flex justify-around mt-4 border-b" style={{ borderColor: theme.border }}>
            {["branches", "employees"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as "branches" | "employees")}
                className={`py-2 px-4 text-sm font-medium transition ${
                  activeTab === tab ? "text-accent border-b-2" : "text-neutral/60"
                }`}
                style={{
                  borderColor: activeTab === tab ? theme.accent : "transparent",
                }}
              >
                {tab === "branches" ? "Branches" : "Employees"}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative mt-3">
            <Search size={18} className="absolute left-3 top-2.5 text-[rgba(0,0,0,0.3)]" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="w-full pl-9 pr-3 py-2 rounded-lg text-sm border focus:outline-none focus:ring-1"
              style={{
                borderColor: theme.accentLight,
                background: "#FFFDFB",
                color: theme.ink,
              }}
            />
          </div>
        </div>

        {/* 🌸 Contact List */}
        <div className="flex-1 overflow-y-auto p-2">
          <AnimatePresence mode="wait">
            {activeTab === "branches" ? (
              <motion.div key="branches" variants={fadeSlide} initial="hidden" animate="visible" exit="exit">
                {filteredBranches.map((b) => (
                  <motion.div
                    key={b.id}
                    whileHover={{ scale: 1.015 }}
                    transition={{ type: "spring", stiffness: 120, damping: 15 }}
                    onClick={() => setSelected(b.id)}
                    className={`flex items-center gap-3 p-3 rounded-xl mb-2 cursor-pointer transition ${
                      selected === b.id ? "shadow-md" : ""
                    }`}
                    style={{
                      background: selected === b.id ? theme.accentLight + "20" : theme.card,
                      border: `1px solid ${theme.border}`,
                    }}
                  >
                    <Image src={b.avatar} alt={b.name} width={36} height={36} className="rounded-full object-cover" />
                    <div className="flex-1">
                      <p className="font-medium" style={{ color: theme.accent }}>
                        {b.name}
                      </p>
                      <p className="text-sm opacity-70 truncate">{b.last}</p>
                    </div>
                    {b.unread && <span className="w-2 h-2 rounded-full" style={{ background: theme.accent }} />}
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div key="employees" variants={fadeSlide} initial="hidden" animate="visible" exit="exit">
                <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
                  {filteredEmployees.map((e) => (
                    <motion.div
                      key={e.id}
                      whileHover={{ scale: 1.015 }}
                      transition={{ type: "spring", stiffness: 120, damping: 15 }}
                      onClick={() => setSelected(e.id)}
                      className={`flex items-center gap-3 p-3 rounded-xl mb-2 cursor-pointer transition ${
                        selected === e.id ? "shadow-md" : ""
                      }`}
                      style={{
                        background: selected === e.id ? theme.accentLight + "20" : theme.card,
                        border: `1px solid ${theme.border}`,
                      }}
                    >
                      <Image
                        src={e.avatar || "/profiphoto/default.png"}
                        alt={`${e.firstName} ${e.lastName}`}
                        width={44}
                        height={44}
                        className="rounded-full object-cover flex-shrink-0"
                        style={{
                          width: "44px",
                          height: "44px",
                          border: `1px solid ${theme.accentLight}`,
                        }}
                      />
                      <div className="flex-1">
                        <p className="font-medium" style={{ color: theme.accent }}>
                          {e.firstName} {e.lastName}
                        </p>
                        <p className="text-sm opacity-70 truncate">{e.location}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* 🌿 Chat Window */}
      <div className="flex-1 flex flex-col">
        {!selected ? (
          <div className="flex flex-1 flex-col items-center justify-center text-center">
            <p className="text-lg font-medium" style={{ color: theme.accent }}>
              Select a chat to start messaging 💌
            </p>
            <p className="text-sm opacity-60 mt-1">Communicate warmly with your branches and employees.</p>
          </div>
        ) : (
          <>
            <div className="p-4 border-b flex items-center justify-between" style={{ borderColor: theme.border }}>
              <h2 className="text-lg font-poetic" style={{ color: theme.accent }}>
                {branches.find((b) => b.id === selected)?.name ||
                  employees.find((e) => e.id === selected)?.firstName}
              </h2>
              <p className="text-xs opacity-60">Active now</p>
            </div>

            {/* 💬 Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              <AnimatePresence>
                {messages.map((m) => (
                  <motion.div
                    key={m.id}
                    initial={{ opacity: 0, scale: 0.96, y: m.sender === "hq" ? 8 : -8 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.35, type: "spring", stiffness: 120, damping: 12 }}
                    className={`flex ${m.sender === "hq" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className="px-4 py-2 rounded-2xl max-w-[70%] text-sm shadow-sm relative"
                      style={{
                        background: m.sender === "hq" ? theme.accent : theme.card,
                        color: m.sender === "hq" ? "#FFF" : theme.ink,
                        border: `1px solid ${theme.accentLight}`,
                      }}
                    >
                      {m.text && <p>{m.text}</p>}
                      {m.imageUrl && (
                        <img
                          src={m.imageUrl}
                          alt="sent"
                          onClick={() => setPreview(m.imageUrl!)}
                          className="mt-2 rounded-xl border border-accentLight max-w-[200px] cursor-pointer hover:opacity-90"
                        />
                      )}
                      <div className="flex justify-end items-center mt-1 gap-1">
                        <p className="text-[10px] opacity-70">{m.time}</p>
                        {m.sender === "hq" && m.read && <Check size={12} color={theme.good} />}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              <div ref={chatEndRef} />
            </div>

            {/* 🖊 Input */}
            <div className="p-4 border-t flex items-center gap-2" style={{ borderColor: theme.border }}>
              <div className="relative">
                <Smile
                  size={20}
                  className="opacity-50 cursor-pointer"
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                />
                {showEmojiPicker && (
                  <div className="absolute bottom-10 left-0 z-50">
                    <Picker onEmojiClick={(e) => setNewMessage((prev) => prev + e.emoji)} />
                  </div>
                )}
              </div>
              <ImageIcon
                size={20}
                className="opacity-50 cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              />
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageSelect} />
              <input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Write a message..."
                className="flex-1 px-4 py-2 rounded-full border text-sm focus:outline-none"
                style={{
                  borderColor: theme.accentLight,
                  color: theme.ink,
                  background: "#FFFDFB",
                }}
              />
              <button
                onClick={handleSend}
                className="px-4 py-2 rounded-full text-sm font-medium transition"
                style={{ background: theme.accent, color: "#FFF" }}
              >
                Send
              </button>
            </div>
          </>
        )}
      </div>

      {/* 🌸 Image Modal */}
      <AnimatePresence>
        {preview && (
          <motion.div
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            onClick={() => setPreview(null)}
          >
            <motion.img
              src={preview}
              alt="preview"
              className="max-w-[80%] max-h-[80%] rounded-xl shadow-lg"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
