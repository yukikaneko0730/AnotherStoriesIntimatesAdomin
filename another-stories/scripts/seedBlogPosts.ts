//scripts/seedBlogPosts.ts
import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import serviceAccount from "./serviceAccountKey.json" assert { type: "json" };

// 🔥 Initialize Firebase Admin SDK
initializeApp({
  credential: cert(serviceAccount as any),
});

const db = getFirestore();

// ✍️ Dummy HQ Blog Posts
const blogPosts = [
  {
    title: "The Power of Mindful Design",
    content:
      "In today’s fast-paced digital world, mindful design is about creating experiences that bring calm, focus, and empathy. Thoughtful UI decisions can reduce cognitive load and make people feel at home in digital spaces.",
    author: "HQ Admin",
    category: "Design",
    coverImage:
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80",
    writtenDate: "2025-10-25",
    createdAt: new Date(),
  },
  {
    title: "How We Built Our Global Community",
    content:
      "Behind every great brand is a great community. Here’s how our branches across Europe collaborate and stay connected, despite cultural and linguistic differences.",
    author: "Camille Dupont",
    category: "Community",
    coverImage:
      "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80",
    writtenDate: "2025-10-20",
    createdAt: new Date(Date.now() - 86400000 * 2),
  },
  {
    title: "Sustainable Materials in Lingerie Design",
    content:
      "We believe sustainability starts with awareness. From organic cotton to recycled lace, we’re constantly exploring materials that care for both skin and planet.",
    author: "Lotte van Dijk",
    category: "Sustainability",
    coverImage:
      "https://images.unsplash.com/photo-1492724441997-5dc865305da7?auto=format&fit=crop&w=800&q=80",
    writtenDate: "2025-10-18",
    createdAt: new Date(Date.now() - 86400000 * 5),
  },
];

async function seedBlogPosts() {
  console.log("🪶 Seeding HQ blog posts...");

  for (const post of blogPosts) {
    const ref = await db.collection("blogPosts").add(post);
    console.log(`✅ Added: ${post.title} (${ref.id})`);
  }

  console.log("🎉 All dummy blog posts added successfully!");
  process.exit(0);
}

seedBlogPosts().catch((err) => {
  console.error("❌ Error seeding blog posts:", err);
  process.exit(1);
});
