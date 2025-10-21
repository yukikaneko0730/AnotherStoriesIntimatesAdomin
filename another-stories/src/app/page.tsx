//src/app/page.tsx
import DashboardLayout from "@/components/layout/DashboardLayout";

export default function Page() {
  return (
    <DashboardLayout>
      <div className="text-accent2">
        <h2 className="text-3xl font-serif mb-2">Your Story in Numbers</h2>
        <p>✨ Here you’ll see your daily sales, shifts, and smiles.</p>
      </div>
    </DashboardLayout>
  );
}
