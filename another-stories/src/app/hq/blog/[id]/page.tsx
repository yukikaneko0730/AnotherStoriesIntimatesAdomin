//app/blog/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import HQBlogEditor from "@/components/HQBlogEditor";
import { useAuth } from "@/context/AuthContext";

export default function EditBlogPost({ params }: { params: { id: string } }) {
  const { role, user } = useAuth();
  const router = useRouter();
  const [postData, setPostData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (role !== "HQ") router.push("/blog");
  }, [role, router]);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const ref = doc(db, "blogPosts", params.id);
        const snap = await getDoc(ref);
        if (snap.exists()) setPostData(snap.data());
        else router.push("/hq/blog");
      } catch (error) {
        console.error("Error fetching post:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [params.id, router]);

  const handleUpdate = async (data: any) => {
    try {
      const ref = doc(db, "blogPosts", params.id);
      await updateDoc(ref, {
        ...data,
        updatedAt: new Date(),
        author: user?.email || "HQ Admin",
      });
      alert("✅ Post updated successfully!");
      router.push("/hq/blog");
    } catch (error) {
      console.error("Error updating post:", error);
    }
  };

  if (loading) return <p className="p-8">Loading...</p>;
  if (!postData) return <p className="p-8">Post not found.</p>;

  return <HQBlogEditor initialData={postData} onSubmit={handleUpdate} isEditing />;
}
