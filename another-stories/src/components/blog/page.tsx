//app/blog/page.tsx
"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Image from "next/image";
import Link from "next/link";

interface BlogPost {
  id: string;
  title: string;
  content: string;
  author: string;
  createdAt?: { seconds: number; nanoseconds: number };
  coverImage?: string;
}

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const q = query(collection(db, "blogPosts"), orderBy("createdAt", "desc"));
        const snap = await getDocs(q);
        const data = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as BlogPost[];
        setPosts(data);
      } catch (err) {
        console.error("Error fetching blog posts:", err);
      }
    };
    fetchPosts();
  }, []);

  const filtered = posts.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.content.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-poetic text-accent1 text-center mb-8">
        Company Blog 🪶
      </h1>

      <div className="flex justify-center mb-8">
        <input
          type="text"
          placeholder="Search posts..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-accent3/40 rounded-lg px-4 py-2 w-full max-w-md bg-surface/40"
        />
      </div>

      {filtered.length === 0 ? (
        <p className="text-center text-neutral/60">No blog posts found yet.</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.id}`}
              className="block border border-accent3/30 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition"
            >
              <div className="relative h-48 bg-surface/50">
                {post.coverImage ? (
                  <Image
                    src={post.coverImage}
                    alt={post.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="h-full flex items-center justify-center text-neutral/60">
                    No Image
                  </div>
                )}
              </div>
              <div className="p-4">
                <p className="text-sm text-neutral/60">
                  {post.createdAt
                    ? new Date(post.createdAt.seconds * 1000).toLocaleDateString()
                    : ""}
                </p>
                <h2 className="text-lg font-semibold text-accent1 mt-1">
                  {post.title}
                </h2>
                <p className="text-sm text-neutral/70 mt-2 line-clamp-2">
                  {post.content}
                </p>
                <p className="text-xs text-neutral/50 mt-2">
                  ✍️ {post.author}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
