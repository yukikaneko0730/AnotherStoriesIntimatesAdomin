"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// scripts/seedUsers.ts
const app_1 = require("firebase-admin/app");
const firestore_1 = require("firebase-admin/firestore");
const serviceAccountKey_json_1 = __importDefault(require("./serviceAccountKey.json"));
// Initialize Firebase Admin SDK
const app = (0, app_1.initializeApp)({
    credential: (0, app_1.cert)(serviceAccountKey_json_1.default),
});
const db = (0, firestore_1.getFirestore)();
// Dummy individual user accounts (one per branch)
const users = [
    {
        id: "amelie-paris",
        firstName: "Amélie",
        lastName: "Durand",
        email: "amelie.durand@aonothertories.com",
        avatar: "/profiphoto/Amélie.png",
        joined: "2023-05-18",
        location: "Paris, France",
        branchId: "paris",
        role: "employee",
    },
    {
        id: "lena-vienna",
        firstName: "Lena",
        lastName: "Schneider",
        email: "lena.schneider@aonothertories.com",
        avatar: "/profiphoto/Lena.png",
        joined: "2023-06-12",
        location: "Vienna, Austria",
        branchId: "vienna",
        role: "employee",
    },
    {
        id: "sofia-rome",
        firstName: "Sofia",
        lastName: "Ricci",
        email: "sofia.ricci@aonothertories.com",
        avatar: "/profiphoto/Sofia.png",
        joined: "2023-07-02",
        location: "Rome, Italy",
        branchId: "rome",
        role: "employee",
    },
    {
        id: "freja-copenhagen",
        firstName: "Freja",
        lastName: "Andersen",
        email: "freja.andersen@aonothertories.com",
        avatar: "/profiphoto/Freja.png",
        joined: "2023-08-21",
        location: "Copenhagen, Denmark",
        branchId: "copenhagen",
        role: "employee",
    },
    {
        id: "lotte-amsterdam",
        firstName: "Lotte",
        lastName: "van Dijk",
        email: "lotte.vandijk@aonothertories.com",
        avatar: "/profiphoto/Lotte.png",
        joined: "2023-09-10",
        location: "Amsterdam, Netherlands",
        branchId: "amsterdam",
        role: "employee",
    },
    {
        id: "emma-amsterdam",
        firstName: "Emma",
        lastName: "Visser",
        email: "emma.visser@aonothertories.com",
        avatar: "/profiphoto/Emma.png",
        joined: "2023-10-05",
        location: "Amsterdam, Netherlands",
        branchId: "amsterdam",
        role: "employee",
    },
    {
        id: "maria-copenhagen",
        firstName: "Maria",
        lastName: "Larsen",
        email: "maria.larsen@aonothertories.com",
        avatar: "/profiphoto/Maria.png",
        joined: "2023-10-10",
        location: "Copenhagen, Denmark",
        branchId: "copenhagen",
        role: "employee",
    },
];
// Send to Firestore
async function seedUsers() {
    console.log("🌱 Adding dummy individual users...");
    for (const user of users) {
        await db.collection("users").doc(user.id).set(user);
        console.log(`✅ Added: ${user.firstName} ${user.lastName} (${user.branchId})`);
    }
    console.log("✨ All individual users added successfully!");
}
seedUsers()
    .then(() => process.exit(0))
    .catch((e) => {
    console.error("❌ Error seeding users:", e);
    process.exit(1);
});
