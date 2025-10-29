//blog/new/page.tsx
"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { db } from "@/lib/firebase";
import { addDoc, collection, serverTimestamp, deleteDoc, doc, getDocs } from "firebase/firestore";
import HQBlogEditor from "@/components/HQBlogEditor";
import { useEffect, useState } from "react";

export default function HQBlogNewPage() {
  const { role, user } = useAuth();
  const router = useRouter();
  const [posts, setPosts] = useState<any[]>([]);

  // 投稿取得
  useEffect(() => {
    const fetchPosts = async () => {
      const snap = await getDocs(collection(db, "blogPosts"));
      const data = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setPosts(data);
    };
    fetchPosts();
  }, []);

  const handlePublish = async (data: any) => {
    await addDoc(collection(db, "blogPosts"), {
      ...data,
      author: user?.email || "HQ Admin",
      createdAt: serverTimestamp(),
    });
    alert("✅ Post published!");
    router.refresh();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this post?")) return;
    await deleteDoc(doc(db, "blogPosts", id));
    setPosts(posts.filter((p) => p.id !== id));
  };

  if (role !== "HQ") return <p className="p-8">Access denied.</p>;

  return (
    <div className="p-8 space-y-12">
      <HQBlogEditor onSubmit={handlePublish} />

      <section className="mt-12">
        <h2 className="text-2xl font-poetic text-accent1 mb-4">
          🗂 Past Blog Posts
        </h2>
        {posts.length === 0 ? (
          <p className="text-neutral/60">No posts yet.</p>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <div
                key={post.id}
                className="border border-accent3/30 rounded-xl p-4 bg-white/40 flex justify-between items-center"
              >
                <div>
                  <p className="text-sm text-neutral/60 mb-1">
                    {post.writtenDate} | {post.category}
                  </p>
                  <h3 className="font-semibold text-accent1">{post.title}</h3>
                </div>
                <div className="flex gap-3 text-sm">
                  <button
                    onClick={() => router.push(`/hq/blog/${post.id}`)}
                    className="text-neutral/70 hover:text-accent1"
                  >
                    👁 View
                  </button>
                  <button
                    onClick={() => router.push(`/hq/blog/edit/${post.id}`)}
                    className="text-accent1 hover:underline"
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => handleDelete(post.id)}
                    className="text-red-500 hover:underline"
                  >
                    🗑 Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
