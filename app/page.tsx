import { requireAuth } from "@/lib/auth-helpers";
import { getTodayTotal, getThisMonthTotal, getRecentExpenses } from "@/app/actions/get-expenses";
import { ensureAutomaticExpensesForCurrentMonth } from "@/lib/recurring";
import { BottomNav } from "@/components/navigation/bottom-nav";
import { Card, CardContent } from "@/components/ui/card";
import { AutomaticExpensesList } from "@/components/expense/automatic-expenses-list";

// Home screen (per agents.md Section 6.1)
// Shows: "Today: ₹X", "This month: ₹Y", Last 3 expenses
export default async function HomePage() {
  const user = await requireAuth();

  // Ensure automatic expenses for current month (lazy creation)
  await ensureAutomaticExpensesForCurrentMonth(user.id);

  const [todayResult, monthResult, expensesResult] = await Promise.all([
    getTodayTotal(),
    getThisMonthTotal(),
    getRecentExpenses(),
  ]);

  const todayTotal = todayResult.success ? todayResult.data : 0;
  const monthTotal = monthResult.success ? monthResult.data : 0;
  const expenses = expensesResult.success ? expensesResult.data : [];

  return (
    <div className="min-h-screen pb-20">
      <div className="p-4 space-y-6">
        {/* Totals */}
        <div className="space-y-4">
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-1">Today</p>
            <p className="text-4xl font-bold">₹{todayTotal.toFixed(2)}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-1">This Month</p>
            <p className="text-4xl font-bold">₹{monthTotal.toFixed(2)}</p>
          </div>
        </div>

        {/* Last 3 expenses */}
        {expenses.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold mb-3">Recent Expenses</h2>
            <div className="space-y-2">
              {expenses.map((expense) => (
                <Card key={expense.id}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="font-medium">{expense.category}</p>
                        {expense.note && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {expense.note}
                          </p>
                        )}
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(expense.date).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                          })}
                        </p>
                      </div>
                      <p className="font-semibold text-lg">
                        ₹{expense.amount.toFixed(2)}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {expenses.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <p>No expenses yet. Add your first expense!</p>
          </div>
        )}

        {/* Automatic Expenses */}
        <AutomaticExpensesList />
      </div>

      <BottomNav />
    </div>
  );
}
