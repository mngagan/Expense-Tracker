import { requireAuth } from "@/lib/auth-helpers";
import { BottomNav } from "@/components/navigation/bottom-nav";
import { SummaryChart } from "@/components/summary/summary-chart";

// Summary screen (per agents.md Section 6.3)
// Shows: Pie chart by category, Month toggle, Simple insight
export default async function SummaryPage() {
  await requireAuth();

  return (
    <div className="min-h-screen pb-20">
      <div className="p-4">
        <SummaryChart />
      </div>
      <BottomNav />
    </div>
  );
}
