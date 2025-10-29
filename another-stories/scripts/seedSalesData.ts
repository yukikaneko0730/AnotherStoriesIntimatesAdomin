// scripts/seedSalesData.ts
import * as admin from "firebase-admin"
import { getFirestore } from "firebase-admin/firestore"
import { randomInt } from "crypto"
import serviceAccount from "./serviceAccountKey.json" assert { type: "json" }

// ✅ Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
})

const db = getFirestore()

// ✅ brunches
const branches = [
  { id: "amsterdam", name: "Amsterdam Branch" },
  { id: "copenhagen", name: "Copenhagen Branch" },
  { id: "paris", name: "Paris Branch" },
  { id: "rome", name: "Rome Branch" },
  { id: "vienna", name: "Vienna Branch" },
];

async function seedSalesData() {
  console.log("🚀 Seeding dummy sales data...")

  const today = new Date()
  const batch = db.batch()

  for (const branch of branches) {
    for (let i = 0; i < 30; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() - i)
      const formatted = date.toISOString().split("T")[0]

      const cash = randomInt(500, 1500)
      const card = randomInt(700, 2200)
      const gross = cash + card
      const transactions = randomInt(20, 80)

      const docRef = db.collection("sales").doc()
      batch.set(docRef, {
        branchId: branch.id,
        branchName: branch.name,
        date: formatted,
        grossSales: gross,
        cashSales: cash,
        cardSales: card,
        transactions,
        createdAt: new Date(),
      })
    }
  }

  await batch.commit()
  console.log("✅ Dummy sales data added successfully!")
}

// do
seedSalesData()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error("❌ Error seeding data:", e)
    process.exit(1)
  })
