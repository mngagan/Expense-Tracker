"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  getAutomaticExpenses,
  skipAutomaticExpense,
  removeAutomaticExpense,
} from "@/app/actions/automatic-expenses";
import { ServerActionResponse } from "@/types";

type AutomaticExpense = {
  id: string;
  name: string;
  amount: number;
  category: string;
  isActive: boolean;
};

// Automatic expenses list component (per agents.md Section 7)
// User actions: "Skip this month", "Remove forever"
export function AutomaticExpensesList() {
  const [expenses, setExpenses] = useState<AutomaticExpense[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);

  useEffect(() => {
    loadExpenses();
  }, []);

  const loadExpenses = async () => {
    setLoading(true);
    const result = await getAutomaticExpenses();
    if (result.success) {
      setExpenses(result.data.filter((e) => e.isActive));
    }
    setLoading(false);
  };

  const handleSkip = async (id: string) => {
    setProcessing(id);
    const result = await skipAutomaticExpense(id);
    if (result.success) {
      // Refresh expenses and navigate to home to see updated totals
      await loadExpenses();
      window.location.href = "/";
    } else {
      alert(result.error);
    }
    setProcessing(null);
  };

  const handleRemove = async (id: string) => {
    if (!confirm("Remove forever? This cannot be undone.")) {
      return;
    }

    setProcessing(id);
    const result = await removeAutomaticExpense(id);
    if (result.success) {
      await loadExpenses();
    } else {
      alert(result.error);
    }
    setProcessing(null);
  };

  if (loading) {
    return (
      <div className="text-center py-4 text-muted-foreground">Loading...</div>
    );
  }

  if (expenses.length === 0) {
    return null; // Don't show section if no automatic expenses
  }

  return (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold">Automatic Expenses</h2>
      {expenses.map((expense) => (
        <Card key={expense.id}>
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <p className="font-medium">{expense.name}</p>
                <p className="text-sm text-muted-foreground">
                  {expense.category} • ₹{expense.amount.toFixed(2)}/month
                </p>
              </div>
              <div className="flex flex-col gap-2 ml-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleSkip(expense.id)}
                  disabled={processing === expense.id}
                >
                  Skip this month
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleRemove(expense.id)}
                  disabled={processing === expense.id}
                >
                  Remove forever
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}



