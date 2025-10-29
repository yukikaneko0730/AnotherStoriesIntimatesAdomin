//hq/blog/page.tsx
"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function HQBlogPage() {
  const { role } = useAuth();
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "blogPosts"));
        const blogData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPosts(blogData);
      } catch (error) {
        console.error("Error fetching blog posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this post?")) return;
    try {
      await deleteDoc(doc(db, "blogPosts", id));
      setPosts(posts.filter((p) => p.id !== id));
      alert("🗑️ Post deleted successfully!");
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-neutral/70 text-center">
        Loading blog posts...
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-poetic text-accent1 mb-4">
        Company Blog 🪶
      </h1>

      <p className="text-neutral/70 mb-6">
        {role === "HQ"
          ? "You can write, edit, and manage posts for all branches."
          : "Browse stories and updates from HQ."}
      </p>

      {role === "HQ" && (
        <Link
          href="/hq/blog/new"
          className="inline-block bg-accent1 text-white px-4 py-2 rounded-lg hover:bg-accent1/80 transition"
        >
          ✍️ Write New Post
        </Link>
      )}

      <div className="mt-10 space-y-8">
        {posts.length === 0 ? (
          <p className="text-neutral/60 text-center">No blog posts yet.</p>
        ) : (
          posts
            .sort(
              (a, b) =>
                new Date(b.createdAt?.toDate?.() || 0).getTime() -
                new Date(a.createdAt?.toDate?.() || 0).getTime()
            )
            .map((post) => (
              <div
                key={post.id}
                className="border border-accent3/30 rounded-xl p-6 bg-white/60 hover:shadow-sm transition"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <h2 className="text-xl font-semibold text-accent1 mb-2 sm:mb-0">
                    {post.title}
                  </h2>
                  <p className="text-neutral/60 text-sm">
                    {post.writtenDate} | {post.category}
                  </p>
                </div>
                <p className="text-neutral/70 mt-3 line-clamp-3">
                  {post.content.slice(0, 150)}...
                </p>

                <div className="flex items-center gap-3 mt-4">
                  <Link
                    href={`/hq/blog/${post.id}`}
                    className="text-accent1 hover:underline"
                  >
                    👁 View
                  </Link>

                  {role === "HQ" && (
                    <>
                      <Link
                        href={`/hq/blog/edit/${post.id}`}
                        className="text-blue-500 hover:underline"
                      >
                        ✏️ Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(post.id)}
                        className="text-red-500 hover:underline"
                      >
                        🗑 Delete
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))
        )}
      </div>
    </div>
  );
}
