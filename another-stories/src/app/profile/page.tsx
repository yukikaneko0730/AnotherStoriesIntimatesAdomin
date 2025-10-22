//app/profile/page.tsx
"use client";

import { useEffect, useState } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Image from "next/image";

interface UserData {
  nickname: string;
  location: string;
  bio: string;
  photoURL?: string;
}

export default function ProfilePage() {
  const { user, logout } = useAuth(); 
  const [profile, setProfile] = useState<UserData>({
    nickname: "",
    location: "",
    bio: "",
    photoURL: "",
  });
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  // ✅ Fetch user data
  useEffect(() => {
    if (!user) return;

    const fetchProfile = async () => {
      try {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setProfile(docSnap.data() as UserData);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  // ✅ Save profile
  const handleSave = async () => {
    if (!user) return;
    try {
      const docRef = doc(db, "users", user.uid);
      await setDoc(docRef, profile, { merge: true });
      toast.success("Profile updated ✅");
    } catch (error) {
      console.error("Error saving profile:", error);
      toast.error("Failed to update profile ❌");
    }
  };

  // ✅ Upload image
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setUploading(true);
    try {
      const storageRef = ref(storage, `profiles/${user.uid}/${file.name}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);

      setProfile((prev) => ({ ...prev, photoURL: url }));

      // Firestoreへ反映
      await setDoc(doc(db, "users", user.uid), { photoURL: url }, { merge: true });

      toast.success("Profile image updated ✅");
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Upload failed ❌");
    } finally {
      setUploading(false);
    }
  };

  // ✅ Log out
  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully 👋");
    } catch (error) {
      console.error(error);
      toast.error("Failed to logout ❌");
    }
  };

  if (loading) return <p className="p-6 text-accent1">Loading...</p>;
  if (!user) return <p className="p-6 text-neutral/60">Please log in.</p>;

  return (
    <div className="max-w-md mx-auto p-6 bg-surface/40 border border-accent3/30 rounded-2xl">
      <h2 className="text-2xl font-poetic text-accent1 mb-4">My Profile</h2>

      {/* ───── Profile Image ───── */}
      <div className="flex flex-col items-center mb-4">
        <Image
          src={profile.photoURL || "/avatar-placeholder.png"}
          alt="Profile"
          width={100}
          height={100}
          className="rounded-full border border-accent3/40 object-cover"
        />
        <label className="mt-3 text-sm text-accent2 cursor-pointer">
          {uploading ? "Uploading..." : "Change Photo"}
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
        </label>
      </div>

      {/* ───── Profile Fields ───── */}
      <div className="space-y-3">
        <div>
          <label className="block text-sm text-neutral/70 mb-1">
            Nickname
          </label>
          <Input
            value={profile.nickname}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setProfile({ ...profile, nickname: e.target.value })
            }
          />
        </div>

        <div>
          <label className="block text-sm text-neutral/70 mb-1">
            Location
          </label>
          <Input
            value={profile.location}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setProfile({ ...profile, location: e.target.value })
            }
          />
        </div>

        <div>
          <label className="block text-sm text-neutral/70 mb-1">Bio</label>
          <Textarea
            rows={3}
            value={profile.bio}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
              setProfile({ ...profile, bio: e.target.value })
            }
          />
        </div>

        {/* Save button */}
        <Button
          onClick={handleSave}
          className="bg-accent1 text-white w-full mt-4"
          disabled={uploading}
        >
          {uploading ? "Please wait..." : "Save Changes"}
        </Button>

        {/* Log out button */}
        <Button
          onClick={handleLogout}
          variant="outline"
          className="w-full mt-4 text-red-500 border-red-300 hover:bg-red-50"
        >
          Log Out
        </Button>
      </div>
    </div>
  );
}
