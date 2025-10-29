// scripts/cleanupOldSales.ts
import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import serviceAccount from "./serviceAccountKey.json" assert { type: "json" };

// -----------------------------
// Firebase Admin 
// -----------------------------
const app = initializeApp({
  credential: cert(serviceAccount as any),
});

const db = getFirestore();

// -----------------------------
// ❌ obsolete
// -----------------------------
const obsoleteBranches = [
  "berlin-mitte",
  "kreuzberg",
  "charlottenburg",
  "branch1",
  "branch2",
  "branch3",
];

// -----------------------------
// clean up
// -----------------------------
async function cleanupOldSales() {
  console.log("🧹 Cleaning up old branch sales...");

  for (const id of obsoleteBranches) {
    const snapshot = await db.collection("sales").where("branchId", "==", id).get();

    if (snapshot.empty) {
      console.log(`⚪ No sales found for ${id}`);
      continue;
    }

    let deletedCount = 0;
    for (const doc of snapshot.docs) {
      await doc.ref.delete();
      deletedCount++;
    }

    console.log(`🗑️ Deleted ${deletedCount} sales documents for branch: ${id}`);
  }

  console.log("✨ Cleanup complete! Only main 5 branches remain (Paris, Vienna, Rome, Copenhagen, Amsterdam).");
}

// -----------------------------
// do
// -----------------------------
cleanupOldSales()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error("❌ Error cleaning up:", e);
    process.exit(1);
  });
