// scripts/seedBranches.ts
import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import serviceAccount from "./serviceAccountKey.json" assert { type: "json" };

// -----------------------------
// Initialize Firebase Admin
// -----------------------------
const app = initializeApp({
  credential: cert(serviceAccount as any),
});

const db = getFirestore();

// -----------------------------
// 🌿 Dummy Branch Data
// -----------------------------
const branches = [
    
  {
    id: "paris",
    name: "Paris Branch",
    manager: "Camille Dupont",
    phone: "+33 1 45 67 89 10",
    founded: "2018-06-12",
    address: "12 Rue de la Paix, Paris, France",
    email: "paris@anotherstories.com",
  },
  {
    id: "vienna",
    name: "Vienna Branch",
    manager: "Anna Schneider",
    phone: "+43 1 234 5678",
    founded: "2019-03-05",
    address: "Mariahilfer Str. 17, Vienna, Austria",
    email: "vienna@anotherstories.com",
  },
  {
    id: "rome",
    name: "Rome Branch",
    manager: "Sofia Ricci",
    phone: "+39 06 123 4567",
    founded: "2017-09-21",
    address: "Via del Corso 220, Rome, Italy",
    email: "rome@anotherstories.com",
  },
  {
    id: "copenhagen",
    name: "Copenhagen Branch",
    manager: "Freja Andersen",
    phone: "+45 32 11 22 33",
    founded: "2020-04-10",
    address: "Strøget 58, Copenhagen, Denmark",
    email: "copenhagen@anotherstories.com",
  },
  {
    id: "amsterdam",
    name: "Amsterdam Branch",
    manager: "Lotte van Dijk",
    phone: "+31 20 445 7788",
    founded: "2016-12-01",
    address: "Kalverstraat 101, Amsterdam, Netherlands",
    email: "amsterdam@anotherstories.com",
  },
];

// -----------------------------
// 🌱 Send to Firestore
// -----------------------------
async function seedBranches() {
  console.log("🌱 Adding branch data to Firestore...");

  for (const branch of branches) {
    await db.collection("branches").doc(branch.id).set(branch);
    console.log(`✅ Added: ${branch.name}`);
  }

  console.log("✨ All branches added successfully!");
}

// -----------------------------
// Run
// -----------------------------
seedBranches()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error("❌ Error seeding branches:", e);
    process.exit(1);
  });
