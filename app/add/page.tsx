"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { addExpense } from "@/app/actions/add-expense";
import { BottomNav } from "@/components/navigation/bottom-nav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EXPENSE_CATEGORIES, type ExpenseCategory } from "@/types";
import { cn } from "@/lib/utils";

// Add Expense screen (per agents.md Section 6.2)
// Most important screen - fastest possible expense logging
export default function AddExpensePage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string>("");

  // Defaults: Date = today, Category = last used (or first), Amount auto-focused
  const [amount, setAmount] = useState<string>("");
  const [category, setCategory] = useState<ExpenseCategory>("Food");
  const [note, setNote] = useState<string>("");
  const [date, setDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      setError("Please enter a valid amount");
      return;
    }

    startTransition(async () => {
      const result = await addExpense({
        amount: amountNum,
        date: new Date(date),
        category,
        note: note.trim() || undefined,
      });

      if (result.success) {
        // Reset form
        setAmount("");
        setNote("");
        setDate(new Date().toISOString().split("T")[0]);
        // Navigate to home
        router.push("/");
        router.refresh();
      } else {
        setError(result.error);
      }
    });
  };

  return (
    <div className="min-h-screen pb-20">
      <div className="p-4 max-w-md mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Add Expense</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Amount - auto-focused, numeric keypad on mobile */}
              <div className="space-y-2">
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  inputMode="decimal"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  autoFocus
                  required
                  aria-required="true"
                  aria-label="Expense amount"
                  className="text-lg h-14"
                  disabled={isPending}
                />
              </div>

              {/* Category - big buttons, not dropdowns */}
              <div className="space-y-2">
                <Label id="category-label">Category</Label>
                <div
                  className="grid grid-cols-2 gap-2"
                  role="radiogroup"
                  aria-labelledby="category-label"
                >
                  {EXPENSE_CATEGORIES.map((cat) => (
                    <Button
                      key={cat}
                      type="button"
                      role="radio"
                      aria-checked={category === cat}
                      variant={category === cat ? "default" : "outline"}
                      onClick={() => setCategory(cat)}
                      className={cn(
                        "h-14 text-base",
                        category === cat && "font-semibold"
                      )}
                      disabled={isPending}
                    >
                      {cat}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Date */}
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                  className="h-14"
                  disabled={isPending}
                />
              </div>

              {/* Optional note */}
              <div className="space-y-2">
                <Label htmlFor="note">Note (optional)</Label>
                <Input
                  id="note"
                  type="text"
                  placeholder="Add a note..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="h-14"
                  disabled={isPending}
                />
              </div>

              {/* Error message - inline, not popup */}
              {error && (
                <p className="text-sm text-destructive">{error}</p>
              )}

              {/* Single Save button */}
              <Button
                type="submit"
                className="w-full h-14 text-base font-semibold"
                disabled={isPending || !amount}
              >
                {isPending ? "Saving..." : "Save"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      <BottomNav />
    </div>
  );
}
