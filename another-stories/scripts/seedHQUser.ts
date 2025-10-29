import { auth, db } from "@/lib/firebase"
import { createUserWithEmailAndPassword } from "firebase/auth"
import { doc, setDoc } from "firebase/firestore"

async function createHQAccount() {
  const email = "hq@anotherstories.com"
  const password = "hqadmin123"

  const userCredential = await createUserWithEmailAndPassword(auth, email, password)
  const user = userCredential.user

  await setDoc(doc(db, "users", user.uid), {
    email,
    firstName: "HQ",
    lastName: "Admin",
    role: "HQ",
    branchId: "hq",
    joined: new Date().toISOString(),
  })

  console.log("✅ HQ account created:", user.uid)
}

createHQAccount().catch(console.error)
