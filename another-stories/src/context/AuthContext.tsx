// src/context/AuthContext.tsx
"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  onAuthStateChanged,
  signOut,
  User,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

interface AuthContextType {
  user: User | null;
  role: string | null;
  loading: boolean;
  setRole: (role: string | null) => void;
  logout: () => Promise<void>; 
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  role: null,
  loading: true,
  setRole: () => {},
  logout: async () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  // logout
  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setRole(null);
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
  };

  //👀 Auth state changed
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      console.log("👀 Auth state changed:", currentUser);
      setUser(currentUser);

      if (currentUser) {
        try {
          const userRef = doc(db, "users", currentUser.uid);
          const snap = await getDoc(userRef);
          const userRole = snap.exists() ? (snap.data().role as string) : null;
          console.log("📄 Firestore role:", userRole);
          setRole(userRole);

          // redirect
          if (["/login", "/signup", "/"].includes(pathname) && userRole) {
            if (userRole === "HQ") router.push("/hq/dashboard");
            else if (userRole === "Store") router.push("/store/dashboard");
            else router.push("/staff/shifts");
          }
        } catch (error) {
          console.error("Error fetching user role:", error);
        }
      } else {
        console.log("⚠️ No user logged in");
        setRole(null);

        // redirect when login
        if (
          pathname.startsWith("/hq") ||
          pathname.startsWith("/store") ||
          pathname.startsWith("/staff")
        ) {
          router.push("/login");
        }
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, [router, pathname]);

  return (
    <AuthContext.Provider value={{ user, role, loading, setRole, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
