//scripts/seedSalesData.ts

import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { randomInt } from "crypto";
import serviceAccount from "./serviceAccountKey.json" assert { type: "json" };


// 🔧 Firebase Admin SDK 初期化（ルールを無視してフル権限で操作可能）
initializeApp({
  credential: cert(serviceAccount),
});

const db = getFirestore();

// ✅ ダミー支店データ
const branches = [
  { id: "branch1", name: "Berlin Mitte" },
  { id: "branch2", name: "Charlottenburg" },
  { id: "branch3", name: "Kreuzberg" },
];

async function seedSalesData() {
  console.log("🚀 Seeding dummy sales data...");

  const today = new Date();
  const batch = db.batch();

  for (const branch of branches) {
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const formatted = date.toISOString().split("T")[0];

      const cash = randomInt(500, 1500);
      const card = randomInt(700, 2200);
      const gross = cash + card;
      const transactions = randomInt(20, 80);

      const docRef = db.collection("sales").doc();
      batch.set(docRef, {
        branchId: branch.id,
        branchName: branch.name,
        date: formatted,
        grossSales: gross,
        cashSales: cash,
        cardSales: card,
        transactions,
        createdAt: new Date(),
      });
    }
  }

  await batch.commit();
  console.log("✅ Dummy sales data added successfully!");
}

// 実行
seedSalesData()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error("❌ Error seeding data:", e);
    process.exit(1);
  });
